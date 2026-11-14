// PROMOTED to core (was src/templates/neon/glyphs.tsx); shared by several families. Import as "../../core/kits/glyphs".
// Neon pictogram glyph library (VV §7: flat, saturated pictograms on pure black with a tight halo + wide bloom; the reference glyphs are FILLED
// silhouettes, e.g. VV @ 1:44.1 crowd, @ 10:43.0 tank). Every glyph lives in a 200 x 200 box centred on (0, 0), y down, feet/base at +100.
// A glyph is a list of parts: filled paths, or stroked paths (sw = stroke width, round caps). `Glyph` renders one in a colour, `NeonGlyph`
// adds the VV halo/bloom. mode "line" strokes every part (Farrell clean line-icon look, used by the diagram family's CleanDiagram).
import React from "react";

export type GlyphPart = { d: string; fill?: boolean; sw?: number; o?: number };
export type GlyphDef = GlyphPart[];
const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
const rrect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

export const GLYPHS: Record<string, GlyphDef> = {
  // VV pictogram person: round head, shoulders, arms down, two legs
  person: [
    { d: circ(0, -66, 24) },
    { d: "M-34 -30 Q-34 -38 -26 -38 H26 Q34 -38 34 -30 L42 26 Q43 36 34 36 Q27 36 26 28 L20 -6 V92 Q20 100 11 100 Q3 100 3 92 V36 H-3 V92 Q-3 100 -11 100 Q-20 100 -20 92 V-6 L-26 28 Q-27 36 -34 36 Q-43 36 -42 26 Z" },
  ],
  // person with one arm raised (pointing / waving)
  personRaise: [
    { d: circ(0, -66, 24) },
    { d: "M-34 -30 Q-34 -38 -26 -38 H22 L54 -82 Q60 -90 67 -84 Q73 -78 67 -71 L34 -24 L20 -6 V92 Q20 100 11 100 Q3 100 3 92 V36 H-3 V92 Q-3 100 -11 100 Q-20 100 -20 92 V-6 L-26 28 Q-27 36 -34 36 Q-43 36 -42 26 Z" },
  ],
  // running person (leaning, stride)
  runner: [
    { d: circ(14, -70, 22) },
    { d: "M-6 -40 Q0 -46 10 -42 L34 -30 L62 -44 Q70 -48 74 -40 Q77 -33 70 -29 L36 -10 L22 -16 L16 18 L46 40 Q52 45 50 54 L42 94 Q40 102 31 100 Q23 98 25 89 L31 58 L4 40 L-14 72 L-50 76 Q-59 77 -60 68 Q-60 60 -51 59 L-26 56 L-12 20 L-8 -18 L-26 -6 L-34 20 Q-36 28 -44 26 Q-51 23 -49 15 L-40 -14 Q-38 -22 -30 -26 Z" },
  ],
  heap: [
    { d: "M-96 92 C-76 46 -52 6 -24 -22 C-10 -36 10 -36 24 -22 C52 6 76 46 96 92 Z" },
    { d: circ(-46, -30, 7) }, { d: circ(-12, -62, 7) }, { d: circ(22, -54, 7) }, { d: circ(52, -26, 7) }, { d: circ(4, -84, 6) },
  ],
  // corn cob (line-art: the husk leaves + kernel grid read better stroked)
  cob: [
    { d: "M0 -92 C34 -92 43 -37 38 12 C34 55 18 86 0 92 C-18 86 -34 55 -38 12 C-43 -37 -34 -92 0 -92 Z", fill: false, sw: 8 },
    { d: "M-35 -60 C-12 -54 12 -54 35 -60 M-38 -32 C-12 -26 12 -26 38 -32 M-38 -4 C-12 2 12 2 38 -4 M-37 24 C-12 30 12 30 37 24 M-31 52 C-12 58 12 58 31 52", fill: false, sw: 4.5 },
    { d: "M-14 -86 C-19 -30 -19 30 -14 86 M14 -86 C19 -30 19 30 14 86", fill: false, sw: 4.5 },
    { d: "M-6 92 C-50 74 -74 25 -68 -37 C-50 0 -36 50 -6 92 Z", fill: false, sw: 7 },
    { d: "M6 92 C50 74 74 25 68 -37 C50 0 36 50 6 92 Z", fill: false, sw: 7 },
  ],
  // TV set: body with a screen hole, antennas, feet
  tv: [
    { d: `${rrect(-92, -54, 184, 128, 16)} ${rrect(-74, -38, 128, 96, 10)}`, fill: true },
    { d: circ(73, -16, 6) }, { d: circ(73, 8, 6) },
    { d: "M-20 -56 L-52 -96 M20 -56 L46 -98", fill: false, sw: 8 },
    { d: "M-62 74 L-70 96 M62 74 L70 96", fill: false, sw: 10 },
  ],
  flame: [
    { d: "M2 -98 C26 -64 64 -40 64 12 C64 62 34 96 0 96 C-34 96 -64 66 -64 22 C-64 -10 -46 -30 -36 -48 C-32 -22 -22 -10 -10 -6 C-14 -44 -10 -74 2 -98 Z M2 6 C14 22 28 34 28 56 C28 74 16 86 0 86 C-16 86 -28 74 -28 58 C-28 42 -18 30 -10 18 C-8 30 -2 36 4 36 C2 26 0 16 2 6 Z" },
  ],
  drop: [{ d: "M0 -96 C22 -56 62 -16 62 28 C62 66 34 94 0 94 C-34 94 -62 66 -62 28 C-62 -16 -22 -56 0 -96 Z" }],
  x: [{ d: "M-80 -80 L80 80 M80 -80 L-80 80", fill: false, sw: 30 }],
  check: [{ d: "M-78 6 L-24 60 L82 -54", fill: false, sw: 30 }],
  question: [
    { d: "M-46 -40 C-46 -92 46 -96 46 -42 C46 -6 4 0 2 34", fill: false, sw: 32 },
    { d: circ(2, 80, 19) },
  ],
  exclaim: [{ d: "M0 -92 L0 34", fill: false, sw: 36 }, { d: circ(0, 80, 20) }],
  arrow: [{ d: "M-88 0 L70 0 M30 -42 L76 0 L30 42", fill: false, sw: 18 }],
  plus: [{ d: "M0 -56 V56 M-56 0 H56", fill: false, sw: 20 }],
  equals: [{ d: "M-54 -22 H54 M-54 22 H54", fill: false, sw: 20 }],
  phone: [
    { d: `${rrect(-50, -96, 100, 192, 18)} ${rrect(-38, -74, 76, 132, 4)}` },
    { d: circ(0, 78, 8) },
  ],
  car: [
    { d: "M-98 40 L-98 8 Q-98 -4 -86 -6 L-60 -10 L-36 -44 Q-30 -52 -18 -52 H34 Q46 -52 54 -44 L80 -12 L90 -8 Q98 -4 98 8 V40 Q98 46 92 46 H-92 Q-98 46 -98 40 Z M-26 -40 L-44 -12 H-4 V-40 Z M8 -40 V-12 H62 L44 -36 Q40 -40 34 -40 Z" },
    { d: `${circ(-52, 50, 24)} ${circ(-52, 50, 9)}` },
    { d: `${circ(54, 50, 24)} ${circ(54, 50, 9)}` },
  ],
  // helicopter, side view, nose right (air ambulance / rescue): cabin with window cut-out, tail boom + fin, main rotor, tail rotor, skids
  helicopter: [
    { d: "M-6 -28 H40 Q74 -28 92 2 Q98 14 92 22 Q86 30 70 30 H-14 Q-34 30 -38 12 L-40 -4 Q-40 -28 -6 -28 Z M44 -18 Q70 -16 82 4 H44 Z" },
    { d: "M-38 -10 L-96 -2 L-96 8 L-36 12 Z" },
    { d: "M-98 -22 L-88 -22 L-84 6 L-96 6 Z" },
    { d: "M-92 -62 H96 M6 -62 V-28", fill: false, sw: 8 },
    { d: "M-92 -18 V-34 M-100 -26 H-84", fill: false, sw: 5 },
    { d: "M-24 30 V46 M46 30 V46 M-44 48 H76 Q86 48 88 40", fill: false, sw: 7 },
  ],
  // gas cylinder / canister (CO2 tank, propane)
  canister: [
    { d: `${rrect(-36, -62, 72, 160, 30)}` },
    { d: "M-14 -62 V-80 H14 V-62 Z M-26 -88 H26 V-78 H-26 Z" },
    { d: "M-24 -10 H24", fill: false, sw: 6, o: 0 },
  ],
  extinguisher: [
    { d: `${rrect(-32, -50, 64, 148, 26)}` },
    { d: "M-12 -50 V-70 H12 V-50 Z" },
    { d: "M-8 -78 L28 -94 L44 -76 M10 -70 C40 -70 56 -50 58 -20 L66 18", fill: false, sw: 9 },
  ],
  house: [{ d: "M-86 -6 L0 -88 L86 -6 L70 -6 V96 H18 V40 H-18 V96 H-70 V-6 Z" }],
  cross: [{ d: "M-22 -86 H22 V-22 H86 V22 H22 V86 H-22 V22 H-86 V-22 H-22 Z" }],
  cloud: [{ d: "M-78 60 C-104 60 -110 22 -86 10 C-92 -22 -58 -38 -38 -22 C-30 -60 26 -66 40 -30 C66 -44 98 -22 88 8 C112 14 108 60 80 60 Z" }],
  bolt: [{ d: "M20 -98 L-60 12 H-8 L-24 98 L62 -18 H10 Z" }],
  clock: [{ d: circ(0, 0, 88), fill: false, sw: 14 }, { d: "M0 -54 V0 L38 24", fill: false, sw: 14 }],
  skull: [
    { d: "M0 -92 C52 -92 82 -58 82 -14 C82 16 66 34 52 40 V66 Q52 80 38 80 H-38 Q-52 80 -52 66 V40 C-66 34 -82 16 -82 -14 C-82 -58 -52 -92 0 -92 Z M-30 -30 a20 22 0 1 0 0.1 0 Z M30 -30 a20 22 0 1 0 0.1 0 Z M0 14 L-12 34 H12 Z" },
  ],
  speech: [
    { d: "M-86 -60 Q-86 -84 -62 -84 H62 Q86 -84 86 -60 V8 Q86 32 62 32 H-6 L-50 70 L-40 32 H-62 Q-86 32 -86 8 Z" },
  ],
  // ---- added for the c02-08 / c09-15 neon + diagram variants
  snowflake: [{ d: "M0 -92 V92 M-80 -46 L80 46 M-80 46 L80 -46 M-22 -78 L0 -56 L22 -78 M-22 78 L0 56 L22 78 M-78 -18 L-50 -30 L-58 -58 M78 18 L50 30 L58 58 M-78 18 L-50 30 L-58 58 M78 -18 L50 -30 L58 -58", fill: false, sw: 12 }],
  sun: [{ d: circ(0, 0, 44) }, { d: "M0 -92 V-62 M0 62 V92 M-92 0 H-62 M62 0 H92 M-65 -65 L-44 -44 M65 65 L44 44 M-65 65 L-44 44 M65 -65 L44 -44", fill: false, sw: 14 }],
  palm: [
    { d: "M6 96 C10 50 14 10 4 -40", fill: false, sw: 16 },
    { d: "M4 -40 C-30 -70 -70 -60 -92 -30 C-60 -50 -30 -48 4 -40 Z M4 -40 C30 -78 70 -74 92 -44 C60 -58 32 -54 4 -40 Z M4 -40 C-10 -80 -40 -96 -66 -92 C-36 -80 -16 -64 4 -40 Z M4 -40 C24 -86 52 -98 76 -90 C48 -80 26 -66 4 -40 Z" },
  ],
  wave: [{ d: "M-96 10 C-70 -30 -40 -30 -20 0 C0 30 30 30 50 0 C66 -24 86 -24 96 -10 M-96 60 C-70 20 -40 20 -20 50 C0 80 30 80 50 50 C66 26 86 26 96 40", fill: false, sw: 14 }],
  wristband: [{ d: "M-92 -6 a92 52 0 1 0 184 0 a92 52 0 1 0 -184 0 Z M-72 -12 a72 36 0 1 0 144 0 a72 36 0 1 0 -144 0 Z" }, { d: rrect(-30, 22, 60, 44, 8) }, { d: "M-14 36 H14 M-14 50 H14", fill: false, sw: 5, o: 0 }],
  chip: [{ d: rrect(-40, -40, 80, 80, 8) }, { d: "M-24 -60 V-44 M0 -60 V-44 M24 -60 V-44 M-24 44 V60 M0 44 V60 M24 44 V60 M-60 -24 H-44 M-60 0 H-44 M-60 24 H-44 M44 -24 H60 M44 0 H60 M44 24 H60", fill: false, sw: 8 }],
  locker: [{ d: `${rrect(-60, -96, 120, 192, 8)} ${rrect(-46, -82, 92, 164, 4)}` }, { d: "M-30 -66 H30 M-30 -54 H30 M-30 -42 H30", fill: false, sw: 6 }, { d: rrect(22, -6, 12, 30, 4) }],
  // zoo set (2026-10-18, zoo builder ic): side-view animal silhouettes, base at +100 like the people (filled; "line" mode strokes them)
  orca: [
    { d: "M100 4 Q98 -14 76 -20 Q40 -28 8 -26 L-4 -90 Q-16 -60 -24 -24 Q-60 -16 -84 -2 L-100 -9 Q-95 0 -100 11 L-84 6 Q-60 24 -10 34 Q50 40 84 26 Q100 18 100 4 Z" },
    { d: "M28 30 Q22 54 4 66 Q30 60 44 32 Z" },
    { d: "M56 -12 Q70 -17 82 -11 Q71 -5 56 -8 Z" },
  ],
  tiger: [
    { d: "M-64 -6 Q-24 -20 34 -16 Q50 -34 70 -34 Q92 -32 98 -16 Q100 -2 88 2 L72 4 Q68 16 60 20 L60 92 Q60 100 51 100 Q43 100 43 92 L40 30 Q8 36 -30 30 L-36 92 Q-36 100 -45 100 Q-53 100 -53 92 L-54 26 Q-64 16 -66 4 Q-82 10 -92 30 Q-96 36 -100 32 Q-94 10 -78 -2 Z" },
    { d: "M70 -34 L74 -48 L82 -34 Z" },
  ],
  meat: [{ d: "M-70 -10 Q-80 -50 -40 -60 Q0 -70 40 -50 Q80 -30 70 10 Q60 50 10 54 Q-50 58 -66 30 Q-74 16 -70 -10 Z M-20 -10 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 Z" }],
  raft: [{ d: `${circ(0, 0, 92)} ${circ(0, 0, 58)}` }, { d: circ(0, -75, 9) }, { d: circ(75, 0, 9) }, { d: circ(0, 75, 9) }, { d: circ(-75, 0, 9) }],
  actioncam: [{ d: `${rrect(-80, -54, 160, 108, 16)} ${circ(14, 0, 34)}` }, { d: circ(14, 0, 18) }, { d: rrect(-66, -74, 40, 20, 4) }],
  lock: [{ d: "M-40 -10 V-40 C-40 -90 40 -90 40 -40 V-10", fill: false, sw: 18 }, { d: `${rrect(-62, -14, 124, 104, 14)} ${circ(0, 30, 12)}` }],
  letter: [{ d: `${rrect(-92, -60, 184, 120, 10)}`, fill: false, sw: 12 }, { d: "M-86 -52 L0 14 L86 -52", fill: false, sw: 10 }],
  lockerOpen: [{ d: rrect(-60, -96, 120, 192, 8), fill: false, sw: 12 }, { d: "M-54 -90 L-118 -70 L-118 98 L-54 90 Z" }, { d: "M-60 -40 H54 M-60 20 H54", fill: false, sw: 6 }],
  rock: [
    { d: "M-70 96 L-92 40 L-60 -6 L-10 -20 L40 6 L84 44 L74 96 Z M-40 -30 L-22 -70 L10 -78 L24 -48 L0 -34 Z M30 -40 L50 -92 L76 -70 L64 -30 Z" },
    { d: "M-34 70 L-4 34 M30 70 L46 44", fill: false, sw: 6, o: 0 },
  ],
  rain: [
    { d: "M-80 -10 C-104 -10 -110 -46 -86 -58 C-92 -90 -58 -104 -38 -88 C-30 -122 26 -126 40 -94 C66 -106 98 -86 88 -58 C112 -52 108 -10 80 -10 Z" },
    { d: "M-58 24 L-70 54 M-18 24 L-30 54 M22 24 L10 54 M62 24 L50 54 M-38 70 L-50 98 M2 70 L-10 98 M42 70 L30 98", fill: false, sw: 10 },
  ],
  gate: [{ d: "M-90 96 V-60 M90 96 V-60 M-90 -40 H90 M-90 20 H90 M-60 -40 V96 M-30 -40 V96 M0 -40 V96 M30 -40 V96 M60 -40 V96", fill: false, sw: 10 }],
  balloon: [{ d: "M0 -96 C40 -96 56 -60 56 -36 C56 0 22 26 0 30 C-22 26 -56 0 -56 -36 C-56 -60 -40 -96 0 -96 Z" }, { d: "M0 30 C-10 50 10 66 0 96", fill: false, sw: 6 }],
  spine: [{ d: circ(0, -66, 26) }, { d: "M0 -36 V 96", fill: false, sw: 6 }, { d: "M-16 -26 H16 M-18 -6 H18 M-18 14 H18 M-18 34 H18 M-16 54 H16 M-14 74 H14", fill: false, sw: 12 }],
  hands: [{ d: "M-96 40 C-96 -10 -76 -60 -56 -70 C-46 -74 -40 -64 -42 -54 L-48 -10 M96 40 C96 -10 76 -60 56 -70 C46 -74 40 -64 42 -54 L48 -10", fill: false, sw: 18 }],
};

