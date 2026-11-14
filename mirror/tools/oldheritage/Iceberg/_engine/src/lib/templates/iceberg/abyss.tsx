// AB = the v3 iceberg devices on the photoreal Blender berg (Disasters2/art/src/berg3_sdf.py + build_berg3.py + comp_berg3.py -> public/ice3).
// Grammar: Disasters2/ICEBERG_SPEC_ABYSSAL.md (lead's frame study of Abyssal Detective, CCTV Iceberg Vol 4). The iceberg is a DEPTH METAPHOR:
// one berg seen from a low camera at the sea surface; above the water an ordinary weathered berg under a storm sky, below it a huge SKULL
// of ice fading into the abyss. The camera's position on it says how deep we are: L1-2 the tip, L3 the waterline split, L4-7 under the
// water (brow -> eye sockets -> nose/cheekbones -> teeth/jaw), darker each level.
//   ChartIntro_AB  Abyssal 0:12-0:15: once, ~3 s, STATIC dark wide berg, 6 thin white bars = 7 bands, typewriter names two per row, deeper
//                  names blurred.
//   LevelCard_AB   Abyssal 0:30-0:33, 1358 s, 1886 s: black 0.8 s -> fade-up 0.5 s on the wide berg -> "Level N" typed on the waterline,
//                  held 1.1 s -> fast push (a REAL Blender camera dolly, 14 frames with Cycles motion blur) while the text flies past the
//                  lens -> lands on the level's depth close-up and drifts.
//   EntryCard_AB   Abyssal 0:33-0:36, 1886 s, 2402 s: black 0.7 s -> depth close-up, slow drift (water shimmer under the surface) ->
//                  ice-cyan wide caps glitch-type in (0.3 s) -> hold -> a designed 8-frame glitch hand-off (pair with GlitchIn_AB on the
//                  first frames of the footage).
// Fonts (chosen for this channel, not Abyssal's): Special Elite = a worn, inked typewriter (found-document dread) for "Level N" + chart
// names; Syncopate Bold = a very wide, cold, all-caps face for the glowing entry titles.
// Every component asserts its min/max duration (rules_ic.ts IC3_MIN) so nothing renders cut off or half-played.
import React from "react";
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { clamp01, lerp } from "../../core";
import { EI } from "./ic";
import { assertIC3 } from "./rules_ic";
import type { ChartLevel } from "./ic";
import { D2_LEVELS } from "./d2_levels";

// ---------------------------------------------------------------- fonts (own loader: the faces are not in core's list)
export const FONT_AB = { type: "Special Elite AB", title: "Syncopate AB" };
let fontsReady: Promise<void> | null = null;
const loadFontsAB = () => {
  if (typeof document === "undefined") return Promise.resolve();
  if (!fontsReady) {
    const faces = [new FontFace(FONT_AB.type, `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`), new FontFace(FONT_AB.title, `url(${staticFile("fonts/Syncopate-Bold.ttf")})`, { weight: "700" })];
    fontsReady = Promise.all(faces.map((f) => f.load().then((ff) => { document.fonts.add(ff); }))).then(() => undefined);
  }
  return fontsReady;
};
/** wrap any AB device (the components below already do this themselves) */
export const FontsAB: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ok, setOk] = React.useState(false);
  const [h] = React.useState(() => delayRender("ice AB fonts"));
  React.useEffect(() => { loadFontsAB().then(() => { setOk(true); continueRender(h); }).catch((e) => { throw e; }); }, [h]);
  return ok ? <>{children}</> : null;
};

