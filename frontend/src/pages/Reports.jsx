import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Sample static report data
const reports = [
  { field: "Field A", totalHarvest: 2500, workers: 5 },
  { field: "Field B", totalHarvest: 1800, workers: 3 },
  { field: "Field C", totalHarvest: 3200, workers: 4 },
];

export default function Reports() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">Reports</h1>

          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-2 px-4">Field</th>
                <th className="py-2 px-4">Total Harvest (kg)</th>
                <th className="py-2 px-4">Workers Involved</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="text-center border-b">
                  <td className="py-2 px-4">{r.field}</td>
                  <td className="py-2 px-4">{r.totalHarvest}</td>
                  <td className="py-2 px-4">{r.workers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}