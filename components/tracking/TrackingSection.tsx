"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/firebase/AuthContext";
import {
  fetchUserBookings,
  fetchBookingByTrackingId,
  FirestoreBookingDoc,
  OrderStageStatus,
} from "../../lib/firestore/clientBookings";
import { formatINR } from "../../lib/data/packages";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Radio,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  LogIn,
  XCircle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { SpotlightCard } from "../ui/SpotlightCard";

const PIPELINE_STAGES: {
  key: OrderStageStatus;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    key: "ordered",
    label: "Ordered",
    desc: "Reservation placed & in queue",
    icon: Clock,
  },
  {
    key: "accepted",
    label: "Package Accepted",
    desc: "Stage logistics verified",
    icon: ShieldCheck,
  },
  {
    key: "shipped",
    label: "Shipped",
    desc: "Dispatch crew en route",
    icon: Truck,
  },
  {
    key: "on_live",
    label: "On Live",
    desc: "Stage live & operational",
    icon: Radio,
  },
  {
    key: "completed",
    label: "Completed",
    desc: "Event concluded successfully",
    icon: Sparkles,
  },
];

function getStageIndex(stage: OrderStageStatus): number {
  if (stage === "declined") return 1;
  const idx = PIPELINE_STAGES.findIndex((s) => s.key === stage);
  return idx >= 0 ? idx : 0;
}

