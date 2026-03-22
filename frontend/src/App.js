import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Fields from "./pages/Fields";
import Harvest from "./pages/Harvest";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN", "OWNER", "WORKER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fields"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Fields />
            </ProtectedRoute>
          }
        />

        <Route
          path="/harvest"
          element={
            <ProtectedRoute allowedRoles={["OWNER", "WORKER"]}>
              <Harvest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;