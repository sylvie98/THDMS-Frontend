import { useState, useEffect } from "react";
import { harvestsApi, fieldsApi, ApiHarvest, ApiField } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HarvestRecords() {
  const [harvests, setHarvests] = useState<ApiHarvest[]>([]);
  const [fields, setFields] = useState<ApiField[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fieldFilter, setFieldFilter] = useState("all");

  useEffect(() => {
    Promise.all([harvestsApi.getAll(), fieldsApi.getAll()])
      .then(([h, f]) => { setHarvests(h); setFields(f); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = harvests.filter((h) => {
    const matchField = fieldFilter === "all" || String(h.field?.fieldId) === fieldFilter;
    const fieldName = h.field?.fieldName || "";
    const matchSearch = fieldName.toLowerCase().includes(search.toLowerCase());
    return matchField && matchSearch;
  });

  if (loading) return <p className="p-6 text-muted-foreground">Loading records...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Harvest Records</h1>
        <p className="page-subheader">All submitted harvest data</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by field name..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={fieldFilter} onValueChange={setFieldFilter}>
          <SelectTrigger className="sm:max-w-[200px]"><SelectValue placeholder="Filter by field" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            {fields.map((f) => (
              <SelectItem key={f.fieldId} value={String(f.fieldId)}>{f.fieldName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Field</TableHead>
              <TableHead className="text-right">Quantity (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No records found</TableCell></TableRow>
            ) : (
              filtered.map((h) => (
                <TableRow key={h.harvestId} className="animate-fade-in">
                  <TableCell>{h.harvestDate}</TableCell>
                  <TableCell className="font-medium">{h.field?.fieldName || "Unknown"}</TableCell>
                  <TableCell className="text-right font-mono">{h.quantity.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
