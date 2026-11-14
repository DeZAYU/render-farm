// PROMOTED to core (was src/templates/labels/kit.tsx); shared by several families. Import as "../../core/kits/labels".
// Shared "DD kit" for the dd-owned families (labels, caseopener, lookhere, stat, footage). Candidates for src/core (see the builder report).
// Everything takes LOCAL frames and is safe with fractional frames (CameraMotionBlur sub-frames): counts use Math.floor on derived values only.
import React from "react";
import { AbsoluteFill, Freeze, Sequence, useCurrentFrame } from "remotion";
import { CAP, EZ, FONT, H, Media, RC, RoundText, Vignette, W, clamp01, isVideo, lerp, linPush, measure, roundWidth } from "../index";
import { FreshLayer } from "../media";

/** a word placed on its spoken frame (local) */
export type Word = { text: string; at: number; red?: boolean };
/** a tracked key (source-frame px of the 1920x1080 media, before any push), r optional */
export type TrackKey = { f: number; x: number; y: number; r?: number };

/** linear interpolation through track keys (fractional f ok) */
export const trackAt = (keys: TrackKey[], f: number): { x: number; y: number; r: number } => {
  if (!keys.length) return { x: W / 2, y: H / 2, r: 100 };
  const r0 = (k: TrackKey) => k.r ?? keys.find((q) => q.r !== undefined)?.r ?? 100;
  if (f <= keys[0].f) return { x: keys[0].x, y: keys[0].y, r: r0(keys[0]) };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const u = (f - a.f) / Math.max(1e-6, b.f - a.f);
      return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), r: lerp(r0(a), r0(b), u) };
    }
  }
  const z = keys[keys.length - 1];
  return { x: z.x, y: z.y, r: r0(z) };
};

/** screen position of a source point under a centre-anchored scale s (origin in px) */
export const scr = (p: { x: number; y: number }, s: number, ox = W / 2, oy = H / 2) => ({ x: ox + (p.x - ox) * s, y: oy + (p.y - oy) * s });

/** footage / photo plate: the Dashcam linear push (never eased), its clock starting at `from` (local). `freezeAt` (local) holds that exact frame
 *  from then on (until `resumeAt`, after which the clip continues from the next source frame: a hard continue). */
export const FootPlate: React.FC<{
  src: string; from?: number; startFrom?: number; push?: number; base?: number; origin?: string; filter?: string; vignette?: boolean;
  freezeAt?: number; resumeAt?: number; style?: React.CSSProperties; children?: React.ReactNode;
}> = ({ src, from = 0, startFrom = 0, push = 0.045, base = 1, origin = "50% 50%", filter, vignette = true, freezeAt, resumeAt, style, children }) => {
  const f = useCurrentFrame();
  const vid = isVideo(src);
  const frozen = vid && freezeAt !== undefined && f >= freezeAt && (resumeAt === undefined || f < resumeAt);
  const resumed = vid && freezeAt !== undefined && resumeAt !== undefined && f >= resumeAt;
  const sc = base * linPush(f - from, push);
  let layer: React.ReactNode;
  if (!vid) layer = <Media src={src} />;
  else if (frozen) layer = <Freeze frame={Math.round(freezeAt! - from)}><Media src={src} startFrom={startFrom} /></Freeze>;
  else if (resumed) layer = <Sequence from={resumeAt} layout="none"><Media src={src} startFrom={startFrom + Math.round(freezeAt! - from) + 1} /></Sequence>;
  else layer = <Sequence from={from} layout="none"><Media src={src} startFrom={startFrom} /></Sequence>;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000", ...style }}>
      <AbsoluteFill style={{ transform: `scale(${sc.toFixed(5)})`, transformOrigin: origin, filter }}>{layer}</AbsoluteFill>
      {vignette ? <Vignette /> : null}
      {children}
    </AbsoluteFill>
  );
};

/** just the media node (no transform): plays from `from`; frozen on local `freezeAt` until `resumeAt`, then a hard continue */
export const ClipLayer: React.FC<{ src: string; from?: number; startFrom?: number; freezeAt?: number; resumeAt?: number }> = ({ src, from = 0, startFrom = 0, freezeAt, resumeAt }) => {
  const f = useCurrentFrame();
  if (!isVideo(src)) return <Media src={src} />;
  const fr = freezeAt === undefined ? 0 : Math.round(freezeAt - from);
  if (freezeAt !== undefined && f >= freezeAt && (resumeAt === undefined || f < resumeAt)) return <Freeze frame={fr}><Media src={src} startFrom={startFrom} /></Freeze>;
  if (freezeAt !== undefined && resumeAt !== undefined && f >= resumeAt) return <Sequence from={resumeAt} layout="none"><Media src={src} startFrom={startFrom + fr + 1} /></Sequence>;
  return <Sequence from={from} layout="none"><Media src={src} startFrom={startFrom} /></Sequence>;
};

// ---------------------------------------------------------------- DD word-rise (Dashcam Vol.3 E2, measured: refsys DDLabel)
/** per-word state k frames after its onset. white: rise 19 px ease-out over 26 f, alpha 0 -> .9 in 16 f -> 1; red: defocused -> sharp in 10 f,
 *  rise 22 px, alpha .2 -> .95 in 10 f. After the settle a slow life drift continues (D2 E2: keeps rising, decelerating). */
