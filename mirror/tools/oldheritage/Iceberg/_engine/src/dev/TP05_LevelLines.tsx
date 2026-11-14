// TP05 LevelLines — heights as horizontal levels laid across the real footage (camera looking up at the tower): a white level line
// glides down from the sky and locks on the tower's top (95 M); on the second mount a red level locks on the stuck platform and
// everything under it — the 60 m of air between the riders and the ground — sinks into a dark wash. Whole-frame levels, no staff.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const LevelLines: React.FC<{ src: string; from: number; top?: { y: number; at: number; label: string }; stop?: { y: number; at: number; label: string };
  s0?: number; s1?: number; fx?: number; fy?: number }> = ({ src, from, top, stop, s0 = 1.02, s1 = 1.07, fx = 0.5, fy = 0.4 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const s = s0 + (s1 - s0) * io(f / durationInFrames);
  // positions are measured in source-frame fractions; map through the push
  const Y = (y: number) => (fy + (y - fy) * s) * height;
  const tk = top ? io(interpolate(f, [top.at, top.at + 24], [0, 1], cl)) : 0;
  const sk = stop ? out(interpolate(f, [stop.at, stop.at + 18], [0, 1], cl)) : 0;
  const wash = stop ? io(interpolate(f, [stop.at + 8, stop.at + 30], [0, 1], cl)) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {stop && wash > 0 && <div style={{ position: "absolute", left: 0, right: 0, top: Y(stop.y), bottom: 0, background: `linear-gradient(180deg, rgba(10,0,0,${0.25 * wash}) 0%, rgba(0,0,0,${0.62 * wash}) 100%)` }} />}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }}>
        {top && tk > 0 && (() => { const y = interpolate(tk, [0, 1], [-10, Y(top.y)]); return <g>
          <line x1={0} y1={y} x2={width} y2={y} stroke="#fff" strokeWidth={4} strokeDasharray="22 12" opacity={0.9} /></g>; })()}
        {stop && sk > 0 && (() => { const y = Y(stop.y), w = width * sk; return <g>
          <line x1={width / 2 - w / 2} y1={y} x2={width / 2 + w / 2} y2={y} stroke={RED} strokeWidth={6} />
          {/* down arrows into the wash: the drop */}
          {[0.15, 0.85].map((x) => <g key={x} opacity={wash}><line x1={x * width} y1={y + 16} x2={x * width} y2={height - 60} stroke="rgba(255,255,255,.8)" strokeWidth={4} />
            <path d={`M${x * width - 14} ${height - 78} L${x * width} ${height - 52} L${x * width + 14} ${height - 78}`} fill="none" stroke="rgba(255,255,255,.8)" strokeWidth={4} /></g>)}
        </g>; })()}
      </svg>
      {top && <RedLabel text={top.label} at={top.at + 20} x={0.14} y={Math.max(0.07, (Y(top.y) - 36) / height)} size={40} />}
      {stop && <RedLabel text={stop.label} at={stop.at + 22} x={0.15} y={(Y(stop.y) + 58) / height} size={40} />}
    </AbsoluteFill>
  );
};
