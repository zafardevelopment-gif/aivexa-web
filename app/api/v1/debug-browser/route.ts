/**
 * GET /api/v1/debug-browser
 * Temporary debug endpoint — remove after fixing browser issue
 */
import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const info: Record<string, unknown> = {
    node_env: process.env.NODE_ENV,
    platform: process.platform,
    arch: process.arch,
  };

  try {
    info.chromium_headless = chromium.headless;
    info.chromium_args = chromium.args;

    const executablePath = await chromium.executablePath();
    info.executable_path = executablePath;

    const browser = await puppeteer.launch({
      headless: chromium.headless,
      args: chromium.args,
      executablePath,
      defaultViewport: chromium.defaultViewport,
    });

    info.browser_launched = true;
    info.browser_version = await browser.version();
    await browser.close();
    info.browser_closed = true;

    return NextResponse.json({ ok: true, info });
  } catch (err) {
    info.error = err instanceof Error ? err.message : String(err);
    info.stack = err instanceof Error ? err.stack?.slice(0, 500) : undefined;
    return NextResponse.json({ ok: false, info }, { status: 500 });
  }
}
