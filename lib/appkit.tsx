"use client";

import { Buffer } from "buffer";
import { createAppKit, type CreateAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";
import { publicEnv } from "@/lib/env";

if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer;
}

const networks = {
  devnet: solanaDevnet,
  testnet: solanaTestnet,
  "mainnet-beta": solana,
} as const;

const network = networks[publicEnv.cluster];
const solanaAdapter = new SolanaAdapter();
const origin = typeof window === "undefined" ? publicEnv.appUrl : window.location.origin;

createAppKit({
  adapters: [solanaAdapter],
  networks: [network],
  defaultNetwork: network,
  projectId: publicEnv.reownProjectId,
  metadata: {
    name: "TickerAI",
    description: "Every candidate wearing a ticker, scored as a heuristic.",
    url: origin,
    icons: [`${origin}/mark.png`],
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#2ee6c7",
    "--w3m-color-mix": "#140e08",
    "--w3m-color-mix-strength": 24,
  },
  basic: true,
} as unknown as CreateAppKit);

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return children;
}
