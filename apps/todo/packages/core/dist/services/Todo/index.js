"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
class TodoService {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }
    async getTodos() {
        return this.todoRepository.getAll();
    }
    async createTodo(data) {
        // TodoSchema.parse(data);
        return this.todoRepository.create(data);
    }
    async updateTodo(id, data) {
        return this.todoRepository.update(id, data);
    }
    async deleteTodo(id) {
        return this.todoRepository.delete(id);
    }
}
exports.TodoService = TodoService;
//# sourceMappingURL=index.js.map