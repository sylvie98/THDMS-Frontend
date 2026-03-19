import { useEffect, useState } from "react";
import { fields } from "../data/fields";
import { harvests } from "../data/harvests";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [harvestSummary, setHarvestSummary] = useState([]);

  useEffect(() => {
    const summary = fields.map(f => ({
      field_name: f.field_name,
      total_quantity: harvests
        .filter(h => h.field_id === f.field_id)
        .reduce((sum, h) => sum + h.quantity, 0)
    }));
    setHarvestSummary(summary);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="font-bold mb-2 text-green-600 dark:text-green-300">Harvest Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={harvestSummary}>
            <XAxis dataKey="field_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_quantity" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}