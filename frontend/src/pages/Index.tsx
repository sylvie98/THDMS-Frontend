import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import FieldOwnerDashboard from "./FieldOwnerDashboard";
import FieldWorkerView from "./FieldWorkerView";

export default function Index() {
  const { role } = useAuth();

  switch (role) {
    case "ROLE_ADMIN":
      return <AdminDashboard />;
    case "ROLE_OWNER":
      return <FieldOwnerDashboard />;
    case "ROLE_WORKER":
      return <FieldWorkerView />;
    default:
      return <AdminDashboard />;
  }
}
