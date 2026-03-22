import { Link } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="w-64 bg-green-700 text-white p-5 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-6">THMDS</h2>

      <Link to="/dashboard" className="hover:underline">Dashboard</Link>

      {role === "SUPER_ADMIN" && <Link to="/users" className="hover:underline">Users</Link>}
      {role === "ADMIN" && <Link to="/fields" className="hover:underline">Fields</Link>}
      {(role === "OWNER" || role === "WORKER") && <Link to="/harvest" className="hover:underline">Harvest</Link>}
      {(role === "SUPER_ADMIN" || role === "ADMIN") && <Link to="/reports" className="hover:underline">Reports</Link>}
    </div>
  );
}