const ghosts = [
  { label: "PEPE", x: "8%", y: "18%", duration: "22s", delay: "-4s", drift: "18px" },
  { label: "PEPE", x: "62%", y: "12%", duration: "28s", delay: "-11s", drift: "-22px" },
  { label: "$WIF", x: "78%", y: "28%", duration: "18s", delay: "-2s", drift: "12px" },
  { label: "WIF", x: "44%", y: "22%", duration: "26s", delay: "-9s", drift: "-14px" },
  { label: "BONK", x: "18%", y: "62%", duration: "24s", delay: "-6s", drift: "16px" },
  { label: "USDT", x: "70%", y: "58%", duration: "32s", delay: "-15s", drift: "-10px" },
  { label: "TRUMP", x: "36%", y: "72%", duration: "20s", delay: "-3s", drift: "20px" },
  { label: "APE", x: "84%", y: "70%", duration: "27s", delay: "-8s", drift: "-18px" },
  { label: "MOODENG", x: "52%", y: "42%", duration: "30s", delay: "-12s", drift: "8px" },
  { label: "POPCAT", x: "12%", y: "40%", duration: "23s", delay: "-7s", drift: "-12px" },
];

export function CollisionField() {
  return (
    <div className="collision" aria-hidden="true">
      <span className="orbit orbit-a" />
      <span className="orbit orbit-b" />
      <span className="orbit orbit-c" />
      <span className="scan" />
      {ghosts.map((ghost, index) => (
        <span
          key={`${ghost.label}-${index}`}
          className="ghost"
          style={{
            left: ghost.x,
            top: ghost.y,
            animationDuration: ghost.duration,
            animationDelay: ghost.delay,
            ["--drift" as string]: ghost.drift,
          }}
        >
          {ghost.label}
        </span>
      ))}
      <span className="beam beam-a" />
      <span className="beam beam-b" />
      <span className="beam beam-c" />
    </div>
  );
}
