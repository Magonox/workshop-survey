"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Leaf = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  fill: string;
  opacity: number;
  delay: number;
};

// Seeded pseudo-random so layout is stable across renders
function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const LEAF_COLORS = [
  "#ff6b35",
  "#f85a20",
  "#ff8351",
  "#ffa071",
  "#e84a16",
  "#ffb993",
  "#d84316",
];

const n = (v: number) => Number(v.toFixed(3));

function buildLeaves(): Leaf[] {
  const r = rng(42);
  const out: Leaf[] = [];
  const clusters: [number, number, number, number][] = [
    [180, 75, 48, 50],
    [220, 95, 42, 42],
    [145, 95, 42, 42],
    [195, 50, 38, 32],
    [120, 70, 30, 22],
    [240, 65, 28, 20],
    [170, 115, 30, 22],
  ];
  for (const [cx, cy, spread, count] of clusters) {
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.pow(r(), 0.6) * spread;
      out.push({
        cx: n(cx + Math.cos(a) * d),
        cy: n(cy + Math.sin(a) * d * 0.85),
        rx: n(2 + r() * 3),
        ry: n(4 + r() * 4),
        rot: n(r() * 360),
        fill: LEAF_COLORS[Math.floor(r() * LEAF_COLORS.length)],
        opacity: n(0.7 + r() * 0.3),
        delay: n(0.25 + r() * 0.8),
      });
    }
  }
  return out;
}

function buildFalling(): Leaf[] {
  const r = rng(7);
  const out: Leaf[] = [];
  for (let i = 0; i < 14; i++) {
    out.push({
      cx: n(40 + r() * 220),
      cy: n(180 + r() * 60),
      rx: n(2 + r() * 2),
      ry: n(4 + r() * 2),
      rot: n(r() * 360),
      fill: LEAF_COLORS[Math.floor(r() * LEAF_COLORS.length)],
      opacity: n(0.55 + r() * 0.35),
      delay: n(0.6 + r() * 1.2),
    });
  }
  return out;
}

export function TreeHero({ size = 340 }: { size?: number }) {
  // Generate leaves on the client only to avoid hydration mismatch
  // from floating-point serialization differences between SSR and CSR.
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [falling, setFalling] = useState<Leaf[]>([]);
  useEffect(() => {
    setLeaves(buildLeaves());
    setFalling(buildFalling());
  }, []);

  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      width={size}
      height={size}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none drop-shadow-[0_18px_40px_rgba(255,107,53,0.18)]"
    >
      <defs>
        <radialGradient id="bowl-top" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#eeeef1" />
          <stop offset="100%" stopColor="#c7c7cc" />
        </radialGradient>
        <linearGradient id="bowl-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dcdce0" />
        </linearGradient>
        <linearGradient id="trunk" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ff9466" />
          <stop offset="55%" stopColor="#e85826" />
          <stop offset="100%" stopColor="#b43a10" />
        </linearGradient>
        <radialGradient id="leaf-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffe7d4" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#ffe7d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="160" cy="272" rx="120" ry="10" fill="#1a1a1a" opacity="0.08" />

      {/* Bowl */}
      <motion.g
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <path
          d="M60 238 Q 160 310 260 238 Q 235 270 160 270 Q 85 270 60 238 Z"
          fill="url(#bowl-top)"
        />
        <path
          d="M60 238 Q 160 210 260 238 L 255 240 Q 160 214 65 240 Z"
          fill="url(#bowl-rim)"
        />
        <path
          d="M75 245 Q 160 227 245 245"
          stroke="#ffffff"
          strokeOpacity="0.7"
          strokeWidth="1.2"
          fill="none"
        />
      </motion.g>

      {/* Crown glow behind leaves */}
      <circle cx="180" cy="90" r="115" fill="url(#leaf-glow)" />

      {/* Trunk — main curve */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        d="M160 248
           C 150 225, 135 205, 130 185
           C 126 165, 138 148, 156 135
           C 174 122, 190 108, 192 88"
        stroke="url(#trunk)"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      {/* Trunk — highlight for depth */}
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.55 }}
        transition={{ duration: 1.1, delay: 0.1 }}
        d="M160 248
           C 150 225, 135 205, 130 185
           C 126 165, 138 148, 156 135
           C 174 122, 190 108, 192 88"
        stroke="#ffd1b8"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        transform="translate(-3 -1)"
      />

      {/* Branches */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        stroke="url(#trunk)"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M152 150 Q 130 142 108 138" strokeWidth="4" />
        <path d="M108 138 Q 92 134 78 128" strokeWidth="3" />
        <path d="M108 138 Q 100 124 92 112" strokeWidth="2.5" />

        <path d="M175 120 Q 200 112 222 106" strokeWidth="4" />
        <path d="M222 106 Q 240 102 252 94" strokeWidth="3" />
        <path d="M222 106 Q 228 92 232 78" strokeWidth="2.5" />

        <path d="M185 95 Q 200 82 212 68" strokeWidth="3" />
        <path d="M170 105 Q 158 88 150 72" strokeWidth="3" />
        <path d="M145 160 Q 125 170 108 178" strokeWidth="2.5" />
        <path d="M165 135 Q 185 128 200 122" strokeWidth="2" />
      </motion.g>

      {/* Leaves */}
      <g>
        {leaves.map((l, i) => (
          <motion.ellipse
            key={`l-${i}`}
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            fill={l.fill}
            opacity={l.opacity}
            transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: l.opacity }}
            transition={{
              delay: l.delay,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </g>

      {/* Falling / drifting leaves */}
      <g>
        {falling.map((l, i) => (
          <motion.ellipse
            key={`f-${i}`}
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            fill={l.fill}
            opacity={l.opacity}
            initial={{
              y: -40,
              opacity: 0,
              rotate: l.rot,
            }}
            animate={{
              y: 0,
              opacity: l.opacity,
              rotate: l.rot + 35,
            }}
            transition={{
              delay: l.delay,
              duration: 1.4,
              ease: "easeOut",
            }}
          />
        ))}
      </g>
    </motion.svg>
  );
}
