// PROMOTED to core (was src/templates/stat/shared.tsx); shared by several families. Import as "../../core/kits/stat".
// stat shared: the DD stat pop curves (Dashcam Vol.3 E5 "23 years" @1:47.87, measured) + Farrell 7-segment digits (wp3 refsys SevenSeg).
import React from "react";
import { EZ, clamp01, lerp } from "../index";

/** D3 E5 number: alpha .19 -> .82 in 5 f, dip to .77, 1.0 by ~20 f (a small pulse); rises 8 px over 6 f */
export const numPop = (k: number) => {
  if (k < 0) return { o: 0, y: 8 };
  const o = k < 5 ? lerp(0.19, 0.82, k / 5) : k < 8 ? lerp(0.82, 0.77, (k - 5) / 3) : k < 20 ? lerp(0.77, 1, (k - 8) / 12) : 1;
  return { o, y: 8 * (1 - EZ.out3(k / 6)) };
};
/** D3 E5 red word: rises 46 px -> settle, alpha .2 -> .99 over 21 f, ease-out; vertical velocity (for a smear blur) */
export const wordPop = (k: number) => {
  if (k < 0) return { o: 0, y: 46, v: 0 };
  const r = EZ.out3(k / 21);
  const v = k < 21 ? 46 * (EZ.out3((k + 1) / 21) - EZ.out3(k / 21)) : 0;
  return { o: 0.2 + 0.79 * clamp01(k / 12), y: 46 * (1 - r), v };
};

/** 7-segment digits (Farrell T8, DSEG7 class), SVG polygons; unlit segments ghost at 7 %. Supports 0-9, '-', ' ', ':', '.', ','. */
const SEG: Record<string, string> = { "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g", " ": "" };
export const SevenSeg: React.FC<{ text: string; h: number; colour: string; ghost?: number }> = ({ text, h, colour, ghost = 0.07 }) => {
  const w = h * 0.52, t = h * 0.1;
  let x = 0;
  const parts: React.ReactNode[] = [];
  for (const [i, ch] of [...text].entries()) {
    if (ch === ":" || ch === "." || ch === ",") {
      const cw = h * 0.22;
      const dots = ch === ":" ? [h * 0.32, h * 0.7] : [h * 0.94];
      dots.forEach((dy, j) => parts.push(<rect key={`${i}d${j}`} x={x + cw / 2 - t / 2} y={dy - t / 2} width={t} height={t} fill={colour} />));
      x += cw;
      continue;
    }
    const on = SEG[ch] ?? "";
    const g = t * 0.15, m = h / 2;
    const s = (k: string, pts: number[][]) => <polygon key={`${i}${k}`} points={pts.map(([px, py]) => `${x + px},${py}`).join(" ")} fill={colour} opacity={on.includes(k) ? 1 : ghost} />;
    parts.push(
      s("a", [[g + t / 2, 0], [w - g - t / 2, 0], [w - g - t, t], [g + t, t]]),
      s("d", [[g + t, h - t], [w - g - t, h - t], [w - g - t / 2, h], [g + t / 2, h]]),
      s("g", [[g + t, m - t / 2], [w - g - t, m - t / 2], [w - g - t / 2, m], [w - g - t, m + t / 2], [g + t, m + t / 2], [g + t / 2, m]]),
      s("f", [[0, g + t / 2], [t, g + t], [t, m - g - t / 2], [0, m - g]]),
      s("b", [[w, g + t / 2], [w, m - g], [w - t, m - g - t / 2], [w - t, g + t]]),
      s("e", [[0, m + g], [t, m + g + t / 2], [t, h - g - t], [0, h - g - t / 2]]),
      s("c", [[w, m + g], [w, h - g - t / 2], [w - t, h - g - t], [w - t, m + g + t / 2]]),
    );
    x += w + h * 0.14;
  }
  return <svg width={x} height={h} style={{ overflow: "visible", transform: "skewX(-4.5deg)", display: "block" }}>{parts}</svg>;
};
/** width of a SevenSeg string */
export const segWidth = (text: string, h: number) => [...text].reduce((a, ch) => a + (ch === ":" || ch === "." || ch === "," ? h * 0.22 : h * 0.52 + h * 0.14), 0);

/** number formatting for counters */
export const fmt = (v: number, mode: "int" | "comma" | "time" | "money", decimals = 0) => {
  if (mode === "time") { const s = Math.max(0, Math.round(v)); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }
  const n = Number(v.toFixed(decimals));
  if (mode === "int") return n.toFixed(decimals);
  const str = n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return mode === "money" ? `$${str}` : str;
};
