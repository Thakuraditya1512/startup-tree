"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  CheckCircleIcon,
  PlusIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { 
  CheckCircleIcon as CheckSolid,
  VideoCameraIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/solid";
import { Profile, UserTask, Module } from "@/types";

export default function AdminPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState<{moduleId: string} | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: "",
    type: "text",
    content_url: "",
    content_body: ""
  });

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: profiles }, { data: mods }] = await Promise.all([
      supabase.from('profiles').select('*').order('full_name'),
      supabase.from('modules').select('*').order('order')
    ]);
    setUsers(profiles || []);
    setModules(mods || []);
    setLoading(false);
  }

  async function loadUserRoadmap(user: Profile) {
    setSelectedUser(user);
    const { data } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', user.id);
    setUserTasks(data || []);
  }

  const handleDragStart = (e: React.DragEvent, userId: string) => {
    e.dataTransfer.setData("userId", userId);
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent, moduleId: string) => {
    e.preventDefault();
    setIsDragging(false);
    const userId = e.dataTransfer.getData("userId");
    if (!selectedUsers.includes(userId) && userId) {
      setSelectedUsers(prev => [...prev, userId]);
    }
    setShowTaskForm({ moduleId });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  async function createCustomTask() {
    if ((!selectedUser && selectedUsers.length === 0) || !showTaskForm) return;

    // Use selectedUsers (bulk) if present, otherwise use the currently viewed user
    const targets = selectedUsers.length > 0 ? selectedUsers : (selectedUser ? [selectedUser.id] : []);
    
    if (targets.length === 0) return;

    const tasksToInsert = targets.map(uid => ({
      user_id: uid,
      module_id: showTaskForm.moduleId,
      title: newTask.title || "New Task",
      type: newTask.type,
      content_url: newTask.content_url || "",
      content_body: newTask.content_body || "",
      status: 'available'
    }));

    const { error } = await supabase.from('user_tasks').insert(tasksToInsert);

    if (!error) {
      if (selectedUser && targets.includes(selectedUser.id)) {
        loadUserRoadmap(selectedUser);
      }
      setShowTaskForm(null);
      setNewTask({ title: "", type: "text", content_url: "", content_body: "" });
      setSelectedUsers([]);
    }
  }

  async function deleteTask(taskId: string) {
    if (!confirm("Delete this task from user's roadmap?")) return;
    const { error } = await supabase.from('user_tasks').delete().eq('id', taskId);
    if (!error) {
      setUserTasks(prev => prev.filter(t => t.id !== taskId));
    }
  }

  async function toggleTaskStatus(task: UserTask) {
    const nextStatus = task.status === 'done' ? 'available' : 'done';
    const { error } = await supabase
      .from('user_tasks')
      .update({ status: nextStatus, completed_at: nextStatus === 'done' ? new Date().toISOString() : null })
      .eq('id', task.id);
    
    if (!error) {
      setUserTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <VideoCameraIcon className="w-4 h-4 text-rose-500" />;
      case 'link': return <LinkIcon className="w-4 h-4 text-blue-500" />;
      case 'quiz': return <QuestionMarkCircleIcon className="w-4 h-4 text-emerald-500" />;
      default: return <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Mission Control</h1>
          <p className="text-muted-foreground mt-1">Drag users to modules to assign tasks instantly.</p>
        </div>
        <button onClick={loadData} className="p-2 rounded-xl border border-border hover:bg-muted transition">
          <ArrowPathIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: User List (Selection & Draggable) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <UserGroupIcon className="w-4 h-4" /> User Directory
             </h2>
             {selectedUsers.length > 0 && (
               <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                 {selectedUsers.length} SELECTED
               </span>
             )}
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {users.map(u => (
              <div
                key={u.id}
                draggable
                onDragStart={(e) => handleDragStart(e, u.id)}
                className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing hover:shadow-md ${selectedUser?.id === u.id ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 ring-1 ring-indigo-500' : 'border-border bg-card'}`}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.includes(u.id)}
                    onChange={() => toggleUserSelection(u.id)}
                    className="w-4 h-4 rounded border-border text-indigo-600 focus:ring-indigo-500"
                  />
                  <div onClick={() => loadUserRoadmap(u)} className="cursor-pointer">
                    <p className="font-bold text-sm">{u.full_name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{u.role}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-extrabold text-green-500">{u.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: User Detail & Module List (Drop Zones) */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedUser && selectedUsers.length === 0 ? (
            <div className="h-64 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
              <AcademicCapIcon className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-bold">Select or Drag a user to start</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              
              {/* User Identity Header */}
              {selectedUser && (
                <div className="p-6 rounded-3xl border border-border bg-card shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {selectedUser.full_name[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">{selectedUser.full_name}</h3>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Module List with Drop Support */}
              <div className="space-y-6">
                {modules.map(mod => {
                  const tasks = selectedUser ? userTasks.filter(t => t.module_id === mod.id) : [];
                  return (
                    <div key={mod.id} className="space-y-4">
                      {/* Drop Zone Header */}
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, mod.id)}
                        className={`p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-between ${isDragging ? 'border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10' : 'border-border bg-card'}`}
                      >
                         <h4 className="text-sm font-bold flex items-center gap-2">
                           <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">{mod.order}</span>
                           {mod.title}
                         </h4>
                         <button 
                           onClick={() => setShowTaskForm({ moduleId: mod.id })}
                           className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/10 text-indigo-600 py-1.5 px-3 rounded-lg hover:bg-indigo-500/20"
                         >
                           Add Content
                         </button>
                      </div>

                      {/* Add Form */}
                      {showTaskForm?.moduleId === mod.id && (
                        <div className="p-6 bg-card border border-border rounded-2xl shadow-xl space-y-4 animate-in slide-in-from-top-2">
                           <div className="flex items-center justify-between">
                             <p className="text-xs font-black uppercase text-indigo-600 tracking-tighter">Mass Assignment Wizard</p>
                             <button onClick={() => setShowTaskForm(null)}><XMarkIcon className="w-5 h-5" /></button>
                           </div>
                           <input 
                             placeholder="Task Title (e.g. Mastering Next.js)"
                             value={newTask.title}
                             onChange={e => setNewTask({...newTask, title: e.target.value})}
                             className="w-full p-3 rounded-xl border border-border outline-none focus:border-indigo-500 bg-background font-bold text-sm"
                           />
                           <div className="grid grid-cols-2 gap-3">
                             <select 
                               value={newTask.type}
                               onChange={e => setNewTask({...newTask, type: e.target.value})}
                               className="p-3 rounded-xl border border-border bg-background text-sm font-semibold"
                             >
                               <option value="text">Text/Article</option>
                               <option value="video">YouTube Video</option>
                               <option value="link">External Link</option>
                               <option value="quiz">Assignment</option>
                             </select>
                             <input 
                               placeholder="Content URL (if any)"
                               value={newTask.content_url}
                               onChange={e => setNewTask({...newTask, content_url: e.target.value})}
                               className="p-3 rounded-xl border border-border outline-none bg-background text-sm"
                             />
                           </div>
                           <textarea 
                             placeholder="Provide instructions..."
                             value={newTask.content_body}
                             onChange={e => setNewTask({...newTask, content_body: e.target.value})}
                             className="w-full p-3 rounded-xl border border-border outline-none bg-background text-sm h-24"
                           />
                           <button 
                             onClick={createCustomTask}
                             className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20"
                           >
                             Assign to {selectedUser ? selectedUser.full_name : `${selectedUsers.length} Users`}
                           </button>
                        </div>
                      )}

                      {/* Existing Tasks (only visible if a user is selected) */}
                      {selectedUser && tasks.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-indigo-500/10">
                          {tasks.map(task => (
                            <button 
                              key={task.id}
                              onClick={() => toggleTaskStatus(task)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${task.status === 'done' ? 'bg-green-500/5 border-green-500/20' : 'bg-card border-border hover:border-indigo-500/30'}`}
                            >
                               <div className="flex items-center gap-3">
                                 {task.status === 'done' ? <CheckSolid className="w-4 h-4 text-green-500" /> : getTypeIcon(task.type)}
                                 <span className="text-xs font-bold text-foreground">{task.title}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-black uppercase text-muted-foreground">{task.status}</span>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                   className="p-1.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                                 >
                                   <XMarkIcon className="w-3.5 h-3.5" />
                                 </button>
                               </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
