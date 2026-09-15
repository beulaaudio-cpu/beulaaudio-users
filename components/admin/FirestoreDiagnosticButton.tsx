"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/firebase/AuthContext";
import { getFirebaseClient } from "../../lib/firebase/client";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Database, Activity, CheckCircle2, AlertTriangle, X, Loader2, RefreshCw } from "lucide-react";

export function FirestoreDiagnosticButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: "idle" | "success" | "error";
    latencyMs?: number;
    message?: string;
    details?: any;
    timestamp?: string;
  }>({ status: "idle" });

  // STRICT ACCESS CONTROL: Visible ONLY for beulaaudio@gmail.com
  if (!user || user.email?.toLowerCase() !== "beulaaudio@gmail.com") {
    return null;
  }

  const runDatabaseDiagnostic = async () => {
    setIsRunning(true);
    const startTime = performance.now();

    try {
      const { db, auth } = getFirebaseClient();
      if (!db) {
        throw new Error("Firestore client not initialized. Check API Key & Project ID.");
      }

      // 1. Test Write: Ping document to diagnostics collection
      const pingDocRef = doc(db, "diagnostics", "admin_connection_ping");
      const pingPayload = {
        timestamp: new Date().toISOString(),
        testedBy: user.email,
        authUid: user.uid,
        serverTime: serverTimestamp(),
      };
      await setDoc(pingDocRef, pingPayload);

      // 2. Test Read: Read back the written document
      const readSnap = await getDoc(pingDocRef);
      if (!readSnap.exists()) {
        throw new Error("Diagnostic document write succeeded, but verification read failed.");
      }

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setTestResult({
        status: "success",
        latencyMs: latency,
        message: "Firestore connected & authenticated successfully.",
        timestamp: new Date().toLocaleTimeString(),
        details: {
          projectId: "beulaaudi0",
          authDomain: "beulaaudi0.firebaseapp.com",
          user: user.email,
          uid: user.uid,
          collection: "diagnostics",
          verified: true,
        },
      });
    } catch (err: any) {
      console.error("Firestore test error:", err);
      const endTime = performance.now();
      setTestResult({
        status: "error",
        latencyMs: Math.round(endTime - startTime),
        message: err?.message || "Failed to reach Firestore.",
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      {/* Fixed Trigger Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in duration-300">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            if (testResult.status === "idle") {
              runDatabaseDiagnostic();
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400/90 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95 border border-amber-300"
          title="Admin Firestore Database Diagnostic"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <Database className="w-3.5 h-3.5" />
          <span>TEST DB CONNECTION</span>
        </button>
      </div>

      {/* Diagnostics Modal HUD */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl border border-amber-400/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-white my-auto animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase font-bold block">
                  ADMIN DIAGNOSTIC CONSOLE
                </span>
                <h3 className="font-serif text-xl font-bold uppercase text-white">
                  Firestore Client Test
                </h3>
              </div>
            </div>

            <p className="font-sans text-xs text-zinc-400 mb-6 font-light">
              Testing client-side direct connection to Google Cloud Firestore project{" "}
              <span className="text-amber-300 font-mono font-medium">beulaaudi0</span>.
            </p>

            {/* Test Status Box */}
            <div
              className={`p-5 rounded-2xl border mb-6 transition-all ${
                isRunning
                  ? "border-amber-400/30 bg-amber-400/5 text-zinc-300"
                  : testResult.status === "success"
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-200"
                  : testResult.status === "error"
                  ? "border-red-500/40 bg-red-950/20 text-red-200"
                  : "border-white/10 bg-white/[0.02] text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {isRunning ? (
                    <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                  ) : testResult.status === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : testResult.status === "error" ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Database className="w-5 h-5 text-zinc-400" />
                  )}
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    {isRunning
                      ? "Testing Connection..."
                      : testResult.status === "success"
                      ? "Firestore Online & Functional"
                      : testResult.status === "error"
                      ? "Connection Test Failed"
                      : "Ready to Test"}
                  </span>
                </div>

                {testResult.latencyMs !== undefined && (
                  <span className="font-mono text-xs font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    {testResult.latencyMs} ms
                  </span>
                )}
              </div>

              <p className="font-sans text-xs mb-3">
                {testResult.message || "Click below to execute a real-time round-trip ping."}
              </p>

              {testResult.status === "error" && testResult.message?.includes("insufficient permissions") && (
                <div className="mb-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] space-y-1">
                  <p className="font-semibold text-amber-300">Quick Fix:</p>
                  <p>In Firebase Console, click the <strong>Rules</strong> tab (next to Data in your screenshot) and publish the firestore rules.</p>
                </div>
              )}

              {testResult.details && (
                <div className="space-y-1 pt-3 border-t border-white/10 font-mono text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Project:</span>
                    <span className="text-white">{testResult.details.projectId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operator:</span>
                    <span className="text-amber-300">{testResult.details.user}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Read/Write Ping:</span>
                    <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-zinc-500">
                Authorized for: {user.email}
              </span>

              <button
                type="button"
                onClick={runDatabaseDiagnostic}
                disabled={isRunning}
                className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
                <span>RERUN TEST</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FirestoreDiagnosticButton;
