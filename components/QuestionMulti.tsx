"use client";

import { motion } from "framer-motion";
import type { ChoiceOption } from "@/lib/questions";
import { QuestionHeader } from "./QuestionChoice";
import { iconFor } from "@/lib/icons";

export function QuestionMulti({
  questionId,
  title,
  subtitle,
  options,
  value,
  onChange,
}: {
  questionId: string;
  title: string;
  subtitle?: string;
  options: ChoiceOption[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <QuestionHeader title={title} subtitle={subtitle} />
      <div className="mt-8 flex flex-wrap gap-3">
        {options.map((opt, i) => {
          const selected = value.includes(opt.value);
          const Icon = iconFor(questionId, opt.value);
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-medium text-sm transition-all ${
                selected
                  ? "border-brand bg-brand text-white shadow-[0_8px_20px_-10px_rgba(255,107,53,0.8)]"
                  : "border-line bg-white text-ink hover:border-brand/50"
              }`}
            >
              <Icon size={16} strokeWidth={2.25} aria-hidden />
              {opt.label}
            </motion.button>
          );
        })}
      </div>
      {value.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-muted"
        >
          {value.length} selected
        </motion.p>
      )}
    </div>
  );
}
