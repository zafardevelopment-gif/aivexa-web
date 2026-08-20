/**
 * AIVEXA PDF API — Puppeteer PDF Engine
 *
 * Uses puppeteer-core + @sparticuz/chromium for Vercel serverless compatibility.
 * In production: @sparticuz/chromium provides a Lambda-compatible Chromium binary.
 * In development: falls back to local Chromium via PUPPETEER_EXEC_PATH env var.
 */

import puppeteer, { Browser, Page, PDFOptions, ScreenshotOptions } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// ── Browser singleton ──────────────────────────────────────────

let browser: Browser | null = null;
let isLaunching = false;

const EXTRA_ARGS = [
  "--disable-accelerated-2d-canvas",
  "--disable-extensions",
  "--disable-background-networking",
  "--disable-default-apps",
  "--disable-sync",
  "--disable-translate",
  "--hide-scrollbars",
  "--metrics-recording-only",
  "--mute-audio",
  "--safebrowsing-disable-auto-update",
];

async function getBrowser(): Promise<Browser> {
  if (browser?.connected) return browser;

  if (isLaunching) {
    await new Promise((r) => setTimeout(r, 500));
    return getBrowser();
  }

  isLaunching = true;
  try {
    // Use local Chromium in dev, @sparticuz/chromium in production (Vercel/serverless)
    const executablePath =
      process.env.PUPPETEER_EXEC_PATH ||
      (process.env.NODE_ENV === "production"
        ? await chromium.executablePath()
        : "/usr/bin/google-chrome-stable");

    browser = await puppeteer.launch({
      headless: chromium.headless,
      args: [...chromium.args, ...EXTRA_ARGS],
      executablePath,
      defaultViewport: chromium.defaultViewport,
    });

    browser.on("disconnected", () => {
      console.error("[pdf-engine] Browser disconnected — will restart on next request");
      browser = null;
    });
  } finally {
    isLaunching = false;
  }

  return browser!;
}

// ── Types ──────────────────────────────────────────────────────

export type PdfFormat =
  | "A3" | "A4" | "A5" | "A6"
  | "Letter" | "Legal" | "Tabloid" | "Ledger";

export type PdfOrientation = "portrait" | "landscape";

export type MarginOptions = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

export type PdfRequestOptions = {
  html?: string;
  url?: string;
  format?: PdfFormat;
  orientation?: PdfOrientation;
  width?: string;
  height?: string;
  margin?: MarginOptions;
  printBackground?: boolean;
  scale?: number;
  mediaType?: "print" | "screen";
  waitForSelector?: string;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
  delay?: number;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  title?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  timeout?: number;
};

export type ScreenshotRequestOptions = {
  url?: string;
  html?: string;
  format?: "png" | "jpeg";
  fullPage?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  quality?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
  delay?: number;
  waitForSelector?: string;
  timeout?: number;
};

export type EngineResult =
  | { ok: true; buffer: Buffer; pages?: number }
  | { ok: false; error: "RENDERING_TIMEOUT" | "BROWSER_ERROR" | "URL_INACCESSIBLE"; detail?: string };

// ── Core renderer ──────────────────────────────────────────────

async function createPage(
  opts: { viewportWidth?: number; viewportHeight?: number }
): Promise<Page> {
  const b = await getBrowser();
  const context = await b.createBrowserContext();
  const page = await context.newPage();

  await page.setViewport({
    width: opts.viewportWidth ?? 1280,
    height: opts.viewportHeight ?? 800,
  });

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();
    if (["media", "websocket"].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  return page;
}

async function loadContent(
  page: Page,
  opts: PdfRequestOptions | ScreenshotRequestOptions,
  timeout: number
): Promise<{ ok: false; error: "URL_INACCESSIBLE" | "RENDERING_TIMEOUT"; detail?: string } | { ok: true }> {
  const waitUntil = opts.waitUntil ?? "networkidle0";

  try {
    if (opts.url) {
      const response = await page.goto(opts.url, { waitUntil, timeout });
      if (!response || response.status() >= 400) {
        return { ok: false, error: "URL_INACCESSIBLE", detail: `HTTP ${response?.status()}` };
      }
    } else if (opts.html) {
      await page.setContent(opts.html, { waitUntil: waitUntil as 'load' | 'domcontentloaded', timeout });
    }

    if (opts.waitForSelector) {
      await page.waitForSelector(opts.waitForSelector, { timeout: 10_000 });
    }

    if (opts.delay && opts.delay > 0 && opts.delay <= 10_000) {
      await new Promise((r) => setTimeout(r, opts.delay));
    }

    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("timeout") || msg.includes("Timeout")) {
      return { ok: false, error: "RENDERING_TIMEOUT", detail: msg };
    }
    return { ok: false, error: "URL_INACCESSIBLE", detail: msg };
  }
}

