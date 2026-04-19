import { NextResponse } from 'next/server';
import { TodoRepoImpl } from '../../../infrastructure/repositories/TodoRepoImpl';
import { TodoService } from '../../../application/services/TodoService';

const todoRepo = new TodoRepoImpl();
const todoService = new TodoService(todoRepo);

export async function GET() {
  try {
    const todos = await todoService.getAllTodos();
    return NextResponse.json(todos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTodo = await todoService.addTodo(body);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
