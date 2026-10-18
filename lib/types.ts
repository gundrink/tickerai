export interface Candidate {
  platform: string;
  address: string;
  name: string;
  symbol: string;
  liqUsd: number | null;
  uniqueTraders24h: number | null;
  mcapUsd: number | null;
  priceChange24h: number | null;
  logo: string | null;
  score: number | null;
  flags: string[];
  cluster?: string;
  bucket: "exact" | "related" | "elsewhere";
  eligible?: boolean;
}

export interface FamilyMember {
  platform: string;
  name: string;
  symbol: string;
  address: string;
  liqUsd: number | null;
  uniqueTraders24h: number | null;
}

export interface ResolvePayload {
  ok: boolean;
  error?: string;
  query: string;
  mode?: string;
  resolution?: "pick" | "family" | "none";
  noneReason?: string | null;
  endpoint?: string;
  capturedAt?: string | null;
  bodySha256?: string | null;
  credits?: number | string | null;
  receiptVerified?: boolean;
  rulesVersion?: string;
  staleReason?: string;
  coverage?: { requestedLimit?: number };
  family?: FamilyMember[] | null;
  stats?: {
    exactCount: number;
    relatedCount: number;
    chainCount: number;
    clusterCount: number;
    totalRows: number;
    farmingFlagged: number;
    elsewhereCount: number;
  };
  pick?: {
    label: string;
    reason: string;
    candidate: Candidate;
  } | null;
  candidates?: Candidate[];
}
