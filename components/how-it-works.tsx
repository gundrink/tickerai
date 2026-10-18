"use client";

import { useEffect, useState } from "react";

export function HowItWorks() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className="icon-btn" type="button" aria-label="How it works" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 .8a5.2 5.2 0 0 0-5.2 5.2h1.9a3.3 3.3 0 1 1 5.1 2.8c-1.2.8-1.8 1.5-1.8 3v.4H9.8v-.4c0-.9.5-1.5 1.5-2.2A5.2 5.2 0 0 0 8 .8ZM7.9 13.4a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"
          />
        </svg>
      </button>
      {open ? (
        <div className="how-modal" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="how-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="howTitle"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="how-head">
              <h2 id="howTitle">How it works</h2>
              <button className="icon-btn" type="button" aria-label="Close" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <ol>
              <li>
                <b>One call.</b> Your ticker hits CoinMarketCap <code>/v1/dex/search</code> — 1 credit per resolve.
              </li>
              <li>
                <b>Every candidate.</b> All tokens answering to it across all chains, clustered by contract.
              </li>
              <li>
                <b>Evidence rank.</b> Liquidity × unique traders 24h, plus pool-age and farming-anomaly checks.
              </li>
              <li>
                <b>Honest answer.</b> A best pick, a close call, a multi-chain family — or nothing.
              </li>
            </ol>
          </div>
        </div>
      ) : null}
    </>
  );
}
