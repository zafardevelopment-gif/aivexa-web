import { fail, HttpError } from "./http";
import { routes } from "./handlers";

/** Matches /api/unscroll/v1/<path> against the route table in handlers.ts. */
export async function dispatch(method: string, req: Request, segments: string[]): Promise<Response> {
  try {
    const url = new URL(req.url);
    let methodMatched = false;
    for (const [m, pattern, handler] of routes) {
      const parts = pattern.split("/");
      if (parts.length !== segments.length) continue;
      const params: Record<string, string> = {};
      const hit = parts.every((part, i) => {
        if (part.startsWith(":")) { params[part.slice(1)] = decodeURIComponent(segments[i]); return true; }
        return part === segments[i];
      });
      if (!hit) continue;
      if (m !== method) { methodMatched = true; continue; }
      return await handler(req, params, url);
    }
    throw new HttpError(methodMatched ? 405 : 404, methodMatched ? "Method not allowed" : "Not found");
  } catch (e) {
    return fail(e);
  }
}
