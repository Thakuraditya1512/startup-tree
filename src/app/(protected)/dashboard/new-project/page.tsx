"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/AuthContext";
import { 
  RocketLaunchIcon, 
  DocumentTextIcon, 
  QueueListIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

const STEPS = [
  { id: 1, title: "Mission Goal", icon: RocketLaunchIcon },
  { id: 2, title: "Resume & Skills", icon: DocumentTextIcon },
  { id: 3, title: "Preferences", icon: QueueListIcon },
];

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    resume_text: "",
    tech_stack: "",
    priority: "mid"
  });

  const nextStep = () => setStep(s => Math.min(s + 1, STEPS.length));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  async function handleSubmit() {
    if (!profile) return;
    setLoading(true);
    
    const { error } = await supabase.from('projects').insert({
      user_id: profile.id,
      title: formData.title,
      description: `Goal: ${formData.goal}\nTech: ${formData.tech_stack}`,
      status: 'active',
      progress: 0
    });

    if (!error) {
      router.push('/dashboard');
    } else {
      alert("Error creating project: " + error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black/50 p-6 sm:p-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Back link */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition mb-10"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Progress Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
             {STEPS.map((s) => (
               <div key={s.id} className="flex flex-col items-center gap-2 flex-1 relative">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${step >= s.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-background border-border text-muted-foreground'}`}>
                   {step > s.id ? <CheckCircleIcon className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-indigo-600' : 'text-muted-foreground'}`}>{s.title}</span>
                 {s.id < STEPS.length && (
                   <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${step > s.id ? 'bg-indigo-600' : 'bg-border'}`} />
                 )}
               </div>
             ))}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Launch a New Path</h1>
          <p className="text-muted-foreground mt-2">Tell us about your next big career move.</p>
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Project Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Senior Frontend Engineer Road"
                  className="w-full p-4 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">What is your primary goal?</label>
                <textarea 
                  placeholder="e.g. I want to master System Design and get a job at a Tier 1 tech company within 6 months."
                  className="w-full p-4 rounded-2xl border border-border bg-background h-32 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  value={formData.goal}
                  onChange={e => setFormData({...formData, goal: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Paste your current Resume/Skills</label>
                <textarea 
                  placeholder="Paste your resume text here so our AI can analyze your current standing..."
                  className="w-full p-4 rounded-2xl border border-border bg-background h-64 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  value={formData.resume_text}
                  onChange={e => setFormData({...formData, resume_text: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Technical Preferences</label>
                <input 
                  type="text" 
                  placeholder="e.g. React, Next.js, TypeScript, AWS"
                  className="w-full p-4 rounded-2xl border border-border bg-background focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none underline-offset-4"
                  value={formData.tech_stack}
                  onChange={e => setFormData({...formData, tech_stack: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-bold mb-4">Urgency</label>
                 <div className="grid grid-cols-3 gap-4">
                    {['low', 'mid', 'high'].map(p => (
                      <button 
                        key={p}
                        onClick={() => setFormData({...formData, priority: p})}
                        className={`py-3 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all ${formData.priority === p ? 'bg-indigo-600 border-indigo-600 text-white' : 'hover:bg-muted'}`}
                      >
                        {p}
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            <button 
              disabled={step === 1}
              onClick={prevStep}
              className={`text-sm font-bold text-muted-foreground hover:text-foreground transition disabled:opacity-30`}
            >
              Back
            </button>
            
            {step < STEPS.length ? (
              <button 
                onClick={nextStep}
                disabled={!formData.title}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                Next Step <ArrowRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Finish & Create Project"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
