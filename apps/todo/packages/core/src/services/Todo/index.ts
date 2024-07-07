import { Todo, TodoSchema } from "../../domain/todo";
import { TodoRepository } from "./types";

export class TodoService {
  private todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  public async getTodos() {
    return this.todoRepository.getAll();
  }

  public async createTodo(data: Todo) {
    // TodoSchema.parse(data);

    return this.todoRepository.create(data);
  }

  public async updateTodo(id: string, data: Partial<Todo>) {
    return this.todoRepository.update(id, data);
  }

  public async deleteTodo(id: string) {
    return this.todoRepository.delete(id);
  }
}
