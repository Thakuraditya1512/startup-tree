"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  ShieldExclamationIcon, 
  TrashIcon, 
  UserMinusIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function AdminSettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    setUsers(data || []);
    setLoading(false);
  }

  async function toggleAdmin(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) fetchUsers();
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure? This will delete the user profile and all their data permanently.")) return;
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (!error) fetchUsers();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Configure global permissions and manage system access.</p>
      </div>

      {/* ACCESS CONTROL */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h2 className="font-bold flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-indigo-500" /> User Permissions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Promote users to admin or revoke access.</p>
        </div>
        <div className="divide-y divide-border">
          {users.map(u => (
            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {u.full_name?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold">{u.full_name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{u.role}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleAdmin(u.id, u.role)}
                className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${u.role === 'admin' ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 hover:bg-amber-500/20' : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* DANGER ZONE (GITHUB STYLE) */}
      <section className="border border-red-500/30 rounded-2xl overflow-hidden bg-red-500/5">
        <div className="p-6 border-b border-red-500/20">
          <h2 className="font-bold text-red-600 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-xs text-red-600/70 mt-1">Irreversible actions that affect the entire application data.</p>
        </div>
        
        <div className="divide-y divide-red-500/10">
          {/* Action: Delete User */}
          <div className="p-6 flex items-center justify-between bg-white/50 dark:bg-black/20">
            <div>
              <p className="text-sm font-bold">Remove User Data</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Permanently delete a user profile and all associated roadmaps.</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95">
              DELETE USER
            </button>
          </div>

          {/* Action: Reset Global Cache */}
          <div className="p-6 flex items-center justify-between bg-white/50 dark:bg-black/20">
            <div>
              <p className="text-sm font-bold">Wipe System Analytics</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">Clears all global activity feeds and activity history.</p>
            </div>
            <button className="text-red-600 border border-red-200 bg-white hover:bg-red-50 dark:bg-transparent dark:border-red-900/50 text-[11px] font-extrabold px-6 py-2.5 rounded-xl transition-all">
              RESET ANALYTICS
            </button>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center p-8 text-center bg-muted/20 rounded-3xl border border-dashed border-border opacity-50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">End of admin configuration</p>
      </div>

    </div>
  );
}
