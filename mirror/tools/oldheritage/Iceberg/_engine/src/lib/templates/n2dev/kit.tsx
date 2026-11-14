// n2dev = the algrow-2 channel DEVICE PACK (2026-10-26, PEAK_V5 "Non-Blender devices from the references").
// Shared look for every device: the approved Case 1 v4 (Disasters2/remotion/src/d2/c01): ice-cyan accent, JetBrains Mono HUD type,
// Courier Prime typewriter, translucent navy boxes with thin L-brackets, cold grade, eased sub-pixel motion (translate3d/scale3d).
// Rules (asserted at render): every device has a min/max duration (DEV_MIN); entries/exits >= 6 f; no 1-frame states; no red, no circles
// round people (look-here), amber ONLY for the year / the active marker.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { FONT, clamp01, lerp } from "../../core";
import { EI } from "../iceberg/ic";
import { ColdGrade } from "../n2/n2";

export { EI };
export const FPS = 30;
// ---------------------------------------------------------------- palette (n2 channel: ice + ice-cyan accent + amber for years/markers)
export const K = { // ICEBERG CHANNEL identity (owner 2 Nov 2026: a different channel from algrow-2 -> its own colours/type)
  ice: "#EEE8DC", // bone (main text)
  frost: "#9A9488", // ash (secondary text)
  cyan: "#E5322D", // signal red: the device accent (lines, markers, brackets)
  cyanDim: "rgba(229,50,45,.4)",
  cyanGlow: "drop-shadow(0 0 3px rgba(229,50,45,.45)) drop-shadow(0 0 10px rgba(229,50,45,.18))",
  box: "rgba(10,10,11,.62)",
  boxSolid: "#0E0E10",
  navy: "#0B0B0C",
  abyss: "#060607",
  amber: "#E5322D",
  shadow: "0 2px 10px rgba(0,0,0,.7)",
} as const;
export const mono = (px: number, w = 500, ls = 0.14): React.CSSProperties => ({ fontFamily: FONT.mono, fontWeight: w, fontSize: px, letterSpacing: `${ls}em`, whiteSpace: "pre" });
export const typew = (px: number, ls = 0.04): React.CSSProperties => ({ fontFamily: FONT.courier, fontWeight: 700, fontSize: px, letterSpacing: `${ls}em`, whiteSpace: "pre" });
export const wide = (px: number, _w = 560, _wd = 100, ls = 0.28): React.CSSProperties => ({ fontFamily: FONT.vcr, fontWeight: 400, fontSize: px, textTransform: "uppercase", letterSpacing: `${Math.min(ls, 0.18)}em`, whiteSpace: "pre" }); // channel: VCR OSD labels
export const cond = (px: number, _w = 800): React.CSSProperties => ({ fontFamily: FONT.dinCond, fontWeight: 700, fontSize: px, textTransform: "uppercase", lineHeight: 0.98, whiteSpace: "pre" }); // channel: D-DIN Condensed titles
export const sans = (px: number, w = 300, ls = 0.02): React.CSSProperties => ({ fontFamily: FONT.inter, fontWeight: w, fontSize: px, letterSpacing: `${ls}em` });

// ---------------------------------------------------------------- timing rules
export const DEV_MIN: Record<string, { min: number; max: number }> = {
  HudBracket: { min: 60, max: 240 }, DimBracket: { min: 60, max: 240 }, DataBox: { min: 75, max: 270 }, RadioHud: { min: 90, max: 600 },
  EngravedDate: { min: 75, max: 210 }, LoupeGlide: { min: 105, max: 300 }, RadarRings: { min: 75, max: 300 }, Flashback: { min: 90, max: 300 },
  MapPull: { min: 105, max: 270 }, CrtWindow: { min: 90, max: 300 }, Highlighter: { min: 75, max: 240 }, FilmInset: { min: 90, max: 360 },
  WireHit: { min: 12, max: 24 }, Datamosh: { min: 12, max: 30 }, FreezeReplay: { min: 105, max: 330 }, SpeakerBox: { min: 45, max: 600 },
  TiltPhoto: { min: 90, max: 270 }, LineMap: { min: 90, max: 300 }, ArchivePush: { min: 90, max: 300 }, BuildOnWords: { min: 75, max: 300 },
  CountUp: { min: 66, max: 240 }, IconGrid: { min: 90, max: 270 }, YearScroll: { min: 75, max: 240 }, RulerTicker: { min: 90, max: 300 },
  DayStrip: { min: 90, max: 270 }, Cutaway: { min: 105, max: 330 }, ExplodedPart: { min: 90, max: 300 }, ScaleCompare: { min: 90, max: 270 },
  StructureSection: { min: 90, max: 300 }, RollUp: { min: 66, max: 210 }, RecedeNumber: { min: 66, max: 210 }, ClockSweep: { min: 75, max: 240 },
  PostCard: { min: 90, max: 300 }, CommentStack: { min: 105, max: 330 }, WatchPage: { min: 90, max: 300 }, NameWindow: { min: 75, max: 240 },
};
export const assertDev = (name: string, dur: number, extra?: () => string | null) => {
  const t = DEV_MIN[name];
  if (!t) throw new Error(`n2dev: no timing for ${name}`);
  if (dur < t.min || dur > t.max) throw new Error(`n2dev: ${name} lasts ${dur} f, allowed ${t.min}-${t.max} f`);
  const e = extra?.(); if (e) throw new Error(`n2dev: ${name}: ${e}`);
};
/** eased in/out envelope: 0 before, 1 held, 0 after (inF/outF >= 6 f: no pops) */
export const envIO = (f: number, dur: number, inF = 10, outF = 10, start = 0) => {
  const a = Math.max(6, inF), b = Math.max(6, outF);
  return Math.min(EI.cam((f - start) / a), EI.cam((dur - f) / b));
};

