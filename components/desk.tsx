"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FLAG_LABEL, explorerHref, fmtDelta, fmtInt, fmtScore, fmtUsd, shortAddr } from "@/lib/format";
import { publicEnv } from "@/lib/env";
import type { Candidate, ResolvePayload } from "@/lib/types";

const samples = ["PEPE", "TRUMP", "WIF", "USDT", "APE", "BONK"];

const NONE_MSG: Record<string, string> = {
  "no-exact-symbol-match": "No exact-symbol deployment in this result set. Nearest matches are below. No pick is better than a wrong pick.",
  "all-candidates-farming-flagged": "Every candidate carries a possible-farming flag. The desk abstains.",
  "no-dex-candidates": "No on-chain DEX candidates in this result set.",
  "no-candidate-with-liquidity-and-trader-data": "No candidate has both liquidity and trader data.",
  "no-candidates": "No candidates returned for this query.",
};

type Phase = "idle" | "loading" | "error" | "empty" | "ready";

export function Desk({ landing = false }: { landing?: boolean }) {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [phase, setPhase] = useState<Phase>(initial ? "loading" : "idle");
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<ResolvePayload | null>(null);

  const resolve = useCallback(async (raw: string, signal?: AbortSignal) => {
    const next = raw.trim().replace(/^\$/, "");
    if (!next) return;
    setQuery(next);
    setPhase("loading");
    setError("");
    const url = new URL(window.location.href);
    url.searchParams.set("q", next);
    window.history.replaceState(null, "", `${url.pathname}?q=${encodeURIComponent(next)}`);
    try {
      const res = await fetch(`/api/resolve?q=${encodeURIComponent(next)}`, { signal });
      const body = (await res.json().catch(() => null)) as ResolvePayload | null;
      if (res.status === 404 || !body?.candidates?.length) {
        setPayload(body);
        setPhase("empty");
        setError(body?.query ?? next);
        return;
      }
      if (!res.ok || !body.ok) {
        setPhase("error");
        setError(body?.error ?? `http ${res.status}`);
        return;
      }
      setPayload(body);
      setPhase("ready");
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") return;
      setPhase("error");
      setError(caught instanceof Error ? caught.message : "network");
    }
  }, []);

  useEffect(() => {
    if (!initial) return;
    const ctrl = new AbortController();
    void resolve(initial, ctrl.signal);
    return () => ctrl.abort();
  }, [initial, resolve]);

  return (
    <main className={landing ? "desk-main" : "desk-main desk-workspace"}>
      <section className="desk-head">
        {landing ? null : <p className="eyebrow">Evidence desk</p>}
        <h1>
          {landing ? (
            <>
              Which one is worth <em>inspecting</em>?
            </>
          ) : (
            "Which candidate is worth inspecting?"
          )}
        </h1>
        {landing ? (
          <p className="lede">Every observed candidate wearing your ticker — ranked by liquidity and trader evidence.</p>
        ) : null}
        <form
          className="search-form"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            void resolve(query);
          }}
        >
          <label className="visually-hidden" htmlFor="q">
            Ticker or contract address
          </label>
          <input
            id="q"
            value={query}
            maxLength={44}
            autoComplete="off"
            spellCheck={false}
            placeholder="PEPE, WIF, TRUMP, 0x6982…"
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="btn-primary desk-submit" type="submit" disabled={phase === "loading"}>
            {phase === "loading" ? "Resolving" : "Resolve"}
          </button>
        </form>
        <div className="try-row">
          {samples.map((sample) => (
            <button key={sample} className="chip" type="button" onClick={() => void resolve(sample)}>
              {sample}
            </button>
          ))}
        </div>
      </section>

      <section className="desk-result" aria-live="polite">
        {phase === "loading" ? <Skeleton /> : null}
        {phase === "error" ? (
          <div className="state-card">
            <p>Resolution failed: {error}</p>
            <p className="state-note">Fix the query or retry.</p>
          </div>
        ) : null}
        {phase === "empty" ? (
          <div className="state-card">
            <p>No token answers to “{error}”.</p>
            <p className="state-note">Zero rows from DEX search, or outside the replay fixtures.</p>
          </div>
        ) : null}
        {phase === "ready" && payload ? <Result payload={payload} /> : null}
      </section>
    </main>
  );
}

function Skeleton() {
  return (
    <div className="skel-wrap" aria-busy="true">
      <span className="skel" />
      <span className="skel" />
      <span className="skel" />
      <span className="skel short" />
    </div>
  );
}

