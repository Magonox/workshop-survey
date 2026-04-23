"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { TreeHero } from "./TreeHero";

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-6 py-16 max-w-6xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 max-w-xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand-deep text-xs font-medium mb-6">
          <span className="live-dot" />
          Live workshop pulse
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold text-ink leading-[1.05] tracking-tight">
          Everyday{" "}
          <span className="text-brand">A.I.</span>
          <br />
          Workshop Pulse
        </h1>
        <p className="mt-5 text-lg text-muted leading-relaxed">
          Shape the next workshop in 90 seconds. Your answers go live on the
          screen as you submit them — so the room decides together what
          comes next.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-brand text-white font-semibold shadow-[0_10px_30px_-10px_rgba(255,107,53,0.6)] hover:bg-brand-deep transition-colors"
          >
            Start the survey
            <span aria-hidden>→</span>
          </motion.button>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl border-2 border-line text-ink font-medium hover:border-brand hover:text-brand-deep transition-colors"
          >
            <BarChart3 size={18} strokeWidth={2.25} />
            View live results
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">
          ~10 questions · your email stays with Shawn, nowhere else
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="flex-1 flex items-center justify-center"
      >
        <TreeHero size={340} />
      </motion.div>
    </div>
  );
}
