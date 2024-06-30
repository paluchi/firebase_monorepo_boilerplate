import { TodoFirebaseRepository } from "../../adapters/src/repositories/firebase/Todo";
import { TodoService } from "../../core/src/services/Todo";
import * as admin from "firebase-admin";

let todoServiceInstance: TodoService | null = null;

function initializeFirebaseApp() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
}

function getTodoService() {
  if (!todoServiceInstance) {
    initializeFirebaseApp();
    const db = admin.firestore();
    const todoRepository = new TodoFirebaseRepository(db);
    todoServiceInstance = new TodoService(todoRepository);
  }
  return todoServiceInstance;
}

export const todoService = getTodoService();
