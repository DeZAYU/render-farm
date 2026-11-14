// IC3 = the iceberg family rebuilt on Abyssal Detective's grammar (Disasters2/ICEBERG_SPEC_ABYSSAL.md, owner v3 change list 2026-10-26).
// The iceberg is a DEPTH METAPHOR: one photoreal Blender berg (Disasters2/art/src/build_cine.py + comp_cine.py -> public/ic3/*), and the
// camera's position on it says how deep we are: L1-2 on the tip, L3 at the waterline, L4+ under the water, darker each level.
//   WarningCard_IC3 · Presents_IC3 · ChartIntro_IC3 (once, ~3 s, static) · LevelCard_IC3 (black -> wide berg -> typed "Level N" on the
//   waterline -> fast push-in with zoom blur -> lands on the depth close-up) · EntryCard_IC3 (black -> depth close-up, slow drift ->
//   glowing ice-cyan title glitch-types in -> hold; the exit is a GlitchCuts hand-off) · DateCard_IC3 · NameTag_IC3 · GlitchCuts_IC3
//   (designed multi-frame RGB-split/slice/pixel hand-off, never a 1-frame flash) · DreadGrade_IC3 (the channel's footage grade) ·
//   PageFocus_IC3 (the RARE full-frame page: tilted sheet, one active passage fully lit, the rest dimmed; the dim always follows the
//   active passage) · Map3D_IC3 (Blender flyover video + tracked labels).
// Every component asserts its minimum timing (rules_ic.ts IC3_MIN) so nothing can render cut off.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { FONT, clamp01, lerp } from "../../core";
import { EI } from "./ic";
import { assertIC3 } from "./rules_ic";
import type { ChartLevel } from "./ic";
import { ChartIntro_AB } from "./abyss";

// ---------------------------------------------------------------- tokens
export const IC3 = {
  cyan: "#A6F6FF", // entry-title ice cyan
  glow: "0 0 5px rgba(120,240,255,.95), 0 0 16px rgba(50,215,255,.70), 0 0 38px rgba(20,170,255,.40)",
  accent: "#FFB23F", // ONE channel accent (year on the date card, route/pin on maps, page underline)
  white: "#F4F7F7",
  shadow: "0 3px 14px rgba(0,0,0,.65), 0 0 2px rgba(0,0,0,.6)",
};
export type Plates = { wide: string; chart: string; tip: string; water: string; under: string[]; waterline: number; target: Record<string, [number, number]>;
  /** base framing of each close-up [zoom, originX, originY] (Abyssal: the tip close-up is a macro that fills the frame) */ frame?: Record<string, [number, number, number]> };
/** default plate set (Disasters2 public/ic3, from comp_cine.py; numbers = ic3/plates.json) */
export const PLATES_D2: Plates = {
  wide: "ic3/wide.jpg", chart: "ic3/chart.jpg", tip: "ic3/tip.jpg", water: "ic3/water.jpg",
  under: ["ic3/under1.jpg", "ic3/under2.jpg", "ic3/under3.jpg", "ic3/under4.jpg"], waterline: 0.324,
  frame: { tip: [1.6, 0.5, 0.8] },
  target: { "1": [0.5, 0.146], "2": [0.5, 0.202], "3": [0.5, 0.324], "4": [0.5, 0.458], "5": [0.5, 0.68], "6": [0.5, 0.86], "7": [0.5, 0.95] },
};
/** the depth close-up for a level: tip (1-2), waterline (3), under1..4 (4-7) */
export const closeFor = (p: Plates, level: number) => (level <= 2 ? p.tip : level === 3 ? p.water : p.under[Math.min(3, level - 4)]);
const closeKey = (level: number) => (level <= 2 ? "tip" : level === 3 ? "water" : `under${Math.min(4, level - 3)}`);
/** the depth close-up drawn with its base framing, times an extra scale `s` (drift / landing) */
const CloseImg: React.FC<{ p: Plates; level: number; s: number; tx?: number; filter?: string }> = ({ p, level, s, tx = 0, filter }) => {
  const [z, ox, oy] = p.frame?.[closeKey(level)] ?? [1, 0.5, 0.45];
  return <Img src={staticFile(closeFor(p, level))} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: `${ox * 100}% ${oy * 100}%`, transform: `translateX(${tx.toFixed(1)}px) scale(${(z * s).toFixed(4)})`, filter }} />;
};
const courier = (px: number): React.CSSProperties => ({ fontFamily: FONT.courier, fontWeight: 700, fontSize: px });
const wide = (px: number, w = 700): React.CSSProperties => ({ fontFamily: FONT.archivo, fontWeight: w, fontSize: px, fontStretch: "125%", fontVariationSettings: `'wdth' 125, 'wght' ${w}`, textTransform: "uppercase", letterSpacing: "0.08em" });
const rnd = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>=+0123456789";

