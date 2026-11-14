// TOR01 | SurveyRows: the NWS damage-survey summary re-typeset as three sharp rows that swing in on a 3-D card over the dimmed,
// blurred storm footage, each timed to its spoken number: the rating lands as a red chip, the peak wind counts up, and the
// start / end times are joined by a red bar that grows into the time on the ground. Source credited small.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);

const Label: React.FC<{ t: string }> = ({ t }) => (
  <div style={{ fontFamily: "Archivo", fontWeight: 600, fontSize: 36, letterSpacing: "0.12em", color: "rgba(255,255,255,.7)", width: 560 }}>{t}</div>
);
const Big: React.FC<{ children: React.ReactNode; red?: number }> = ({ children, red = 0 }) => (
  <div style={{ fontFamily: "D-DIN Exp", fontWeight: 700, fontSize: 124, lineHeight: 1, color: "#F4F4F2", position: "relative", padding: "6px 18px" }}>
    <div style={{ position: "absolute", inset: 0, background: RED, clipPath: `inset(0 ${(1 - red) * 100}% 0 0)` }} />
    <span style={{ position: "relative" }}>{children}</span>
  </div>
);

export const SurveyRows: React.FC<{ bg: React.ReactNode; at: [number, number, number]; wind: number; t0: string; t1: string; mins: number; rating: string; credit: string }> = ({ bg, at, wind, t0, t1, mins, rating, credit }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const row = (k: number) => out(interpolate(f, [at[k], at[k] + 16], [0, 1], cl));
  const r0 = row(0), r1 = row(1), r2 = row(2);
  const chip = io(interpolate(f, [at[0] + 8, at[0] + 18], [0, 1], cl));
  const w = Math.round(wind * io(interpolate(f, [at[1] + 2, at[1] + 20], [0, 1], cl)));
  const bar = io(interpolate(f, [at[2] + 10, at[2] + 30], [0, 1], cl));
  const lab = io(interpolate(f, [at[2] + 26, at[2] + 36], [0, 1], cl));
  const drift = f / durationInFrames;
  const rowStyle = (g: number): React.CSSProperties => ({ display: "flex", alignItems: "center", height: 200, opacity: g, transform: `translateX(${(1 - g) * 140}px) rotateY(${(1 - g) * -38}deg)`, transformOrigin: "0% 50%" });
  return (
    <AbsoluteFill style={{ background: "#05070a", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(14px) brightness(.38) saturate(.7)", transform: "scale(1.12)" }}>{bg}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 45% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.6) 100%)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 170, top: 210, width: 1600, transform: `rotateY(${-7 + 4 * drift}deg) rotateX(${3 - 2 * drift}deg) scale(${1 + 0.05 * drift})`, transformOrigin: "30% 50%" }}>
          <div style={{ borderTop: "3px solid rgba(255,255,255,.85)", width: 1600 * io(interpolate(f, [0, 10], [0.3, 1], cl)), marginBottom: 18 }} />
          <div style={rowStyle(r0)}><Label t="RATING" /><Big red={chip}>{rating}</Big></div>
          <div style={rowStyle(r1)}><Label t="ESTIMATED PEAK WIND" /><Big>{w} MPH</Big></div>
          <div style={rowStyle(r2)}>
            <Label t="ON THE GROUND" />
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ fontFamily: "D-DIN Exp", fontWeight: 700, fontSize: 84, color: "#F4F4F2" }}>{t0}</div>
              <div style={{ position: "relative", width: 260, height: 70, margin: "0 26px" }}>
                <div style={{ position: "absolute", top: 31, left: 0, width: 260 * bar, height: 8, background: RED }} />
                <div style={{ position: "absolute", top: 18, left: 260 * bar - 4, width: 8, height: 34, background: RED, opacity: bar > 0.02 ? 1 : 0 }} />
                <div style={{ position: "absolute", top: 18, left: 0, width: 8, height: 34, background: RED, opacity: bar > 0 ? 1 : 0 }} />
                <div style={{ position: "absolute", top: -34, left: 0, width: 260, textAlign: "center", fontFamily: "Archivo", fontWeight: 900, fontSize: 40, color: "#fff", opacity: lab, transform: `translateY(${(1 - lab) * 10}px)` }}>{mins} MIN</div>
              </div>
              <div style={{ fontFamily: "D-DIN Exp", fontWeight: 700, fontSize: 84, color: "#F4F4F2", opacity: 0.25 + 0.75 * bar }}>{t1}</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, bottom: 44, fontFamily: "Archivo", fontWeight: 600, fontSize: 22, letterSpacing: "0.08em", color: "rgba(255,255,255,.62)" }}>{credit}</div>
    </AbsoluteFill>
  );
};
