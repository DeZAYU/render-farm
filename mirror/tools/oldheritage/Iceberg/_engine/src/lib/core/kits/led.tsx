// NEW (2026-10-18, set "midway"): small LED kit for the Amusement Park "MIDWAY AFTER DARK" identity (REFERENCE_SYNTHESIS §I3 AP-1).
// REF FB F10 @V4 2:49.6 (LED/neon figure card: dot-matrix core + bloom, slight push) + FA F3 @V3 12:41 (fine 3-4 px pixel texture, 30-40 px
// glow, number fades in 8 f). A 5x7 dot-matrix glyph set where every cell is ONE round lamp (0.62 cell, dark gaps, hot centre + bloom; fix 2026-10-19),
// with the unlit cells kept as a dim board (park signage). Shared by caseopener/LedMarquee and stat/StuckClock.
// Also: tiny MIDWAY helpers (accent pick with the M-024 fire fallback, hex mix, Oswald word rise D3 E2 numbers) used by the midway set.
import React from "react";
import { useCurrentFrame } from "remotion";
import { CAP, EZ, FONT, FreshLayer, W, clamp01, fs } from "../index";
import type { Theme } from "../themes";

// ---------------------------------------------------------------- 5x7 glyphs ("X" = lit). Variable width (colon 1 col, digits 5).
export const LED_GLYPHS: Record<string, string[]> = {
  "0": [" XXX ", "X   X", "X  XX", "X X X", "XX  X", "X   X", " XXX "],
  "1": ["  X  ", " XX  ", "  X  ", "  X  ", "  X  ", "  X  ", " XXX "],
  "2": [" XXX ", "X   X", "    X", "   X ", "  X  ", " X   ", "XXXXX"],
  "3": ["XXXXX", "   X ", "  X  ", "   X ", "    X", "X   X", " XXX "],
  "4": ["   X ", "  XX ", " X X ", "X  X ", "XXXXX", "   X ", "   X "],
  "5": ["XXXXX", "X    ", "XXXX ", "    X", "    X", "X   X", " XXX "],
  "6": ["  XX ", " X   ", "X    ", "XXXX ", "X   X", "X   X", " XXX "],
  "7": ["XXXXX", "    X", "   X ", "  X  ", " X   ", " X   ", " X   "],
  "8": [" XXX ", "X   X", "X   X", " XXX ", "X   X", "X   X", " XXX "],
  "9": [" XXX ", "X   X", "X   X", " XXXX", "    X", "   X ", " XX  "],
  ":": [" ", " ", "X", " ", "X", " ", " "],
  ".": [" ", " ", " ", " ", " ", " ", "X"],
  "-": ["   ", "   ", "   ", "XXX", "   ", "   ", "   "],
  "+": ["     ", "  X  ", "  X  ", "XXXXX", "  X  ", "  X  ", "     "],
  " ": ["   ", "   ", "   ", "   ", "   ", "   ", "   "],
  // A-Z + a few signs (2026-10-19, ride-name strips: photo/OnRidePrint, footage/RiderCamTakeover tag)
  "A": [" XXX ", "X   X", "X   X", "XXXXX", "X   X", "X   X", "X   X"],
  "B": ["XXXX ", "X   X", "X   X", "XXXX ", "X   X", "X   X", "XXXX "],
  "C": [" XXX ", "X   X", "X    ", "X    ", "X    ", "X   X", " XXX "],
  "D": ["XXXX ", "X   X", "X   X", "X   X", "X   X", "X   X", "XXXX "],
  "E": ["XXXXX", "X    ", "X    ", "XXXX ", "X    ", "X    ", "XXXXX"],
  "F": ["XXXXX", "X    ", "X    ", "XXXX ", "X    ", "X    ", "X    "],
  "G": [" XXX ", "X   X", "X    ", "X XXX", "X   X", "X   X", " XXXX"],
  "H": ["X   X", "X   X", "X   X", "XXXXX", "X   X", "X   X", "X   X"],
  "I": [" XXX ", "  X  ", "  X  ", "  X  ", "  X  ", "  X  ", " XXX "],
  "J": ["  XXX", "   X ", "   X ", "   X ", "   X ", "X  X ", " XX  "],
  "K": ["X   X", "X  X ", "X X  ", "XX   ", "X X  ", "X  X ", "X   X"],
  "L": ["X    ", "X    ", "X    ", "X    ", "X    ", "X    ", "XXXXX"],
  "M": ["X   X", "XX XX", "X X X", "X X X", "X   X", "X   X", "X   X"],
  "N": ["X   X", "X   X", "XX  X", "X X X", "X  XX", "X   X", "X   X"],
  "O": [" XXX ", "X   X", "X   X", "X   X", "X   X", "X   X", " XXX "],
  "P": ["XXXX ", "X   X", "X   X", "XXXX ", "X    ", "X    ", "X    "],
  "Q": [" XXX ", "X   X", "X   X", "X   X", "X X X", "X  X ", " XX X"],
  "R": ["XXXX ", "X   X", "X   X", "XXXX ", "X X  ", "X  X ", "X   X"],
  "S": [" XXXX", "X    ", "X    ", " XXX ", "    X", "    X", "XXXX "],
  "T": ["XXXXX", "  X  ", "  X  ", "  X  ", "  X  ", "  X  ", "  X  "],
  "U": ["X   X", "X   X", "X   X", "X   X", "X   X", "X   X", " XXX "],
  "V": ["X   X", "X   X", "X   X", "X   X", "X   X", " X X ", "  X  "],
  "W": ["X   X", "X   X", "X   X", "X X X", "X X X", "X X X", " X X "],
  "X": ["X   X", "X   X", " X X ", "  X  ", " X X ", "X   X", "X   X"],
  "Y": ["X   X", "X   X", " X X ", "  X  ", "  X  ", "  X  ", "  X  "],
  "Z": ["XXXXX", "    X", "   X ", "  X  ", " X   ", "X    ", "XXXXX"],
  "#": [" X X ", " X X ", "XXXXX", " X X ", "XXXXX", " X X ", " X X "],
  "/": ["    X", "    X", "   X ", "  X  ", " X   ", "X    ", "X    "],
  ",": ["  ", "  ", "  ", "  ", "  ", " X", "X "],
  "'": ["X", "X", " ", " ", " ", " ", " "],
  "!": ["X", "X", "X", "X", "X", " ", "X"],
};
const glyph = (c: string) => LED_GLYPHS[c] ?? LED_GLYPHS[c.toUpperCase()] ?? LED_GLYPHS[" "];
/** total columns of a string (1 empty column between glyphs) */
export const ledCols = (text: string) => [...text].reduce((a, c, i) => a + glyph(c)[0].length + (i > 0 ? 1 : 0), 0);
/** pixel size of an LED string at `cell` px per matrix cell */
export const ledSize = (text: string, cell: number) => ({ w: ledCols(text) * cell, h: 7 * cell });

