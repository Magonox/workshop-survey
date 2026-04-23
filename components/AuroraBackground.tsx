"use client";

export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-white"
    >
      <div
        className="aurora-blob"
        style={{
          top: "-10%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, #ff6b35 0%, rgba(255,107,53,0) 60%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          top: "40%",
          right: "-15%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle, #ffb088 0%, rgba(255,176,136,0) 60%)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: "-20%",
          left: "20%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, #fff1ea 0%, rgba(255,241,234,0) 60%)",
          animationDelay: "-14s",
        }}
      />
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />
    </div>
  );
}
