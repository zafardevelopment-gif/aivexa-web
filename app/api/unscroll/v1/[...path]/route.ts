/**
 * Unscroll family backend — every /api/unscroll/v1/* endpoint.
 * Route table: lib/unscroll/handlers.ts. Schema: db/unscroll/001_unscroll.sql.
 */
import { dispatch } from "@/lib/unscroll/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };
const run = (method: string) => async (req: Request, ctx: Ctx) => dispatch(method, req, (await ctx.params).path ?? []);

export const GET = run("GET");
export const POST = run("POST");
export const PUT = run("PUT");
export const PATCH = run("PATCH");
export const DELETE = run("DELETE");
