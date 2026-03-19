import React from "react";
import { fields } from "../data/fields";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function Fields() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Fields</h1>
      <Grid container spacing={3}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field.field_id}>
            <Card className="dark:bg-gray-800">
              <CardContent>
                <Typography variant="h6" className="font-bold text-green-600 dark:text-green-300">
                  {field.field_name}
                </Typography>
                <Typography>Size: {field.size}</Typography>
                <Typography>Location: {field.location}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}