import { NextResponse } from 'next/server';
import { TodoRepoImpl } from '../../../../infrastructure/repositories/TodoRepoImpl';
import { TodoService } from '../../../../application/services/TodoService';

const todoRepo = new TodoRepoImpl();
const todoService = new TodoService(todoRepo);

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updatedTodo = await todoService.updateTodo(id, body);
    return NextResponse.json(updatedTodo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await todoService.deleteTodo(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