function Result({ payload }: { payload: ResolvePayload }) {
  const candidates = payload.candidates ?? [];
  const exact = candidates.filter((candidate) => candidate.bucket === "exact");
  const related = candidates.filter((candidate) => candidate.bucket === "related");
  const elsewhere = candidates.filter((candidate) => candidate.bucket === "elsewhere");
  const clusterSizes = new Map<string, number>();
  for (const candidate of candidates) {
    if (!candidate.cluster) continue;
    clusterSizes.set(candidate.cluster, (clusterSizes.get(candidate.cluster) ?? 0) + 1);
  }
  const maxScore = Math.max(0, ...candidates.map((candidate) => candidate.score ?? 0));
  const stats = payload.stats;

  return (
    <>
      {stats ? (
        <p className="stats-line">
          <b>{stats.exactCount}</b> exact-symbol {stats.exactCount === 1 ? "match" : "matches"} · <b>{stats.relatedCount}</b> related ·{" "}
          <b>{stats.chainCount}</b> chains · {stats.clusterCount} distinct addresses · observed {stats.totalRows} rows in a ≤{payload.coverage?.requestedLimit ?? 100}-row window
          {stats.farmingFlagged ? (
            <>
              {" "}
              · <b className="danger-text">{stats.farmingFlagged}</b> farming-flagged
            </>
          ) : null}
          {stats.elsewhereCount ? <> · {stats.elsewhereCount} off-chain venue listings</> : null}
        </p>
      ) : null}
      <Audit payload={payload} />
      {payload.resolution === "family" && payload.family?.length ? (
        <Family payload={payload} />
      ) : payload.pick ? (
        <Pick payload={payload} />
      ) : (
        <div className="state-card">
          <p>
            {NONE_MSG[payload.noneReason ?? ""] ??
              "No candidate has both liquidity and trader data. No pick is better than a wrong pick."}
          </p>
        </div>
      )}
      {exact.length ? <Lineup title="Exact symbol" rows={exact} offset={0} maxScore={maxScore} clusterSizes={clusterSizes} /> : null}
      {related.length ? (
        <details className="related">
          <summary>Also matched: {related.length} name/symbol partials</summary>
          <Lineup title="" rows={related} offset={exact.length} maxScore={maxScore} clusterSizes={clusterSizes} />
        </details>
      ) : null}
      {elsewhere.length ? (
        <details className="related">
          <summary>Listed elsewhere: {elsewhere.length} off-chain venue rows</summary>
          <Lineup
            title=""
            rows={elsewhere}
            offset={exact.length + related.length}
            maxScore={maxScore}
            clusterSizes={clusterSizes}
          />
        </details>
      ) : null}
    </>
  );
}

function Audit({ payload }: { payload: ResolvePayload }) {
  const rows: Array<[string, string]> = [
    ["endpoint", `${payload.endpoint ?? "/v1/dex/search"}?q=${payload.query}&limit=${payload.coverage?.requestedLimit ?? 100}`],
    ["captured", payload.capturedAt ?? "unknown"],
    ["sha256", payload.bodySha256 ? `${payload.bodySha256.slice(0, 16)}…` : "unknown"],
    ["credits", payload.credits == null ? "unknown" : String(payload.credits)],
    ["mode", payload.mode ?? "unknown"],
    [
      "receipt",
      payload.mode === "live" || payload.mode === "live (cached)"
        ? "sha256 over raw upstream body"
        : payload.receiptVerified
          ? "sha256 verified against raw stored body"
          : "hash stored; raw body not retained",
    ],
    ["rules", payload.rulesVersion ?? "unknown"],
  ];
  if (payload.staleReason) rows.push(["note", payload.staleReason]);

  return (
    <details className="audit">
      <summary>
        audit · {payload.mode ?? "unknown"} · {payload.credits ?? "?"} credit
      </summary>
      <div className="audit-body">
        {rows.map(([key, value]) => (
          <span key={key}>
            <b>{key}: </b>
            {value}
          </span>
        ))}
      </div>
    </details>
  );
}

function Pick({ payload }: { payload: ResolvePayload }) {
  const pick = payload.pick;
  if (!pick) return null;
  const href = explorerHref(pick.candidate.platform, pick.candidate.address, publicEnv.cluster);
  const label = pick.label === "close-call" ? "close call" : pick.label === "only-candidate" ? "only candidate" : "best pick";
  return (
    <article className={`pick-strip${pick.label === "close-call" ? " close" : ""}`}>
      <div className={`pick-stamp${pick.label === "close-call" ? " close" : ""}`}>{label}</div>
      <div className="pick-body">
        <div className="pick-name">
          {pick.candidate.name} <span className="sym">{pick.candidate.symbol}</span> · {pick.candidate.platform}
        </div>
        {href ? (
          <a className="pick-addr" href={href} target="_blank" rel="noreferrer">
            {pick.candidate.address}
          </a>
        ) : (
          <span className="pick-addr">{pick.candidate.address}</span>
        )}
        <p className="pick-reason">
          <b>Why: </b>
          {pick.reason}
        </p>
        <p className="pick-caveat">Heuristic pick. Depth and trader counts can be bought. Verify on the explorer.</p>
      </div>
    </article>
  );
}

