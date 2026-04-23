"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ChoiceOption } from "@/lib/questions";
import { iconFor } from "@/lib/icons";

export function QuestionChoice({
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
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <QuestionHeader title={title} subtitle={subtitle} />
      <div className="mt-8 grid gap-3">
        {options.map((opt, i) => {
          const selected = value === opt.value;
          const Icon = iconFor(questionId, opt.value);
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`group relative w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
                selected
                  ? "border-brand bg-brand-soft/60 shadow-[0_6px_20px_-10px_rgba(255,107,53,0.5)]"
                  : "border-line bg-white hover:border-brand/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${
                    selected
                      ? "bg-brand text-white"
                      : "bg-brand-soft text-brand-deep group-hover:bg-brand/10"
                  }`}
                  aria-hidden
                >
                  <Icon size={20} strokeWidth={2} />
                </span>
                <span
                  className={`font-medium ${
                    selected ? "text-brand-deep" : "text-ink"
                  }`}
                >
                  {opt.label}
                </span>
                {selected && (
                  <motion.span
                    layoutId="choice-check"
                    className="ml-auto text-brand"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check size={20} strokeWidth={2.5} />
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function QuestionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-3xl font-semibold text-ink tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-2 text-muted"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
