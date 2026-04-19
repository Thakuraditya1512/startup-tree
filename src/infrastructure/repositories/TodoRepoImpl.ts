import { TodoRepo } from '../../domain/repositories/TodoRepo';
import { Todo } from '../../domain/entities/Todo';
import { supabase } from '../supabaseClient';

export class TodoRepoImpl implements TodoRepo {
  private mapToTodo(data: any): Todo {
    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      createdAt: new Date(data.created_at || new Date())
    };
  }

  async getTodos(): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          console.warn("Supabase env missing, please configure your .env.local file");
          return [];
      }
      throw new Error(error.message);
    }
    return data ? data.map((item) => this.mapToTodo(item)) : [];
  }

  async getTodoById(id: string): Promise<Todo | null> {
    const { data, error } = await supabase.from('todos').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data ? this.mapToTodo(data) : null;
  }

  async addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
    const { data, error } = await supabase.from('todos').insert({
      title: todo.title,
      completed: todo.completed
    }).select().single();
    
    if (error) {
      // Mock logic in case credentials are missing for visualization
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
         return { id: Math.random().toString(), title: todo.title, completed: todo.completed, createdAt: new Date() };
      }
      throw new Error(error.message);
    }
    return this.mapToTodo(data);
  }

  async updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
    const { data, error } = await supabase.from('todos').update({
      ...(todo.title !== undefined && { title: todo.title }),
      ...(todo.completed !== undefined && { completed: todo.completed })
    }).eq('id', id).select().single();
    
    if (error) {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
         return { id, title: todo.title || '', completed: todo.completed || false, createdAt: new Date() };
      }
      throw new Error(error.message);
    }
    return this.mapToTodo(data);
  }

  async deleteTodo(id: string): Promise<void> {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (error) {
       if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
       throw new Error(error.message);
    }
  }
}
