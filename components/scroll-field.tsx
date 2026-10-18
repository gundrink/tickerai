"use client";

import { useEffect, useRef } from "react";

const bursts = [
  { start: 0.04, end: 0.22, x: 72, y: 28 },
  { start: 0.34, end: 0.52, x: 22, y: 46 },
  { start: 0.62, end: 0.8, x: 68, y: 38 },
  { start: 0.84, end: 0.98, x: 40, y: 24 },
];

function span(progress: number, start: number, end: number) {
  if (progress <= start || progress >= end) return null;
  return (progress - start) / (end - start);
}

export function ScrollField() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const groups = [...node.querySelectorAll<HTMLElement>(".burst")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.setAttribute("hidden", "");
      return;
    }

    let frame = 0;
    const paint = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      groups.forEach((group, index) => {
        const burst = bursts[index];
        const raw = span(progress, burst.start, burst.end);
        const rings = [...group.querySelectorAll<HTMLElement>(".burst-ring")];
        if (raw == null) {
          group.style.opacity = "0";
          return;
        }
        group.style.opacity = "1";
        rings.forEach((ring, ringIndex) => {
          const local = Math.min(1, Math.max(0, raw * 1.15 - ringIndex * 0.12));
          ring.style.opacity = String(0.7 * (1 - local));
          ring.style.transform = `translate(-50%, -50%) scale(${0.4 + local * (8 + ringIndex * 3)})`;
        });
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scroll-field" ref={root} aria-hidden="true">
      {bursts.map((burst) => (
        <div key={burst.start} className="burst" style={{ left: `${burst.x}%`, top: `${burst.y}vh` }}>
          <span className="burst-ring" />
          <span className="burst-ring" />
          <span className="burst-ring" />
        </div>
      ))}
    </div>
  );
}
