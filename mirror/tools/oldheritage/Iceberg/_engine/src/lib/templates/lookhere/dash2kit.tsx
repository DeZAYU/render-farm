// Shared helpers for the dash2 template set (Dashcam "INSTRUMENT"): theme-aware cap sizing + the theme chip (HudBox recipe in theme colours).
import React from "react";
import { CAP, EZ, FONT, H, W, measure, type Theme } from "../../core";

/** font size for a target cap height in ANY library face (looks the face up in FONT -> CAP; unknown faces use 0.70) */
export const themeFs = (face: string, cap: number) => {
  const key = (Object.keys(FONT) as (keyof typeof FONT)[]).find((k) => FONT[k] === face);
  const r = key && key in CAP ? CAP[key as keyof typeof CAP] : 0.7;
  return cap / r;
};
/** CSS font string for a theme slot */
export const themeFont = (slot: { face: string; weight: number }, cap: number) => `${slot.weight} ${themeFs(slot.face, cap)}px "${slot.face}"`;

/** HudBox-like chip in theme colours: leader draws 6 f from the head to the elbow, box wipes L->R 6 f, then the text (D1 E4 numbers) */
export const ThemeChip: React.FC<{ k: number; p: { x: number; y: number }; elbow: { x: number; y: number }; text: string; cap: number; theme: Theme; o?: number }> = ({ k, p, elbow, text, cap, theme, o = 1 }) => {
  if (k < 0) return null;
  const f = themeFs(theme.text.face, cap);
  const font = `${theme.text.weight} ${f}px "${theme.text.face}"`;
  const tw = measure(text, font) + 40, bh = Math.round(cap * 2.0);
  const dir = elbow.x >= p.x ? 1 : -1;
  const bx = dir === 1 ? elbow.x : elbow.x - tw, by = elbow.y - bh / 2;
  const lk = EZ.out2(k / 6), bk = EZ.out3((k - 4) / 6), tk = EZ.out2((k - 9) / 6);
  const L = Math.hypot(elbow.x - p.x, elbow.y - p.y);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={p.x} y1={p.y} x2={elbow.x} y2={elbow.y} stroke={theme.accent} strokeWidth={3} strokeDasharray={`${L * lk} ${L + 10}`} style={{ filter: `drop-shadow(0 0 4px ${theme.accentGlow})` }} />
        {bk > 0 ? <rect x={dir === 1 ? bx : bx + tw * (1 - bk)} y={by} width={tw * bk} height={bh} fill={theme.plateDark} stroke={theme.accent} strokeWidth={3} /> : null}
      </svg>
      <div style={{ position: "absolute", left: bx + 20, top: by, height: bh, display: "flex", alignItems: "center", whiteSpace: "pre", fontFamily: theme.text.face, fontWeight: theme.text.weight,
        fontSize: f, color: theme.neutral, opacity: tk, transform: `translateY(${(6 * (1 - tk)).toFixed(1)}px)`, textShadow: "0 2px 6px rgba(0,0,0,.85)" }}>{text}</div>
    </div>
  );
};