// ---------------------------------------------------------------- tokens + plates
export const AB = {
  cyan: "#B9F7FF",
  glow: "0 0 3px rgba(190,250,255,.95), 0 0 10px rgba(90,225,255,.85), 0 0 26px rgba(30,190,255,.55), 0 0 60px rgba(10,140,220,.35)",
  white: "#EEF2F2",
  shadow: "0 4px 18px rgba(0,0,0,.6), 0 0 3px rgba(0,0,0,.55)",
};
export type PlatesAB = {
  wide: string; chart: string; tip: string; water: string; under: string[];
  waterline: number; // y (0..1) of the waterline on the wide plate = where "Level N" sits
  target: Record<string, number>; // y (0..1) on the wide plate of each level's depth (the dolly's aim; "Level N" flies out from it)
  push: Record<string, { dir: string; frames: number }>; // rendered dolly per level: <dir>/00.jpg .. NN.jpg (1920x1080)
};
/** Disasters2 public/ice3 (numbers = ice3/plates.json written by comp_berg3.py) */
export const PLATES_ICE3: PlatesAB = {
  wide: "ice3/wide.jpg", chart: "ice3/chart.jpg", tip: "ice3/tip.jpg", water: "ice3/water.jpg",
  under: ["ice3/under1.jpg", "ice3/under2.jpg", "ice3/under3.jpg", "ice3/under4.jpg"], waterline: 0.3043,
  target: { "1": 0.178, "2": 0.178, "3": 0.304, "4": 0.393, "5": 0.625, "6": 0.779, "7": 0.966 },
  push: Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((l) => [String(l), { dir: `ice3/push${l === 2 ? 1 : l}`, frames: 14 }])), // L2 reuses the tip dolly
};
export const closeAB = (p: PlatesAB, level: number) => (level <= 2 ? p.tip : level === 3 ? p.water : p.under[Math.min(3, level - 4)]);
const rnd = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

// ---------------------------------------------------------------- data (24 cases, Houston last; from d2_levels.ts = cases_map.json minus the dropped case)
export type EntryAB = { id: string; number: number; level: number; label: string; lines: string[] };
/** split a title into <= 2 balanced lines (Abyssal: 2 lines, centred) */
export const titleLines = (label: string): string[] => {
  const w = label.toUpperCase().split(/\s+/);
  if (w.join(" ").length <= 14 || w.length < 2) return [w.join(" ")];
  let best = 1, bestD = 1e9;
  for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(" ").length - w.slice(i).join(" ").length); if (d < bestD) { bestD = d; best = i; } }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
};
export const entriesAB = (levels: ChartLevel[] = D2_LEVELS): EntryAB[] =>
  levels.flatMap((l) => l.cases.map((c) => ({ id: c.id, number: c.number, level: l.n, label: c.label, lines: titleLines(c.label) })));
export const ENTRIES_D2 = entriesAB();

