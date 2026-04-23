"use client";

import { motion } from "framer-motion";

export function TreeHero({ size = 280 }: { size?: number }) {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      width={size}
      height={size}
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-[0_8px_32px_rgba(255,107,53,0.25)]"
    >
      <defs>
        <radialGradient id="bowl" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="80%" stopColor="#e9e9ec" />
          <stop offset="100%" stopColor="#cfcfd3" />
        </radialGradient>
        <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8a5b" />
          <stop offset="100%" stopColor="#e85826" />
        </linearGradient>
      </defs>

      {/* Bowl */}
      <ellipse cx="140" cy="230" rx="110" ry="22" fill="#d8d8dc" opacity="0.5" />
      <path
        d="M50 210 Q 140 295 230 210 Q 200 240 140 240 Q 80 240 50 210 Z"
        fill="url(#bowl)"
      />

      {/* Trunk */}
      <path
        d="M140 220 Q 110 180 115 150 Q 120 120 160 105 Q 175 100 170 90"
        stroke="url(#trunk)"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* Branches */}
      <g stroke="#e85826" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M150 120 Q 170 110 185 95" />
        <path d="M135 140 Q 115 130 95 115" />
        <path d="M155 100 Q 175 85 195 75" />
        <path d="M165 95 Q 150 75 135 60" />
      </g>

      {/* Leaves */}
      {Array.from({ length: 48 }).map((_, i) => {
        const seed = i * 137.5;
        const r = 55 + (i % 5) * 8;
        const angle = (seed * Math.PI) / 180;
        const cx = 160 + Math.cos(angle) * r * 0.6;
        const cy = 80 - Math.sin(angle) * r * 0.55;
        return (
          <motion.ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={3 + (i % 3)}
            ry={5 + (i % 3)}
            fill="#ff6b35"
            opacity={0.55 + ((i * 17) % 40) / 100}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3 + i * 0.015,
              duration: 0.6,
              ease: "easeOut",
            }}
            transform={`rotate(${seed % 90} ${cx} ${cy})`}
          />
        );
      })}
    </motion.svg>
  );
}
