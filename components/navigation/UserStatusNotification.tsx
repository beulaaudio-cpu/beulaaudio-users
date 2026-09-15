'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getClientFirestore } from '@/lib/firebase/client';
import { Bell, CheckCircle2, Truck, Radio, Sparkles, XCircle, X } from 'lucide-react';
import Link from 'next/link';

interface UserStatusAlert {
  id: string;
  bookingId: string;
  title: string;
  message: string;
  stage: string;
  isCancelled: boolean;
}

export function UserStatusNotification() {
  const { user } = useAuth();
  const [activeAlert, setActiveAlert] = useState<UserStatusAlert | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user?.uid) return;

    const db = getClientFirestore();
    if (!db) return;

    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const data = change.doc.data();
            const bookingId = change.doc.id;
            const stage = data.stageStatus || 'ordered';
            const isCancelled = data.status === 'cancelled' || stage === 'declined';
            const alertKey = `${bookingId}-${stage}-${data.status}`;

            if (!dismissedIds[alertKey]) {
              let title = `Booking #${bookingId} Updated`;
              let message = `Dispatch stage status is now: ${stage.toUpperCase()}`;

              if (isCancelled) {
                title = `Booking #${bookingId} Cancelled`;
                message = data.cancellationReason
                  ? `Your booking was cancelled: "${data.cancellationReason}"`
                  : 'Your booking reservation was declined or cancelled.';
              } else if (stage === 'accepted') {
                title = `Booking #${bookingId} Accepted!`;
                message = 'Your stage equipment package has been approved & verified for production.';
              } else if (stage === 'shipped') {
                title = `Rig Shipped! (Dispatch En Route)`;
                message = 'The sound crew and audio inventory are in transit to your event venue.';
              } else if (stage === 'on_live') {
                title = `● Concert System ON LIVE!`;
                message = 'Beula Audio sound system is active and operational at your event.';
              }

              setActiveAlert({
                id: alertKey,
                bookingId,
                title,
                message,
                stage,
                isCancelled,
              });
            }
          }
        });
      }, (err) => console.warn('User notification listener:', err));

      return () => unsub();
    } catch (err) {
      console.warn('Could not initialize user notification listener:', err);
    }
  }, [user?.uid, dismissedIds]);

  if (!activeAlert) return null;

  const handleDismiss = () => {
    setDismissedIds((prev) => ({ ...prev, [activeAlert.id]: true }));
    setActiveAlert(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 font-mono text-xs ${
        activeAlert.isCancelled 
          ? 'bg-red-950/80 border-red-500/40 text-red-100 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
          : 'bg-black/90 border-amber-400/40 text-white shadow-[0_0_30px_rgba(251,191,36,0.25)]'
      }`}>
        <div className={`p-2 rounded-xl shrink-0 ${
          activeAlert.isCancelled ? 'bg-red-500/20 text-red-400' : 'bg-amber-400/20 text-amber-300'
        }`}>
          {activeAlert.isCancelled ? (
            <XCircle className="w-5 h-5" />
          ) : activeAlert.stage === 'shipped' ? (
            <Truck className="w-5 h-5" />
          ) : activeAlert.stage === 'accepted' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Radio className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-sm truncate">
              {activeAlert.title}
            </span>
            <button
              onClick={handleDismiss}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="font-sans text-xs text-zinc-300 mt-1 leading-relaxed">
            {activeAlert.message}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/track"
              onClick={handleDismiss}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                activeAlert.isCancelled
                  ? 'bg-red-500 hover:bg-red-400 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-black'
              }`}
            >
              Track Package
            </Link>
            <button
              onClick={handleDismiss}
              className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-wider"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
