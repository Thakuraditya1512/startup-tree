"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Trash2, Plus, Loader2 } from "lucide-react";

// Local typing to avoid relative import issues on client
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    setAdding(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setNewTaskTitle("");
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    // Optimistic UI update
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
    
    try {
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
    } catch (e) {
      console.error(e);
      // Revert if failed
      setTodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)));
    }
  };

  const deleteTodo = async (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      fetchTodos(); // Refetch to align state
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/30">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950 pointer-events-none" />
      
      <div className="relative w-full max-w-2xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-[2rem] p-6 sm:p-10 shadow-2xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Tasks
            </h1>
            <p className="text-sm font-medium text-neutral-400">
              {todos.filter((t) => !t.completed).length} remaining today
            </p>
          </div>
          <div className="h-14 w-14 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <span className="text-indigo-400 font-bold text-xl">
              {todos.length}
            </span>
          </div>
        </header>

        <form onSubmit={addTodo} className="relative mb-10 group">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-neutral-950/50 border border-neutral-800 hover:border-neutral-700 focus:border-indigo-500/50 rounded-2xl px-6 py-5 text-base sm:text-lg text-white placeholder-neutral-500 transition-all outline-none pr-16 shadow-inner focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)]"
            disabled={adding}
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim() || adding}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-500 hover:bg-indigo-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-white rounded-[14px] flex items-center justify-center transition-all disabled:opacity-50"
          >
            {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
          </button>
        </form>

        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 w-full rounded-2xl bg-neutral-800/40 animate-pulse border border-neutral-800/30" />
              ))}
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-neutral-600" />
              </div>
              <p className="text-lg">You&apos;re all caught up!</p>
              <p className="text-sm text-neutral-600 mt-1">Add a task above to get started.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`group relative flex items-center gap-5 bg-neutral-800/20 hover:bg-neutral-800/40 border border-neutral-800/50 hover:border-neutral-700/80 rounded-2xl p-5 transition-all duration-300 ${
                    todo.completed ? "opacity-60 grayscale-[50%]" : "opacity-100"
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className="flex-shrink-0 text-neutral-500 hover:text-indigo-400 transition-colors focus:outline-none"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-7 h-7 text-indigo-500" />
                    ) : (
                      <Circle className="w-7 h-7" />
                    )}
                  </button>
                  
                  <span
                    className={`flex-1 text-lg transition-all duration-300 truncate ${
                      todo.completed ? "text-neutral-500 line-through" : "text-neutral-200"
                    }`}
                  >
                    {todo.title}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-neutral-600 hover:text-red-400 bg-neutral-900/50 hover:bg-neutral-900 p-2 rounded-xl transition-all duration-200 focus:outline-none focus:opacity-100"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
