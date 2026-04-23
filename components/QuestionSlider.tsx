"use client";

import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { QuestionHeader } from "./QuestionChoice";

export function QuestionSlider({
  title,
  subtitle,
  min,
  max,
  step,
  leftLabel,
  rightLabel,
  stops,
  value,
  onChange,
}: {
  title: string;
  subtitle?: string;
  min: number;
  max: number;
  step: number;
  leftLabel: string;
  rightLabel: string;
  stops?: string[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  const current = value ?? Math.round((min + max) / 2);
  const pct = ((current - min) / (max - min)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <QuestionHeader title={title} subtitle={subtitle} />

      <div className="mt-16 relative">
        <div className="flex justify-between text-xs text-muted mb-3 px-1">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>

        <Slider.Root
          value={[current]}
          min={min}
          max={max}
          step={step}
          onValueChange={(v) => onChange(v[0])}
          className="relative flex items-center select-none touch-none w-full h-8"
        >
          <Slider.Track className="bg-line relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-brand rounded-full h-full shimmer-fill" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-7 h-7 bg-white border-4 border-brand rounded-full shadow-[0_4px_16px_rgba(255,107,53,0.4)] hover:scale-110 transition-transform focus:outline-none focus:shadow-[0_0_0_6px_rgba(255,107,53,0.2)]"
            aria-label={title}
          />
        </Slider.Root>

        {/* Value bubble */}
        <motion.div
          className="absolute -top-4 pointer-events-none"
          style={{ left: `calc(${pct}% - 28px)` }}
          initial={false}
          animate={{ left: `calc(${pct}% - 28px)` }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="px-3 py-1.5 bg-ink text-white text-sm font-semibold rounded-full shadow-lg">
            {stops ? stops[current] : current}
          </div>
          <div className="w-0 h-0 mx-auto border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-ink" />
        </motion.div>

        {stops && (
          <div className="mt-8 grid grid-cols-5 gap-1">
            {stops.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                className={`text-[10px] md:text-xs py-1 rounded transition-colors ${
                  current === i
                    ? "text-brand-deep font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
