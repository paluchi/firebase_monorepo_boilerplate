import { https } from "firebase-functions";
import { todoService } from "./context.js";

// Define and export the createTodo function
export const createTodo = https.onRequest(async (request, response) => {
  await todoService.createTodo({
    text: "test",
    completed: false,
    userId: "123",
  });

  response.send("Todo created");
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
