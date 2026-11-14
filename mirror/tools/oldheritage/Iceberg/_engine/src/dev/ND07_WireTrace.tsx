// ND07 WireTrace — the raw's own last frame holds; the picture cools and darkens while the power lines in it are drawn over in white,
// wire by wire along their real sag (points picked on the frame), and the pole gets a thin white outline; slow push toward them.
// Built for "Those power lines aren't the ones that started it, but they're hard to ignore." (a different hold from a bracket lock-on:
// the subject is the lines themselves, not a box).
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

/** wires / pole: points in 0..1 frame coordinates of the source frame; at/every = frame the first wire starts and spacing */
export const WireTrace: React.FC<{ src: string; sec: number; wires: [number, number][][]; pole?: [number, number][]; focus: [number, number]; z1?: number; at?: number; every?: number }> = ({ src, sec, wires, pole, focus, z1 = 1.25, at = 8, every = 7 }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const k = io(interpolate(f, [0, D], [0, 1], cl)), z = 1 + (z1 - 1) * k;
  const cx = (v: number, lim: number) => Math.min(0, Math.max(lim - lim * z, v)); // never show past the frame's edge
  const ox = cx(W / 2 - focus[0] * W * z + (focus[0] - 0.5) * W * (1 - k), W), oy = cx(H / 2 - focus[1] * H * z + (focus[1] - 0.5) * H * (1 - k), H);
  const P = (p: [number, number]) => `${ox + p[0] * W * z} ${oy + p[1] * H * z}`;
  const dim = interpolate(f, [2, 18], [1, 0.55], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: ox, top: oy, width: W * z, height: H * z, filter: `brightness(${dim}) saturate(${0.5 + 0.5 * dim})` }}>
        <Freeze frame={Math.round(sec * 30)}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {pole && (() => { const g = io(interpolate(f, [at - 4, at + 10], [0, 1], cl)); const d = "M" + pole.map(P).join(" L");
          return <path d={d} fill="none" stroke="#fff" strokeWidth={3} pathLength={1} strokeDasharray={`${g} 1`} opacity={0.9} />; })()}
        {wires.map((w, i) => {
          const g = io(interpolate(f, [at + i * every, at + i * every + 16], [0, 1], cl)); const d = "M" + w.map(P).join(" L");
          return <g key={i}>
            <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={9} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#fff" strokeWidth={4.5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
          </g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};
