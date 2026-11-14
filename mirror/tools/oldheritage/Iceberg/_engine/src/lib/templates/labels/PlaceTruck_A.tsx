// labels / PlaceTruck_A (EDITOR A sibling of TitlePlace / SceneTitle; Amusement Park 2026-10-19).
// REF TitlePlace (Varela cap 113/96, red rule #FD292D glow 14, words blur-in 3-4 f, stagger 6-8 f) + FA F1 1:32.9 place-in-shot + VV 2026
// continuous camera. The place sits IN the scene: the footage trucks sideways (constant, inside the linear push) and the label rides a nearer
// parallax layer (1.35 x the truck) so it reads as part of the shot, not pasted on top. Line 1 white, line 2 with the red key word; the red
// rule draws under line 1 on its word (EZ.quick, 14 f). Exit: 20 f ease-in + 3 px blur while the drift continues. Silent.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, RoundText, W, clamp01, roundWidth } from "../../core";
import { SH_WHITE, glowRed } from "../../core/kits/labels";

export type PWord = { text: string; at: number; red?: boolean };
export type PlaceTruckAProps = { line1: PWord[]; line2?: PWord[]; cap?: number; cap2?: number; x?: number; y?: number; truck?: number; exitAt?: number; ruleAt?: number; band?: number };
const RULE = "#FD292D";
export const PlaceTruck_A: React.FC<PlaceTruckAProps> = ({ line1, line2 = [], cap = 104, cap2 = 62, x = 150, y = 560, truck = -30, exitAt, ruleAt, band = 0.5 }) => {
  const f = useCurrentFrame();
  const a0 = line1[0].at;
  if (f < a0 - 4) return null;
  const k0 = f - a0;
  const dx = 1.35 * truck * (Math.max(0, k0) / 30) * clamp01(k0 / 20);
  const ex = exitAt === undefined ? 0 : EZ.in2((f - exitAt) / 20);
  const word = (w: PWord, c: number, i: number) => {
    const k = f - w.at; if (k < 0) return null;
    const o = EZ.out2(k / 8); const b = 5 * (1 - clamp01(k / 4)); const r = 18 * (1 - EZ.out3(k / 22));
    return (
      <div key={i} style={{ opacity: o, transform: `translateY(${r.toFixed(2)}px)`, filter: `${w.red ? glowRed() : SH_WHITE}${b > 0.05 ? ` blur(${b.toFixed(2)}px)` : ""}` }}>
        <RoundText text={w.text} cap={c} colour={w.red ? "#F22522" : "#FDFDFD"} />
      </div>
    );
  };
  const w1 = line1.reduce((a, w) => a + roundWidth(w.text, cap), 0) + cap * 0.3 * (line1.length - 1);
  const ru = ruleAt === undefined ? 0 : EZ.quick(clamp01((f - ruleAt) / 14));
  return (
    <AbsoluteFill style={{ opacity: 1 - ex, filter: ex > 0 ? `blur(${(3 * ex).toFixed(2)}px)` : undefined }}>
      <div style={{ position: "absolute", left: x - 260 + dx * 0.6, top: y - cap * 1.9, width: Math.max(1300, w1 + 600), height: cap * 4.2, opacity: band * clamp01((k0 + 4) / 12),
        background: "radial-gradient(ellipse 50% 50% at 42% 50%, rgba(0,0,0,.8) 0%, rgba(0,0,0,.38) 55%, rgba(0,0,0,0) 100%)" }} />
      <div style={{ position: "absolute", left: x + dx, top: y - cap * 1.25, display: "flex", gap: cap * 0.3 }}>{line1.map((w, i) => word(w, cap, i))}</div>
      {ru > 0 ? <div style={{ position: "absolute", left: x + dx, top: y + cap * 0.18, width: Math.min(W, w1) * ru, height: 6, background: RULE, boxShadow: "0 0 14px rgba(253,41,45,.75)" }} /> : null}
      <div style={{ position: "absolute", left: x + dx, top: y + cap * 0.55, display: "flex", gap: cap2 * 0.3 }}>{line2.map((w, i) => word(w, cap2, i))}</div>
    </AbsoluteFill>
  );
};
