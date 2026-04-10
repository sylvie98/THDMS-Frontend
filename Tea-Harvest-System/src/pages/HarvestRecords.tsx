import { useState, useEffect } from "react";
import { harvestsApi, fieldsApi, ApiHarvest, ApiField } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function HarvestRecords() {
  const { user, role } = useAuth();
  const [harvests, setHarvests] = useState<ApiHarvest[]>([]);
  const [fields, setFields] = useState<ApiField[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ fieldId: "", harvestDate: new Date().toISOString().split("T")[0], quantity: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hData, fData] = await Promise.all([harvestsApi.getAll(), fieldsApi.getAll()]);
        setFields(fData);
        setHarvests(hData);
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally { setLoading(false); }
    };
    if (user) fetchData();
  }, [user]);

  const handleAdd = async () => {
    try {
      const newH = await harvestsApi.create({ 
        field: { fieldId: parseInt(form.fieldId) }, 
        harvestDate: form.harvestDate, 
        quantity: parseFloat(form.quantity) 
      });
      setHarvests(p => [newH, ...p]);
      setOpenAdd(false);
      
      // FIX: Reset form state to prevent accidental double-submissions
      setForm({ fieldId: "", harvestDate: new Date().toISOString().split("T")[0], quantity: "" });
      
      toast({ title: "Success", description: "Harvest logged successfully." });
    } catch (err: any) { 
      // FIX: Display the actual backend error message (e.g., "Record already exists for this date.")
      toast({ title: "Submission Failed", description: err.message, variant: "destructive" }); 
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      const updated = await harvestsApi.updateStatus(id, status);
      setHarvests(p => p.map(h => h.harvestId === id ? updated : h));
      toast({ title: `Harvest ${status.toLowerCase()}` });
    } catch (err: any) { toast({ title: "Action failed", variant: "destructive" }); }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Harvest Records</h1>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-2 h-4 w-4" /> Log Harvest</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Harvest</DialogTitle><DialogDescription>Submit daily tea log.</DialogDescription></DialogHeader>
            <div className="space-y-4 pt-2">
              <Label>Field</Label>
              <Select value={form.fieldId} onValueChange={v => setForm({ ...form, fieldId: v })}>
                <SelectTrigger><SelectValue placeholder="Choose field" /></SelectTrigger>
                <SelectContent>{fields.map(f => <SelectItem key={f.fieldId} value={String(f.fieldId)}>{f.fieldName}</SelectItem>)}</SelectContent>
              </Select>
              <Label>Quantity (kg)</Label>
              <Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
              <Button className="w-full" onClick={handleAdd}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Field</TableHead><TableHead>Quantity</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {harvests.map(h => (
              <TableRow key={h.harvestId}>
                <TableCell>{h.harvestDate}</TableCell>
                <TableCell>{h.field?.fieldName}</TableCell>
                <TableCell>{h.quantity} kg</TableCell>
                <TableCell><Badge variant={h.status === "VERIFIED" ? "default" : "secondary"}>{h.status}</Badge></TableCell>
                <TableCell>
                  {(role === "ROLE_OWNER" && h.status === "PENDING") && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleStatus(h.harvestId, "VERIFIED")}><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatus(h.harvestId, "REJECTED")}><X className="h-4 w-4" /></Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {harvests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No harvest records found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}