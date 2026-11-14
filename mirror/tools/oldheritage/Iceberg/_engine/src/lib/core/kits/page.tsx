// PROMOTED to core (was src/templates/page/shared.tsx); shared by several families. Import as "../../core/kits/page".
// Shared plumbing for the "page" family (also used by evidence + social): a sliced/cropped page sheet, phrase marks (bars / ink / marker)
// with a continuous multi-line wipe, page entries (cut / 4-f flash / D3 flash-streak / 1 white frame / fade / VV glitch) and the D3 boxed
// typed caption. All frames LOCAL. Rects are CSS px of the 2x-DPR capture ([x, y, w, h], as in the capture's .json).
import React from "react";
import { AbsoluteFill, Easing, Img, useCurrentFrame } from "remotion";
import { FLASH4, FONT, H, W, asset, clamp01, envAt, fs, rng, type Rect } from "../index";

export type PageSrc = {
  src: string; // public-relative PNG (2x DPR capture)
  cssW: number; // CSS width of the capture (= PNG width / 2)
  cssH: number; // CSS height of the capture
};
/** one spoken phrase on the page: its line rects (in reading order) and the local frame its mark starts; dur = whole phrase wipe */
export type Mark = { rects: Rect[]; at: number; dur?: number };
/** a slice of the page drawn at virtual y `vy` (collapse a long page so headline + paragraph sit together; DD D3 E4 / wp3 sec_C HighPage) */
export type Slice = { y0: number; y1: number; vy: number };
/** mode: "bar" = DD bar UNDER the multiplied page (black text on red); "white" = same bar, but the words inside it are re-inked WHITE
 *  (M-024 contrast); "ink" = colour over the words (lighten: black text turns colour) */
export type Bar = { r: Rect; p: number; c: string; mode?: "bar" | "ink" | "white"; px?: number; py?: number; radius?: number; glow?: string };
export type BarInk = "page" | "white";

const bz = (a: number, b: number, c: number, d: number) => { const e = Easing.bezier(a, b, c, d); return (x: number) => e(clamp01(x)); };
/** DD red-bar wipe: quick attack, steady read (~0.6 s per line) */
export const ddWipe = bz(0.25, 0.4, 0.4, 1);
export const linear = (x: number) => clamp01(x);

/** phrase marks -> bars. The wipe runs continuously across the phrase's lines (each line's share of the time = its width share). */
export const markBars = (
  f: number, marks: Mark[] | undefined,
  st: { c: string; mode?: "bar" | "ink" | "white"; ink?: BarInk; ease?: (x: number) => number; perLine?: number; px?: number; py?: number; radius?: number; glow?: string },
): Bar[] => {
  const out: Bar[] = [];
  for (const m of marks ?? []) {
    const tot = m.rects.reduce((a, r) => a + r[2], 0) || 1;
    const dur = m.dur ?? (st.perLine ?? 18) * m.rects.length;
    const u = (st.ease ?? ddWipe)((f - m.at) / Math.max(1, dur));
    if (f < m.at) continue;
    let acc = 0;
    for (const r of m.rects) {
      const p = clamp01((u * tot - acc) / r[2]);
      acc += r[2];
      out.push({ r, p, c: st.c, mode: st.ink === "white" && (st.mode ?? "bar") === "bar" ? "white" : st.mode, px: st.px, py: st.py, radius: st.radius, glow: st.glow });
    }
  }
  return out;
};

