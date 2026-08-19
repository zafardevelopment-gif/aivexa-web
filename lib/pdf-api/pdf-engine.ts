/**
 * AIVEXA PDF API — Puppeteer PDF Engine
 *
 * Wraps Puppeteer with:
 *  - Isolated browser context per request (no cross-request data leak)
 *  - Configurable timeout and viewport
 *  - All standard PDF options (format, margins, headers, footers, etc.)
 *  - Screenshot support (PNG/JPEG)
 *  - Graceful browser restart on crash
 *
 * Decision: Puppeteer over Playwright because:
 *  - Mature, battle-tested Chromium integration
 *  - Simpler browser reuse pattern
 *  - Smaller Docker image (chromium-only)
 *  - Official @puppeteer/browsers for reliable Chromium management
 */

import puppeteer, { Browser, Page, PDFOptions, ScreenshotOptions } from "puppeteer";

// ── Browser singleton ──────────────────────────────────────────

let browser: Browser | null = null;
let isLaunching = false;

const BROWSER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-accelerated-2d-canvas",
  "--disable-gpu",
  "--no-first-run",
  "--no-zygote",
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
    // Wait for the in-flight launch
    await new Promise((r) => setTimeout(r, 500));
    return getBrowser();
  }

  isLaunching = true;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: BROWSER_ARGS,
      executablePath: process.env.PUPPETEER_EXEC_PATH || undefined,
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
  // Input (one of these required)
  html?: string;
  url?: string;

  // Page format
  format?: PdfFormat;
  orientation?: PdfOrientation;
  width?: string;
  height?: string;

  // Margins
  margin?: MarginOptions;

  // Rendering
  printBackground?: boolean;
  scale?: number;
  mediaType?: "print" | "screen";

  // JS wait options
  waitForSelector?: string;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
  delay?: number;  // ms

  // Headers / footers
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;

  // PDF metadata
  title?: string;

  // Viewport
  viewportWidth?: number;
  viewportHeight?: number;

  // Timeout (ms, default 30s)
  timeout?: number;
};

export type ScreenshotRequestOptions = {
  url?: string;
  html?: string;
  format?: "png" | "jpeg";
  fullPage?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  quality?: number;  // JPEG only, 0-100
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

  // Block unnecessary resource types to speed up rendering
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
      const response = await page.goto(opts.url, {
        waitUntil,
        timeout,
      });
      if (!response || response.status() >= 400) {
        return { ok: false, error: "URL_INACCESSIBLE", detail: `HTTP ${response?.status()}` };
      }
    } else if (opts.html) {
      await page.setContent(opts.html, { waitUntil, timeout });
    }

    // Optional: wait for a selector
    if (opts.waitForSelector) {
      await page.waitForSelector(opts.waitForSelector, { timeout: 10_000 });
    }

    // Optional: artificial delay
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

    // Set media type
    if (opts.mediaType) {
      await page.emulateMediaType(opts.mediaType);
    }

    const loadResult = await loadContent(page, opts, timeout);
    if (!loadResult.ok) return loadResult;

    // Build PDF options
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

    // Custom dimensions override format
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
