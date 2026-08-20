import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const info: Record<string, unknown> = {
    node: process.version,
    env: process.env.NODE_ENV,
    PUPPETEER_EXEC_PATH: process.env.PUPPETEER_EXEC_PATH ?? "(not set)",
  };

  try {
    const executablePath = process.env.PUPPETEER_EXEC_PATH || await chromium.executablePath();
    info.executablePath = executablePath;
    info.chromiumArgs = chromium.args;
    info.chromiumHeadless = chromium.headless;

    const browser = await puppeteer.launch({
      headless: chromium.headless,
      args: chromium.args,
      executablePath,
      defaultViewport: chromium.defaultViewport,
    });

    const version = await browser.version();
    await browser.close();

    return NextResponse.json({ ok: true, version, ...info });
  } catch (err) {
    info.error = err instanceof Error ? err.message : String(err);
    info.stack = err instanceof Error ? err.stack : undefined;
    return NextResponse.json({ ok: false, ...info }, { status: 500 });
  }
}
