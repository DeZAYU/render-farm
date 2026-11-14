// PROMOTED to core (was src/templates/toll/shared.tsx); shared by several families. Import as "../../core/kits/toll".
// Shared parts for the pixel-people toll family (Farrell YT pixel glyphs / CC 12:41 glowing icon; core PP_PATH = 7 x 13 cells).
import React from "react";
import { AbsoluteFill } from "remotion";
import { PP_PATH, rng } from "../index";

export const PP_W = 7, PP_H = 13;
export const GREY = "#3B3D3F", RED = "#E0101A", WHITE = "#ECEEEE";
export const RED_GLOW = "drop-shadow(0 0 4px rgba(255,30,40,.85)) drop-shadow(0 0 16px rgba(220,10,20,.55))";
export const WHITE_GLOW = "drop-shadow(0 0 4px rgba(255,255,255,.55)) drop-shadow(0 0 14px rgba(200,220,255,.25))";

/** <defs> holding the glyph; use <use href="#<id>"> per person */
export const PPDefs: React.FC<{ id?: string }> = ({ id = "pp" }) => (
  <defs><path id={id} d={PP_PATH} /></defs>
);
/** one person at (x, y) top-left, cell size px */
export const P: React.FC<{ x: number; y: number; px: number; fill: string; o?: number; id?: string; sx?: number; sy?: number }> = ({ x, y, px, fill, o = 1, id = "pp", sx = 1, sy = 1 }) => (
  <use href={`#${id}`} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${(px * sx).toFixed(3)} ${(px * sy).toFixed(3)})`} fill={fill} opacity={o} />
);

/** Farrell R16 pixel texture: a fine dark grid over large glyphs (3-4 px cells) */
export const PixelTexture: React.FC<{ cell?: number; k?: number }> = ({ cell = 4, k = 0.32 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply",
    background: `repeating-linear-gradient(0deg, rgba(0,0,0,${k}) 0 1px, transparent 1px ${cell}px), repeating-linear-gradient(90deg, rgba(0,0,0,${k}) 0 1px, transparent 1px ${cell}px)` }} />
);

/** the dark plate with a soft edge vignette */
export const Plate: React.FC<{ children?: React.ReactNode; bg?: string }> = ({ children, bg = "#050505" }) => (
  <AbsoluteFill style={{ background: bg }}>
    {children}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.75) 100%)", pointerEvents: "none" }} />
  </AbsoluteFill>
);

/** n distinct seeded indices out of total, avoiding the border cells of a cols x rows grid, sorted left->right */
export const pickSpread = (n: number, cols: number, rows: number, seed = 11) => {
  const r = rng(seed);
  const set = new Set<number>();
  let guard = 0;
  while (set.size < Math.min(n, cols * rows) && guard++ < 100000) {
    const i = Math.floor(r() * cols * rows), c = i % cols, rr = Math.floor(i / cols);
    if ((cols < 6 || (c > 0 && c < cols - 1)) && (rows < 4 || (rr > 0 && rr < rows - 1))) set.add(i);
  }
  return [...set].sort((a, b) => (a % cols) - (b % cols));
};

/** "1,234" */
export const fmt = (v: number) => Math.round(v).toLocaleString("en-US");
