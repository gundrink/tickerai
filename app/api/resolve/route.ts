import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { onRequestGet } from "../../../functions/api/resolve.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIVE_DESK = "https://ambiguitydesk.pages.dev/api/resolve";

export async function GET(request: Request): Promise<Response> {
  const root = process.cwd();
  const local = await onRequestGet({
    request,
    env: {
      CMC_API_KEY: process.env.CMC_API_KEY,
      ASSETS: {
        fetch: async (assetRequest: Request) => {
          const name = decodeURIComponent(new URL(assetRequest.url).pathname.replace(/^\/fixtures\//, ""));
          if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
            return new Response("not found", { status: 404 });
          }
          const file = path.join(root, "fixtures", name);
          if (!existsSync(file)) return new Response("not found", { status: 404 });
          return new Response(readFileSync(file), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        },
      },
    },
  });

  // Local dev has no CMC key, so unknown tickers miss the fixture set.
  // The deployed desk is already live — use it instead of reporting a false miss.
  if (process.env.CMC_API_KEY || local.status !== 404) return local;
  const query = new URL(request.url).searchParams.get("q") ?? "";
  if (!query) return local;
  try {
    const upstream = await fetch(`${LIVE_DESK}?q=${encodeURIComponent(query)}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return local;
  }
}
