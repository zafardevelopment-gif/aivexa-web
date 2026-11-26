import { NextResponse } from "next/server";

/** Error with an HTTP status; the app maps status codes to messages (see unscroll client.ts). */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const ok = (data: unknown, status = 200) =>
  status === 204 ? new NextResponse(null, { status: 204 }) : NextResponse.json(data, { status });

export const noContent = () => new NextResponse(null, { status: 204 });

export function fail(e: unknown) {
  if (e instanceof HttpError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error("[unscroll]", e);
  return NextResponse.json({ error: "Something went wrong on the server." }, { status: 500 });
}

export async function body<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

export const str = (v: unknown, field: string, max = 200): string => {
  if (typeof v !== "string" || !v.trim()) throw new HttpError(400, `${field} is required`);
  return v.trim().slice(0, max);
};

export const int = (v: unknown, field: string, min: number, max: number): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n) || n < min || n > max) throw new HttpError(400, `${field} must be between ${min} and ${max}`);
  return Math.round(n);
};
