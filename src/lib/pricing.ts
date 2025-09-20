// Unit prices based on current public docs (UI-only demo values)
export const IMAGE_PER_MP_USD = 0.003; // FLUX.1 schnell per megapixel
export const VIDEO_PER_SEC_USD = 0.0333; // Framepack per second

export function mpFromWH(w: number, h: number) {
  const raw = (w * h) / 1_000_000;
  return Math.max(0, Math.ceil(raw));
}

export function estimateImageUSD(w: number, h: number) {
  return mpFromWH(w, h) * IMAGE_PER_MP_USD;
}

export function estimateVideoUSD(seconds: number) {
  return Math.max(0, seconds) * VIDEO_PER_SEC_USD;
}

export function formatUSD(value: number) {
  return `$${value.toFixed(value < 1 ? 4 : 2)}`;
}

