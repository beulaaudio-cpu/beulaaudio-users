"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/firebase/AuthContext";
import { X, Lock, Mail, User, AlertCircle, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authPromptReason,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    const res = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    if (mode === "signin") {
      const res = await signInWithEmail(email, password);
      if (!res.success && res.error) {
        setErrorMsg(res.error);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name.");
        setIsLoading(false);
        return;
      }
      const res = await signUpWithEmail(email, password, name);
      if (!res.success && res.error) {
        setErrorMsg(res.error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-white my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-amber-400 uppercase font-bold block mb-1">
            BEULA AUDIO // AUTHENTICATION
          </span>
          <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-white">
            {mode === "signin" ? "Sign In to Continue" : "Create Client Account"}
          </h3>
          <p className="font-sans text-xs text-zinc-400 mt-1 font-light leading-relaxed">
            {authPromptReason || "Sign in to reserve your event setup and access live dispatch tracking."}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google One-Click Login */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full py-3.5 px-4 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.10] hover:border-white/40 text-white font-sans text-xs font-semibold tracking-wider flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 active:scale-[0.99] mb-4 shadow-sm"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-zinc-950 px-3 font-mono text-[9px] uppercase tracking-widest text-zinc-500 shrink-0">
            OR WITH EMAIL
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="block font-mono text-[9px] tracking-wider text-zinc-400 uppercase mb-1 font-semibold">
                FULL NAME
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/15 bg-black text-white font-sans text-xs focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono text-[9px] tracking-wider text-zinc-400 uppercase mb-1 font-semibold">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/15 bg-black text-white font-sans text-xs focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[9px] tracking-wider text-zinc-400 uppercase mb-1 font-semibold">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/15 bg-black text-white font-sans text-xs focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)] mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === "signin" ? (
              <span>SIGN IN</span>
            ) : (
              <span>CREATE ACCOUNT</span>
            )}
          </button>
        </form>

        {/* Toggle between Sign In & Sign Up */}
        <div className="pt-4 mt-4 border-t border-white/10 text-center">
          {mode === "signin" ? (
            <p className="font-sans text-xs text-zinc-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                }}
                className="text-amber-400 hover:underline font-medium"
              >
                Sign up free
              </button>
            </p>
          ) : (
            <p className="font-sans text-xs text-zinc-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                }}
                className="text-amber-400 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
