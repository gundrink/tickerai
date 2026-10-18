import type { SolanaCluster } from "@/lib/env";

const EXPLORERS: Record<string, string> = {
  ethereum: "https://etherscan.io/token/",
  bsc: "https://bscscan.com/token/",
  base: "https://basescan.org/token/",
  arbitrum: "https://arbiscan.io/token/",
  optimism: "https://optimistic.etherscan.io/token/",
  polygon: "https://polygonscan.com/token/",
  avalanche: "https://snowtrace.io/token/",
  gnosis: "https://gnosisscan.io/token/",
  tron: "https://tronscan.org/#/token20/",
  "sui network": "https://suiscan.xyz/mainnet/coin/",
  near: "https://nearblocks.io/token/",
};

export function explorerHref(platform: string, address: string, cluster: SolanaCluster): string | null {
  if (platform.toLowerCase() === "solana") {
    const base = `https://solscan.io/token/${encodeURIComponent(address)}`;
    if (cluster === "mainnet-beta") return base;
    return `${base}?cluster=${cluster}`;
  }
  const prefix = EXPLORERS[platform.toLowerCase()];
  return prefix ? prefix + encodeURIComponent(address) : null;
}

export function fmtUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return "unknown";
  if (value >= 1e15) return `$${value.toExponential(1)}`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function fmtInt(value: number | null | undefined): string {
  if (value === null || value === undefined) return "unknown";
  return value.toLocaleString("en-US");
}

export function fmtScore(value: number | null | undefined): string {
  if (value === null || value === undefined) return "no score";
  return value.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });
}

export function fmtDelta(value: number | null | undefined): { text: string; tone: "up" | "down" | "flat" } {
  if (value === null || value === undefined) return { text: "unknown", tone: "flat" };
  const pct = value * 100;
  const tone = pct > 0.05 ? "up" : pct < -0.05 ? "down" : "flat";
  return { text: `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`, tone };
}

export function shortAddr(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 7)}…${address.slice(-5)}`;
}

export const FLAG_LABEL: Record<string, [string, string]> = {
  "mcap-inflated": ["mcap inflated", "warn"],
  "thin-pool": ["thin pool", "warn"],
  "no-traders": ["no traders", "danger"],
  "data-gap": ["data gap", ""],
  "possible-farming": ["farmed?", "danger"],
  "young-pool": ["young pool", "warn"],
  "offchain-venue": ["off-chain venue", ""],
  "venue-unmapped": ["venue unmapped", "warn"],
};
