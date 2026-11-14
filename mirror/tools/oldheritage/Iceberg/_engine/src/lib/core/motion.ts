// Measured motion models (MOTION.md / DD studies). All functions accept FRACTIONAL frames (CameraMotionBlur renders sub-frames):
// never index an array with a raw frame; use these helpers.
import { FPS, clamp01, lerp, lerpLog } from "./tokens";

/** VV §6 page-camera velocity: ramps x1.28 per 2 f to a peak at +1.05 s, then decays tau 1.45 s. */
const vvV = (t: number) => (t < 1.05 ? Math.pow(1.28, (t - 1.05) * 12) : Math.exp(-(t - 1.05) / 1.45));
const VV_TAB: number[] = (() => { const a = [0]; for (let k = 0; k < 900; k++) a.push(a[k] + vvV(k / FPS)); return a; })();
const tab = (T: number[], k: number) => {
  if (k <= 0) return 0;
  const i = Math.min(T.length - 2, Math.floor(k));
  return T[i] + (T[i + 1] - T[i]) * Math.min(1, k - i);
};
/** integrated VV burst (un-normalised; ~ seconds of travel). scale = exp(Z * vvBurst(k)), Z 0.010-0.016 per frame-unit */
export const vvBurst = (k: number) => tab(VV_TAB, k);
/** VV burst normalised to 0..1 over `norm` frames (still moving at the end, as in VV) */
export const vvBurstN = (k: number, norm: number) => clamp01(vvBurst(k) / vvBurst(norm));

/** DD V3 E4 scroll: velocity ease-in to a peak at 0.9 s then halving every 0.45 s; normalised over `norm` frames */
const scV = (t: number) => (t < 0.9 ? Math.pow(t / 0.9, 2) : Math.pow(0.5, (t - 0.9) / 0.45));
const SC_TAB: number[] = (() => { const a = [0]; for (let k = 0; k < 900; k++) a.push(a[k] + scV(k / FPS)); return a; })();
export const ddScroll = (k: number, norm = 140) => clamp01(tab(SC_TAB, k) / tab(SC_TAB, norm));

/** Dashcam footage push: linear, +rate per second (0.04-0.045). Never eased on footage. */
export const linPush = (k: number, rate = 0.045) => 1 + rate * (Math.max(0, k) / FPS);
/** constant "life" drift for designed plates (+0.6-1.4 %/s, exponential so it composes with log zooms) */
export const drift = (k: number, ratePerS = 0.008) => Math.exp(ratePerS * (Math.max(0, k) / FPS));

/** VV §3 "on twos" (12 fps designed-graphic feel) */
export const onTwos = (k: number) => Math.floor(k / 2) * 2;

/** VV §1 recession: S(t) = 0.39 + 0.61 e^(-t/1.10) (=1 at entry, -> 0.39) */
export const recession = (k: number, tau = 1.1) => 0.39 + 0.61 * Math.exp(-(Math.max(0, k) / FPS) / tau);

/** camera keys: each key eases from the previous state to `to` over d frames starting at f. Log-zoom. */
export type Cam = { cx: number; cy: number; s: number; rot?: number };
export type CamKey = { f: number; d: number; to: Cam; e: (x: number) => number };
export const camAt = (k: number, c0: Cam, keys: CamKey[]): Cam => {
  let c = { rot: 0, ...c0 };
  for (const key of keys) {
    const u = key.e(clamp01((k - key.f) / key.d));
    c = { cx: lerp(c.cx, key.to.cx, u), cy: lerp(c.cy, key.to.cy, u), s: lerpLog(c.s, key.to.s, u), rot: lerp(c.rot ?? 0, key.to.rot ?? c.rot ?? 0, u) };
  }
  return c;
};
/** is a camera key in its fast part (for motion blur gating) */
export const camFast = (k: number, keys: CamKey[], lo = 0.06, hi = 0.75) => keys.some((key) => { const u = (k - key.f) / key.d; return u > lo && u < hi; });

// ---------------------------------------------------------------- flash envelopes (frame offsets from the cut)
/** D1 hard white flash: 4 f */
export const FLASH4 = [1, 0.85, 0.5, 0.2];
/** FA camera R5 flash-decay on the incoming shot: 3 f */
export const DECAY3 = [0.87, 0.71, 0.5];
/** D3 F1 flash-streak white level, k = frames from the cut (-3 .. +9) */
export const flashStreak = (k: number) => {
  const T: Record<number, number> = { [-3]: 0.25, [-2]: 0.45, [-1]: 0.7, 0: 0.9, 1: 0.9, 2: 0.3, 3: 0.3, 4: 0.55, 5: 0.6, 6: 0.45, 7: 0.3, 8: 0.15, 9: 0.05 };
  return T[Math.floor(k)] ?? 0;
};
/** D1 time-skip white flash (sec B 4310): long soft white */
export const timeSkipFlash = (k: number) => {
  const T: Record<number, number> = { [-2]: 0.3, [-1]: 0.72, 0: 0.96, 1: 0.97, 2: 0.94, 3: 0.9, 4: 0.55, 5: 0.28, 6: 0.12, 7: 0.05 };
  return T[Math.floor(k)] ?? 0;
};
export const envAt = (env: number[], k: number) => (k >= 0 && k < env.length ? env[Math.floor(k)] : 0);

/** VV §8 word ghost: 0.3 -> 1 over 4 f after its onset (0 before) */
export const ghost = (k: number, d = 4, from = 0.3) => (k < 0 ? 0 : from + (1 - from) * clamp01(k / d));
