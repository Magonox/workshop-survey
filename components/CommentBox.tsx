"use client";

import { motion } from "framer-motion";
import { QuestionHeader } from "./QuestionChoice";

export function CommentBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <QuestionHeader
        title="Anything else you'd like to share?"
        subtitle="Totally optional — one line, one paragraph, or skip it."
      />
      <motion.textarea
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What worked, what didn't, what you want to see next…"
        rows={5}
        maxLength={2000}
        className="mt-8 w-full px-5 py-4 bg-white border border-line rounded-2xl text-ink outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_rgba(255,107,53,0.15)] resize-none"
      />
      <p className="mt-2 text-xs text-muted text-right">
        {value.length} / 2000
      </p>
    </div>
  );
}