// ---------------------------------------------------------------- tracking: keyframed position (frame space 1920 x 1080), Catmull-Rom between keys
export type TK = { f: number; x: number; y: number; s?: number };
export type XY = { x: number; y: number };
export const trackAt = (keys: TK[], f: number): XY & { s: number } => {
  const k = [...keys].sort((a, b) => a.f - b.f);
  if (k.length === 0) return { x: 960, y: 540, s: 1 };
  if (f <= k[0].f || k.length === 1) return { x: k[0].x, y: k[0].y, s: k[0].s ?? 1 };
  if (f >= k[k.length - 1].f) { const l = k[k.length - 1]; return { x: l.x, y: l.y, s: l.s ?? 1 }; }
  let i = 0; while (i < k.length - 2 && f > k[i + 1].f) i++;
  const p0 = k[Math.max(0, i - 1)], p1 = k[i], p2 = k[i + 1], p3 = k[Math.min(k.length - 1, i + 2)];
  const u = (f - p1.f) / Math.max(1e-6, p2.f - p1.f);
  const cr = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
  return { x: cr(p0.x, p1.x, p2.x, p3.x), y: cr(p0.y, p1.y, p2.y, p3.y), s: lerp(p1.s ?? 1, p2.s ?? 1, u) };
};
/** fixed point helper: a TK list from one point */
export const fixed = (x: number, y: number): TK[] => [{ f: 0, x, y }];

// ---------------------------------------------------------------- the plate: optional source picture under the device (graded, linear push)
export type PlateP = { src?: string; from?: number; push?: number; focus?: [number, number]; grade?: boolean; dim?: number; blur?: number; s0?: number };
const isVid = (s: string) => /\.(mp4|mov|webm|mkv)$/i.test(s);
/** frame-space -> screen mapping of the plate's push (overlays track the picture without being scaled themselves) */
export const plateScale = (f: number, p: PlateP) => (p.s0 ?? 1.02) + (p.push ?? 0.018) * (f / FPS);
export const plateMap = (f: number, p: PlateP, pt: XY): XY => {
  const s = plateScale(f, p), fx = (p.focus?.[0] ?? 0.5) * 1920, fy = (p.focus?.[1] ?? 0.5) * 1080;
  return { x: fx + (pt.x - fx) * s, y: fy + (pt.y - fy) * s };
};
export const Pic: React.FC<{ src: string; from?: number; style?: React.CSSProperties; rate?: number; freeze?: boolean }> = ({ src, from = 0, style, rate }) =>
  isVid(src) ? <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * FPS)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />
    : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
export const Plate: React.FC<PlateP> = (p) => {
  const f = useCurrentFrame();
  if (!p.src) return <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 50% 45%, #0A1E2E 0%, ${K.navy} 55%, ${K.abyss} 100%)` }} />;
  const s = plateScale(f, p);
  const pic = (
    <AbsoluteFill style={{ willChange: "transform", transform: `scale3d(${s.toFixed(5)}, ${s.toFixed(5)}, 1)`, transformOrigin: `${(p.focus?.[0] ?? 0.5) * 100}% ${(p.focus?.[1] ?? 0.5) * 100}%`, filter: p.blur ? `blur(${p.blur}px)` : undefined }}>
      <Pic src={p.src} from={p.from} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {p.grade === false ? pic : <ColdGrade>{pic}</ColdGrade>}
      {p.dim ? <AbsoluteFill style={{ background: K.abyss, opacity: p.dim }} /> : null}
    </AbsoluteFill>
  );
};
/** tiny source credit, bottom-left (Fern #28 / LEMMiNO) */
export const Credit: React.FC<{ text?: string; o?: number }> = ({ text, o = 1 }) => text ? (
  <div style={{ position: "absolute", left: 44, bottom: 30, ...sans(16, 400, 0.04), color: "rgba(220,226,230,.62)", opacity: o }}>{text}</div>
) : null;

