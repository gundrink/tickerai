"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const samples = ["PEPE", "WIF", "TRUMP", "USDT", "APE", "BONK"];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function go(value: string) {
    const next = value.trim().replace(/^\$/, "");
    if (!next) return;
    router.push(`/desk?q=${encodeURIComponent(next)}`);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    go(query);
  }

  return (
    <div className="hero-search">
      <form className="search-form" onSubmit={onSubmit} role="search">
        <label className="visually-hidden" htmlFor="hero-q">
          Ticker or contract address
        </label>
        <input
          id="hero-q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="PEPE, WIF, TRUMP, 0x6982…"
          maxLength={44}
          autoComplete="off"
          spellCheck={false}
        />
        <button className="btn-primary" type="submit">
          Resolve
        </button>
      </form>
      <div className="try-row" aria-label="Example tickers">
        {samples.map((sample) => (
          <button key={sample} className="chip" type="button" onClick={() => go(sample)}>
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
}
