import React from "react";
import { users } from "../data/users";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";

export default function Users() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Users</h1>
      <Paper className="overflow-x-auto">
        <Table>
          <TableHead className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}