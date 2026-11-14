// AM12 StripStack: the real AlicantePlaza report on the 2017 appeal ruling (21 Mar 2017; captured with _tools/capture_page.py) cut into
// paper strips of its own lines - masthead + headline + dateline, the court's sentence that the nylon strap was torn ("rasgado de su
// cincha o eslinga de nylon"), and the passage on the loose seat cover ("coquilla") whose hard plastic edges could cut the strap. The
// strips arrive one by one from below into the light over the dimmed ride footage, each earlier strip lifting away and sinking back into
// depth (smaller, darker, softer), a slow camera drift. One thin red rule under the torn-strap phrase; a soft light band later sweeps the
// line about the plastic edges (no colour). Nothing re-typed.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type Strip = { src: string; w: number; h: number; at: number; scale: number; rule?: { box: [number, number, number, number]; at: number }; band?: { y0: number; y1: number; at: number } };

export const StripStack: React.FC<{ strips: Strip[]; bg: string; bgFrom?: number }> = ({ strips, bg, bgFrom = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const drift = io(f / dur);
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.15 + 0.05 * drift})` }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px) brightness(.24) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 40%" }}>
        {strips.map((s, i) => {
          if (f < s.at - 2) return null;
          const inn = out(interpolate(f, [s.at, s.at + 24], [0, 1], cl));
          // how many later strips have arrived: each pushes this one up and back
          const pushed = strips.slice(i + 1).reduce((m, n) => m + io(interpolate(f, [n.at, n.at + 26], [0, 1], cl)), 0);
          const y = (1 - inn) * 420 - pushed * 300, z = -pushed * 520, dim = Math.max(0.25, 1 - pushed * 0.5);
          const rot = (i % 2 ? 1.2 : -1.4) + 0.5 * drift;
          const ru = s.rule ? out(interpolate(f, [s.rule.at, s.rule.at + 14], [0, 1], cl)) : 0;
          const bu = s.band ? interpolate(f, [s.band.at, s.band.at + 40], [-0.2, 1.2], cl) : -1;
          return (
            <div key={i} style={{ position: "absolute", left: 960 - (s.w * s.scale) / 2, top: 540 - (s.h * s.scale) / 2, width: s.w * s.scale, height: s.h * s.scale,
              transform: `translate3d(0, ${y}px, ${z}px) rotateZ(${rot}deg) rotateX(${6 * (1 - inn)}deg)`, opacity: inn, filter: `brightness(${dim}) blur(${pushed * 2.2}px)`,
              boxShadow: "0 24px 50px rgba(0,0,0,.7), 0 4px 10px rgba(0,0,0,.5)" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: s.w, height: s.h, transform: `scale(${s.scale})`, transformOrigin: "0 0", background: "#F5F2EB" }}>
                <Img src={staticFile(s.src)} style={{ position: "absolute", inset: 0, width: s.w, height: s.h, mixBlendMode: "multiply" }} />
                {ru > 0 && s.rule && <div style={{ position: "absolute", left: s.rule.box[0], top: s.rule.box[3] + 2, height: 5, width: (s.rule.box[2] - s.rule.box[0]) * ru, background: RED }} />}
                {s.band && bu > -0.2 && bu < 1.2 && <div style={{ position: "absolute", left: 0, right: 0, top: s.band.y0, height: s.band.y1 - s.band.y0, mixBlendMode: "soft-light",
                  background: `linear-gradient(90deg, rgba(255,255,255,0) ${bu * 100 - 18}%, rgba(255,255,255,.9) ${bu * 100}%, rgba(255,255,255,0) ${bu * 100 + 18}%)` }} />}
                <svg width={s.w} height={s.h} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.1 }}>
                  <filter id={`am12P${i}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={12 + i} /><feColorMatrix type="saturate" values="0" /></filter>
                  <rect width={s.w} height={s.h} filter={`url(#am12P${i})`} />
                </svg>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
