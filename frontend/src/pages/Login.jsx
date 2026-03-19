import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../data/users";
import { Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [selectedUser, setSelectedUser] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!selectedUser) return toast.error("Select a user!");
    localStorage.setItem("role", selectedUser.role);
    toast.success(`Logged in as ${selectedUser.username}`);
    navigate("/dashboard");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-green-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow w-96 space-y-4">
        <h2 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">Login</h2>
        <FormControl fullWidth>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            renderValue={(v) => v?.username || ""}
          >
            {users.map(u => (
              <MenuItem key={u.user_id} value={u}>{u.username} ({u.role})</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="success" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}