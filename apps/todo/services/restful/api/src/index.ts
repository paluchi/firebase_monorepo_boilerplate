import express from "express";
import * as functions from "firebase-functions";

import middleware0 from "./methods/private/onlyAuth.middleware";
import middleware1 from "./methods/todo/onlyAuth.middleware";
import endpoint0 from "./methods/todo/post.endpoint";
import endpoint1 from "./methods/todo/get.endpoint";
import endpoint2 from "./methods/todo/[todoId]/patch.endpoint";
import endpoint3 from "./methods/todo/[todoId]/get.endpoint";
import endpoint4 from "./methods/todo/[todoId]/delete.endpoint";
import endpoint5 from "./methods/private/auth/get.endpoint";

const app = express();
app.use(express.json());

app.use("/private", middleware0);
app.use("/todo", middleware1);
app.post("/todo", endpoint0);
app.get("/todo", endpoint1);
app.patch("/todo/:todoId", endpoint2);
app.get("/todo/:todoId", endpoint3);
app.delete("/todo/:todoId", endpoint4);
app.get("/private/auth", endpoint5);

// Fallback route for handling invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
  } else {
    app(req, res);
  }
});
