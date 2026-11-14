// IC / N2 = the algrow-2 channel identity (Disasters Vol 2, CCTV Vol 1, CCTV Vol 2). NEW channel: none of the 404/Waterpark tokens.
// Spec: D:/404 Rendrer/Disasters2/NEW_CHANNEL_STYLE.md. Motion numbers: refs/iceberg/ICEBERG_MOTION.md, Waterpark/study/abyssal_chinese_iceberg/STUDY.md,
// Smoothness_Guide (Nocturn/Farrell), core/tokens.ts EZ (VV/DD measured curves).
import React from "react";
import { Easing } from "remotion";
import { FONT, clamp01 } from "../../core";

// ---------------------------------------------------------------- palette (icy blues -> abyss navy, ONE accent: beacon amber)
export const IC = {
  ice: "#F2F8FB", // names, titles
  iceDim: "rgba(242,248,251,0.55)",
  frost: "#A9D8EC", // secondary labels (place line, roles)
  surface: "#7FD3F2", // waterline glow, caustic tint
  deep: "#0B3768",
  abyss: "#020814",
  amber: "#FFB23F", // THE accent: active marker, caret, sonar ping, highlighter (never on people, never as a circle)
  amberDeep: "#E8952A",
  shadow: "rgba(0,8,20,0.78)",
} as const;

// ---------------------------------------------------------------- type (Archivo variable: wdth 62 = ExtraCondensed for names / titles)
export const T = {
  name: (px: number): React.CSSProperties => ({ fontFamily: FONT.archivo, fontWeight: 800, fontSize: px, fontStretch: "62%", fontVariationSettings: "'wdth' 62, 'wght' 800", textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 0.98 }),
  label: (px: number, w = 560): React.CSSProperties => ({ fontFamily: FONT.archivo, fontWeight: w, fontSize: px, fontStretch: "100%", fontVariationSettings: `'wdth' 100, 'wght' ${w}`, textTransform: "uppercase", letterSpacing: "0.28em" }),
  mono: (px: number, w = 500): React.CSSProperties => ({ fontFamily: FONT.mono, fontWeight: w, fontSize: px, letterSpacing: "0.06em" }),
};
export const NAME_SHADOW = "0 2px 0 rgba(0,6,16,.55), 0 0 14px rgba(0,10,26,.75), 0 0 34px rgba(0,10,26,.45)";

// ---------------------------------------------------------------- easing (no springs; everything eased; footage pushes stay linear)
const bz = (a: number, b: number, c: number, d: number) => { const e = Easing.bezier(a, b, c, d); return (x: number) => e(clamp01(x)); };
export const EI = {
  smooth: (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); }, // ICEBERG_MOTION smoothstep (camera between held states)
  cam: bz(0.45, 0, 0.25, 1), // core EZ.inout: camera between two held items
  quick: bz(0.31, 0, 0.0, 0.957), // VV phase A: fast start, long settle (graphic entries)
  land: (x: number) => 1 - Math.pow(1 - clamp01(x), 3), // ease-out cubic (Abyssal level landing, page rise)
  flyIn: (x: number) => Math.pow(clamp01(x), 2), // fly-through acceleration
};

// ---------------------------------------------------------------- chart layout contract (normalised to the plate; the plate fills chart space)
/** chart space is CW x CH px; the plate image is drawn to exactly that box. y values are 0..1 of the plate height. */
export type PlateLayout = {
  src: string; // staticFile path of the plate
  aspect: number; // plate width / height
  waterline: number; // y of the surface (= bars[0])
  bars: number[]; // y of each bright bar between levels, top to bottom (levels = bars.length + 1)
  bottom: number; // y where the deepest band ends
  bergX: [number, number]; // x span of the underwater body (names stagger around it)
  credit?: string;
};
/** procedural plate (TemplateLibrary/tools/iceberg_art.py). The Blender plate (Disasters2/art) ships its own layout JSON with the same fields. */
export const PLATE_PROC: PlateLayout = {
  src: "ic/berg_plate.jpg", aspect: 16 / 9, waterline: 0.215,
  bars: [0.215, 0.346, 0.477, 0.608, 0.739, 0.870], bottom: 1.0, bergX: [0.27, 0.74],
};
/** Blender plate (Disasters2/art -> tools/plate_from_tall.py): the old tall render squashed 1.75x into 16:9. DEPRECATED (owner 2026-10-25:
 *  "stretched", berg too thin, hidden behind the bars). Kept only so old style frames still render. */
