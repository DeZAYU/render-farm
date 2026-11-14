// ND14 DrumTrace: a seismograph strip for the USGS reading. A cream chart strip scrolls left under a fixed pen; the trace runs quiet,
// then the pen throws into the big oscillation of the main shock while the strip keeps moving. The USGS event page's own figures are
// stamped above the strip as it happens: the magnitude in red, then the depth and the origin time (small, mono). Source credited small.
// Built for "the US Geological Survey put it at magnitude 7.7": the number arrives with the shaking that produced it.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };

export const DrumTrace: React.FC<{ onset: number; mag: string; magAt: number; lines: { text: string; at: number }[]; credit: string }> = ({ onset, mag, magAt, lines, credit }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const SY = height * 0.58, SH = height * 0.42, penX = width * 0.7, V = 9; // strip centre, height, pen x, px per frame
  const amp = (t: number) => {
    const quiet = 4 + 3 * rnd(t);
    if (t < onset) return quiet;
    const k = t - onset;
    return quiet + 175 * Math.min(1, k / 10) * Math.exp(-Math.max(0, k - 30) / 60);
  };
  const y = (t: number) => SY + amp(t) * Math.sin(t * 2.3 + Math.sin(t * 0.37) * 3) * (0.55 + 0.45 * rnd(t + 99));
  // trace history: one point per third of a frame
  const pts: string[] = [];
  for (let t = f - penX / V; t <= f; t += 1 / 3) pts.push(`${(penX - (f - t) * V).toFixed(1)},${y(t).toFixed(1)}`);
  const d = f / durationInFrames;
  const m = out(interpolate(f, [magAt, magAt + 10], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, #1e1e1e 0%, #090909 75%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.0 + 0.06 * d})`, transformOrigin: `${penX}px ${SY}px` }}>
        {/* the strip with its minute grid, scrolling */}
        <div style={{ position: "absolute", left: 0, right: 0, top: SY - SH / 2, height: SH, background: "linear-gradient(#efeadb, #e4dfcf)", boxShadow: "0 20px 60px rgba(0,0,0,.6)" }} />
        <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 40 }, (_, i) => { const x = ((i * 90 - f * V) % 3600 + 3600) % 3600; return x < width ? <line key={i} x1={x} x2={x} y1={SY - SH / 2} y2={SY + SH / 2} stroke="rgba(60,50,40,.18)" strokeWidth={i % 6 === 0 ? 3 : 1.5} /> : null; })}
          {[-2, -1, 0, 1, 2].map((k) => <line key={k} x1={0} x2={width} y1={SY + k * SH / 5} y2={SY + k * SH / 5} stroke="rgba(60,50,40,.12)" strokeWidth={1.5} />)}
          <polyline points={pts.join(" ")} fill="none" stroke="#151515" strokeWidth={3.2} strokeLinejoin="round" />
          {/* the pen arm */}
          <line x1={penX} y1={SY - SH / 2 - 120} x2={penX} y2={y(f)} stroke="#d8d8d8" strokeWidth={5} />
          <circle cx={penX} cy={y(f)} r={9} fill={RED} />
        </svg>
      </AbsoluteFill>
      {/* the USGS figures */}
      <div style={{ position: "absolute", left: width * 0.08, top: height * 0.1, opacity: m, transform: `translateY(${(1 - m) * 30}px) scale(${1.25 - 0.25 * m})`, transformOrigin: "0 50%",
        fontFamily: "D-DIN Exp", fontWeight: 700, fontSize: 150, lineHeight: 1, color: RED, letterSpacing: "0.02em", textShadow: "0 8px 30px rgba(0,0,0,.6)" }}>{mag}</div>
      {lines.map((l, i) => {
        const k = out(interpolate(f, [l.at, l.at + 10], [0, 1], cl));
        return <div key={i} style={{ position: "absolute", left: width * 0.08 + 6, top: height * 0.1 + 170 + i * 48, opacity: k, clipPath: `inset(0 ${(1 - k) * 100}% 0 0)`,
          fontFamily: "JetBrains Mono", fontWeight: 600, fontSize: 34, color: "#f2f2f2", letterSpacing: "0.02em" }}>{l.text}</div>;
      })}
      <div style={{ position: "absolute", left: 60, bottom: 40, fontFamily: "D-DIN", fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "rgba(255,255,255,.62)" }}>{credit}</div>
    </AbsoluteFill>
  );
};
