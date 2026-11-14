// ND12 HailCycle: how a hailstone grows, as a cut through the storm drawn over a dark copy of the windshield footage. A tall storm outline,
// the freezing level, the updraft core (white streamlines rising). A drop is carried up past the freezing level, falls, is lifted again;
// each trip adds a ring of ice (the stone, shown big in a white-framed inset on the right, gains a ring per loop). On the last loop the
// stone is too heavy for the updraft and falls out of the cloud. Built for the hail-growth lines (18.5-35 s of the take).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

// the stone's path: loops in the updraft (x, y in px), keyed by frame fraction
const LOOPS = 3;
export const ND12_HailCycle: React.FC<{ bg: string; bgFrom?: number; freezeLabel: string; loopAt: number[]; fallAt: number }> = ({ bg, bgFrom = 0, freezeLabel, loopAt, fallAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const FL = 520; // freezing level y
  // stone position: before loopAt[0] rising from cloud base; each loop: up to the top, drift out, fall to just below FL, back in
  const pos = (): [number, number] => {
    const base: [number, number] = [700, 830];
    if (f < loopAt[0]) { const k = io(interpolate(f, [0, loopAt[0]], [0, 1], cl)); return [base[0], base[1] - (base[1] - 330) * k]; }
    for (let i = 0; i < loopAt.length; i++) {
      const a = loopAt[i], b = i + 1 < loopAt.length ? loopAt[i + 1] : fallAt;
      if (f < b) { const k = (f - a) / (b - a); const ang = Math.PI * 2 * k; const r = 150 + 30 * i;
        return [700 + r * Math.sin(ang), 330 + 210 * (1 - Math.cos(ang)) * 0.5 * (1 + 0.15 * i) + (300 - 300) * k]; }
    }
    const k = io(interpolate(f, [fallAt, durationInFrames], [0, 1], cl));
    return [700 + 260 * k, 330 + 760 * k];
  };
  const [sx, sy] = pos();
  const rings = Math.min(LOOPS + 1, 1 + loopAt.filter((a) => f > a + 8).length);
  const o = interpolate(f, [0, 8], [0, 1], cl);
  const flow = (f * 6) % 80;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(12px) brightness(.3) saturate(.4)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* the storm: anvil-topped outline */}
        <path d="M 260 860 C 240 700 330 560 420 470 C 450 330 520 210 640 150 L 300 120 C 260 110 260 90 300 85 L 1180 85 C 1230 90 1230 115 1180 120 L 900 150 C 1010 220 1060 360 1060 480 C 1150 560 1200 700 1180 860 Z" fill="rgba(200,210,220,.12)" stroke="rgba(255,255,255,.85)" strokeWidth={4} />
        {/* freezing level */}
        <line x1={120} y1={FL} x2={1300} y2={FL} stroke="rgba(255,255,255,.7)" strokeWidth={3} strokeDasharray="14 10" />
        {/* updraft streamlines */}
        {[-90, -30, 30, 90].map((dx, i) => <line key={i} x1={700 + dx} y1={900} x2={700 + dx * 0.6} y2={180} stroke="rgba(255,255,255,.35)" strokeWidth={3} strokeDasharray="30 50" strokeDashoffset={flow + i * 13} />)}
        {/* ground */}
        <line x1={80} y1={900} x2={1360} y2={900} stroke="#fff" strokeWidth={4} />
        {/* the stone */}
        <circle cx={sx} cy={sy} r={8 + 3 * rings} fill="#fff" stroke={RED} strokeWidth={3} />
        {/* the inset: the stone cut in half, a ring per trip */}
        <rect x={1450} y={300} width={380} height={380} fill="rgba(0,0,0,.55)" stroke="#fff" strokeWidth={6} />
        {Array.from({ length: rings }, (_, i) => rings - 1 - i).map((i) => {
          const r = 46 + i * 34; return <circle key={i} cx={1640} cy={490} r={r} fill={i % 2 ? "rgba(235,242,248,.92)" : "rgba(180,198,212,.92)"} stroke="rgba(255,255,255,.9)" strokeWidth={2} />; })}
      </svg>
      <RedLabel text={freezeLabel} at={10} x={0.13} y={(FL - 34) / height} size={30} />
    </AbsoluteFill>
  );
};
