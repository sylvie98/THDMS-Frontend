import { Link } from "react-router-dom";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  return (
    <div className="w-64 h-screen bg-green-700 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">THDMS</h2>
      <ul className="flex flex-col gap-3">
        <li><Link to="/dashboard">Dashboard</Link></li>
        {(role === "SUPER_ADMIN" || role === "ADMIN") && (
          <>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/fields">Fields</Link></li>
          </>
        )}
        {(role === "FIELD_WORKER" || role === "ADMIN") && <li><Link to="/harvest">Harvest</Link></li>}
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </div>
  );
}