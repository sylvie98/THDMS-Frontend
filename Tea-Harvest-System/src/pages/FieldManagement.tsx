import { useState, useEffect } from "react";
import { fieldsApi, usersApi, ApiField, ApiUser } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Users, UserMinus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function FieldManagement() {
  const { user, role } = useAuth();
  const [fieldList, setFieldList] = useState<ApiField[]>([]);
  const [owners, setOwners] = useState<ApiUser[]>([]);
  const [workers, setWorkers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ApiField | null>(null);
  const [form, setForm] = useState({ fieldName: "", location: "", ownerId: "" });

  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [managingField, setManagingField] = useState<ApiField | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  useEffect(() => {
    const isAdminOrOwner = role === "ROLE_ADMIN" || role === "ROLE_OWNER";

    const fetchData = async () => {
      try {
        // Only fetch users if ADMIN or OWNER — workers get 403 on /api/users
        const [fields, allUsers] = await Promise.all([
          fieldsApi.getAll(),
          isAdminOrOwner ? usersApi.getAll() : Promise.resolve([]),
        ]);

        if (isAdminOrOwner) {
          setOwners(allUsers.filter((u) => u.role === "ROLE_OWNER"));
          setWorkers(allUsers.filter((u) => u.role === "ROLE_WORKER"));
        }

        if (role === "ROLE_OWNER" && user) {
          setFieldList(fields.filter((f) => f.owner?.userId === user.userId));
        } else {
          setFieldList(fields);
        }
      } catch (err: any) {
        toast({ title: "Failed to load fields", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role]);

  const handleSaveField = async () => {
    if (!form.fieldName.trim() || !form.location.trim() || !form.ownerId) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    const payload = {
      fieldName: form.fieldName.trim(),
      location: form.location.trim(),
      owner: { userId: Number(form.ownerId) },
    };
    try {
      if (editing) {
        const updated = await fieldsApi.update(editing.fieldId, payload);
        setFieldList((p) => p.map((f) => (f.fieldId === editing.fieldId ? updated : f)));
        toast({ title: "Field updated" });
      } else {
        const created = await fieldsApi.create(payload);
        setFieldList((p) => [...p, created]);
        toast({ title: "Field created" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: err.message || "Failed to save field", variant: "destructive" });
    }
  };

  const handleDeleteField = async (id: number) => {
    try {
      await fieldsApi.delete(id);
      setFieldList((p) => p.filter((f) => f.fieldId !== id));
      toast({ title: "Field deleted", variant: "destructive" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to delete", variant: "destructive" });
    }
  };

  const handleAssignWorker = async () => {
    if (!managingField || !selectedWorkerId) return;
    try {
      const updatedField = await fieldsApi.assignWorker(managingField.fieldId, Number(selectedWorkerId));
      setFieldList((p) => p.map((f) => (f.fieldId === updatedField.fieldId ? updatedField : f)));
      setManagingField(updatedField);
      setSelectedWorkerId("");
      toast({ title: "Worker assigned successfully!" });
    } catch (err: any) {
      toast({ title: "Failed to assign worker", description: err.message, variant: "destructive" });
    }
  };

  const handleRemoveWorker = async (workerId: number) => {
    if (!managingField) return;
    try {
      const updatedField = await fieldsApi.removeWorker(managingField.fieldId, workerId);
      setFieldList((p) => p.map((f) => (f.fieldId === updatedField.fieldId ? updatedField : f)));
      setManagingField(updatedField);
      toast({ title: "Worker removed successfully" });
    } catch (err: any) {
      toast({ title: "Failed to remove worker", description: err.message, variant: "destructive" });
    }
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading fields...</p>;

  const assignedWorkerIds = managingField?.workers?.map((w) => w.userId) || [];
  const unassignedWorkers = workers.filter((w) => !assignedWorkerIds.includes(w.userId));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">{role === "ROLE_OWNER" ? "My Fields" : "Field Management"}</h1>
          <p className="page-subheader">
            {role === "ROLE_OWNER"
              ? "Manage workers assigned to your fields"
              : role === "ROLE_WORKER"
              ? "Fields you are assigned to"
              : "Manage all cooperative fields"}
          </p>
        </div>

        {role === "ROLE_ADMIN" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => { setEditing(null); setForm({ fieldName: "", location: "", ownerId: "" }); }}
                size="sm"
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Edit Field" : "Add Field"}</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={form.fieldName} onChange={(e) => setForm({ ...form, fieldName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Field Owner</Label>
                  <Select value={form.ownerId} onValueChange={(value) => setForm({ ...form, ownerId: value })}>
                    <SelectTrigger><SelectValue placeholder="Select an owner" /></SelectTrigger>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner.userId} value={String(owner.userId)}>
                          {owner.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleSaveField}>{editing ? "Update" : "Create"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-xl border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              {role === "ROLE_ADMIN" && <TableHead>Owner</TableHead>}
              <TableHead>Assigned Workers</TableHead>
              {(role === "ROLE_ADMIN" || role === "ROLE_OWNER") && (
                <TableHead className="w-32 text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fieldList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No fields found.
                </TableCell>
              </TableRow>
            ) : (
              fieldList.map((f) => (
                <TableRow key={f.fieldId}>
                  <TableCell className="font-medium">{f.fieldName}</TableCell>
                  <TableCell className="text-muted-foreground">{f.location}</TableCell>
                  {role === "ROLE_ADMIN" && (
                    <TableCell className="text-muted-foreground">{f.owner?.fullName || "—"}</TableCell>
                  )}
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {f.workers?.length || 0} Workers
                    </Badge>
                  </TableCell>
                  {(role === "ROLE_ADMIN" || role === "ROLE_OWNER") && (
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          title="Manage Workers"
                          onClick={() => { setManagingField(f); setSelectedWorkerId(""); setWorkerDialogOpen(true); }}
                        >
                          <Users className="h-4 w-4 text-blue-600" />
                        </Button>
                        {role === "ROLE_ADMIN" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditing(f);
                                setForm({ fieldName: f.fieldName, location: f.location, ownerId: String(f.owner?.userId) });
                                setOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteField(f.fieldId)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={workerDialogOpen} onOpenChange={setWorkerDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Workers: {managingField?.fieldName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div className="flex items-end gap-2">
              <div className="space-y-1.5 flex-1">
                <Label>Assign New Worker</Label>
                <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={unassignedWorkers.length ? "Select a worker..." : "No available workers"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {unassignedWorkers.map((w) => (
                      <SelectItem key={w.userId} value={String(w.userId)}>
                        {w.fullName} ({w.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignWorker} disabled={!selectedWorkerId} className="shrink-0">
                Assign
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Currently Assigned ({managingField?.workers?.length || 0})</Label>
              <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                {(!managingField?.workers || managingField.workers.length === 0) ? (
                  <p className="p-3 text-sm text-muted-foreground text-center">
                    No workers assigned to this field.
                  </p>
                ) : (
                  managingField.workers.map((worker) => (
                    <div key={worker.userId} className="flex items-center justify-between p-2 px-3 text-sm">
                      <span>
                        {worker.fullName}{" "}
                        <span className="text-muted-foreground">(@{worker.username})</span>
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveWorker(worker.userId)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}