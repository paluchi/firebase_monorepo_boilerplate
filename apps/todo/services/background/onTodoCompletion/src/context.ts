import { TodoFirebaseRepository } from "@todo/adapters/src/repositories/firebase/Todo";
import { TodoService } from "@todo/core/src/services/Todo";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import * as functions from "firebase-functions";

let todoServiceInstance: TodoService | null = null;
let initialized = false;

export const initialize = async () => {
  if (initialized) return;
  const client = new SecretManagerServiceClient();

  async function accessSecretVersion(secretName: string) {
    const projectId =
      process.env.GCLOUD_PROJECT || functions.config().project.id;
    const [version] = await client.accessSecretVersion({
      name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
    });

    if (version.payload?.data) {
      const payload = version.payload.data.toString();
      return JSON.parse(payload);
    } else {
      throw new Error(`Secret ${secretName} not found or is empty`);
    }
  }

  const serviceAccount = await accessSecretVersion("SERVICE_ACCOUNT");

  initializeApp({
    credential: cert(serviceAccount),
  });

  initialized = true;
};

async function getTodoService(): Promise<TodoService> {
  if (!todoServiceInstance) {
    if (!initialized) await initialize();

    const db = getFirestore();
    const todoRepository = new TodoFirebaseRepository(db);
    todoServiceInstance = new TodoService(todoRepository);
  }
  return todoServiceInstance;
}

export { getTodoService };
