// import { useState, useEffect } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { usersApi, fieldsApi, harvestsApi } from "@/lib/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users, Sprout, Scale, Activity, Clock } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// // Import your newly created dashboard components
// import AdminDashboard from "./AdminDashboard";
// import FieldOwnerDashboard from "./FieldOwnerDashboard";
// import FieldWorkerView from "./FieldWorkerView";

// export default function Index() {
//   const { user, role, isLoading: authLoading } = useAuth();
//   const { toast } = useToast();
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalFields: 0,
//     totalHarvestsKg: 0,
//     totalHarvestsCount: 0,
//     pendingApprovals: 0, // Added to track pending harvests
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch data from the real backend APIs concurrently
//         const [users, fields, harvests] = await Promise.all([
//           role === "ROLE_ADMIN" ? usersApi.getAll() : Promise.resolve([]),
//           fieldsApi.getAll(),
//           harvestsApi.getAll()
//         ]);

//         let relevantFields = fields;
//         let relevantHarvests = harvests;

//         // If the user is a Field Owner, only calculate stats for THEIR fields
//         if (role === "ROLE_OWNER" && user) {
//           relevantFields = fields.filter((f) => f.owner?.userId === user.userId);
//           const myFieldIds = new Set(relevantFields.map((f) => f.fieldId));
//           relevantHarvests = harvests.filter((h) => myFieldIds.has(h.field?.fieldId));
//         }

//         // Calculate verified total kg and pending count
//         const totalKg = relevantHarvests
//           .filter(h => h.status === "VERIFIED")
//           .reduce((sum, h) => sum + h.quantity, 0);
        
//         const pending = relevantHarvests.filter(h => h.status === "PENDING").length;

//         setStats({
//           totalUsers: users.length,
//           totalFields: relevantFields.length,
//           totalHarvestsKg: totalKg,
//           totalHarvestsCount: relevantHarvests.length,
//           pendingApprovals: pending,
//         });
//       } catch (error: any) {
//         console.error("Dashboard fetch error:", error);
//         toast({ 
//           title: "Failed to load dashboard data", 
//           description: error.message, 
//           variant: "destructive" 
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user && !authLoading) {
//       fetchDashboardData();
//     }
//   }, [user, role, authLoading, toast]);

//   if (loading || authLoading) {
//     return (
//       <div className="p-6 text-muted-foreground animate-pulse">
//         Loading your dashboard analytics...
//       </div>
//     );
//   }

//   // ROLE-BASED ROUTING: 
//   // This directs the user to the specific dashboard files you provided
//   if (role === "ROLE_ADMIN") return <AdminDashboard />;
//   if (role === "ROLE_OWNER") return <FieldOwnerDashboard />;
//   if (role === "ROLE_WORKER") return <FieldWorkerView />;

//   // Default Fallback UI (if role is not determined)
//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="page-header">Welcome back, {user?.fullName || user?.username}!</h1>
//         <p className="page-subheader">Here is the latest overview of your tea cooperative operations.</p>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {role === "ROLE_ADMIN" && (
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalUsers}</div>
//               <p className="text-xs text-muted-foreground">Registered in the system</p>
//             </CardContent>
//           </Card>
//         )}

//         {(role === "ROLE_ADMIN" || role === "ROLE_OWNER") && (
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Registered Fields</CardTitle>
//               <Sprout className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.totalFields}</div>
//               <p className="text-xs text-muted-foreground">
//                 {role === "ROLE_OWNER" ? "Fields assigned to you" : "Total cooperative fields"}
//               </p>
//             </CardContent>
//           </Card>
//         )}

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Verified Harvest</CardTitle>
//             <Scale className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalHarvestsKg.toFixed(2)} kg</div>
//             <p className="text-xs text-muted-foreground">Accepted tea leaves</p>
//           </CardContent>
//         </Card>

//         {/* New Stat Card for Pending Approvals */}
//         {(role === "ROLE_ADMIN" || role === "ROLE_OWNER") && (
//           <Card className={stats.pendingApprovals > 0 ? "border-yellow-500/50 bg-yellow-50/10" : ""}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
//               <Clock className={`h-4 w-4 ${stats.pendingApprovals > 0 ? "text-yellow-600 animate-pulse" : "text-muted-foreground"}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
//               <p className="text-xs text-muted-foreground">Awaiting your approval</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./AdminDashboard";
import FieldOwnerDashboard from "./FieldOwnerDashboard";
import FieldWorkerView from "./FieldWorkerView";

export default function Index() {
  const { role, isLoading } = useAuth();
  if (isLoading) return <div className="p-6">Loading workspace...</div>;
  if (role === "ROLE_ADMIN") return <AdminDashboard />;
  if (role === "ROLE_OWNER") return <FieldOwnerDashboard />;
  if (role === "ROLE_WORKER") return <FieldWorkerView />;
  return null;
}