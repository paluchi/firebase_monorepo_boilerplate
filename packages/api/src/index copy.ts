// import * as functions from "firebase-functions";
// import { FieldValue } from "firebase-admin/firestore";
// import * as admin from "firebase-admin";

// admin.initializeApp();
// const db = admin.firestore();


// export const createTodo = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       "unauthenticated",
//       "User must be authenticated"
//     );
//   }
//   const newTodo = {
//     text: data.text,
//     completed: false,
//     userId: context.auth.uid,
//     createdAt: FieldValue.serverTimestamp(),
//   };
//   await db.collection("todos").add(newTodo);
//   return { message: "Todo created" };
// });

// export const updateTodo = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       "unauthenticated",
//       "User must be authenticated"
//     );
//   }
//   const todoRef = db.collection("todos").doc(data.id);
//   await todoRef.update({
//     text: data.text,
//     completed: data.completed,
//   });
//   return { message: "Todo updated" };
// });

// export const deleteTodo = functions.https.onCall(async (data, context) => {
//   if (!context.auth) {
//     throw new functions.https.HttpsError(
//       "unauthenticated",
//       "User must be authenticated"
//     );
//   }
//   const todoRef = db.collection("todos").doc(data.id);
//   await todoRef.delete();
//   return { message: "Todo deleted" };
// });
