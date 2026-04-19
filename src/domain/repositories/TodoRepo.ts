import { Todo } from '../entities/Todo';

export interface TodoRepo {
  getTodos(): Promise<Todo[]>;
  getTodoById(id: string): Promise<Todo | null>;
  addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo>;
  updateTodo(id: string, todo: Partial<Todo>): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
}
