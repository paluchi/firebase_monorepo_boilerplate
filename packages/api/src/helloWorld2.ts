import * as functions from "firebase-functions";

export const helloWorld2 = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
