import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const reports = [
  { id: 1, title: "Weekly Harvest Summary", date: "2026-03-16" },
  { id: 2, title: "Monthly Field Overview", date: "2026-03-01" },
];

export default function Reports() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Reports</h1>
      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card className="dark:bg-gray-800">
              <CardContent>
                <Typography variant="h6" className="font-bold text-green-600 dark:text-green-300">
                  {report.title}
                </Typography>
                <Typography>Date: {report.date}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}