export type GlyphName = keyof typeof GLYPHS | string;

/** one glyph in a colour (no glow). size = px height of the 200-unit box. mode "line" strokes every part. */
export const Glyph: React.FC<{ name: GlyphName; colour: string; size?: number; mode?: "neon" | "line"; lineW?: number; draw?: number }> = ({ name, colour, size = 200, mode = "neon", lineW = 7, draw = 1 }) => {
  const g = GLYPHS[name] ?? GLYPHS.question;
  const k = size / 200;
  return (
    <g transform={`scale(${k.toFixed(4)})`}>
      {g.map((p, i) => {
        const filled = mode === "neon" && p.fill !== false;
        const sw = filled ? 0 : (p.sw ?? lineW) * (mode === "line" && p.fill !== false ? 1 : 1);
        if (p.o === 0) return null;
        return (
          <path key={i} d={p.d} fill={filled ? colour : "none"} fillRule="evenodd" stroke={filled ? "none" : colour} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
            pathLength={draw < 1 ? 1 : undefined} strokeDasharray={draw < 1 ? `${draw} 1` : undefined} />
        );
      })}
    </g>
  );
};

/** VV §7 neon halo: tight 3 px core + 14 px + 36 px bloom in the glyph colour (scale = current on-screen scale of the parent) */
export const neonFilter = (c: string, scale = 1, strength = 1) =>
  `drop-shadow(0 0 ${(3 * scale).toFixed(2)}px ${c}) drop-shadow(0 0 ${(14 * scale).toFixed(2)}px ${c}) drop-shadow(0 0 ${(36 * scale).toFixed(2)}px ${hexA(c, 0.5 * strength)})`;
export const hexA = (c: string, a: number) => {
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (!m) return c;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a.toFixed(3)})`;
};

/** a neon glyph at (x, y) with rotation / scaleX / scaleY / opacity; soft = core blur (VV glyphs are slightly soft) */
export const NeonGlyph: React.FC<{ name: GlyphName; colour: string; x: number; y: number; size?: number; rot?: number; sx?: number; sy?: number; o?: number; soft?: number; draw?: number }> = ({
  name, colour, x, y, size = 200, rot = 0, sx = 1, sy = 1, o = 1, soft = 0.6, draw = 1,
}) => (
  <g transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rot.toFixed(3)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`} opacity={o} style={{ filter: `${neonFilter(colour)}${soft > 0 ? ` blur(${soft}px)` : ""}` }}>
    <Glyph name={name} colour={colour} size={size} draw={draw} />
  </g>
);

/** VV neon palette (MOTION.md §7) */
export const NEON = { white: "#FDFCFD", magenta: "#E3006B", blue: "#2A3BFF", yellow: "#F3FF0C", green: "#88FF72", red: "#FF1A2A", orange: "#FF7A1A", cyan: "#3FE6FF" };