/** the page as a physical sheet: crop (x0..x1) + slices, camera (cx, cy) in CSS px (virtual y when sliced) at screen (ox, oy), s = screen px / CSS px */
export const PageSheet: React.FC<PageSrc & {
  cx: number; cy: number; s: number; rot?: number; ox?: number; oy?: number; bars?: Bar[]; x0?: number; x1?: number; slices?: Slice[];
  bg?: string; imgFilter?: string; shadow?: string; children?: React.ReactNode;
}> = ({ src, cssW, cssH, cx, cy, s, rot = 0, ox = W / 2, oy = H / 2, bars = [], x0 = 0, x1, slices, bg = "#fff", imgFilter, shadow = "0 30px 90px rgba(0,0,0,.55)", children }) => {
  const X1 = x1 ?? cssW;
  const sl = slices ?? [{ y0: 0, y1: cssH, vy: 0 }];
  const top = Math.min(...sl.map((q) => q.vy)), bot = Math.max(...sl.map((q) => q.vy + q.y1 - q.y0));
  const bar = (b: Bar, q: Slice, i: number) => {
    const px = b.px ?? 3, py = b.py ?? 2;
    return (
      <div key={i} style={{ position: "absolute", left: b.r[0] - x0 - px, top: b.r[1] - q.y0 - py, width: (b.r[2] + 2 * px) * clamp01(b.p), height: b.r[3] + 2 * py, background: b.c,
        mixBlendMode: b.mode === "ink" ? "lighten" : undefined, borderRadius: b.radius ?? (b.mode === "ink" ? 0 : 3), boxShadow: b.glow }} />
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${ox}px, ${oy}px) rotate(${rot}deg) scale(${s}) translate(${-cx}px, ${-cy}px)` }}>
      <div style={{ position: "absolute", left: x0, top, width: X1 - x0, height: bot - top, background: bg, boxShadow: shadow }} />
      {sl.map((q, i) => {
        const mine = bars.filter((b) => b.p > 0 && b.r[1] + b.r[3] / 2 >= q.y0 && b.r[1] + b.r[3] / 2 < q.y1);
        return (
          <div key={i} style={{ position: "absolute", left: x0, top: q.vy, width: X1 - x0, height: q.y1 - q.y0, overflow: "hidden", background: bg, isolation: "isolate" }}>
            {mine.filter((b) => b.mode !== "ink").map((b, j) => bar(b, q, j))}
            <Img src={asset(src)} style={{ position: "absolute", left: -x0, top: -q.y0, width: cssW, height: cssH, mixBlendMode: "multiply", filter: imgFilter }} />
            {mine.filter((b) => b.mode === "white").map((b, j) => {
              // white re-ink: an inverted copy of the page, clipped to the wiped bar, screened over it: white paper -> black (no change on red),
              // black text -> white. Same wipe width as the bar.
              const px = b.px ?? 3, py = b.py ?? 2, L = b.r[0] - x0 - px, T = b.r[1] - q.y0 - py;
              return (
                <div key={200 + j} style={{ position: "absolute", left: L, top: T, width: (b.r[2] + 2 * px) * clamp01(b.p), height: b.r[3] + 2 * py, overflow: "hidden", mixBlendMode: "screen" }}>
                  <Img src={asset(src)} style={{ position: "absolute", left: -x0 - L, top: -q.y0 - T, width: cssW, height: cssH, filter: "grayscale(1) invert(1) contrast(1.6)" }} />
                </div>
              );
            })}
            {mine.filter((b) => b.mode === "ink").map((b, j) => bar(b, q, 100 + j))}
          </div>
        );
      })}
      {children}
    </div>
  );
};
/** virtual y of a page y under a slice layout */
export const vY = (y: number, slices?: Slice[]) => {
  for (const q of slices ?? []) if (y >= q.y0 && y < q.y1) return q.vy + (y - q.y0);
  return y;
};

// ---------------------------------------------------------------- entries (frame 0 = first frame of the page)
export type Entry = "cut" | "flash" | "flashStreak" | "whiteFrame" | "fade" | "glitch";
// D3 F1 flash-streak, incoming half (transition/FlashStreak recipe I4 from the cut on): bloom .9 .9 .3 .3 .55 .95 .95 .9 .55 .2 + streak bars
const FS_OVER = [0.9, 0.9, 0.3, 0.3, 0.55, 0.8, 0.7, 0.5, 0.3, 0.12];
const FS_BARS = [1, 1, 0.55, 0.4, 0.5, 0.6, 0.5, 0.35, 0.2, 0.08];
const GL_AMP = [60, 63, 0, 30, 0]; // VV §10 incoming bands (wp3 sec_A TtPage)
/** wraps a page scene with its entry. Keep it OUTSIDE MBlur (integer frames). `fadeDur` for "fade" (Farrell EN2 1.0-1.5 s ease-out). */
export const Entered: React.FC<{ entry?: Entry; fadeDur?: number; seed?: number; children: React.ReactNode }> = ({ entry = "cut", fadeDur = 24, seed = 5, children }) => {
  const f = useCurrentFrame();
  const k = Math.floor(f);
  if (entry === "glitch" && k >= 0 && k < GL_AMP.length && GL_AMP[k] > 0) {
    const r = rng(9100 + seed * 31 + k);
    const n = 14;
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        {Array.from({ length: n }, (_, i) => {
          const big = r() < 0.08;
          const dx = (r() - 0.5) * 2 * GL_AMP[k] * (big ? 6 : 1);
          return (
            <AbsoluteFill key={i} style={{ clipPath: `inset(${(i * 100) / n}% 0 ${100 - ((i + 1) * 100) / n}% 0)`, transform: `translateX(${dx.toFixed(1)}px)${big ? " scaleX(1.6)" : ""}` }}>{children}</AbsoluteFill>
          );
        })}
      </AbsoluteFill>
    );
  }
  let white = 0, bars = 0, op = 1;
  if (entry === "flash") white = envAt(FLASH4, k);
  else if (entry === "whiteFrame") white = k === 0 ? 0.92 : 0;
  else if (entry === "flashStreak") { white = k >= 0 && k < FS_OVER.length ? FS_OVER[k] : 0; bars = k >= 0 && k < FS_BARS.length ? FS_BARS[k] : 0; }
  else if (entry === "fade") op = Easing.out(Easing.quad)(clamp01(f / fadeDur));
  const r = rng(seed * 131 + (k + 10) * 17);
  const sb = bars > 0 ? Array.from({ length: 3 + (k <= 1 ? 3 : 0) }, () => ({ y: 120 + r() * 840, h: 10 + r() * 18, x: -300 + r() * 500, w: 1300 + r() * 1300 })) : [];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>
      {white > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: white }} /> : null}
      {sb.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: Math.min(b.w, W + 400), height: b.h, background: "#fff", opacity: bars, filter: "blur(5px)",
          boxShadow: "0 0 70px 26px rgba(255,255,255,.6)", borderRadius: b.h }} />
      ))}
    </AbsoluteFill>
  );
};
/** sfx hint for an entry (sfx.json event names) */
export const entrySfx = (e: Entry | undefined) =>
  e === "flash" ? [{ event: "white_flash_hit", at: 0, note: "anchor = first white frame" }]
    : e === "flashStreak" ? [{ event: "transition_whoosh", at: 0, note: "anchor = first full-white frame" }]
      : e === "glitch" ? [{ event: "glitch", at: 0, note: "anchor = first glitch frame" }] : [];

// ---------------------------------------------------------------- D3 I13 boxed caption (typed translation): Nunito 700, cap 40, white on #000
export type CaptionLine = { text: string; at: number; until?: number };
/** Typed on at `cpf` characters per frame (Farrell T9 29-38 c/s ~ 1.0-1.3 c/f), held until the next line (or `until`). */
export const TypedCaption: React.FC<{ lines?: CaptionLine[]; cpf?: number; y?: number; cap?: number; maxW?: number; end?: number }> = ({ lines, cpf = 1.25, y = 0.88 * H, cap = 40, maxW = 1500, end }) => {
  const f = useCurrentFrame();
  if (!lines?.length) return null;
  let txt = "";
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const nx = l.until ?? (i + 1 < lines.length ? lines[i + 1].at : end ?? Infinity);
    if (f >= l.at && f < nx) txt = l.text.slice(0, Math.min(l.text.length, Math.ceil((Math.floor(f) - l.at + 1) * cpf)));
  }
  if (!txt) return null;
  const size = fs("nunito", cap);
  return (
    <div style={{ position: "absolute", left: (W - maxW) / 2, width: maxW, top: y - size * 0.95, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#000", padding: `${Math.round(size * 0.16)}px ${Math.round(size * 0.36)}px`, fontFamily: FONT.nunito, fontWeight: 700, fontSize: size, lineHeight: 1.18, color: "#fff", textAlign: "center", whiteSpace: "pre-wrap" }}>
        {txt}
      </div>
    </div>
  );
};
export const typingSfx = (lines?: CaptionLine[]) => (lines ?? []).map((l) => ({ event: "typing_key", at: l.at, note: `typed caption "${l.text.slice(0, 18)}…" (one key per glyph step)` }));

/** M-024 white re-ink for hand-rolled DD red bars: place it right AFTER the multiplied page <Img> in the same container.
 *  (ix, iy) = where the page image's top-left sits in that container; px/py = the bar padding used by the variant. */
export const WhiteInk: React.FC<{ bars: Bar[]; src: string; cssW: number; cssH: number; ix: number; iy: number; px?: number; py?: number }> = ({ bars, src, cssW, cssH, ix, iy, px = 3, py = 3 }) => (
  <>
    {bars.filter((b) => b.p > 0).map((b, i) => {
      const L = b.r[0] + ix - px, T = b.r[1] + iy - py;
      return (
        <div key={`wi${i}`} style={{ position: "absolute", left: L, top: T, width: (b.r[2] + 2 * px) * clamp01(b.p), height: b.r[3] + 2 * py, overflow: "hidden", mixBlendMode: "screen" }}>
          <Img src={asset(src)} style={{ position: "absolute", left: ix - L, top: iy - T, width: cssW, height: cssH, filter: "grayscale(1) invert(1) contrast(1.6)" }} />
        </div>
      );
    })}
  </>
);
