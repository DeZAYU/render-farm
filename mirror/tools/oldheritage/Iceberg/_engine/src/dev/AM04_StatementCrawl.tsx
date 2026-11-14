// AM04 StatementCrawl: "The park said the ride had been checked every day and maintained the way the manufacturer recommended, and it
// closed until further notice." Futuroscope's own statement of 7 April 2023, as quoted in full by Parc-Attraction-Loisirs.fr (real page,
// captured 14 Nov 2026, nothing re-typed): the quoted block is a long paper column laid back in depth (tilted away from the camera) over the
// dim, soft-blurred smoke of the clip; it crawls slowly upward as if being read, the lines above the focus line fade into the dark, and it
// eases to a stop on the closing sentence, "L'attraction reste fermée jusqu'à nouvel ordre." A single red rule draws under that sentence.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Freeze, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const StatementCrawl: React.FC<{ page: string; pw: number; ph: number; bg: string; bgAt: number; y0: number; y1: number; stopAt: number; rule: [number, number, number]; ruleAt: number; credit: string }> = ({ page, pw, ph, bg, bgAt, y0, y1, stopAt, rule, ruleAt, credit }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const inn = out(interpolate(f, [0, 24], [0, 1], cl));
  const fy = interpolate(io(interpolate(f, [0, stopAt], [0, 1], cl)), [0, 1], [y0, y1]);  // page y at the focus line
  const k = 0.82 + 0.08 * io(f / dur);
  const ru = out(interpolate(f, [ruleAt, ruleAt + 16], [0, 1], cl));
  const focusY = 600;                                   // screen y of the focus line
  const m = `linear-gradient(180deg, transparent ${((fy - 520 / k) / ph) * 100}%, #000 ${((fy - 140 / k) / ph) * 100}%, #000 ${((fy + 260 / k) / ph) * 100}%, rgba(0,0,0,.35) ${((fy + 520 / k) / ph) * 100}%)`;
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <RedLabel text="" at={1e6} />
      <AbsoluteFill style={{ transform: "scale(1.2)", filter: "blur(22px) brightness(.32) saturate(.7)" }}>
        <Freeze frame={Math.round(bgAt * 30)}><OffthreadVideo src={staticFile(bg)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: `50% ${focusY}px` }}>
        <div style={{ position: "absolute", left: 960 - (pw * k) / 2, top: focusY - fy * k + (1 - inn) * 120, width: pw * k, height: ph * k, opacity: inn,
          transform: "rotateX(24deg)", transformOrigin: `50% ${fy * k}px`, WebkitMaskImage: m, maskImage: m }}>
          <div style={{ position: "absolute", inset: 0, background: "#F7F6F2", boxShadow: "0 30px 80px rgba(0,0,0,.7)" }} />
          <Img src={staticFile(page)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          {ru > 0 && <div style={{ position: "absolute", left: rule[0] * k, top: rule[2] * k + 2, width: (rule[1] - rule[0]) * k * ru, height: 6, background: RED }} />}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
      <div style={{ position: "absolute", left: 70, bottom: 54, fontFamily: "Elite", fontSize: 26, color: "rgba(240,240,236,.7)", opacity: inn }}>{credit}</div>
    </AbsoluteFill>
  );
};
