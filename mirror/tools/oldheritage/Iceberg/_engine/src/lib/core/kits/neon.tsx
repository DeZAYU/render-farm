// PROMOTED to core (was src/templates/neon/shared.tsx); shared by several families. Import as "../../core/kits/neon".
// Shared bits for the neon family: Bebas caption words (VV §9 hard word pop: no fade, no glow), the black neon stage with a coloured floor
// pool of light (VV 1:44.1 crowd: red light pooled under the figures), and the item type used by the pictogram variants.
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, H, W } from "../index";
import { hexA } from "./glyphs";

export type CapWord = { t: string; at: number; colour?: string };
/** VV §9: Bebas Neue words that pop hard on their spoken word (1 f, no fade), centred row */
export const PopCaption: React.FC<{ f: number; words: CapWord[]; y?: number; size?: number; gap?: number }> = ({ f, words, y = H - 250, size = 120, gap = 0.28 }) => (
  <div style={{ position: "absolute", left: 0, top: y, width: W, display: "flex", justifyContent: "center", gap: size * gap, fontFamily: FONT.bebas, fontSize: size, letterSpacing: "0.06em", lineHeight: 1 }}>
    {words.map((w, i) => <span key={i} style={{ color: w.colour ?? "#FDFCFD", opacity: f >= w.at ? 1 : 0 }}>{w.t}</span>)}
  </div>
);

/** pure black stage + optional soft floor light under the glyphs (screen px) */
export const NeonStage: React.FC<{ floor?: { colour: string; x?: number; y?: number; rx?: number; ry?: number; o?: number }; children: React.ReactNode }> = ({ floor, children }) => (
  <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    {floor ? (
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${floor.rx ?? 34}% ${floor.ry ?? 12}% at ${((floor.x ?? W / 2) / W) * 100}% ${((floor.y ?? H * 0.72) / H) * 100}%, ${hexA(floor.colour, floor.o ?? 0.32)}, rgba(0,0,0,0) 100%)` }} />
    ) : null}
    {children}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
  </AbsoluteFill>
);
