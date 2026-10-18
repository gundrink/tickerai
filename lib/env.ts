const CLUSTERS = ["devnet", "testnet", "mainnet-beta"] as const;

export type SolanaCluster = (typeof CLUSTERS)[number];

function isCluster(value: string): value is SolanaCluster {
  return CLUSTERS.some((cluster) => cluster === value);
}

function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) {
    throw new Error(`${name} is not set`);
  }
  return trimmed;
}

function optional(value: string | undefined): string {
  return value?.trim() ?? "";
}

function clusterFrom(value: string | undefined): SolanaCluster {
  const trimmed = value?.trim() || "devnet";
  if (isCluster(trimmed)) return trimmed;
  throw new Error("NEXT_PUBLIC_SOLANA_CLUSTER must be devnet, testnet, or mainnet-beta");
}

export const publicEnv = {
  reownProjectId: required(
    "NEXT_PUBLIC_REOWN_PROJECT_ID",
    process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  ),
  appUrl: optional(process.env.NEXT_PUBLIC_APP_URL) || "http://localhost:3000",
  cluster: clusterFrom(process.env.NEXT_PUBLIC_SOLANA_CLUSTER),
  rpcUrl: required("NEXT_PUBLIC_SOLANA_RPC_URL", process.env.NEXT_PUBLIC_SOLANA_RPC_URL),
  xUrl: optional(process.env.NEXT_PUBLIC_X_URL),
  ca: optional(process.env.NEXT_PUBLIC_CA),
};

export const clusterLabel: Record<SolanaCluster, string> = {
  devnet: "Solana devnet",
  testnet: "Solana testnet",
  "mainnet-beta": "Solana mainnet",
};
