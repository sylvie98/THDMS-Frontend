export default function Navbar() {
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-xl">THMDS Dashboard</h1>
      <div>
        <span className="mr-4 text-gray-700">Role: {role}</span>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}