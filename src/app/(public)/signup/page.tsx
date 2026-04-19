"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Account created! Please check your email to confirm your account.");
      }
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (authError) setError(authError.message);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-900">

      {/* LEFT SIDE (FORM) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 mt-10 lg:mt-0 pb-10">

          <div className="flex items-center gap-2.5 mb-10">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg viewBox="0 0 18 18" fill="none" className="w-4 h-4">
                <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <circle cx="9" cy="9" r="2.5" fill="white" />
              </svg>
            </span>
            <span className="font-bold text-xl tracking-tight text-gray-900">CareerOS</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Create Account</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Create an account to start your mission and get hired faster.
          </p>

          <form className="space-y-4" onSubmit={handleSignup}>
            {error && (
              <div className={`p-3 border rounded-xl text-sm font-semibold ${error.includes("Account created") ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                {error}
              </div>
            )}
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password (6+ chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-muted-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center pt-1 text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium">
                <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" />
                I agree to the{" "}
                <Link href="#" className="flex-shrink-0 text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {/* Button */}
            <button 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3 rounded-xl font-semibold shadow-sm transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75"/></svg> Creating account...</>
              ) : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">Or register with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social */}
          <div className="flex gap-4">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-2.5 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              onClick={() => handleSocialLogin('apple')}
              className="w-full flex items-center justify-center gap-2 bg-black py-2.5 rounded-xl text-sm font-semibold text-white shadow-md hover:bg-gray-900 transition-all border border-black"
            >
              <svg className="w-5 h-5" viewBox="0 0 384 512" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Login Redirect */}
          <p className="text-sm text-center mt-8 text-gray-600 font-medium tracking-wide">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (SHOWCASE) */}
      <div className="hidden lg:flex w-1/2 bg-[#fafafa] border-l border-gray-100 items-center justify-center relative p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
        
        <div className="max-w-md relative z-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-150 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Active Community
          </div>
          <h2 className="text-4xl font-serif tracking-tight text-gray-900 mb-4 leading-tight">
            Join thousands scaling their careers faster.
          </h2>
          <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
            Stop guessing what to learn. Get custom AI roadmaps and instantly build your portfolio.
          </p>

          {/* Mock Card */}
          <div className="bg-background rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
               <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Skill Radar</p>
                 <h4 className="text-foreground font-semibold">Senior Engineering Alignment</h4>
               </div>
               <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                 92%
               </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">System Design</span>
                <span className="text-xs font-bold bg-white border border-gray-200 shadow-sm px-2 py-1 rounded text-gray-600">Level 8</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Algorithms</span>
                <span className="text-xs font-bold bg-white border border-gray-200 shadow-sm px-2 py-1 rounded text-gray-600">Level 7</span>
              </div>
            </div>

            <div className="mt-4 h-20 bg-[linear-gradient(90deg,rgba(79,70,229,0.1),transparent)] border border-indigo-100 rounded-xl flex flex-col items-center justify-center text-indigo-600 text-sm overflow-hidden relative">
              <span className="font-semibold z-10 block mb-1">Growth Prediction</span>
              <span className="text-xs text-indigo-500 z-10">+18% this month</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}