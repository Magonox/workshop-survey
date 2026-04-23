"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { QuestionHeader } from "./QuestionChoice";

export function QuestionStars({
  title,
  subtitle,
  labels,
  value,
  onChange,
}: {
  title: string;
  subtitle?: string;
  labels: string[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value ?? 0;

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <QuestionHeader title={title} subtitle={subtitle} />

      <div
        className="mt-12 flex justify-center gap-3"
        onMouseLeave={() => setHover(null)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const lit = n <= display;
          return (
            <motion.button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n)}
              whileTap={{ scale: 0.85 }}
              animate={{ scale: lit ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
              className="focus:outline-none"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill={lit ? "#ff6b35" : "none"}
                stroke={lit ? "#ff6b35" : "#d4d4d8"}
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="drop-shadow-[0_4px_12px_rgba(255,107,53,0.3)] transition-all"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        key={display}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 h-6 text-brand-deep font-medium"
      >
        {display > 0 ? labels[display - 1] : <span className="text-muted text-sm">Tap a star</span>}
      </motion.div>
    </div>
  );
}
