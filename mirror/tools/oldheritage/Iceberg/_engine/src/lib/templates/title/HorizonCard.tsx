// title / HorizonCard: VV §3 date card with a horizon line (MOTION.md §3: 17:42 "1987 / WITNESS A CRIME", 22:40 "2009 / VIDEO LEAKED ON YOUTUBE");
// wp3 sec_A DateCard @ abs 1204 (approved "2020 / FIVE YEARS LATER"). Rendered ON TWOS. 2 px white line at 0.59 H draws from the left (8 f);
// the small white year slides in from the right; the amber Bebas subtitle slides right -> centre in 22 f (bezier .221,.496,.454,1.01, 3 px
// overshoot) then floats +-8 px; a torn-edge B/W print rises FROM BEHIND the line (masked below it, 20 f ease-out) and turns colour over 4 f
// with a x1.15 amber bloom. Hard cut out.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { EZ, FONT, H, Media, RC, W, clamp01, lerp, onTwos } from "../../core";
import { tornClip } from "./torn";

export type HorizonCardProps = {
  year: string; subtitle: string; media: string;
  subAt?: number; colourAt?: number; badge?: { text: string; at: number };
  accent?: string; // subtitle colour (VV amber #D0B53E; teal #DDF6F2 alternative)
  /** cap heights (px): year (default 38), badge (default 28) - M-024 >= 28 */
  yearCap?: number; badgeCap?: number;
};
export const HorizonCard: React.FC<HorizonCardProps> = ({ year, subtitle, media, subAt = 23, colourAt = 60, badge, accent = RC.vvAmber, yearCap = 38, badgeCap = 28 }) => {
  const g = onTwos(useCurrentFrame());
  const LINE_Y = Math.round(0.59 * H);
  const lineW = W * clamp01((g - 2) / 8);
  const yearX = lerp(W + 140, W / 2, EZ.dateSlide((g - 0) / 22));
  const sk = EZ.dateSlide((g - subAt) / 22);
  const subDx = lerp(W * 0.62, 0, sk) + (g > subAt + 22 ? 8 * Math.sin(((g - subAt - 22) / 24) * Math.PI) : 0);
  const pk = EZ.out3((g - (subAt + 6)) / 20);
  const pw = 1000, ph = 562;
  const top = lerp(LINE_Y + 10, 72, pk);
  const col = clamp01((g - colourAt) / 4);
  const bloom = 1 + 0.15 * col;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 40%, rgba(70,52,18,.30), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: LINE_Y, overflow: "hidden" }}>
        {g >= subAt + 6 ? (
          <div style={{ position: "absolute", left: W / 2 - pw / 2, top, width: pw, height: ph, transform: "rotate(-1.2deg)", clipPath: tornClip(pw, ph, 11, 8) }}>
            <Sequence from={subAt + 6} layout="none"><Media src={media} style={{ filter: `grayscale(${(1 - col).toFixed(3)}) contrast(1.08)` }} /></Sequence>
            {badge ? <div style={{ position: "absolute", right: 22, bottom: 30, padding: "3px 9px", borderRadius: 6, background: "rgba(0,0,0,.82)", fontFamily: FONT.inter, fontWeight: 600, fontSize: badgeCap / 0.727, color: "#fff", opacity: g >= badge.at ? 1 : 0 }}>{badge.text}</div> : null}
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 0, top: LINE_Y - 1, width: lineW, height: 2, background: "#F4F4F4", boxShadow: "0 0 6px rgba(255,255,255,.5)" }} />
      <div style={{ position: "absolute", left: yearX, top: LINE_Y + 26, transform: "translateX(-50%)", fontFamily: FONT.inter, fontWeight: 400, fontSize: yearCap / 0.727, color: "#F2F2F2", letterSpacing: "0.08em" }}>{year}</div>
      {g >= subAt ? (
        <div style={{ position: "absolute", left: 0, width: W, top: LINE_Y + 84, textAlign: "center", transform: `translateX(${subDx.toFixed(1)}px)`, fontFamily: FONT.bebas, fontSize: 128, letterSpacing: "0.05em", color: accent,
          textShadow: `0 0 ${(6 * bloom).toFixed(1)}px ${accent}, 0 0 ${(18 * bloom).toFixed(1)}px rgba(168,112,42,.55), 0 0 ${(40 * bloom).toFixed(1)}px rgba(90,60,30,.5)` }}>{subtitle}</div>
      ) : null}
    </AbsoluteFill>
  );
};
