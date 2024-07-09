import functions from "firebase-functions";

export const onTodoCompletedChange = functions.firestore
  .document("todos/{todoId}")
  .onUpdate((change, context) => {
    const beforeData = change.before.data(); // Data before the update
    const afterData = change.after.data(); // Data after the update

    // Check if the completed field exists and has changed
    const beforeCompleted = beforeData.completed;
    const afterCompleted = afterData.completed;

    // Only proceed if the 'completed' field has changed
    if (beforeCompleted !== afterCompleted) {
      console.log(
        `Todo ${context.params.todoId} completed status changed:`,
        afterCompleted
      );
      // Add your custom logic here, such as sending a notification or updating another document
    }

    return null;
  });