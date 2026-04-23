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

type FallingLeaf = {
  startX: number;
  startY: number;
  rx: number;
  ry: number;
  fill: string;
  opacity: number;
  driftX: number;
  fallY: number;
  rotStart: number;
  rotEnd: number;
  duration: number;
  delay: number;
};

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

function buildFallingPool(): FallingLeaf[] {
  const r = rng(11);
  const out: FallingLeaf[] = [];
  const count = 26;
  const spawns: [number, number][] = [
    [180, 70],
    [150, 90],
    [210, 95],
    [195, 55],
    [165, 105],
    [125, 85],
    [240, 75],
    [200, 115],
    [160, 60],
    [135, 110],
  ];
  for (let i = 0; i < count; i++) {
    const [sx, sy] = spawns[Math.floor(r() * spawns.length)];
    const rotStart = n(r() * 360);
    out.push({
      startX: n(sx + (r() - 0.5) * 30),
      startY: n(sy + (r() - 0.5) * 20),
      rx: n(2.5 + r() * 2),
      ry: n(4.5 + r() * 2),
      fill: LEAF_COLORS[Math.floor(r() * LEAF_COLORS.length)],
      opacity: n(0.7 + r() * 0.25),
      driftX: n(-30 + r() * 65),
      fallY: n(160 + r() * 30),
      rotStart,
      rotEnd: n(rotStart + 180 + r() * 360),
      duration: n(4.5 + r() * 3.5),
      delay: n((i / count) * 10 + r() * 0.8),
    });
  }
  return out;
}

export function TreeHero({ size = 340 }: { size?: number }) {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [falling, setFalling] = useState<FallingLeaf[]>([]);

  useEffect(() => {
    setLeaves(buildLeaves());
    setFalling(buildFallingPool());
  }, []);

  // Sway cycle values — rotation around trunk base (160, 248)
  // Larger amplitude so the wind is obviously visible.
  const swayValues =
    "-2.5 160 248; 3 160 248; -1.5 160 248; 2.2 160 248; -2.5 160 248";

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

      {/* Ground shadow */}
      <ellipse cx="160" cy="272" rx="120" ry="10" fill="#1a1a1a" opacity="0.08" />

      {/* Bowl — static */}
      <g>
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
      </g>

      {/* Crown glow */}
      <circle cx="180" cy="90" r="115" fill="url(#leaf-glow)" />

      {/* SWAYING CANOPY — trunk + branches + crown leaves all rotate
          together around (160, 248) via SMIL animateTransform.
          Bulletproof: native SVG animation, no library quirks. */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values={swayValues}
          keyTimes="0;0.28;0.55;0.8;1"
          dur="5.5s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
        />

        {/* Trunk */}
        <path
          d="M160 248
             C 150 225, 135 205, 130 185
             C 126 165, 138 148, 156 135
             C 174 122, 190 108, 192 88"
          stroke="url(#trunk)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        {/* Trunk highlight */}
        <path
          d="M160 248
             C 150 225, 135 205, 130 185
             C 126 165, 138 148, 156 135
             C 174 122, 190 108, 192 88"
          stroke="#ffd1b8"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
          transform="translate(-3 -1)"
        />

        {/* Branches */}
        <g
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
        </g>

        {/* Crown leaves — plain SVG ellipses with a SMIL opacity
            entrance. Static rotation via transform attribute. No
            framer-motion on these so nothing can go wrong. */}
        <g>
          {leaves.map((l, i) => (
            <ellipse
              key={`l-${i}`}
              cx={l.cx}
              cy={l.cy}
              rx={l.rx}
              ry={l.ry}
              fill={l.fill}
              opacity="0"
              transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
            >
              <animate
                attributeName="opacity"
                from="0"
                to={l.opacity}
                dur="0.5s"
                begin={`${l.delay}s`}
                fill="freeze"
              />
            </ellipse>
          ))}
        </g>
      </g>

      {/* FALLING LEAVES — continuous rain, outside the sway group so
          they drift freely after detaching. Each leaf has three SMIL
          animations (translate, rotate, opacity) combined via
          additive="sum" so they loop independently. */}
      <g>
        {falling.map((l, i) => (
          <ellipse
            key={`f-${i}`}
            cx={l.startX}
            cy={l.startY}
            rx={l.rx}
            ry={l.ry}
            fill={l.fill}
            opacity="0"
          >
            {/* Diagonal drift down */}
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0 0; ${l.driftX * 0.4} ${l.fallY * 0.35}; ${l.driftX * 0.8} ${l.fallY * 0.7}; ${l.driftX} ${l.fallY}`}
              keyTimes="0;0.35;0.7;1"
              dur={`${l.duration}s`}
              begin={`${l.delay}s`}
              repeatCount="indefinite"
              additive="sum"
              calcMode="spline"
              keySplines="0.3 0 0.7 1; 0.3 0 0.7 1; 0.3 0 0.7 1"
            />
            {/* Tumble rotation */}
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={`${l.rotStart} ${l.startX} ${l.startY}; ${l.rotEnd} ${l.startX} ${l.startY}`}
              dur={`${l.duration}s`}
              begin={`${l.delay}s`}
              repeatCount="indefinite"
              additive="sum"
            />
            {/* Fade in, visible during flight, fade out */}
            <animate
              attributeName="opacity"
              values={`0;${l.opacity};${l.opacity};0`}
              keyTimes="0;0.12;0.78;1"
              dur={`${l.duration}s`}
              begin={`${l.delay}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        ))}
      </g>
    </motion.svg>
  );
}