/** lit / unlit cell centres of a string, in px (origin top-left) */
const ledCells = (text: string, cell: number) => {
  const lit: [number, number][] = [], off: [number, number][] = [];
  let col = 0;
  [...text].forEach((c, i) => {
    if (i > 0) col += 1;
    const g = glyph(c);
    const gw = g[0].length;
    const blank = c === " ";
    for (let r = 0; r < 7; r++) for (let q = 0; q < gw; q++) {
      const pt: [number, number] = [(col + q + 0.5) * cell, (r + 0.5) * cell];
      if (g[r][q] === "X") lit.push(pt);
      else if (!blank) off.push(pt);
    }
    col += gw;
  });
  return { lit, off };
};
const circlesPath = (pts: [number, number][], r: number) =>
  pts.map(([x, y]) => `M${(x - r).toFixed(2)} ${y.toFixed(2)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0z`).join("");
const isHex = (c: string) => /^#[0-9a-fA-F]{6}$/.test(c);

/** a dot-matrix LED string. (x, y) = anchor point; anchor "center" centres the block on it, "left" puts its left edge there (y = centre).
 *  FIX 2026-10-19 (review #15): every matrix cell is ONE round lamp (diameter `dotFrac` x cell, default 0.62, dark gaps between lamps),
 *  hot centre -> colour -> darker rim (radial gradient per lamp), threshold-style bloom = a blurred copy of the lit lamps + two
 *  drop-shadow glows (`glowPx` inner/outer, FA F3 30-40 px). Unlit lamps: the same dots in `ghostColour` at `ghost` opacity (the sign board).
 *  `pitch` / `dot` / `core` are the old fine-texture params: kept for prop compatibility, ignored. */
