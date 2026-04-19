"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowUpTrayIcon, DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [goal, setGoal] = useState<string>("");
  const [experience, setExperience] = useState<string>("");

  useEffect(() => {
    if (step === 4) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // Redirect to dashboard after generation
              router.push("/dashboard?created=true");
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, router]);

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-8 duration-500 animate-in fade-in">
      {/* Header */}
      <div className="mb-8 flex items-center">
        {step < 4 ? (
          <button 
            onClick={step === 1 ? () => router.push("/dashboard") : handleBack}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>
        ) : (
          <div className="h-5" /> // Spacer
        )}
      </div>

      {/* Progress Dots */}
      {step < 4 && (
        <div className="mb-10 flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-indigo-600" : "bg-muted"}`} 
            />
          ))}
        </div>
      )}

      {/* Step 1: Resume Upload */}
      {step === 1 && (
        <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Upload your Resume</h1>
          <p className="mb-8 text-muted-foreground">We'll use this to understand your current baseline and generate a personalized roadmap.</p>
          
          <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition hover:border-indigo-500/50 hover:bg-muted/50">
            <div className="mb-4 rounded-full bg-indigo-50 p-4 dark:bg-indigo-500/10">
              <ArrowUpTrayIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="mb-1 font-semibold text-foreground">Click to upload or drag and drop</h3>
            <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT (max. 5MB)</p>
            <input 
              type="file" 
              className="absolute inset-x-0 inset-y-0 opacity-0 cursor-pointer w-full h-[60%]"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            {file && (
              <div className="mt-6 flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                <DocumentTextIcon className="h-5 w-5" />
                {file.name}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button 
              onClick={handleNext}
              disabled={!file}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Goal selection */}
      {step === 2 && (
        <div className="animate-in slide-in-from-right-8 duration-500 fade-in">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">What's your primary goal?</h1>
          <p className="mb-8 text-muted-foreground">Select the target role you want to get hired for.</p>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
            {["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Product Manager", "Data Scientist", "DevOps Engineer"].map((role) => (
              <button
                key={role}
                onClick={() => setGoal(role)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${goal === role ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-600" : "border-border bg-card hover:bg-muted"}`}
              >
                <span className={`font-medium ${goal === role ? "text-indigo-700 dark:text-indigo-300" : "text-foreground"}`}>{role}</span>
                {goal === role && <CheckCircleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button onClick={handleBack} className="text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
            <button 
              onClick={handleNext}
              disabled={!goal}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next step
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Experience Level */}
      {step === 3 && (
        <div className="animate-in slide-in-from-right-8 duration-500 fade-in">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Current experience level?</h1>
          <p className="mb-8 text-muted-foreground">Help us calibrate the difficulty of your daily loops.</p>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
            {[
              { id: "junior", label: "Junior / Entry", desc: "0-2 years of experience" },
              { id: "mid", label: "Mid-Level", desc: "3-5 years of experience" },
              { id: "senior", label: "Senior+", desc: "6+ years of experience" }
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setExperience(level.id)}
                className={`flex flex-col rounded-xl border p-5 text-left transition-all ${experience === level.id ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-600" : "border-border bg-card hover:bg-muted"}`}
              >
                <span className={`font-semibold mb-1 ${experience === level.id ? "text-indigo-700 dark:text-indigo-300" : "text-foreground"}`}>{level.label}</span>
                <span className="text-xs text-muted-foreground">{level.desc}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button onClick={handleBack} className="text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
            <button 
              onClick={handleNext}
              disabled={!experience}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate AI Plan
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Loading State */}
      {step === 4 && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-700">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
            <svg className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent transition-all duration-200" 
              style={{ transform: `rotate(${progress * 3.6}deg)` }}
            ></div>
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Analyzing Your Profile</h2>
          <p className="text-muted-foreground mb-6">Structuring your personalized roadmap for {goal}...</p>
          
          <div className="w-full max-w-sm rounded-full bg-muted h-2.5 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="mt-3 font-mono text-sm font-semibold text-indigo-600">{progress}%</span>
        </div>
      )}

    </div>
  );
}