// ---------------------------------------------------------------- footage grade (owner v3 #4: disturbing, cinematic, consistent)
/** desaturated, crushed, teal shadows / cold-cream highlights, animated fine grain, heavy soft vignette. Footage + maps; never on pages. */
export const DreadGrade_IC3: React.FC<{ children: React.ReactNode; strength?: number; grain?: number }> = ({ children, strength = 1, grain = 0.07 }) => {
  const f = useCurrentFrame();
  const id = `dg${f % 6}`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `saturate(${lerp(1, 0.58, strength)}) contrast(${lerp(1, 1.18, strength)}) brightness(${lerp(1, 0.9, strength)})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "#0C3A42", mixBlendMode: "soft-light", opacity: 0.55 * strength }} />
            <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 48%, rgba(0,5,8,0) 35%, rgba(0,5,8,.18) 62%, rgba(0,5,8,.42) 84%, rgba(0,5,8,.6) 100%)", opacity: strength }} />
      {grain > 0 && (
        <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: grain * 4 }}>
          <svg width="1920" height="1080"><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 97} /><feColorMatrix type="saturate" values="0" /></filter><rect width="1920" height="1080" filter={`url(#${id})`} opacity={0.5} /></svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- GlitchCuts_IC3: designed hand-offs (owner v3 #8: never 1-frame errors)
export type GlitchCut = { at: number; len?: number; amt?: number }; // frame of the cut, total frames (>= 5), strength 0..1
/** wraps the whole edit: around each cut the picture gets a symmetric multi-frame glitch (slice displacement + RGB split, pixel blocks
 *  at the peak). Envelope sin(pi*u) over `len` frames centred on the cut: no luminance flash, no single odd frame. */
export const GlitchCuts_IC3: React.FC<{ cuts: GlitchCut[]; children: React.ReactNode }> = ({ cuts, children }) => {
  const f = useCurrentFrame();
  let e = 0, amt = 1, at = 0;
  for (const c of cuts) {
    const len = c.len ?? 6; assertIC3("GlitchCut_IC3", len);
    const u = (f - (c.at - len / 2)) / len;
    if (u >= 0 && u <= 1) { const v = Math.sin(Math.PI * u); if (v > e) { e = v; amt = c.amt ?? 1; at = c.at; } }
  }
  if (e < 0.05) return <AbsoluteFill>{children}</AbsoluteFill>;
  const k = e * amt, id = `gc${at}_${f}`, dx = Math.round(24 * k), disp = Math.round(140 * k), blk = k > 0.55 ? Math.round(6 + 14 * (k - 0.55) / 0.45) * 2 : 0;
  const seed = Math.floor(f / 2) * 7 + at;
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.00002 0.035" numOctaves={1} seed={seed} result="t" />
          <feComponentTransfer in="t" result="tq"><feFuncR type="discrete" tableValues="0.5 0.5 0.1 0.5 0.9 0.5 0.3 0.5" /><feFuncG type="discrete" tableValues="0.5" /></feComponentTransfer>
          <feDisplacementMap in="SourceGraphic" in2="tq" scale={disp} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="d" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r" />
          <feOffset in="r" dx={dx} result="ro" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b" />
          <feOffset in="b" dx={-dx} result="bo" />
          <feBlend in="ro" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bo" mode="screen" result="rgb" />
          {blk > 0 && (<>
            <feFlood x={blk / 2} y={blk / 2} width="1" height="1" floodColor="#fff" result="fl" />
            <feComposite in="fl" width={blk} height={blk} result="cell" />
            <feTile in="cell" result="tile" />
            <feComposite in="rgb" in2="tile" operator="in" result="pts" />
            <feMorphology in="pts" operator="dilate" radius={blk / 2} />
          </>)}
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- glitch-typed glowing title (entry cards, presents)
const GlitchType: React.FC<{ lines: string[]; f: number; start: number; dur?: number; px?: number; style?: React.CSSProperties }> = ({ lines, f, start, dur = 9, px = 58, style }) => {
  const t = f - start; if (t < 0) return null;
  const n = lines.join("").length;
  let k = 0;
  return (
    <div style={{ textAlign: "center", color: IC3.cyan, textShadow: IC3.glow, ...wide(px), lineHeight: 1.18, ...style }}>
      {lines.map((ln, li) => {
        const jit = t < dur ? (rnd(li * 31 + Math.floor(t / 2)) - 0.5) * 18 * (1 - t / dur) : 0;
        return (
          <div key={li} style={{ transform: `translateX(${jit.toFixed(1)}px)`, whiteSpace: "pre" }}>
            {[...ln].map((ch, ci) => {
              const idx = k++, settle = (rnd(idx * 7.7 + 3) * 0.8 + (idx / n) * 0.2) * dur, show = t >= settle * 0.35;
              const c = ch === " " ? " " : t >= settle ? ch : GL[Math.floor(rnd(idx * 13 + t) * GL.length)];
              return <span key={ci} style={{ opacity: show ? (t >= settle ? 1 : 0.7) : 0 }}>{c}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- WarningCard_IC3
export const WarningCard_IC3: React.FC<{ dur: number; lines?: string[] }> = ({ dur, lines = ["WARNING", "This video contains real footage of disasters", "and the moments right before them.", "Viewer discretion is advised."] }) => {
  const f = useCurrentFrame(); assertIC3("WarningCard_IC3", dur);
  const o = Math.min(EI.land((f - 4) / 12), 1 - EI.smooth((f - (dur - 12)) / 12));
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", opacity: clamp01(o) }}>
      <div style={{ ...courier(44), color: IC3.white, letterSpacing: "0.3em", marginBottom: 26 }}>{lines[0]}</div>
      {lines.slice(1).map((l, i) => <div key={i} style={{ ...courier(27), color: "rgba(244,247,247,.78)", lineHeight: 1.5 }}>{l}</div>)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Presents_IC3 ("<channel> presents", over footage)
export const Presents_IC3: React.FC<{ dur: number; title: string[]; sub?: string }> = ({ dur, title, sub = "presents" }) => {
  const f = useCurrentFrame(); assertIC3("Presents_IC3", dur);
  const out = 1 - EI.smooth((f - (dur - 10)) / 10);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 32% at 50% 50%, rgba(0,6,10,.55), rgba(0,0,0,0))" }} />
      <GlitchType lines={title} f={f} start={2} dur={10} px={50} />
      <div style={{ ...courier(26), color: "rgba(244,247,247,.85)", marginTop: 18, letterSpacing: "0.2em", opacity: clamp01((f - 12) / 8) }}>{sub}</div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ChartIntro_IC3 (Abyssal 0:12-0:15: static, dark photo, 7 thin bars, typed names, deeper ones blurred)
// v3 owner fix 2026-10-26 ("the iceberg doesn't have charting done"): ChartIntro_IC3 now renders the full CHARTED photoreal skull berg
// (ChartIntro_AB in abyss.tsx: 7 bands, 6 bars, typewriter names, deeper ones blurred). `insert` = the short version for the hook.
export const ChartIntro_IC3: React.FC<{ dur: number; levels: ChartLevel[]; clearLevels?: number; insert?: boolean; px?: number }> = ({ dur, levels, clearLevels = 2, insert, px }) =>
  <ChartIntro_AB dur={dur} levels={levels} blurFrom={clearLevels} insert={insert} px={px} />;

// ---------------------------------------------------------------- zoom-blurred plate (push-in with motion blur: ghost copies along the zoom)
const ZoomPlate: React.FC<{ src: string; s: number; ds: number; ox: number; oy: number; filter?: string; opacity?: number }> = ({ src, s, ds, ox, oy, filter, opacity = 1 }) => {
  const n = ds > 0.01 ? 6 : 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      {Array.from({ length: n }, (_, i) => {
        const si = s / (1 + (ds * i) / n);
        return <Img key={i} src={staticFile(src)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", transformOrigin: `${ox * 100}% ${oy * 100}%`, transform: `scale(${si})`, opacity: i === 0 ? 1 : 0.42, filter: `${filter ?? ""} ${ds > 0.01 ? `blur(${Math.min(10, ds * 9).toFixed(1)}px)` : ""}`, mixBlendMode: i === 0 ? undefined : "normal" }} />;
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- LevelCard_IC3
/** frames: black 0-24 · fade-up wide 24-39 (Level N types in on the waterline) · hold to 72 · push 72-83 (zoom blur, text flies past) ·
 *  lands on the level's depth close-up (ease-out) and drifts slowly until `dur` (the level VO plays over the landed close-up). */
export const LevelCard_IC3: React.FC<{ dur: number; level: number; plates?: Plates; label?: string }> = ({ dur, level, plates = PLATES_D2, label }) => {
  const f = useCurrentFrame(); assertIC3("LevelCard_IC3", dur);
  const [tx, ty] = plates.target[String(level)] ?? [0.5, 0.5];
  const P0 = 72, P1 = 83;
  const fade = EI.smooth((f - 24) / 15);
  const u = clamp01((f - P0) / (P1 - P0)), push = EI.flyIn(u);
  const sW = (1 + 0.012 * clamp01((f - 24) / 48)) * (1 + 3.4 * push);
  const dsW = f >= P0 && f < P1 + 1 ? 0.45 * Math.sin(Math.PI * Math.min(1, u * 1.1)) + 0.15 : 0;
  const text = label ?? `Level ${level}`, typed = text.slice(0, Math.max(0, Math.floor((f - 25) / 1.6)));
  const ts = 1 + 6 * push, to = 1 - EI.smooth((u - 0.35) / 0.6);
  const land = clamp01((f - (P1 - 4)) / 16), cs = lerp(1.32, 1.0, EI.land(land)) * (1 + 0.03 * clamp01((f - P1) / Math.max(1, dur - P1)));
  const cOp = EI.smooth((f - (P1 - 4)) / 5), cBlur = (1 - EI.land(land)) * 9;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {f < P1 + 2 && (
        <AbsoluteFill style={{ opacity: fade }}>
          <ZoomPlate src={plates.wide} s={sW} ds={dsW} ox={tx} oy={ty} />
          <div style={{ position: "absolute", left: 0, right: 0, top: plates.waterline * 1080 - 120, textAlign: "center", ...courier(300), color: IC3.white, textShadow: "0 6px 26px rgba(0,0,0,.55)",
            transformOrigin: `50% 160px`, transform: `scale(${ts})`, opacity: to, filter: push > 0.02 ? `blur(${(push * 16).toFixed(1)}px)` : undefined, whiteSpace: "pre" }}>{typed.padEnd(text.length, " ")}</div>
        </AbsoluteFill>
      )}
      {f >= P1 - 4 && (
        <AbsoluteFill style={{ opacity: cOp }}>
          <CloseImg p={plates} level={level} s={cs} filter={cBlur > 0.2 ? `blur(${cBlur.toFixed(1)}px)` : undefined} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- EntryCard_IC3
/** black 0-21 · fade-up 21-36 on the depth close-up with a slow drift · title glitch-types at 33 (0.3 s) · holds to `dur`. The hand-off
 *  into the footage is a GlitchCuts_IC3 cut at the card's last frame (placed by the edit). */
export const EntryCard_IC3: React.FC<{ dur: number; level: number; title: string[]; plates?: Plates; drift?: [number, number] }> = ({ dur, level, title, plates = PLATES_D2, drift = [1.07, 1.0] }) => {
  const f = useCurrentFrame(); assertIC3("EntryCard_IC3", dur);
  const fade = EI.smooth((f - 21) / 15), s = lerp(drift[0], drift[1], EI.smooth(f / dur));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fade }}>
        <CloseImg p={plates} level={level} s={s} tx={lerp(-12, 12, f / dur)} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 40% at 50% 32%, rgba(0,10,14,.35), rgba(0,0,0,0))" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0.27 * 1080 }}><GlitchType lines={title} f={f} start={33} dur={9} /></div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- DateCard_IC3 (typewriter, the year in the accent, typed in)
export const DateCard_IC3: React.FC<{ dur: number; date: string; year: string; start?: number; cps?: number }> = ({ dur, date, year, start = 4, cps = 16 }) => {
  const f = useCurrentFrame(); assertIC3("DateCard_IC3", dur);
  const full = date + year, n = Math.max(0, Math.min(full.length, Math.floor(((f - start) / 30) * cps)));
  const done = start + Math.ceil((full.length / cps) * 30);
  const o = 1 - EI.smooth((f - (dur - 12)) / 12), cur = f < done + 30 ? (Math.floor(f / 8) % 2 === 0 ? 1 : 0) : 0;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 46% 24% at 50% 50%, rgba(0,4,6,.62), rgba(0,0,0,0))" }} />
      <div style={{ ...courier(74), color: IC3.white, textShadow: IC3.shadow, letterSpacing: "0.04em", whiteSpace: "pre" }}>
        <span>{full.slice(0, Math.min(n, date.length))}</span>
        <span style={{ color: IC3.accent }}>{n > date.length ? full.slice(date.length, n) : ""}</span>
        <span style={{ display: "inline-block", width: 40, height: 64, marginLeft: 6, verticalAlign: -8, background: IC3.white, opacity: cur }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- NameTag_IC3 (tiny small caps, bottom-left, first time a person is on screen)
export const NameTag_IC3: React.FC<{ dur: number; name: string }> = ({ dur, name }) => {
  const f = useCurrentFrame(); assertIC3("NameTag_IC3", dur);
  const o = Math.min(EI.land(f / 10), 1 - EI.smooth((f - (dur - 10)) / 10));
  return (
    <div style={{ position: "absolute", left: 96, bottom: 104, opacity: o, transform: `translateY(${(1 - EI.land(f / 10)) * 8}px)` }}>
      <div style={{ width: 38, height: 2, background: IC3.accent, marginBottom: 10 }} />
      <div style={{ fontFamily: FONT.archivo, fontWeight: 600, fontSize: 28, fontVariant: "small-caps", letterSpacing: "0.14em", color: IC3.white, textShadow: IC3.shadow }}>{name.toLowerCase()}</div>
    </div>
  );
};

// ---------------------------------------------------------------- PageFocus_IC3 (RARE: at most one per case)
export type FocusSpan = { x0: number; y0: number; x1: number; y1: number; at: number; isolate?: boolean }; // image px, local frame it becomes active; isolate = ParallelPipes macro (the phrase alone on black, filling the frame)
/** a real page crop as a tilted sheet on black; the camera eases in; ONE active passage is fully lit, everything else dims and softens.
 *  The dim is computed every frame from the CURRENT active span only, eased between spans: no section stays dimmed once active (v2 bug). */
export const PageFocus_IC3: React.FC<{ dur: number; src: string; crop: [number, number, number, number]; spans: FocusSpan[] }> = ({ dur, src, crop, spans }) => {
  const f = useCurrentFrame(); assertIC3("PageFocus_IC3", dur);
  const [cx0, cy0, cx1, cy1] = crop, cw = cx1 - cx0, ch = cy1 - cy0, W = 1560, k = W / cw, H = ch * k;
  const enter = EI.land(f / 26), cam = EI.smooth(f / dur);
  let i = 0; spans.forEach((s, j) => { if (f >= s.at) i = j; });
  const prev = spans[Math.max(0, i - 1)], cur = spans[i], mv = i > 0 ? EI.cam((f - cur.at) / 12) : 1;
  const r = { x0: lerp(prev.x0, cur.x0, mv), y0: lerp(prev.y0, cur.y0, mv), x1: lerp(prev.x1, cur.x1, mv), y1: lerp(prev.y1, cur.y1, mv) };
  const dim = 0.62 * EI.smooth((f - (spans[0].at - 6)) / 10);
  const ul = EI.cam((f - cur.at - 4) / 14);
  // ParallelPipes macro: the camera flies into the active phrase, the tilt flattens and the page around it goes to black
  const iso = cur.isolate ? EI.cam((f - cur.at) / 14) : 0;
  const Z = Math.min(3.2, 1780 / ((cur.x1 - cur.x0) * k)), zc = lerp(1, Z, iso);
  const tx = lerp(0, W / 2 - ((cur.x0 + cur.x1) / 2 - cx0) * k, iso), ty = lerp(0, H / 2 - ((cur.y0 + cur.y1) / 2 - cy0) * k, iso);
  const drift = iso > 0 ? lerp(40, -40, clamp01((f - cur.at) / Math.max(1, dur - cur.at))) : 0;
  const dimA = lerp(dim, 1.0, iso);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, #10181b, #020405)", perspective: 1800 }}>
     <AbsoluteFill style={{ transform: `scale(${zc.toFixed(4)}) translate(${(tx + drift / zc).toFixed(1)}px, ${ty.toFixed(1)}px)` }}>
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: (1080 - H) / 2, width: W, height: H, transformStyle: "preserve-3d",
        transform: `translateY(${(1 - enter) * 120}px) rotateX(${lerp(lerp(14, 5, cam), 0, iso)}deg) rotateY(${lerp(lerp(-9, -3, cam), 0, iso)}deg) rotateZ(${lerp(lerp(-1.2, -0.4, cam), 0, iso)}deg) scale(${lerp(0.92, 1.04, cam)})`,
        opacity: enter, boxShadow: "0 40px 90px rgba(0,0,0,.75)" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff" }}>
          <Img src={staticFile(src)} style={{ position: "absolute", left: -cx0 * k, top: -cy0 * k, width: 2560 * k, filter: "contrast(1.05) saturate(0.85)" }} />
        </div>
        <div style={{ position: "absolute", left: (r.x0 - cx0) * k - 10, top: (r.y0 - cy0) * k - 6, width: (r.x1 - r.x0) * k + 20, height: (r.y1 - r.y0) * k + 12,
          boxShadow: `0 0 0 3000px rgba(4,7,9,${dimA.toFixed(3)})`, borderRadius: 4 }} />
        <div style={{ position: "absolute", left: (cur.x0 - cx0) * k, top: (cur.y1 - cy0) * k + 4, height: 3, width: ((cur.x1 - cur.x0) * k) * ul, background: IC3.accent, opacity: dim > 0.1 && !cur.isolate ? 0.9 : 0 }} />
      </div>
     </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Map3D_IC3 (Blender flyover render + labels tracked from its camera)
export type MapTrack = { len: number; draw: [number, number]; track: Record<string, Record<string, [number, number, number]>> };
export type MapLabel = { key: string; text: string; from: number; dx?: number; dy?: number };
export const Map3D_IC3: React.FC<{ dur: number; src: string; track: MapTrack; labels: MapLabel[] }> = ({ dur, src, track, labels }) => {
  const f = useCurrentFrame(); assertIC3("Map3D_IC3", dur);
  const tf = track.track[String(Math.min(track.len - 1, f))] ?? track.track["0"];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DreadGrade_IC3 strength={0.7} grain={0.05}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%" }} /></DreadGrade_IC3>
      {labels.map((l) => {
        const p = tf[l.key]; if (!p) return null;
        const o = Math.min(EI.land((f - l.from) / 12), 1 - EI.smooth((f - (dur - 10)) / 10));
        const x = p[0] * 1920 + (l.dx ?? 0), y = (1 - p[1]) * 1080 + (l.dy ?? -70);
        return (
          <div key={l.key} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -100%)", opacity: clamp01(o), textAlign: "center" }}>
            <div style={{ fontFamily: FONT.archivo, fontWeight: 600, fontSize: 24, letterSpacing: "0.22em", color: IC3.white, textShadow: IC3.shadow, whiteSpace: "nowrap", textTransform: "uppercase" }}>{l.text}</div>
            <div style={{ width: 1.5, height: 46 * clamp01(o), background: "rgba(244,247,247,.7)", margin: "8px auto 0" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