export function TrackingSection() {
  const { user, openAuthModal } = useAuth();

  const [searchId, setSearchId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchedBooking, setSearchedBooking] = useState<FirestoreBookingDoc | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [userBookings, setUserBookings] = useState<FirestoreBookingDoc[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load user bookings when logged in
  useEffect(() => {
    if (user?.uid) {
      setIsLoadingHistory(true);
      fetchUserBookings(user.uid)
        .then((bookings) => {
          setUserBookings(bookings);
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    } else {
      setUserBookings([]);
    }
  }, [user?.uid]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchedBooking(null);

    try {
      const result = await fetchBookingByTrackingId(searchId.trim());
      if (result) {
        setSearchedBooking(result);
      } else {
        setSearchError(`No dispatch order found for reference "${searchId.trim()}". Please check your tracking ID.`);
      }
    } catch {
      setSearchError("Unable to look up tracking details right now. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="tracking" className="relative py-28 px-6 md:px-14 lg:px-16 max-w-7xl mx-auto text-white">
      {/* Background Accent Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-amber-500/[0.04] blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase block mb-3 font-bold flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>BEULA AUDIO // DISPATCH PIPELINE</span>
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Track Package
          </h2>
        </div>
        <p className="max-w-md font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
          Real-time event equipment dispatch tracking across Tamil Nadu. Check your stage setup status from warehouse dispatch to live concert execution.
        </p>
      </div>

      {/* Direct Tracking Search Bar */}
      <div className="max-w-2xl mx-auto mb-16">
        <form onSubmit={handleSearch} className="relative flex items-center group">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-zinc-500 group-focus-within:text-amber-400 transition-colors absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Booking ID (e.g. BK-XXXXXX or REQ-...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl sm:rounded-l-2xl sm:rounded-r-none border border-white/20 bg-black/80 backdrop-blur-md text-white font-mono text-sm focus:border-amber-400 focus:outline-none transition-all shadow-[0_0_25px_rgba(0,0,0,0.8)] focus:shadow-[0_0_30px_rgba(251,191,36,0.25)]"
            />
          </div>
          <button
            type="submit"
            disabled={mounted ? Boolean(isSearching || !searchId.trim()) : false}
            className="hidden sm:flex items-center gap-2 px-8 py-4 rounded-r-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-50 active:scale-95 shadow-[0_0_25px_rgba(251,191,36,0.35)] shrink-0 hover:scale-[1.02]"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>TRACK STATUS</span>}
          </button>
        </form>

        <div className="sm:hidden mt-3">
          <button
            type="button"
            onClick={handleSearch}
            disabled={mounted ? Boolean(isSearching || !searchId.trim()) : false}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>TRACK STATUS</span>}
          </button>
        </div>

        {searchError && (
          <div className="mt-4 p-4 rounded-2xl border border-red-500/40 bg-red-950/40 text-red-200 flex items-center gap-3 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Searched Booking Result Display */}
      {searchedBooking && (
        <div className="mb-16 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              SEARCH RESULT // REF: {searchedBooking.trackingId || searchedBooking.id}
            </span>
            <button
              onClick={() => setSearchedBooking(null)}
              className="text-xs text-zinc-500 hover:text-white transition-colors font-mono"
            >
              Clear
            </button>
          </div>
          <OrderCard order={searchedBooking} isFeatured />
        </div>
      )}

      {/* User Order History Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-white">
              {user ? "Your Ordered Packages" : "Account Order History"}
            </h3>
            {user && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                {userBookings.length} {userBookings.length === 1 ? "ORDER" : "ORDERS"}
              </span>
            )}
          </div>

          {!user && (
            <button
              onClick={() => openAuthModal("Sign in to view your complete Beula Audio order history and live dispatch updates.")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>SIGN IN FOR ORDER HISTORY</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoadingHistory && (
          <div className="py-16 text-center text-zinc-400 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-wider">Loading your dispatch records...</span>
          </div>
        )}

        {/* User Logged in with Bookings */}
        {user && !isLoadingHistory && userBookings.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {userBookings.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* User Logged in with No Bookings */}
        {user && !isLoadingHistory && userBookings.length === 0 && (
          <div className="py-16 text-center rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-500">
              <Package className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-xl font-bold uppercase text-white mb-2">
              No Orders Found Yet
            </h4>
            <p className="font-sans text-xs text-zinc-400 max-w-sm mx-auto mb-6 font-light leading-relaxed">
              You haven&apos;t reserved any DJ or Live Band audio setups yet. Explore our concert-grade equipment and reserve for your upcoming celebration.
            </p>
            <a
              href="#packages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-widest uppercase transition-colors"
            >
              <span>EXPLORE PACKAGES</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Guest prompt when not logged in */}
        {!user && (
          <div className="py-12 px-6 rounded-3xl border border-white/10 bg-white/[0.02] text-center max-w-xl mx-auto space-y-4">
            <p className="font-sans text-sm text-zinc-400 font-light">
              Clients who ordered using their Google ID or Email can access complete order histories, dispatch schedules, and technical logistics anytime.
            </p>
            <button
              onClick={() => openAuthModal("Sign in to view your complete Beula Audio order history.")}
              className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold tracking-widest uppercase transition-colors"
            >
              SIGN IN WITH GOOGLE / EMAIL
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Single Order Card with 5-Step Visual Stepper
 */
function OrderCard({
  order,
  isFeatured = false,
}: {
  order: FirestoreBookingDoc;
  isFeatured?: boolean;
}) {
  const currentIdx = getStageIndex(order.stageStatus);
  const isCancelled = order.status === "cancelled" || order.stageStatus === "declined" || order.status === "rejected";
  const isDeclined = order.stageStatus === "declined" || isCancelled;

  const stageBadgeStyle = isCancelled
    ? "bg-red-500/10 border-red-500/30 text-red-300 font-bold"
    : {
        ordered: "bg-blue-500/10 border-blue-500/30 text-blue-300",
        accepted: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        declined: "bg-red-500/10 border-red-500/30 text-red-300",
        shipped: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        on_live: "bg-purple-500/10 border-purple-500/30 text-purple-300 animate-pulse",
        completed: "bg-zinc-500/10 border-zinc-500/30 text-zinc-300",
      }[order.stageStatus] || "bg-amber-500/10 border-amber-500/30 text-amber-300";

  return (
    <SpotlightCard
      className={`rounded-3xl border ${
        isCancelled
          ? "border-red-500/30 shadow-red-950/20"
          : isFeatured
          ? "border-amber-400/50 shadow-2xl"
          : "border-white/10"
      }`}
    >
      <div className="p-6 sm:p-8 space-y-6">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest">
                TRACKING ID:
              </span>
              <span className="font-mono text-sm font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                {order.trackingId || order.id}
              </span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold uppercase text-white">
              {order.setup?.packageName || (order.setup?.category === "custom" ? "Custom Audio Setup" : "Beula Stage Setup")}
            </h4>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
            <span
              className={`px-3 py-1 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider ${stageBadgeStyle}`}
            >
              {isCancelled
                ? "CANCELLED / DECLINED"
                : order.stageStatus === "on_live"
                ? "● ON LIVE NOW"
                : order.stageStatus.replace("_", " ").toUpperCase()}
            </span>
            <span className="font-mono text-xs text-zinc-500">
              Reserved: {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        </div>

        {/* 5-STAGE VISUAL DISPATCH STEPPER */}
        <div className="py-3">
          <div className="grid grid-cols-5 gap-2 relative">
            {PIPELINE_STAGES.map((stage, sIdx) => {
              const Icon = stage.icon;
              const isPast = sIdx < currentIdx;
              const isCurrent = sIdx === currentIdx && !isDeclined;

              return (
                <div key={stage.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-2 transition-all duration-300 border ${
                      isCurrent
                        ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-110"
                        : isPast
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-white/5 border-white/10 text-zinc-600"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span
                    className={`font-mono text-[10px] sm:text-xs font-bold uppercase leading-tight ${
                      isCurrent
                        ? "text-amber-300"
                        : isPast
                        ? "text-zinc-300"
                        : "text-zinc-600"
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="hidden sm:block font-sans text-[9px] text-zinc-500 font-light mt-0.5 max-w-[90px]">
                    {stage.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Connecting Line */}
          <div className="w-full bg-white/10 h-1 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 via-amber-400 to-amber-300 h-full transition-all duration-500"
              style={{
                width: isDeclined
                  ? "20%"
                  : `${Math.min(100, (currentIdx / (PIPELINE_STAGES.length - 1)) * 100)}%`,
              }}
            />
          </div>

          {isCancelled && (
            <div className="mt-3 p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs flex items-center gap-2 font-mono">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                {order.cancellationReason
                  ? `Booking Cancelled: "${order.cancellationReason}". Please contact dispatch support if you have questions.`
                  : "Booking cancelled / declined. Our dispatch team is available if you need further assistance."}
              </span>
            </div>
          )}
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-xs">
          <div>
            <span className="font-mono text-[10px] text-zinc-500 uppercase block font-semibold mb-1">
              EVENT LOGISTICS
            </span>
            <div className="flex items-center gap-2 text-white mb-0.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{order.event?.date}</span>
            </div>
            <p className="font-sans text-zinc-400 text-[11px] capitalize">
              {order.event?.timing || "Full Day Setup"}
            </p>
          </div>

          <div>
            <span className="font-mono text-[10px] text-zinc-500 uppercase block font-semibold mb-1">
              LOCATION & VENUE
            </span>
            <div className="flex items-center gap-2 text-white mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{order.event?.district}</span>
            </div>
            <p className="font-sans text-zinc-400 text-[11px] truncate">
              {order.event?.address}
            </p>
          </div>

          <div>
            <span className="font-mono text-[10px] text-zinc-500 uppercase block font-semibold mb-1">
              FINANCIAL SUMMARY
            </span>
            <div className="font-serif text-lg font-bold text-amber-300">
              {order.totalPriceBeforeTransport !== null && order.totalPriceBeforeTransport !== undefined
                ? formatINR(order.totalPriceBeforeTransport)
                : "Custom Quote"}
            </div>
            <p className="font-mono text-[10px] text-zinc-500">
              Transport calculated at dispatch
            </p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default TrackingSection;
