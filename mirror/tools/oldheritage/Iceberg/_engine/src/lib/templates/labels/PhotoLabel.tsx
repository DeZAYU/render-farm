// labels / PhotoLabel: REF Farrell text T1b "label baked into a photo that pushes" (GF 'Dallas' 7:22-7:32: regular grotesk ink .063 H #DDE0D6,
// the label RIDES the photo push, push linear ~ +1.4 %/s) + Farrell camera R5 flash-decay entry @8:33.08 (incoming frames 1-3 lifted
// w .87/.71/.50). wp3 sec_A ParkPhoto @ abs 852 (approved). OUR TWIST: the words pop 1 f on their spoken words (FA text R2) instead of a fade-up.
// Use for a place name on a real photo of the place (Commons / news photo), not on footage.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DECAY3, FONT, H, Media, Vignette, W, envAt } from "../../core";
import type { Word } from "./kit";

export type PhotoLabelProps = { src: string; words: Word[]; y?: number; ink?: number; pos?: string; origin?: string; rate?: number; colour?: string };
export const PhotoLabel: React.FC<PhotoLabelProps> = ({ src, words, y = 0.11 * H, ink = 0.063 * H, pos = "50% 40%", origin = "50% 42%", rate = 0.014, colour = "#DDE0D6" }) => {
  const f = useCurrentFrame();
  const sc = 1.04 * Math.exp(rate * (f / 30));
  const w = envAt(DECAY3, f);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${sc.toFixed(5)})`, transformOrigin: origin }}>
        <Media src={src} pos={pos} />
        <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,.42), rgba(0,0,0,0) 34%)" }} />
        <div style={{ position: "absolute", left: 0, top: y, width: W, display: "flex", justifyContent: "center", gap: ink * 0.32 }}>
          {words.map((x, i) => (
            <span key={i} style={{ fontFamily: FONT.inter, fontWeight: 500, fontSize: ink / 0.727, lineHeight: 1, letterSpacing: "0.01em", color: colour, opacity: f >= x.at ? 1 : 0,
              textShadow: "0 2px 4px rgba(0,0,0,.55), 0 0 22px rgba(0,0,0,.45)" }}>{x.text}</span>
          ))}
        </div>
      </AbsoluteFill>
      <Vignette />
      {w > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: w }} /> : null}
    </AbsoluteFill>
  );
};
