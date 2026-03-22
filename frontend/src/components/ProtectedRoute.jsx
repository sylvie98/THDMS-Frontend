import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/" />;

  if (!allowedRoles.includes(role)) {
    return <h1 className="text-center mt-10 text-red-600">Access Denied</h1>;
  }

  return children;
}