// ── PDF Generation ─────────────────────────────────────────────

export async function generatePdf(opts: PdfRequestOptions): Promise<EngineResult> {
  const timeout = Math.min(opts.timeout ?? 30_000, 60_000);
  let page: Page | null = null;

  try {
    page = await createPage({
      viewportWidth: opts.viewportWidth,
      viewportHeight: opts.viewportHeight,
    });

    if (opts.mediaType) {
      await page.emulateMediaType(opts.mediaType);
    }

    const loadResult = await loadContent(page, opts, timeout);
    if (!loadResult.ok) return loadResult;

    const pdfOpts: PDFOptions = {
      format: (opts.format ?? "A4") as PDFOptions["format"],
      landscape: opts.orientation === "landscape",
      printBackground: opts.printBackground ?? true,
      scale: opts.scale ?? 1,
      margin: opts.margin ?? { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
      displayHeaderFooter: opts.displayHeaderFooter ?? false,
      headerTemplate: opts.headerTemplate ?? "<span></span>",
      footerTemplate: opts.footerTemplate ?? "<span></span>",
    };

    if (opts.width && opts.height) {
      delete pdfOpts.format;
      pdfOpts.width = opts.width;
      pdfOpts.height = opts.height;
    }

    const pdfBuffer = await page.pdf(pdfOpts);
    return { ok: true, buffer: Buffer.from(pdfBuffer) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pdf-engine] PDF generation error:", msg);
    if (msg.includes("timeout") || msg.includes("Timeout")) {
      return { ok: false, error: "RENDERING_TIMEOUT", detail: msg };
    }
    return { ok: false, error: "BROWSER_ERROR", detail: msg };
  } finally {
    if (page) {
      const context = page.browserContext();
      await page.close().catch(() => {});
      await context.close().catch(() => {});
    }
  }
}

// ── Screenshot Generation ──────────────────────────────────────

export async function generateScreenshot(
  opts: ScreenshotRequestOptions
): Promise<EngineResult> {
  const timeout = Math.min(opts.timeout ?? 30_000, 60_000);
  let page: Page | null = null;

  try {
    page = await createPage({
      viewportWidth: opts.viewportWidth ?? 1280,
      viewportHeight: opts.viewportHeight ?? 800,
    });

    const loadResult = await loadContent(page, opts, timeout);
    if (!loadResult.ok) return loadResult;

    const screenshotOpts: ScreenshotOptions = {
      type: opts.format ?? "png",
      fullPage: opts.fullPage ?? false,
      ...(opts.format === "jpeg" && { quality: opts.quality ?? 90 }),
    };

    const buf = await page.screenshot(screenshotOpts);
    return { ok: true, buffer: Buffer.from(buf) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("timeout") || msg.includes("Timeout")) {
      return { ok: false, error: "RENDERING_TIMEOUT", detail: msg };
    }
    return { ok: false, error: "BROWSER_ERROR", detail: msg };
  } finally {
    if (page) {
      const context = page.browserContext();
      await page.close().catch(() => {});
      await context.close().catch(() => {});
    }
  }
}

// ── Graceful shutdown ─────────────────────────────────────────

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close().catch(() => {});
    browser = null;
  }
}