function Family({ payload }: { payload: ResolvePayload }) {
  return (
    <article className="family-box">
      <div className="pick-stamp family">multi-chain asset</div>
      <p className="pick-reason">
        <b>Reframed: </b>“{payload.query}” is one asset on many chains. There is no single winner. Pick the chain you are trading on.
      </p>
      {(payload.family ?? []).map((member) => {
        const href = explorerHref(member.platform, member.address, publicEnv.cluster);
        return (
          <div className="family-row" key={`${member.platform}-${member.address}`}>
            <span className="ex-chain">{member.platform}</span>
            <span>
              {member.name || "?"} <span className="sym">{member.symbol}</span>
            </span>
            {href ? (
              <a href={href} target="_blank" rel="noreferrer">
                {shortAddr(member.address)}
              </a>
            ) : (
              <span>{shortAddr(member.address)}</span>
            )}
            <span>{fmtUsd(member.liqUsd)}</span>
            <span>{fmtInt(member.uniqueTraders24h)} traders</span>
          </div>
        );
      })}
    </article>
  );
}

function Lineup({
  title,
  rows,
  offset,
  maxScore,
  clusterSizes,
}: {
  title: string;
  rows: Candidate[];
  offset: number;
  maxScore: number;
  clusterSizes: Map<string, number>;
}) {
  return (
    <div className="lineup">
      {title ? <h2>{title}</h2> : null}
      <div className="exhibit-head">
        {["#", "candidate", "chain", "address", "liquidity", "traders 24h", "mcap", "24h", "liq×ut24h"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      {rows.map((candidate, index) => (
        <Exhibit
          key={`${candidate.platform}-${candidate.address}-${index}`}
          candidate={candidate}
          index={offset + index}
          maxScore={maxScore}
          clusterSize={candidate.cluster ? (clusterSizes.get(candidate.cluster) ?? 0) : 0}
        />
      ))}
    </div>
  );
}

function Exhibit({
  candidate,
  index,
  maxScore,
  clusterSize,
}: {
  candidate: Candidate;
  index: number;
  maxScore: number;
  clusterSize: number;
}) {
  const href = explorerHref(candidate.platform, candidate.address, publicEnv.cluster);
  const delta = fmtDelta(candidate.priceChange24h);
  const width = candidate.score != null && maxScore > 0 ? Math.max(1.5, (candidate.score / maxScore) * 100) : 0;
  const logo = candidate.logo && /^https?:\/\//.test(candidate.logo) ? candidate.logo : null;

  return (
    <article className={`exhibit${candidate.eligible === false ? " is-dead" : ""}`} style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}>
      <span className="ex-num">EX-{String(index + 1).padStart(2, "0")}</span>
      <div className="ex-id">
        <TokenLogo src={logo} />
        <div>
          <div className="ex-name">
            {candidate.name || "?"} <span className="sym">{candidate.symbol}</span>
          </div>
          <div className="ex-flags">
            {(candidate.flags ?? []).map((flag) => {
              const [label, tone] = FLAG_LABEL[flag] ?? [flag, ""];
              return (
                <span key={flag} className={`flag ${tone}`}>
                  {label}
                </span>
              );
            })}
            {clusterSize > 1 ? <span className="flag same">same address ×{clusterSize} — unverified</span> : null}
          </div>
        </div>
      </div>
      <span className="ex-chain">{candidate.platform}</span>
      <div className="ex-addr">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" title={candidate.address}>
            {shortAddr(candidate.address)}
          </a>
        ) : (
          <span title={candidate.address}>{shortAddr(candidate.address)}</span>
        )}
        <CopyButton address={candidate.address} />
      </div>
      <span className={`stat stat-liq${candidate.liqUsd == null ? " na" : ""}`}>{fmtUsd(candidate.liqUsd)}</span>
      <span className={`stat stat-traders${candidate.uniqueTraders24h == null ? " na" : ""}`}>{fmtInt(candidate.uniqueTraders24h)}</span>
      <span className={`stat stat-mcap${candidate.mcapUsd == null ? " na" : ""}`}>{fmtUsd(candidate.mcapUsd)}</span>
      <span className={`stat stat-delta delta ${delta.tone}`}>{delta.text}</span>
      <div className="score-cell">
        <div className="score-bar">
          <div className={`score-fill${index === 0 ? "" : " runner"}`} style={{ width: `${width}%` }} />
        </div>
        <span>{fmtScore(candidate.score)}</span>
      </div>
    </article>
  );
}

function TokenLogo({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <span className="ex-logo empty" aria-hidden="true" />;
  return (
    <img
      className="ex-logo"
      src={src}
      alt=""
      width={22}
      height={22}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function CopyButton({ address }: { address: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className={`addr-copy${done ? " done" : ""}`}
      type="button"
      aria-label="Copy address"
      onClick={async () => {
        await navigator.clipboard.writeText(address);
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? "ok" : "copy"}
    </button>
  );
}
