import { TodoFirebaseRepository } from "@repo/adapters/repositories/firebase/Todo.js";
import { TodoService } from "../../core/src/services/Todo/index.js";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let todoServiceInstance: TodoService | null = null;

function getTodoService() {
  if (!todoServiceInstance) {
    initializeApp();
    const db = getFirestore();
    const todoRepository = new TodoFirebaseRepository(db);
    todoServiceInstance = new TodoService(todoRepository);
  }
  return todoServiceInstance;
}

export const todoService = getTodoService();
