// transition / GlitchStreak: Dashcam Vol.3 F2 soft glitch-streak (54 uses; STUDY §F2 + recipe I5), 9 f, cut at frame 1:
// frames 0-2 white haze .45 + 3 horizontal streak bars with a sideways slice offset, then the haze decays in 2-FRAME HOLDS .30 .30 .20 .20 .08
// (the stepped decay is the signature). Use for shot changes inside a case and into raws. Our version: the two frames around the cut also
// shift 3 thin bands of the picture sideways (the "glitch" half), seeded.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { rng } from "../../core";
import { Cut, type TransitionProps } from "./shared";

const HAZE = [0.45, 0.45, 0.45, 0.3, 0.3, 0.2, 0.2, 0.08, 0.08];
export type GlitchStreakProps = TransitionProps & { seed?: number };
export const GlitchStreak: React.FC<GlitchStreakProps> = (p) => {
  const f = useCurrentFrame();
  const k = Math.floor(f - p.cut) + 1; // frame index of the 9-f event (cut at 1)
  const on = k >= 0 && k < HAZE.length;
  const r = rng((p.seed ?? 3) * 97 + k * 13);
  const bands = on && k <= 2 ? Array.from({ length: 3 }, () => ({ y: 8 + r() * 80, h: 2 + r() * 7, dx: (r() - 0.5) * 140 })) : [];
  const streaks = on && k <= 3 ? Array.from({ length: 3 }, () => ({ y: 100 + r() * 880, h: 3 + r() * 8 })) : [];
  return (
    <AbsoluteFill>
      <Cut {...p} />
      {bands.map((b, i) => (
        <AbsoluteFill key={i} style={{ clipPath: `inset(${b.y}% 0 ${Math.max(0, 100 - b.y - b.h)}% 0)`, transform: `translateX(${b.dx}px)` }}>
          <Cut {...p} />
        </AbsoluteFill>
      ))}
      {on ? <AbsoluteFill style={{ background: "#fff", opacity: HAZE[k] }} /> : null}
      {streaks.map((s, i) => (
        <div key={`s${i}`} style={{ position: "absolute", left: -100, top: s.y, width: 2200, height: s.h, background: "#fff", opacity: 0.85, filter: "blur(1.5px)", boxShadow: "0 0 30px 8px rgba(255,255,255,.45)" }} />
      ))}
    </AbsoluteFill>
  );
};
