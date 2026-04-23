"use client";

import { motion } from "framer-motion";

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="w-full h-1.5 bg-line/60 rounded-full overflow-hidden">
      <motion.div
        className="h-full shimmer-fill rounded-full"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
      />
    </div>
  );
}
