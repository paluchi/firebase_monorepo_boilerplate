import { TodoFirebaseRepository } from "@todo/adapters/src/repositories/firebase/Todo";
import { TodoService } from "@todo/core/src/services/Todo";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

let todoServiceInstance: TodoService | null = null;

let initialized = false;

export const initialize = async () => {
  if (initialized) return;
  const client = new SecretManagerServiceClient();

  async function accessSecretVersion(secretName: string) {
    const [version] = await client.accessSecretVersion({
      name: `projects/todo-project-dev-6f87b/secrets/${secretName}/versions/latest`,
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
