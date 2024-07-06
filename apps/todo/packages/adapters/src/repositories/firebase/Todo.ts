import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { TodoRepository } from "@todo/core/src/services/Todo/types";
import { Todo } from "@todo/core/src/domain/todo";

export class TodoFirebaseRepository implements TodoRepository {
  db: admin.firestore.Firestore;
  private collection: admin.firestore.CollectionReference;

  constructor(db: admin.firestore.Firestore) {
    this.db = db;
    this.collection = db.collection("todos");
  }

  public async getAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Todo);
  }

  public async create(todo: any) {
    todo.createdAt = FieldValue.serverTimestamp();
    const docRef = await this.collection.add(todo);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Todo;
  }

  public async update(id: string, data: any) {
    const todoRef = this.collection.doc(id);
    const doc = await todoRef.get();
    if (!doc.exists) {
      return false;
    }
    await todoRef.update(data);
    return true;
  }

  public async delete(id: string) {
    const todoRef = this.collection.doc(id);
    const doc = await todoRef.get();
    if (!doc.exists) {
      return false;
    }
    await todoRef.delete();
    return true;
  }

  public async getById(id: string) {
    const todoRef = this.collection.doc(id);
    const doc = await todoRef.get();
    return { id: doc.id, ...doc.data() } as Todo;
  }
}
