// TP21 | EmptyWheel: the Dino Eye as a white line drawing over the darkened, blurred real footage. The wheel draws itself on (rim,
// spokes, A-frame), the cabins hang on one by one, every one hollow; a soft white pass travels round the rim checking each cabin
// (nobody on board: the storm had closed the ride); only the top cabin, the one that burned, glows red and flickers.
// A schematic (cabin count illustrative), not a survey drawing.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);
const RED = "#E3141B";

export const EmptyWheel: React.FC<{
  bg: string; bgFrom: number; n?: number; cx?: number; cy?: number; r?: number;
  drawAt?: number; sweepAt?: number; sweepLen?: number; glowAt?: number;
}> = ({ bg, bgFrom, n = 18, cx = 960, cy = 470, r = 330, drawAt = 0, sweepAt = 60, sweepLen = 54, glowAt = 40 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: N } = useVideoConfig();
  const t = io(f / N);
  const rim = io(interpolate(f, [drawAt, drawAt + 26], [0, 1], cl));
  const spk = io(interpolate(f, [drawAt + 8, drawAt + 30], [0, 1], cl));
  const legs = io(interpolate(f, [drawAt + 4, drawAt + 24], [0, 1], cl));
  const glow = out(interpolate(f, [glowAt, glowAt + 12], [0, 1], cl));
  const flick = 0.82 + 0.18 * Math.sin(f * 0.9) * Math.sin(f * 0.37 + 1.3);
  const C = 2 * Math.PI * r;
  const ground = cy + r + 150;
  const sw = interpolate(f, [sweepAt, sweepAt + sweepLen], [0, 1], cl); // 0..1 round the wheel, starting at the top, clockwise
  const cab = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { i, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  const line = { stroke: "#fff", fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", objectPosition: "50% 30%",
          filter: "blur(12px) brightness(.32) saturate(.7)", transform: `scale(${1.04 + 0.05 * t})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.035 * t})`, transformOrigin: `${cx}px ${cy}px`,
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
        {/* A-frame legs + base */}
        {[[-1], [1]].map(([s], k) => {
          const L = Math.hypot(r * 0.62, ground - cy);
          return <line key={k} x1={cx} y1={cy} x2={cx + s * r * 0.62} y2={ground} {...line} strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - legs)} />;
        })}
        <line x1={cx - r * 0.8} y1={ground} x2={cx + r * 0.8} y2={ground} {...line} strokeWidth={5} opacity={legs} />
        {/* rim: outer + inner ring */}
        <circle cx={cx} cy={cy} r={r} {...line} strokeWidth={5} strokeDasharray={C} strokeDashoffset={C * (1 - rim)} transform={`rotate(-90 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r - 22} {...line} strokeWidth={2.5} opacity={0.7 * rim} />
        {/* spokes */}
        {cab.map(({ i, x, y }) => <line key={"s" + i} x1={cx} y1={cy} x2={cx + (x - cx) * spk} y2={cy + (y - cy) * spk} {...line} strokeWidth={2} opacity={0.65} />)}
        <circle cx={cx} cy={cy} r={20} {...line} strokeWidth={5} opacity={spk} />
        {/* cabins: hung on one by one, all hollow; the top one (i = 0) glows red */}
        {cab.map(({ i, x, y }) => {
          const ap = out(interpolate(f, [drawAt + 22 + i * 1.6, drawAt + 32 + i * 1.6], [0, 1], cl));
          if (ap <= 0) return null;
          const w = 46, h = 54, top = y + 6;
          const dPhase = ((i / n) - sw + 1) % 1; // how far behind the sweep this cabin is
          const hit = sw > 0 && sw < 1 && i > 0 && dPhase > 0.94 ? (dPhase - 0.94) / 0.06 : 0;
          const red = i === 0 ? glow : 0;
          return (
            <g key={"c" + i} opacity={ap} transform={`translate(0 ${(1 - ap) * -10})`}>
              <line x1={x} y1={y} x2={x} y2={top} {...line} strokeWidth={3} />
              {red > 0 && <rect x={x - w / 2 - 14} y={top - 14} width={w + 28} height={h + 28} rx={22} fill={RED} opacity={0.45 * red * flick} style={{ filter: "blur(14px)" }} />}
              <rect x={x - w / 2} y={top} width={w} height={h} rx={12} fill={red > 0 ? RED : "rgba(0,0,0,.35)"} fillOpacity={red > 0 ? 0.85 * red * flick : 1}
                stroke={red > 0 ? "#fff" : "#fff"} strokeWidth={hit > 0 ? 5 : 3.5} opacity={1} />
              {hit > 0 && <rect x={x - w / 2 - 6} y={top - 6} width={w + 12} height={h + 12} rx={16} fill="none" stroke="#fff" strokeWidth={2} opacity={hit * 0.9} />}
              {/* window line: shows each cabin is empty inside */}
              {i !== 0 && <line x1={x - w / 2 + 8} y1={top + h * 0.42} x2={x + w / 2 - 8} y2={top + h * 0.42} {...line} strokeWidth={2} opacity={0.6} />}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
