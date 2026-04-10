import { useState, useEffect } from "react";
import { usersApi, ApiUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ROLE_LABELS } from "@/contexts/AuthContext";

const ROLE_OPTIONS = [
  { value: "ROLE_ADMIN", label: "Admin" },
  { value: "ROLE_OWNER", label: "Field Owner" },
  { value: "ROLE_WORKER", label: "Field Worker" },
];

export default function UserManagement() {
  const [userList, setUserList] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ApiUser | null>(null);
  const [form, setForm] = useState({ fullName: "", username: "", password: "", role: "ROLE_WORKER" });

  useEffect(() => {
    usersApi.getAll()
      .then(setUserList)
      .catch((err) => {
        console.error(err);
        toast({ title: "Failed to load users", description: err.message, variant: "destructive" });
      })
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ fullName: "", username: "", password: "", role: "ROLE_WORKER" });
    setOpen(true);
  };

  const openEdit = (u: ApiUser) => {
    setEditing(u);
    setForm({ fullName: u.fullName, username: u.username, password: "", role: u.role });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.username || !form.role) return;
    try {
      if (editing) {
        const data: any = { fullName: form.fullName, username: form.username, role: form.role };
        if (form.password) data.password = form.password;
        const updated = await usersApi.update(editing.userId, data);
        setUserList((p) => p.map((u) => (u.userId === editing.userId ? updated : u)));
        toast({ title: "User updated" });
      } else {
        if (!form.password) { toast({ title: "Password is required", variant: "destructive" }); return; }
        const created = await usersApi.create(form);
        setUserList((p) => [...p, created]);
        toast({ title: "User created" });
      }
      setOpen(false);
    } catch (err: any) {
      toast({ title: err.message || "Failed to save", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await usersApi.delete(id);
      setUserList((p) => p.filter((u) => u.userId !== id));
      toast({ title: "User deleted", variant: "destructive" });
    } catch (err: any) {
      toast({ title: err.message || "Failed to delete", variant: "destructive" });
    }
  };

  if (loading) return <p className="p-6 text-muted-foreground">Loading users...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">User Management</h1>
          <p className="page-subheader">Manage cooperative users</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit User" : "Create User"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Username</Label>
                <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Password {editing && "(leave blank to keep)"}</Label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found. Click "Add User" to create one.
                </TableCell>
              </TableRow>
            ) : (
              userList.map((u) => (
                <TableRow key={u.userId} className="animate-fade-in">
                  <TableCell className="font-medium">{u.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{u.username}</TableCell>
                  <TableCell>{ROLE_LABELS[u.role] || u.role}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(u)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(u.userId)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
