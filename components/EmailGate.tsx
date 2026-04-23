"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailGate({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [value, setValue] = useState("");
  const valid = EMAIL_RE.test(value.trim());

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit(value.trim().toLowerCase());
        }}
        className="w-full max-w-lg"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight">
          First — where should we send the results?
        </h2>
        <p className="mt-3 text-muted">
          You'll get the live dashboard link when you finish, plus a summary
          after the workshop. No spam.
        </p>
        <div className="mt-8 relative">
          <input
            type="email"
            autoFocus
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-5 py-4 bg-white border border-line rounded-2xl text-ink text-lg outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_rgba(255,107,53,0.15)]"
          />
        </div>
        <motion.button
          type="submit"
          disabled={!valid}
          whileHover={valid ? { scale: 1.02 } : undefined}
          whileTap={valid ? { scale: 0.98 } : undefined}
          className="mt-6 w-full py-4 rounded-2xl bg-brand text-white font-semibold disabled:bg-line disabled:text-muted disabled:cursor-not-allowed transition-colors hover:bg-brand-deep"
        >
          {valid ? "Begin →" : "Enter a valid email"}
        </motion.button>
      </motion.form>
    </div>
  );
}
