import { TodoFirebaseRepository } from "@todo/adapters/src/repositories/firebase/Todo";
import { TodoService } from "@todo/core/src/services/Todo";
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