// ---------------------------------------------------------------- typing
/** characters shown at frame f for a string typed from `at` at `cps` chars/s, untyped from `end - outLen` (if end given) */
export const typedN = (f: number, len: number, at: number, cps = 26, end?: number, outF = 12) => {
  const tin = Math.floor(((f - at) * cps) / FPS);
  let n = Math.max(0, Math.min(len, tin));
  if (end !== undefined && f > end - outF) n = Math.min(n, Math.round(len * clamp01((end - f) / outF)));
  return n;
};
/** layout-stable typed text (the untyped rest is invisible), optional underscore caret */
export const Typed: React.FC<{ text: string; n: number; caret?: boolean; style?: React.CSSProperties; caretColor?: string }> = ({ text, n, caret, style, caretColor }) => {
  const f = useCurrentFrame();
  const on = caret && n < text.length && n > 0 && Math.floor(f / 8) % 2 === 0;
  return <span style={{ whiteSpace: "pre", ...style }}>{text.slice(0, n)}<span style={{ color: caretColor ?? "inherit", opacity: on ? 1 : 0 }}>_</span><span style={{ visibility: "hidden" }}>{text.slice(n)}</span></span>;
};

// ---------------------------------------------------------------- brackets + box + leader
/** two thin L-brackets (top-left + bottom-right, Fern #01 / approved HudLabel_C1). g = 0..1 arm growth. */
export const Brackets: React.FC<{ g: number; arm?: number; t?: number; colour?: string; all?: boolean }> = ({ g, arm = 26, t = 2.5, colour = "rgba(244,247,247,.92)", all }) => {
  const a = arm * EI.quick(g);
  const L = (s: React.CSSProperties) => <div style={{ position: "absolute", background: colour, ...s }} />;
  return (
    <>
      {L({ left: 0, top: 0, width: a, height: t })}{L({ left: 0, top: 0, width: t, height: a })}
      {L({ right: 0, bottom: 0, width: a, height: t })}{L({ right: 0, bottom: 0, width: t, height: a })}
      {all && <>{L({ right: 0, top: 0, width: a, height: t })}{L({ right: 0, top: 0, width: t, height: a })}{L({ left: 0, bottom: 0, width: a, height: t })}{L({ left: 0, bottom: 0, width: t, height: a })}</>}
    </>
  );
};
/** HUD box: translucent navy + backdrop blur + brackets; opens with a 6-8 f scale/fade (never a pop) */
export const HudBox: React.FC<{ o: number; children: React.ReactNode; pad?: string; style?: React.CSSProperties; all?: boolean; solid?: boolean }> = ({ o, children, pad = "18px 30px 20px", style, all, solid }) => (
  <div style={{ position: "relative", padding: pad, background: solid ? K.boxSolid : K.box, backdropFilter: solid ? undefined : "blur(6px)", opacity: clamp01(o * 1.4), transform: `scale(${lerp(0.97, 1, EI.quick(o)).toFixed(4)})`, transformOrigin: "0 50%", ...style }}>
    <Brackets g={o} all={all} />
    {children}
  </div>
);
/** SVG overlay sized to the frame */
export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>{children}</svg>
);
/** a drawn line (0..1 progress) */
export const DrawLine: React.FC<{ a: XY; b: XY; p: number; colour?: string; w?: number; dash?: string }> = ({ a, b, p, colour = K.cyan, w = 2, dash }) => {
  const x = lerp(a.x, b.x, clamp01(p)), y = lerp(a.y, b.y, clamp01(p));
  return p <= 0 ? null : <line x1={a.x} y1={a.y} x2={x} y2={y} stroke={colour} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />;
};
/** small anchor marker on the object: a cross-hair dot (no circle round a person) */
export const Anchor: React.FC<{ p: XY; o: number; colour?: string }> = ({ p, o, colour = K.cyan }) => (
  <g opacity={o}>
    <rect x={p.x - 4} y={p.y - 4} width={8} height={8} fill={colour} />
    <path d={`M${p.x - 16} ${p.y}h7M${p.x + 9} ${p.y}h7M${p.x} ${p.y - 16}v7M${p.x} ${p.y + 9}v7`} stroke={colour} strokeWidth={2} />
  </g>
);

// ---------------------------------------------------------------- data loading (geo paths for line maps)
export const useJson = <T,>(src?: string): T | null => {
  const [d, setD] = React.useState<T | null>(null);
  const [h] = React.useState(() => (src ? delayRender(`n2dev json ${src}`) : null));
  React.useEffect(() => {
    if (!src) return;
    fetch(staticFile(src)).then((r) => r.json()).then((j) => { setD(j); if (h !== null) continueRender(h); }).catch(() => { if (h !== null) continueRender(h); });
  }, [src, h]);
  return d;
};
/** every path string inside a json (any shape) + its numeric bounds (absolute M/L coords) */
export const geoPaths = (j: unknown): { paths: string[]; box: [number, number, number, number] } => {
  const out: string[] = [];
  const walk = (v: unknown) => { if (typeof v === "string" && /^M/.test(v)) out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
  walk(j);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  out.forEach((d) => { const n = d.match(/-?\d+(\.\d+)?/g) ?? []; for (let i = 0; i + 1 < n.length; i += 2) { const x = +n[i], y = +n[i + 1]; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } });
  return { paths: out, box: [x0, y0, x1 - x0, y1 - y0] };
};
export const rnd = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
