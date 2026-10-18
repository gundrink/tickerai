export function onRequestGet(context: {
  request: { url: string };
  env: {
    CMC_API_KEY?: string;
    ASSETS: { fetch: (request: Request) => Promise<Response> };
  };
}): Promise<Response>;
