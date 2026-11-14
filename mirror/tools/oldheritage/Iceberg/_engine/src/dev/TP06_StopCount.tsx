// TP06 StopCount — four emergency stops in two years, counted on the footage: a thin 2016 -> 2018 rule along the lower third, four red
// blocks drop onto it one per beat (not placed at dates: only the count is reported), the fourth — this one — gets the white frame.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const StopCount: React.FC<{ src: string; from: number; marks: number[]; s0?: number; s1?: number; fx?: number; fy?: number }> = ({ src, from, marks, s0 = 1.04, s1 = 1.1, fx = 0.5, fy = 0.4 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const s = s0 + (s1 - s0) * io(f / durationInFrames);
  const Y = height * 0.8, L = width * 0.24, R = width * 0.76, sz = 74, gap = 40, x0 = width / 2 - (4 * sz + 3 * gap) / 2;
  const rule = out(interpolate(f, [0, 16], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 3px 10px rgba(0,0,0,.7))" }}>
        <line x1={L} y1={Y} x2={L + (R - L) * rule} y2={Y} stroke="#fff" strokeWidth={4} />
        <line x1={L} y1={Y - 14} x2={L} y2={Y + 14} stroke="#fff" strokeWidth={4} opacity={rule} />
        {rule > 0.98 && <line x1={R} y1={Y - 14} x2={R} y2={Y + 14} stroke="#fff" strokeWidth={4} />}
        <text x={L} y={Y + 56} fill="#fff" opacity={rule} fontFamily="ArchivoBlk, Archivo" fontWeight={900} fontSize={32} textAnchor="middle">2016</text>
        <text x={R} y={Y + 56} fill="#fff" opacity={rule} fontFamily="ArchivoBlk, Archivo" fontWeight={900} fontSize={32} textAnchor="middle">2018</text>
        {marks.map((at, i) => {
          const k = out(interpolate(f, [at, at + 12], [0, 1], cl)); if (k <= 0) return null;
          const x = x0 + i * (sz + gap), y = Y - 30 - sz - (1 - k) * 60;
          return <g key={i} opacity={k}><rect x={x} y={y} width={sz} height={sz} fill={RED} stroke={i === 3 ? "#fff" : "rgba(0,0,0,.4)"} strokeWidth={i === 3 ? 6 : 2} /></g>;
        })}
      </svg>
      <RedLabel text="MAY 1, 2018" at={marks[3] + 14} x={(x0 + 3 * (sz + gap) + sz / 2) / width} y={(Y - 30 - sz - 50) / height} size={32} />
    </AbsoluteFill>
  );
};
