import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldsApi, harvestsApi, ApiField, ApiHarvest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";

export default function FieldWorkerView() {
  const [fields, setFields] = useState<ApiField[]>([]);
  const [recentHarvests, setRecentHarvests] = useState<ApiHarvest[]>([]);
  const [fieldId, setFieldId] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fieldsApi.getAll().then(setFields).catch(console.error);
    harvestsApi.getAll().then((h) => setRecentHarvests(h.slice(-5).reverse())).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!fieldId || !quantity || isNaN(Number(quantity))) {
      toast({ title: "Please fill all fields correctly", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const newH = await harvestsApi.create({
        field: { fieldId: parseInt(fieldId) },
        harvestDate: format(date, "yyyy-MM-dd"),
        quantity: parseFloat(Number(quantity).toFixed(2)),
      });
      setRecentHarvests((prev) => [newH, ...prev].slice(0, 5));
      setQuantity("");
      toast({ title: "Harvest logged successfully!" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to submit", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-2">
          <Leaf className="h-7 w-7 text-primary" />
        </div>
        <h1 className="page-header">Log Harvest</h1>
        <p className="page-subheader">Record today's tea harvest</p>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-5">
        <div className="space-y-2">
          <Label className="text-base">Field</Label>
          <Select value={fieldId} onValueChange={setFieldId}>
            <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Select a field" /></SelectTrigger>
            <SelectContent>
              {fields.map((f) => (
                <SelectItem key={f.fieldId} value={String(f.fieldId)}>{f.fieldName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Harvest Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full h-12 justify-start text-left text-base", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Quantity (kg)</Label>
          <Input type="number" step="0.01" min="0" placeholder="e.g. 25.50" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-12 text-lg font-mono" />
        </div>

        <Button className="w-full h-14 text-lg font-semibold" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Harvest"}
        </Button>
      </div>

      <div>
        <h2 className="font-display font-semibold text-lg mb-3">Recent Logs</h2>
        <div className="rounded-xl border bg-card divide-y">
          {recentHarvests.map((h) => (
            <div key={h.harvestId} className="px-4 py-3 flex justify-between items-center animate-fade-in">
              <div>
                <p className="font-medium text-sm">{h.field?.fieldName || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{h.harvestDate}</p>
              </div>
              <span className="font-mono text-primary font-semibold">{h.quantity.toFixed(2)} kg</span>
            </div>
          ))}
          {recentHarvests.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">No harvests logged yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
