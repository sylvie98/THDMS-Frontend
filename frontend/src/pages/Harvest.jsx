import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Sample static harvest data
const harvests = [
  { id: 1, field: "Field A", worker: "Worker 1", date: "2026-03-20", quantity: 120 },
  { id: 2, field: "Field B", worker: "Worker 2", date: "2026-03-20", quantity: 150 },
  { id: 3, field: "Field C", worker: "Worker 3", date: "2026-03-20", quantity: 180 },
  { id: 4, field: "Field A", worker: "Worker 4", date: "2026-03-20", quantity: 130 },
];

export default function Harvest() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">Harvest Records</h1>

          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Field</th>
                <th className="py-2 px-4">Worker</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Quantity (kg)</th>
              </tr>
            </thead>
            <tbody>
              {harvests.map((h) => (
                <tr key={h.id} className="text-center border-b">
                  <td className="py-2 px-4">{h.id}</td>
                  <td className="py-2 px-4">{h.field}</td>
                  <td className="py-2 px-4">{h.worker}</td>
                  <td className="py-2 px-4">{h.date}</td>
                  <td className="py-2 px-4">{h.quantity}</td>
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