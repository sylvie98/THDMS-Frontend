import { useState, useEffect } from "react";
import { fieldsApi, ApiField } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function FieldManagement() {
  const [fieldList, setFieldList] = useState<ApiField[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ApiField | null>(null);
  const [form, setForm] = useState({ fieldName: "", location: "" });

  useEffect(() => {
    fieldsApi.getAll().then(setFieldList).catch(console.error).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setEditing(null); setForm({ fieldName: "", location: "" }); setOpen(true); };
  const openEdit = (f: ApiField) => { setEditing(f); setForm({ fieldName: f.fieldName, location: f.location }); setOpen(true); };

  const handleSave = async () => {
    if (!form.fieldName || !form.location) return;
    try {
      if (editing) {
        const updated = await fieldsApi.update(editing.fieldId, { fieldName: form.fieldName, location: form.location, owner: editing.owner ? { userId: editing.owner.userId } : undefined });
        setFieldList((p) => p.map((f) => (f.fieldId === editing.fieldId ? updated : f)));
        toast({ title: "Field updated" });
      } else {
        const created = await fieldsApi.create({ fieldName: form.fieldName, location: form.location });
        setFieldList((p) => [...p, created]);
        toast({ title: "Field created" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: err.message || "Failed to save", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fieldsApi.delete(id);
      setFieldList((p) => p.filter((f) => f.fieldId !== id));
      toast({ title: "Field deleted", variant: "destructive" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to delete", variant: "destructive" });
    }
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading fields...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Field Management</h1>
          <p className="page-subheader">Manage registered tea fields</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Field</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Field" : "Add Field"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5"><Label>Name</Label><Input value={form.fieldName} onChange={(e) => setForm({ ...form, fieldName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldList.map((f) => (
              <TableRow key={f.fieldId} className="animate-fade-in">
                <TableCell className="font-medium">{f.fieldName}</TableCell>
                <TableCell className="text-muted-foreground">{f.location}</TableCell>
                <TableCell className="text-muted-foreground">{f.owner?.fullName || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(f)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(f.fieldId)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
