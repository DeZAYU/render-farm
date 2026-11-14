// dash1 kit: small theme helpers shared by the Dashcam "INSTRUMENT" set (caseopener/OsdLine, labels/SceneTitle, stat/OsdLift,
// transition/DoubleFlashSkip, labels/SpeakerCaptions, title/VideoWall). REF Dashcam/study/REFERENCE_SYNTHESIS.md §H2 Direction A.
// Every dash1 template reads accent / faces from a Theme (default DASH: needle orange #FF5A1F, D-DIN / D-DIN Exp).
import { CAP, FONT, H, W } from "../../core";
import type { Theme } from "../../core";

/** cap-height / em ratio of a library face (CSS family name) */
const RATIO: Record<string, number> = Object.fromEntries((Object.keys(FONT) as (keyof typeof FONT)[]).map((k) => [FONT[k], CAP[k]]));
export const capRatio = (face: string) => RATIO[face] ?? 0.7;
/** font size for a target cap height in a theme face */
export const fsOf = (face: string, cap: number) => cap / capRatio(face);
/** CSS font string for measure(): weight size "family" */
export const fontStr = (t: { face: string; weight: number }, size: number) => `${t.weight} ${size.toFixed(2)}px "${t.face}"`;

/** mix two #rrggbb colours (t = 0 -> a, 1 -> b) */
export const mixHex = (a: string, b: string, t: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};

/** source px rect [x, y, w, h] of the 1920x1080 media -> screen rect under the FootPlate centre push s */
export type SrcRect = [number, number, number, number];
export const scrRect = (r: SrcRect, s: number) => ({ x: W / 2 + (r[0] - W / 2) * s, y: H / 2 + (r[1] - H / 2) * s, w: r[2] * s, h: r[3] * s });

/** dark legibility shadow for type sitting directly on footage (no plate) */
export const SHADOW_ON_FOOTAGE = "0 2px 4px rgba(0,0,0,.85), 0 0 14px rgba(0,0,0,.45)";
/** accent glow for the key word (theme accentGlow) */
export const accentGlow = (th: Theme, k = 1) => `0 0 ${(10 * k).toFixed(1)}px ${th.accentGlow}, 0 2px 4px rgba(0,0,0,.8)`;
