import { https } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { todoService } from "./context.js";

todoService.createTodo;

// Initialize Firebase app
// initializeApp();
// const db = getFirestore();

// Define and export the createTodo function
export const createTodo = https.onRequest(async (request, response) => {
  console.log("Creating todo_");
  response.send("Creating todo_!");
});

// Define and export the helloWorld function
export const helloWorld = https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Define and export the updateTodo function
export const updateTodo = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "User must be authenticated");
  }
  // const todoRef = db.collection("todos").doc(data.id);
  // await todoRef.update({
  //   text: data.text,
  //   completed: data.completed,
  // });
  return { message: "Todo updated" };
});

// Define and export the deleteTodo function
export const deleteTodo = https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "User must be authenticated");
  }
  // const todoRef = db.collection("todos").doc(data.id);
  // await todoRef.delete();
  return { message: "Todo deleted" };
});
