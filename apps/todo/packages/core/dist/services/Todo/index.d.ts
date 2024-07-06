import { Todo } from "../../domain/todo";
import { TodoRepository } from "./types";
export declare class TodoService {
    private todoRepository;
    constructor(todoRepository: TodoRepository);
    getTodos(): Promise<{
        text: string;
        completed: boolean;
        userId: string;
        id?: string | undefined;
        createdAt?: Date | undefined;
    }[]>;
    createTodo(data: Todo): Promise<{
        text: string;
        completed: boolean;
        userId: string;
        id?: string | undefined;
        createdAt?: Date | undefined;
    }>;
    updateTodo(id: string, data: Partial<Todo>): Promise<boolean>;
    deleteTodo(id: string): Promise<boolean>;
}
