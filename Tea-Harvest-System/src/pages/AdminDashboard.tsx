import { useEffect, useState } from "react";
import { harvestsApi, fieldsApi, ApiHarvest, ApiField } from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import { Scale, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [harvests, setHarvests] = useState<ApiHarvest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    harvestsApi.getAll().then(setHarvests).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalKg = harvests.reduce((s, h) => s + h.quantity, 0);

  const today = new Date();
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getTime() - (6 - i) * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en", { weekday: "short", day: "numeric" });
    const kg = harvests.filter((h) => h.harvestDate === dateStr).reduce((s, h) => s + h.quantity, 0);
    return { day: label, kg: parseFloat(kg.toFixed(1)) };
  });

  if (loading) return <p className="p-6 text-muted-foreground">Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Admin Dashboard</h1>
        <p className="page-subheader">Harvest trends &amp; overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={Scale} title="Total Harvested" value={`${totalKg.toFixed(1)} kg`} />
        <StatCard icon={TrendingUp} title="Records" value={harvests.length} subtitle="Total harvest entries" />
      </div>

      <div className="rounded-xl border bg-card p-4 md:p-6">
        <h2 className="font-display font-semibold mb-4">Harvest Trend — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit=" kg" />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
            <Bar dataKey="kg" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