// ---------------------------------------------------------------- shared bits
/** animated film grain (per frame, subtle) + the channel vignette */
const Grain: React.FC<{ f: number; amt?: number }> = ({ f, amt = 0.06 }) => (
  <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: amt * 4, pointerEvents: "none" }}>
    <svg width="1920" height="1080"><filter id={`gab${f % 8}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 8} /><feColorMatrix type="saturate" values="0" /></filter><rect width="1920" height="1080" filter={`url(#gab${f % 8})`} opacity={0.5} /></svg>
  </AbsoluteFill>
);
/** designed glitch: slice displacement + RGB split (+ a little block noise at the peak). k = 0..1 envelope, never a 1-frame flash. */
export const GlitchAB: React.FC<{ k: number; seed: number; children: React.ReactNode }> = ({ k, seed, children }) => {
  if (k < 0.03) return <AbsoluteFill>{children}</AbsoluteFill>;
  const id = `glab${seed}`, dx = Math.round(26 * k), disp = Math.round(160 * k);
  return (
    <AbsoluteFill>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={id} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.00002 0.04" numOctaves={1} seed={seed} result="t" />
          <feComponentTransfer in="t" result="tq"><feFuncR type="discrete" tableValues="0.5 0.5 0.15 0.5 0.85 0.5 0.35 0.5 0.5" /><feFuncG type="discrete" tableValues="0.5" /></feComponentTransfer>
          <feDisplacementMap in="SourceGraphic" in2="tq" scale={disp} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="d" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r" />
          <feOffset in="r" dx={dx} result="ro" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b" />
          <feOffset in="b" dx={-dx} dy={Math.round(dx / 4)} result="bo" />
          <feBlend in="ro" in2="g" mode="screen" result="rg" />
          <feBlend in="rg" in2="bo" mode="screen" />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
      {k > 0.45 && (
        <AbsoluteFill style={{ opacity: (k - 0.45) * 0.9, mixBlendMode: "screen" }}>
          {Array.from({ length: 6 }, (_, i) => { const y = rnd(seed * 7 + i) * 1080, h = 4 + rnd(seed + i * 3) * 26; return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: h, background: `rgba(${i % 2 ? "120,240,255" : "255,60,90"},.18)` }} />; })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
/** the footage side of the hand-off: wrap the first `len` frames (>= 5) of the clip that follows an EntryCard_AB */
export const GlitchIn_AB: React.FC<{ len?: number; children: React.ReactNode }> = ({ len = 6, children }) => {
  const f = useCurrentFrame(); assertIC3("GlitchCut_IC3", len);
  const k = f < len ? Math.pow(1 - f / len, 1.5) : 0;
  return <GlitchAB k={k} seed={91 + Math.floor(f / 2)}>{children}</GlitchAB>;
};
/** a plate with a slow eased drift; `shimmer` = underwater refraction wobble (only for plates under the surface) */
const DriftPlate: React.FC<{ src: string; f: number; dur: number; s0: number; s1: number; x0?: number; x1?: number; ox?: number; oy?: number; shimmer?: number }> = ({ src, f, dur, s0, s1, x0 = 0, x1 = 0, ox = 0.5, oy = 0.5, shimmer = 0 }) => {
  const u = EI.smooth(f / Math.max(1, dur)), s = lerp(s0, s1, u), tx = lerp(x0, x1, u);
  const id = `shab${Math.floor(f)}`;
  return (
    <AbsoluteFill>
      {shimmer > 0 && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency={`${0.004 + 0.0004 * Math.sin(f / 23)} 0.012`} numOctaves={2} seed={3} result="n" />
            <feOffset in="n" dy={-f * 0.9} result="no" /><feDisplacementMap in="SourceGraphic" in2="no" scale={shimmer} xChannelSelector="R" yChannelSelector="G" /></filter>
        </svg>
      )}
      <Img src={staticFile(src)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", transformOrigin: `${ox * 100}% ${oy * 100}%`, transform: `translateX(${tx.toFixed(2)}px) scale(${s.toFixed(5)})`, filter: shimmer > 0 ? `url(#${id})` : undefined }} />
    </AbsoluteFill>
  );
};

/** constant-speed drift after a landing (LevelCard_AB) and its continuation (EntryCard_AB cont): scale 1 + DRIFT.s*t, x = DRIFT.x*t */
export const DRIFT = { s: 0.00045, x: -0.16 };
/** the drift state a LevelCard_AB of `dur` frames ends on (pass as EntryCard_AB cont to continue the same shot without a cut) */
export const levelCardEnd = (dur: number, holdUntil = 72, frames = 14) => Math.max(0, dur - (holdUntil + frames));
const LinearDrift: React.FC<{ src: string; t: number; shimmer: number; f: number }> = ({ src, t, shimmer, f }) => {
  const id = `ldab${f}`;
  return (
    <AbsoluteFill>
      {shimmer > 0 && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={id} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency={`${0.004 + 0.0004 * Math.sin(f / 23)} 0.012`} numOctaves={2} seed={3} result="n" />
            <feOffset in="n" dy={-f * 0.9} result="no" /><feDisplacementMap in="SourceGraphic" in2="no" scale={shimmer} xChannelSelector="R" yChannelSelector="G" /></filter>
        </svg>
      )}
      <Img src={staticFile(src)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", transformOrigin: "50% 42%", transform: `translateX(${(DRIFT.x * t).toFixed(2)}px) scale(${(1 + DRIFT.s * t).toFixed(5)})`, filter: shimmer > 0 ? `url(#${id})` : undefined }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ChartIntro_AB
/** Abyssal 0:12-0:15 (refs/abyssal_v4/f_13.5.jpg): the wide berg darkened, 6 thin white bars (7 equal bands), names in small typewriter
 *  two per row left/right of centre (staggered), typed in fast band by band; deeper / unrevealed names blurred. STATIC: no zoom, no drift.
 *  frames: fade-up 0-9 (eased) · names type 4-40 · hold · (the edit cuts or glitches out). */
export const ChartIntro_AB: React.FC<{ dur: number; levels?: ChartLevel[]; plates?: PlatesAB; blurFrom?: number; px?: number; insert?: boolean }> = ({ dur, levels = D2_LEVELS, plates = PLATES_ICE3, blurFrom = 2, px = 34, insert = false }) => {
  // insert = the short chart flash for the hook montage (1.2-2.5 s): 4-frame fade, every name typed within ~10 frames
  const f = useCurrentFrame(); assertIC3(insert ? "ChartInsert_AB" : "ChartIntro_AB", dur);
  const nb = levels.length, bh = 1080 / nb, fade = EI.smooth(f / (insert ? 4 : 9));
  return (
    <FontsAB>
      <AbsoluteFill style={{ background: "#000" }}>
        <AbsoluteFill style={{ opacity: fade }}>
          <Img src={staticFile(plates.chart)} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
          {Array.from({ length: nb - 1 }, (_, k) => (
            <div key={k} style={{ position: "absolute", left: 0, right: 0, top: (k + 1) * bh - 4, height: 8, background: "rgba(242,246,246,.94)", boxShadow: "0 0 10px rgba(0,0,0,.45)" }} />
          ))}
          {levels.map((lv, k) => {
            const names = lv.cases.map((c) => c.label), rows = Math.ceil(names.length / 2);
            return names.map((nm, i) => {
              const row = Math.floor(i / 2), lonely = names.length % 2 === 1 && i === names.length - 1, left = i % 2 === 0 && !lonely;
              const y = k * bh + bh * ((row + 0.5) / rows) - px * 0.62;
              // deeper = more hidden: level index >= blurFrom blurs a growing share of its names; the last level keeps one tease
              const hide = k >= blurFrom && rnd(k * 17 + i * 3) < 0.35 + 0.1 * (k - blurFrom);
              const t0 = insert ? 1 + k * 1 + (i % 2) : 4 + k * 4 + (i % 2) * 2, typed = Math.max(0, Math.floor((f - t0) * (insert ? 3.2 : 1.6)));
              const shown = nm.slice(0, typed), stag = (row + k) % 2 ? 60 : 0;
              return (
                <div key={`${k}-${i}`} style={{ position: "absolute", top: y, whiteSpace: "pre", fontFamily: FONT_AB.type, fontSize: px, color: AB.white, textShadow: AB.shadow,
                  ...(lonely ? { left: 0, right: 0, textAlign: "center" } : left ? { right: 960 + 22 + stag, textAlign: "right" } : { left: 960 + 22 + (60 - stag) }),
                  filter: hide ? "blur(5px)" : undefined, opacity: hide ? 0.8 : 1 }}>{shown}</div>
              );
            });
          })}
        </AbsoluteFill>
        <Grain f={f} amt={0.05} />
      </AbsoluteFill>
    </FontsAB>
  );
};

// ---------------------------------------------------------------- LevelCard_AB
/** frames (30 fps): black 0-24 · fade-up 24-39 (eased) · "Level N" types 26-38 on the waterline · hold to P0 = 72 (Level N readable 1.1 s) ·
 *  push P0..P0+n (n = rendered dolly frames, ~0.47 s; the text scales past the lens with growing blur, ghost trails on the plate) ·
 *  lands on the depth close-up (3-frame dissolve from the last dolly frame = the same camera) · slow drift to `dur`.
 *  The level's VO may start on the landed close-up. */
export const LevelCard_AB: React.FC<{ dur: number; level: number; plates?: PlatesAB; label?: string; holdUntil?: number }> = ({ dur, level, plates = PLATES_ICE3, label, holdUntil = 72 }) => {
  const f = useCurrentFrame(); assertIC3("LevelCard_AB", dur);
  const push = plates.push[String(level)], n = push.frames, P0 = holdUntil, P1 = P0 + n;
  if (dur < P1 + 12) throw new Error(`rules_ic: LevelCard_AB ${dur} f is shorter than its push end ${P1} + 12 f landing`);
  const fade = EI.smooth((f - 24) / 15);
  const text = label ?? `Level ${level}`, typed = text.slice(0, Math.max(0, Math.min(text.length, Math.floor((f - 26) / 1.7) + 1)));
  const u = clamp01((f - P0) / n), fly = Math.pow(u, 1.7);                       // text accelerates past the lens
  const ts = 1 + 9 * fly, tblur = fly * 26, top = 1 - EI.smooth((u - 0.25) / 0.45);
  const target = [0.5, plates.target[String(level)] ?? plates.waterline];
  const pi = Math.min(n - 1, Math.max(0, Math.floor(f - P0)));
  const ghost = f >= P0 && f < P1 ? Math.sin(Math.PI * u) : 0;
  const land = clamp01((f - (P1 - 1)) / 3);
  const shimmer = level >= 4 ? 7 : 0;
  return (
    <FontsAB>
      <AbsoluteFill style={{ background: "#000" }}>
        {f < P0 && (
          <AbsoluteFill style={{ opacity: fade }}>
            <DriftPlate src={plates.wide} f={f - 24} dur={P0 - 24} s0={1.0} s1={1.025} ox={target[0]} oy={target[1]} />
          </AbsoluteFill>
        )}
        {f >= P0 && f < P1 + 2 && (
          <AbsoluteFill>
            <Img src={staticFile(`${push.dir}/${String(pi).padStart(2, "0")}.jpg`)} style={{ position: "absolute", width: 1920, height: 1080 }} />
            {ghost > 0.05 && [1.035, 1.075].map((g, i) => (
              <Img key={i} src={staticFile(`${push.dir}/${String(pi).padStart(2, "0")}.jpg`)} style={{ position: "absolute", width: 1920, height: 1080, transformOrigin: "50% 50%", transform: `scale(${1 + (g - 1) * ghost})`, opacity: 0.28 * ghost, filter: `blur(${(3 + 3 * i) * ghost}px)` }} />
            ))}
          </AbsoluteFill>
        )}
        {f >= P1 - 1 && (
          <AbsoluteFill style={{ opacity: land }}>
            <LinearDrift src={closeAB(plates, level)} t={Math.max(0, f - P1)} shimmer={shimmer} f={f} />
          </AbsoluteFill>
        )}
        {f < P1 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: plates.waterline * 1080 - 128, textAlign: "center", whiteSpace: "pre", fontFamily: FONT_AB.type, fontSize: 250, lineHeight: "250px",
            color: AB.white, textShadow: "0 8px 30px rgba(0,0,0,.55)", opacity: fade * top,
            transformOrigin: `${target[0] * 100}% ${(target[1] - plates.waterline) * 1080 + 128}px`, transform: `scale(${ts.toFixed(4)})`, filter: tblur > 0.3 ? `blur(${tblur.toFixed(1)}px)` : undefined }}>
            {typed.padEnd(text.length, " ")}
          </div>
        )}
        <Grain f={f} />
      </AbsoluteFill>
    </FontsAB>
  );
};

// ---------------------------------------------------------------- glitch-typed glowing title
const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/<>";
const GlitchTitle: React.FC<{ lines: string[]; t: number; dur?: number; px?: number }> = ({ lines, t, dur = 9, px = 52 }) => {
  if (t < 0) return null;
  const all = lines.join("").length; let k = 0;
  const settleAll = t >= dur, jit = settleAll ? 0 : (1 - t / dur);
  const split = 10 * jit;
  const layer = (color: string, dx: number, op: number, glow: boolean) => (
    <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", transform: `translateX(${dx}px)`, opacity: op, color, textShadow: glow ? AB.glow : undefined,
      fontFamily: FONT_AB.title, fontWeight: 700, fontSize: px, letterSpacing: "0.06em", lineHeight: 1.32, mixBlendMode: glow ? undefined : "screen" }}>
      {lines.map((ln, li) => {
        const lj = settleAll ? 0 : (rnd(li * 31 + Math.floor(t)) - 0.5) * 24 * jit;
        return (
          <div key={li} style={{ whiteSpace: "pre", transform: `translateX(${lj.toFixed(1)}px)` }}>
            {[...ln].map((ch, ci) => {
              const idx = k++, settle = (rnd(idx * 7.7 + 3) * 0.75 + (idx / all) * 0.25) * dur, vis = t >= settle * 0.4;
              const c = ch === " " ? " " : t >= settle ? ch : GL[Math.floor(rnd(idx * 13 + Math.floor(t)) * GL.length)];
              return <span key={ci} style={{ opacity: vis ? (t >= settle ? 1 : 0.65) : 0 }}>{c}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
  k = 0; const main = layer(AB.cyan, 0, 1, true);
  if (split < 0.5) return <div style={{ position: "relative" }}>{main}</div>;
  k = 0; const r = layer("rgba(255,70,90,.8)", split, 0.7, false);
  k = 0; const b = layer("rgba(60,170,255,.8)", -split, 0.7, false);
  return <div style={{ position: "relative" }}>{r}{b}{main}</div>;
};

// ---------------------------------------------------------------- EntryCard_AB
/** frames: black 0-21 · fade-up 21-36 on the depth close-up (slow eased drift; underwater plates shimmer) · title glitch-types at 33 over 9 f
 *  (random glyphs settle, RGB split decays) · holds >= 2.2 s · last `out` frames (default 8) = designed glitch hand-off (slices + RGB split
 *  rising, the picture darkens a little: no white flash). Follow with GlitchIn_AB on the footage.
 *  cont = the first entry right after a LevelCard_AB (Abyssal 0:33): no black, the landed close-up keeps drifting (pass levelCardEnd(levelDur))
 *  and the title types at frame 8. */
export const EntryCard_AB: React.FC<{ dur: number; level: number; lines?: string[]; title?: string; plates?: PlatesAB; out?: number; seed?: number; cont?: number }> = ({ dur, level, lines, title, plates = PLATES_ICE3, out = 8, seed = 1, cont }) => {
  const f = useCurrentFrame(); assertIC3(cont === undefined ? "EntryCard_AB" : "EntryCardCont_AB", dur);
  if (out < 5) throw new Error("rules_ic: EntryCard_AB glitch hand-off must be >= 5 frames");
  const L = lines ?? titleLines(title ?? "");
  const T0 = cont === undefined ? 33 : 8;                      // title start: after the black + fade, or soon after a level card's landing
  const fade = cont === undefined ? EI.smooth((f - 21) / 15) : 1;
  const g = clamp01((f - (dur - out)) / out), k = Math.pow(g, 1.4);
  const dir = rnd(seed) < 0.5 ? -1 : 1;
  return (
    <FontsAB>
      <AbsoluteFill style={{ background: "#000" }}>
        <GlitchAB k={k} seed={seed * 13 + Math.floor(f / 2)}>
          <AbsoluteFill style={{ opacity: fade * (1 - 0.35 * k) }}>
            {cont === undefined
              ? <DriftPlate src={closeAB(plates, level)} f={f - 21} dur={dur - 21} s0={1.07} s1={1.0} x0={-18 * dir} x1={18 * dir} oy={0.42} shimmer={level >= 4 ? 7 : 0} />
              : <LinearDrift src={closeAB(plates, level)} t={cont + f} shimmer={level >= 4 ? 7 : 0} f={f} />}
            <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 30% at 50% 31%, rgba(0,8,12,.42), rgba(0,0,0,0))" }} />
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0.255 * 1080 }}><GlitchTitle lines={L} t={f - T0} /></div>
        </GlitchAB>
        <Grain f={f} />
      </AbsoluteFill>
    </FontsAB>
  );
};
