// ND02 TerrainLabels: plays a Blender terrain shot (dev: build/CASE02/maps/fuego.py) and pins the channel's red place labels to the
// places Blender projected for every frame (labels json: name -> [x, y, depth] per frame, 0..1 of the frame). Each label wipes on at its
// word with a small white dot + leader on the exact ground point. `hold` freezes on one frame (a still push for a later beat).
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

export const TerrainLabels: React.FC<{ src: string; labels: Record<string, number[][]>; from?: number; hold?: number; push?: number;
  pins: { name: string; text: string; at: number; dy?: number; dx?: number }[] }> = ({ src, labels, from = 0, hold, push = 0.06, pins }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const vf = hold !== undefined ? hold : Math.min(from + f, labels[pins[0]?.name ?? Object.keys(labels)[0]].length - 1);
  const s = 1 + push * (f / durationInFrames);
  const vid = <OffthreadVideo src={staticFile(src)} startFrom={from} muted style={{ width: "100%", height: "100%" }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 45%" }}>
        {hold !== undefined ? <Freeze frame={hold}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%" }} /></Freeze> : vid}
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {pins.map((p, i) => {
            const q = labels[p.name][Math.max(0, Math.min(vf, labels[p.name].length - 1))]; const g = out(interpolate(f, [p.at, p.at + 10], [0, 1], cl));
            if (g <= 0) return null; const x = q[0] * width, y = q[1] * height, ly = y + (p.dy ?? 70) * g;
            return <g key={i} opacity={g}><line x1={x} y1={y} x2={x + (p.dx ?? 0) * g} y2={ly - 20} stroke="#fff" strokeWidth={3} /><circle cx={x} cy={y} r={8} fill="#fff" stroke="rgba(0,0,0,.6)" strokeWidth={2} /></g>;
          })}
        </svg>
      </AbsoluteFill>
      {pins.map((p, i) => {
        const q = labels[p.name][Math.max(0, Math.min(vf, labels[p.name].length - 1))];
        const cx = 0.5 + (q[0] + (p.dx ?? 0) / width - 0.5) * s, cy = 0.45 + (q[1] + (p.dy ?? 70) / height - 0.45) * s;
        return <RedLabel key={i} text={p.text} at={p.at + 4} x={cx} y={cy} size={36} />;
      })}
    </AbsoluteFill>
  );
};