export const LedText: React.FC<{
  text: string; cell: number; x: number; y: number; colour: string; glow?: string; glowPx?: [number, number]; pitch?: number; dot?: number;
  ghost?: number; ghostColour?: string; core?: number; anchor?: "center" | "left" | "right"; opacity?: number; style?: React.CSSProperties;
  dotFrac?: number; bloom?: number;
}> = ({ text, cell, x, y, colour, glow = "rgba(255,255,255,.5)", glowPx = [10, 34], ghost = 0.12, ghostColour = "#8E7F86", anchor = "center", opacity = 1, style, dotFrac = 0.62, bloom = 0.6 }) => {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const { w, h } = ledSize(text, cell);
  const { lit, off } = ledCells(text, cell);
  const r = (cell * dotFrac) / 2;
  const left = anchor === "center" ? x - w / 2 : anchor === "left" ? x : x - w;
  const hot = isHex(colour) ? mixHex(colour, "#FFFFFF", 0.6) : colour;
  const rim = isHex(colour) ? mixHex(colour, "#000000", 0.28) : colour;
  const litD = circlesPath(lit, r);
  return (
    <svg width={w} height={h} style={{ position: "absolute", left, top: y - h / 2, overflow: "visible", opacity, ...style }}>
      <defs>
        <radialGradient id={`r${id}`} cx="0.42" cy="0.4" r="0.62">
          <stop offset="0" stopColor={hot} />
          <stop offset="0.5" stopColor={colour} />
          <stop offset="1" stopColor={rim} />
        </radialGradient>
        <radialGradient id={`o${id}`} cx="0.45" cy="0.42" r="0.6">
          <stop offset="0" stopColor={ghostColour} />
          <stop offset="1" stopColor="#000000" />
        </radialGradient>
      </defs>
      {ghost > 0 && off.length ? <g opacity={ghost}>{off.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#o${id})`} />)}</g> : null}
      {bloom > 0 ? <path d={litD} fill={colour} opacity={bloom} style={{ filter: `blur(${(cell * 0.45).toFixed(1)}px)` }} /> : null}
      <g style={{ filter: `drop-shadow(0 0 ${glowPx[0]}px ${glow}) drop-shadow(0 0 ${glowPx[1]}px ${glow})` }}>
        {lit.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#r${id})`} />)}
      </g>
    </svg>
  );
};

/** a dark LED sign board behind an LED string (75-85 % plate, rounded bezel, faint top edge highlight, soft drop shadow).
 *  (x, y) = centre of the LED string; `extraBottom` px under the string for a caption row. */
export const LedBoard: React.FC<{
  w: number; h: number; x: number; y: number; pad?: number; extraBottom?: number; alpha?: number; edge?: string; opacity?: number;
}> = ({ w, h, x, y, pad = 26, extraBottom = 0, alpha = 0.8, edge = "rgba(255,240,248,.16)", opacity = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2 - pad, top: y - h / 2 - pad, width: w + 2 * pad, height: h + 2 * pad + extraBottom, opacity,
    borderRadius: 10, background: `linear-gradient(180deg, rgba(22,10,17,${alpha}) 0%, rgba(8,3,6,${Math.min(0.95, alpha + 0.06)}) 100%)`,
    boxShadow: `inset 0 1px 0 ${edge}, inset 0 0 0 1px rgba(255,255,255,.06), 0 10px 30px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.5)` }} />
);

// ---------------------------------------------------------------- MIDWAY helpers
/** the accent to use on this plate: M-024 fallback (white) on fire / red plates where magenta would vanish */
export const pickAccent = (t: Theme, fire?: boolean) => (fire ? t.fallbackAccent : t.accent);
/** hex colour mix (a -> b by u) */
export const mixHex = (a: string, b: string, u: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = p(a), B = p(b), t = clamp01(u);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
/** font size for a cap height in any library face */
export const fsFace = (face: string, cap: number) => {
  const key = (Object.keys(FONT) as (keyof typeof FONT)[]).find((k) => FONT[k] === face) ?? "inter";
  return fs(key as keyof typeof CAP, cap);
};
/** zero-pad to 2 digits (lib es2015: no padStart) */
export const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** a word on its spoken frame (local). hot = accent colour */
export type MWord = { text: string; at: number; hot?: boolean };
/** D3 E2 word label numbers (§I3 AP-1): rise 19 px over 22 f ease-out, alpha 16 f, blur 4 -> 0 in 6 f; then a slow life rise (never still). */
export const midRise = (k: number) => {
  if (k < 0) return { o: 0, y: 19, b: 4 };
  return { o: EZ.out2(k / 16), y: 19 * (1 - EZ.out3(k / 22)) - 4 * (1 - Math.exp(-k / 90)), b: 4 * (1 - clamp01(k / 6)) };
};
/** a centred row of words (caps) that rise in on their frames; exit = 12 f fade + 6 px lift */
export const RiseWords: React.FC<{
  words: MWord[]; cap: number; y: number; cx?: number; face: string; weight: number; colour: string; hot: string; hotGlow: string; exitAt?: number; caps?: boolean; gap?: number;
  shadow?: string; // text-shadow of the plain words (default soft drop)
}> = ({ words, cap, y, cx = W / 2, face, weight, colour, hot, hotGlow, exitAt, caps = true, gap, shadow = "0 3px 10px rgba(0,0,0,.65)" }) => {
  const f = useCurrentFrame();
  const ex = exitAt === undefined ? 0 : EZ.in2((f - exitAt) / 12);
  if (ex >= 1 || !words.length || f < words[0].at) return null;
  const size = fsFace(face, cap);
  return (
    <FreshLayer>
      <div style={{ position: "absolute", left: cx, top: y, transform: `translate(-50%,-50%) translateY(${(-6 * ex).toFixed(2)}px)`, display: "flex", gap: gap ?? size * 0.28, opacity: 1 - ex, whiteSpace: "nowrap" }}>
        {words.map((w, i) => {
          const s = midRise(f - w.at);
          return (
            <span key={i} style={{ fontFamily: face, fontWeight: weight, fontSize: size, lineHeight: 1, color: w.hot ? hot : colour, opacity: s.o, transform: `translateY(${s.y.toFixed(2)}px)`,
              textShadow: w.hot ? `0 0 14px ${hotGlow}, 0 3px 10px rgba(0,0,0,.6)` : shadow, filter: s.b > 0.05 ? `blur(${s.b.toFixed(2)}px)` : undefined }}>
              {caps ? w.text.toUpperCase() : w.text}
            </span>
          );
        })}
      </div>
    </FreshLayer>
  );
};
