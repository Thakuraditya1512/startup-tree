import { TodoRepo } from '../../domain/repositories/TodoRepo';
import { Todo } from '../../domain/entities/Todo';
import { validateTodoCreation } from '../validators/todoValidator';

export class TodoService {
  constructor(private readonly todoRepo: TodoRepo) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepo.getTodos();
  }

  async getTodoById(id: string): Promise<Todo | null> {
    return this.todoRepo.getTodoById(id);
  }

  async addTodo(data: { title: string }): Promise<Todo> {
    validateTodoCreation(data);
    return this.todoRepo.addTodo({
      title: data.title,
      completed: false
    });
  }

  async updateTodo(id: string, data: Partial<Todo>): Promise<Todo> {
    return this.todoRepo.updateTodo(id, data);
  }

  async deleteTodo(id: string): Promise<void> {
    return this.todoRepo.deleteTodo(id);
  }
}
