"use client";

import { useEffect, useState } from "react";

export const landingSections = [
  { id: "current", label: "Search" },
  { id: "collision", label: "Collision" },
  { id: "signals", label: "Signals" },
  { id: "steps", label: "Path" },
  { id: "enter", label: "Open" },
] as const;

export function SectionNav() {
  const [active, setActive] = useState<string>("current");

  useEffect(() => {
    const sections = landingSections
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -58% 0px", threshold: [0.15, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {landingSections.map((item) => (
        <a
          key={item.id}
          className="section-link"
          href={`#${item.id}`}
          aria-current={active === item.id ? "location" : undefined}
          onClick={() => setActive(item.id)}
        >
          {item.label}
        </a>
      ))}
    </>
  );
}