export const PLATE_BLENDER: PlateLayout = {
  src: "ic/berg_blender.jpg", aspect: 16 / 9, waterline: 0.1311,
  bars: [0.1311, 0.2759, 0.4207, 0.5655, 0.7104, 0.8552], bottom: 1.0, bergX: [0.3346, 0.6235],
  credit: "Blender render, Disasters2/art (original)",
};
/** THE chart plate (2026-10-25 v2): Blender re-render composed FOR 16:9 (art/src/build_iceberg.py --chart + comp.py --chart), 3840x2160 so the
 *  camera can push x2 sharp. No stretching: the body geometry is shorter/wider, facets sampled at true scale. Measured on the render:
 *  waterline y .300, snow tip y .05-.30 (x .36-.64), body x .26-.71, keel y .95. Bars follow Abyssal Detective's chart (CCTV Iceberg Vol 4
 *  0:12.0-15.0): 7 even-ish bands, the 2nd bar ON the waterline, so level 1 = the snow tip and level 2 = the lit water just under it. */
export const PLATE_CHART: PlateLayout = {
  src: "ic/berg_chart.jpg", aspect: 16 / 9, waterline: 0.30,
  bars: [0.165, 0.30, 0.44, 0.58, 0.72, 0.86], bottom: 1.0, bergX: [0.26, 0.71],
  credit: "Blender render, Disasters2/art (original, 16:9 composition)",
};
export const CW = 1920;
export const chartH = (p: PlateLayout) => Math.round(CW / p.aspect);
/** band k (0-based level index) top/bottom in chart px */
export const band = (p: PlateLayout, k: number) => {
  const H = chartH(p), ys = [0, ...p.bars, p.bottom];
  return { top: ys[k] * H, bot: ys[k + 1] * H, mid: ((ys[k] + ys[k + 1]) / 2) * H, h: (ys[k + 1] - ys[k]) * H };
};

// ---------------------------------------------------------------- data
export type ChartCase = { id: string; label: string; number: number };
export type ChartLevel = { n: number; name: string; cases: ChartCase[] };
/** placed name: chart-space centre + lines (long names wrap to 2 lines, like the owner's reference "THE STORY OF / KAMIKUISHIKI VILLAGE") */
export type Placed = ChartCase & { level: number; x: number; y: number; lines: string[]; px: number; slot: number };

/** deterministic layout, one line per name (owner reference: single-line condensed caps; Abyssal Vol 4 chart: two staggered columns per band).
 *  Columns at x .29 / .71 of the chart (clear of each other for names up to .38 W), rows at 30 % / 72 % of the band, the second row nudged
 *  40 px inward (Abyssal's stagger), an odd last name centred. A name wider than .38 W is set smaller so nothing overlaps or runs off. */
export const placeNames = (p: PlateLayout, levels: ChartLevel[], px = 58): Placed[] => {
  const out: Placed[] = [], cx = CW / 2, maxW = CW * 0.38;
  levels.forEach((lv, k) => {
    const b = band(p, k), n = lv.cases.length, rows = Math.ceil(n / 2);
    lv.cases.forEach((c, i) => {
      const label = c.label.toUpperCase();
      const fit = Math.min(px, maxW / (label.length * 0.43));
      let row = Math.floor(i / 2), side = i % 2 === 0 ? -1 : 1;
      const lonely = n % 2 === 1 && i === n - 1;
      if (n === 2) row = i; // two names: diagonal stagger (Abyssal "A Regular Night Out / Mopping After Hours")
      const nRows = n === 2 ? 2 : rows;
      const y = nRows === 1 ? b.mid : b.top + b.h * (row === 0 ? 0.30 : 0.72);
      const x = lonely ? cx : cx + side * CW * 0.21 - (row % 2 === 1 ? side * 40 : 0);
      out.push({ ...c, level: k, x, y, lines: [label], px: fit, slot: i });
    });
  });
  return out;
};
/** estimated rendered width of a placed name (Archivo wdth 62 / wght 800 caps ~0.43 em per char) */
export const nameW = (n: { lines: string[]; px: number }) => Math.max(...n.lines.map((l) => l.length)) * 0.43 * n.px;
