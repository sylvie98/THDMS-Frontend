import React from "react";
import { harvests } from "../data/harvests";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper } from "@mui/material";

export default function Harvest() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Harvest Records</h1>
      <Paper className="overflow-x-auto">
        <Table>
          <TableHead className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Quantity (kg)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {harvests.map((h) => (
              <TableRow key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <TableCell>{h.id}</TableCell>
                <TableCell>{h.field_name}</TableCell>
                <TableCell>{h.date}</TableCell>
                <TableCell>{h.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}