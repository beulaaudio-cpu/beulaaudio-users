"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquarePlus, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../../lib/firebase/AuthContext";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { ReviewDoc, subscribeApprovedReviews, submitReview } from "../../lib/firestore/reviews";
import { SpotlightCard } from "../ui/SpotlightCard";

export function ReviewSection() {
  const { user, openAuthModal } = useAuth();
  const { dict } = useLanguage();

  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [district, setDistrict] = useState("");
  const [eventType, setEventType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Subscribe to real-time reviews from Firestore
  useEffect(() => {
    const unsubscribe = subscribeApprovedReviews((loadedReviews) => {
      setReviews(loadedReviews);
    });
    return () => unsubscribe();
  }, []);

  // Pre-fill name when logged in
  useEffect(() => {
    if (user?.displayName && !authorName) {
      setAuthorName(user.displayName);
    }
  }, [user?.displayName, authorName]);

  const handleOpenReviewForm = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setIsFormOpen(true);
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setSubmitError("Please write your review feedback.");
      return;
    }
    if (!authorName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const res = await submitReview({
      userId: user?.uid,
      userName: authorName.trim(),
      userEmail: user?.email || undefined,
      rating,
      comment: comment.trim(),
      district: district.trim() || undefined,
      eventTypeName: eventType.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmitSuccess(true);
      setComment("");
      setTimeout(() => {
        setIsFormOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } else {
      setSubmitError(res.error || "Failed to submit review.");
    }
  };

  return (
    <section id="reviews" className="relative py-28 px-6 md:px-14 lg:px-16 max-w-7xl mx-auto text-white">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-amber-500/[0.03] blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-amber-400 uppercase block mb-3">
            Client Reviews
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
            Reviews
          </h2>
        </div>

        {/* Add Review Action Button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleOpenReviewForm}
            data-cursor="REVIEW"
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:scale-105 active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>WRITE A REVIEW</span>
          </button>
        </div>
      </div>



      {/* Add Review Modal / Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <div
            onClick={() => setIsFormOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl border border-amber-400/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl text-white my-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase font-bold block">
                    SHARE YOUR EXPERIENCE
                  </span>
                  <h3 className="font-serif text-2xl font-bold uppercase text-white mt-1">
                    Add Review
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-full border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="font-serif text-xl font-bold text-white uppercase">
                    Review Submitted
                  </h4>
                  <p className="font-sans text-xs text-zinc-400">
                    Thank you for sharing your experience with Beula Audio!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
                      Star Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${(hoverRating !== null ? hoverRating >= star : rating >= star)
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-600"
                              }`}
                          />
                        </button>
                      ))}
                      <span className="font-mono text-xs text-amber-300 font-bold ml-2">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. John Doe / Sound Engineer"
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Event Type & District Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                        Event Type
                      </label>
                      <input
                        type="text"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        placeholder="e.g. Wedding Reception / DJ Night"
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                        District / City
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Chennai / Madurai"
                        className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Feedback Comment */}
                  <div>
                    <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                      Your Feedback / Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe the sound clarity, lighting atmosphere, and setup quality..."
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black/60 text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 flex items-center gap-2.5 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-5 py-2.5 rounded-full border border-white/20 text-zinc-400 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>POST REVIEW</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reviews Display Grid */}
      {reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 sm:p-16 text-center border border-amber-400/20 rounded-3xl bg-gradient-to-b from-zinc-950/90 to-black/90 shadow-2xl max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.2)]">
            <MessageSquarePlus className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white uppercase tracking-tight mb-2">
            Be The First Client Voice
          </h3>
          <p className="font-sans text-sm text-zinc-400 max-w-md mx-auto mb-8 font-light leading-relaxed">
            Share your concert sound, wedding clarity, or lighting show experience with the Beula Audio stage engineering crew.
          </p>
          <button
            type="button"
            onClick={handleOpenReviewForm}
            data-cursor="WRITE"
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:scale-105 active:scale-95"
          >
            Add First Review
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="h-full flex flex-col"
            >
              <SpotlightCard
                className="h-full shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                spotlightColor="rgba(251, 191, 36, 0.12)"
                borderGlowColor="rgba(251, 191, 36, 0.55)"
              >
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 h-full">
                  <div>
                    {/* Rating badge */}
                    <div className="flex items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= rev.rating
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                : "text-zinc-800"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-300 ml-1">
                          {rev.rating}/5
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" />

                      </div>
                    </div>

                    {/* Review Quote Body */}
                    <div className="relative mb-6">
                      <p className="font-sans text-sm sm:text-base text-zinc-200 leading-relaxed font-light italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Bottom Strip: Client Identity & Details */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-serif font-bold text-base shadow-[0_0_15px_rgba(251,191,36,0.3)] shrink-0">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wide truncate">
                          {rev.userName}
                        </h4>
                        <span className="font-mono text-[10px] text-amber-300/80 uppercase block truncate">
                          {rev.eventTypeName || "Live Concert Production"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      {rev.district && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400 uppercase font-medium">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{rev.district}</span>
                        </span>
                      )}
                      <span className="font-mono text-[9px] text-zinc-500 mt-0.5">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ReviewSection;
