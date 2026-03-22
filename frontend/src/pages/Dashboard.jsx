import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Sample static data for dashboard
const dashboardData = {
  totalFields: 12,
  totalWorkers: 34,
  totalOwners: 5,
  totalHarvestToday: 1560, // kg
};

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Total Fields</h2>
              <p className="text-2xl">{dashboardData.totalFields}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Total Workers</h2>
              <p className="text-2xl">{dashboardData.totalWorkers}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Field Owners</h2>
              <p className="text-2xl">{dashboardData.totalOwners}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-semibold">Harvest Today (kg)</h2>
              <p className="text-2xl">{dashboardData.totalHarvestToday}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}