// Small client-side image helpers shared by the Image tools.
// All processing happens in the browser — nothing is uploaded.

export function formatBytes(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

/** Load a File into an HTMLImageElement (object URL is revoked automatically). */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that file as an image."));
    };
    img.src = url;
  });
}

/** Promise wrapper around canvas.toBlob with a helpful error. */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not export the image (canvas may be too large)."));
      },
      type,
      quality
    );
  });
}

/** Trigger a download for a Blob, then revoke the object URL. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Strip extension from a filename. */
export function baseName(name: string): string {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}

export const MAX_CANVAS_DIM = 16000;

export function dimsOk(w: number, h: number): boolean {
  return w > 0 && h > 0 && w <= MAX_CANVAS_DIM && h <= MAX_CANVAS_DIM;
}
