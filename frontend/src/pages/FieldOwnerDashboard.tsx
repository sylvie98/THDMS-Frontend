import { useEffect, useState } from "react";
import { harvestsApi, fieldsApi, ApiHarvest, ApiField } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";
import { Scale, Map } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function FieldOwnerDashboard() {
  const { user } = useAuth();
  const [fields, setFields] = useState<ApiField[]>([]);
  const [harvests, setHarvests] = useState<ApiHarvest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fieldsApi.getAll(), harvestsApi.getAll()])
      .then(([f, h]) => {
        // Filter fields owned by current user
        const myFields = f.filter((field) => field.owner?.userId === user?.userId);
        const myFieldIds = new Set(myFields.map((field) => field.fieldId));
        setFields(myFields);
        setHarvests(h.filter((harvest) => myFieldIds.has(harvest.field?.fieldId)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const totalKg = harvests.reduce((s, h) => s + h.quantity, 0);

  const chartData = fields.map((f) => ({
    field: f.fieldName.split(" ").slice(0, 2).join(" "),
    kg: parseFloat(harvests.filter((h) => h.field?.fieldId === f.fieldId).reduce((s, h) => s + h.quantity, 0).toFixed(1)),
  }));

  if (loading) return <p className="p-6 text-muted-foreground">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">My Fields Overview</h1>
        <p className="page-subheader">Read-only view of your tea fields</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={Scale} title="Total Harvest" value={`${totalKg.toFixed(1)} kg`} />
        <StatCard icon={Map} title="My Fields" value={fields.length} />
      </div>

      {chartData.length > 0 && (
        <div className="rounded-xl border bg-card p-4 md:p-6">
          <h2 className="font-display font-semibold mb-4">Productivity per Field</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="field" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit=" kg" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="kg" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-xl border bg-card overflow-auto">
        <h2 className="font-display font-semibold p-4 pb-2">Assigned Fields</h2>
        <div className="divide-y">
          {fields.map((f) => (
            <div key={f.fieldId} className="px-4 py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{f.fieldName}</p>
                <p className="text-sm text-muted-foreground">{f.location}</p>
              </div>
              <span className="text-sm font-mono text-primary">
                {harvests.filter((h) => h.field?.fieldId === f.fieldId).reduce((s, h) => s + h.quantity, 0).toFixed(1)} kg
              </span>
            </div>
          ))}
          {fields.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">No fields assigned</p>}
        </div>
      </div>
    </div>
  );
}
