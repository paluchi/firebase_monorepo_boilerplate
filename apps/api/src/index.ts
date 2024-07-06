import express from "express";
import * as functions from "firebase-functions";

import endpoint0 from "./methods/todo/post.endpoint";
import endpoint1 from "./methods/todo/get.endpoint";
import endpoint2 from "./methods/todo/[todoId]/patch.endpoint";
import endpoint3 from "./methods/todo/[todoId]/get.endpoint";
import endpoint4 from "./methods/todo/[todoId]/delete.endpoint";

const app = express();
app.use(express.json());

app.post("/todo", endpoint0);
app.get("/todo", endpoint1);
app.patch("/todo/:todoId", endpoint2);
app.get("/todo/:todoId", endpoint3);
app.delete("/todo/:todoId", endpoint4);

// Fallback route for handling invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
