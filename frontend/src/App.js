import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Fields from "./pages/Fields";
import Harvest from "./pages/Harvest";
import Reports from "./pages/Reports";
import "./App.css";

function App() {
  return (
   <BrowserRouter>
  <div className="flex">
    <Sidebar />
    <div className="flex-1">
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><Users /></ProtectedRoute>} />
        <Route path="/fields" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN","ADMIN"]}><Fields /></ProtectedRoute>} />
        <Route path="/harvest" element={<ProtectedRoute allowedRoles={["ADMIN","FIELD_WORKER"]}><Harvest /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      </Routes>
    </div>
  </div>
</BrowserRouter>
  );
}

export default App;