export const wordRise = (k: number, red?: boolean) => {
  if (k < 0) return { o: 0, y: 0, b: 0 };
  const rise = (red ? 22 : 19) * (1 - EZ.out3(k / 26)) - 5 * (1 - Math.exp(-k / 60));
  const o = red ? 0.2 + 0.75 * EZ.out2(k / 10) + 0.05 * clamp01((k - 10) / 10) : 0.9 * EZ.out2(k / 16) + 0.1 * clamp01((k - 16) / 10);
  const b = red ? 8 * (1 - clamp01(k / 10)) : 0;
  return { o, y: rise, b };
};
/** D3 E2 exit: 20 f ease-in fade + slight blur (u = 0..1) */
export const exitU = (f: number, at: number | undefined, d = 20) => (at === undefined ? 0 : clamp01((f - at) / d));

export const SH_WHITE = "drop-shadow(0 4px 8px rgba(0,0,0,.6))";
export const glowRed = (c = RC.placeRed, a = 0.75) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  return `drop-shadow(0 0 6px rgba(${r},${g},${b},${a})) drop-shadow(0 0 16px rgba(${r},${g},${b},${(a * 0.6).toFixed(2)})) drop-shadow(0 3px 6px rgba(0,0,0,.45))`;
};

/** a row of DD words (Varela Round + round stroke) that rise in on their frames. align: centre on cx, or left edge at x. */
export const RiseRow: React.FC<{
  words: Word[]; cap: number; y: number; cx?: number; x?: number; align?: "center" | "left"; exitAt?: number; red?: string; white?: string;
  rise?: (k: number, red?: boolean) => { o: number; y: number; b: number };
}> = ({ words, cap, y, cx = W / 2, x = 0, align = "center", exitAt, red = RC.placeRed, white = "#FDFDFD", rise = wordRise }) => {
  const f = useCurrentFrame();
  const sw = 0.076 * cap;
  const space = measure(" ", `${(cap - sw) / CAP.round}px "${FONT.round}"`) * 0.9;
  const ex = exitU(f, exitAt);
  if (ex >= 1) return null;
  const total = words.reduce((a, w) => a + roundWidth(w.text, cap), 0) + space * (words.length - 1);
  const left = align === "center" ? cx - total / 2 : x;
  return (
    <FreshLayer><div style={{ position: "absolute", left, top: y, transform: "translateY(-62%)", display: "flex", gap: space, opacity: 1 - ex * ex, filter: ex > 0 ? `blur(${(3 * ex).toFixed(2)}px)` : undefined }}>
      {words.map((w, i) => {
        const s = rise(f - w.at, w.red);
        return (
          <div key={i} style={{ opacity: s.o, transform: `translateY(${s.y.toFixed(2)}px)`, filter: `${w.red ? glowRed(red) : SH_WHITE}${s.b > 0.05 ? ` blur(${s.b.toFixed(2)}px)` : ""}` }}>
            <RoundText text={w.text} cap={cap} colour={w.red ? red : white} />
          </div>
        );
      })}
    </div></FreshLayer>
  );
};

// ---------------------------------------------------------------- typing (D1 E4 "MONDAY - 4:30 PM", "40 minutes": per character, ~2 f/char)
/** number of characters of `text` shown k frames after its start at `step` f per character */
export const typedN = (text: string, k: number, step = 2) => (k < 0 ? 0 : Math.min(text.length, Math.floor(k / step) + 1));
/** a typed word list: each word types from its own `at` at `step` f/char (spaces come with the next word) */
export const typedWords = (words: Word[], f: number, step = 2) => words.map((w) => ({ ...w, shown: w.text.slice(0, typedN(w.text, f - w.at, step)) }));

/** the DD case number glyph (Dashcam Vol.3 E1, FONTS.md): Nunito 900, footed 1, vertical gradient #D61E18 -> #870608 (core #B81209).
 *  `glyph` = glyph height in px (168 = D3 corner). Centred on (x, y). `glow` adds the D1 red outer glow (0..1). */
export const CaseGlyph: React.FC<{ text: string; glyph: number; x: number; y: number; opacity?: number; glow?: number; blur?: number; style?: React.CSSProperties; gloss?: number }> = ({
  text, glyph, x, y, opacity = 1, glow = 0, blur = 0, style, gloss = 0,
}) => {
  const fsz = glyph / 0.714;
  const sh = `drop-shadow(0 ${(glyph * 0.018).toFixed(1)}px ${(glyph * 0.036).toFixed(1)}px rgba(40,10,15,.8))`;
  const gl = glow > 0 ? ` drop-shadow(0 0 ${(glyph * 0.06).toFixed(1)}px rgba(235,24,25,${(0.65 * glow).toFixed(2)})) drop-shadow(0 0 ${(glyph * 0.16).toFixed(1)}px rgba(200,10,14,${(0.35 * glow).toFixed(2)}))` : "";
  const grad = gloss > 0
    ? `linear-gradient(rgba(255,150,140,${gloss}) 8%, rgba(214,30,24,1) 34%, #B81209 58%, #870608 86%)`
    : "linear-gradient(#D61E18 20%, #B81209 55%, #870608 85%)";
  return (
    <FreshLayer>
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", opacity, filter: `${sh}${gl}${blur > 0.05 ? ` blur(${blur.toFixed(2)}px)` : ""}`, ...style }}>
      <span style={{ display: "block", fontFamily: FONT.nunito, fontWeight: 900, fontSize: fsz, lineHeight: 1, whiteSpace: "nowrap", background: grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{text}</span>
    </div></FreshLayer>
  );
};
/** D3 E1 corner position (0.869 W, 0.190 H) and glyph 168 px */
export const CORNER = { x: 0.869 * W, y: 0.19 * H, glyph: 168 };
