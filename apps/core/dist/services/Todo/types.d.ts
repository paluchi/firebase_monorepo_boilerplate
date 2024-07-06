import { Todo } from "../../domain/todo";
export interface TodoRepository {
    getAll(): Promise<Todo[]>;
    getById(id: string): Promise<Todo | null>;
    create(item: Todo): Promise<Todo>;
    update(id: string, item: Partial<Todo>): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
