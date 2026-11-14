// TOR04 | BulletinRoll: the real NWS bulletin (IEM archive capture) on a lit sheet lying back in 3-D. The sheet rolls up from
// the product header to the issuance time, settles, and the emergency headline is marked: a white select bar sweeps under it,
// then turns channel red. A soft light pool drifts over the sheet so it reads as a lit object, not a screenshot.
// box coords = capture image pixels (w x h).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Box = [number, number, number, number];

export const BulletinRoll: React.FC<{ src: string; w: number; h: number; startY: number; marks: { box: Box; at: number; red?: boolean }[]; settleY: number; settleAt: number }> = ({ src, w, h, startY, marks, settleY, settleAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const s = 1.25; // image px -> screen px
  const roll = io(interpolate(f, [0, settleAt], [0, 1], cl));
  const cy = startY + (settleY - startY) * roll + 18 * io(f / durationInFrames); // keeps a slow drift after settling
  const cx = 760;
  const ox = width / 2 - cx * s, oy = height / 2 - cy * s;
  const lx = 40 + 20 * Math.sin(f / 40), ly = 45 + 8 * Math.cos(f / 55);
  return (
    <AbsoluteFill style={{ background: "#07090c", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${24 - 6 * roll}deg) rotateZ(${-3 + 1.5 * roll}deg) scale(1.05)`, transformOrigin: "50% 55%" }}>
          <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: w * s, height: h * s, filter: "contrast(1.08) brightness(.95)" }} />
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply" }}>
            {marks.map((m, i) => {
              const g = io(interpolate(f, [m.at, m.at + 14], [0, 1], cl));
              const r = m.red ? io(interpolate(f, [m.at + 16, m.at + 26], [0, 1], cl)) : 0;
              if (g <= 0) return null;
              const x = ox + (m.box[0] - 8) * s, y = oy + (m.box[1] - 4) * s, bw = (m.box[2] - m.box[0] + 16) * s * g, bh = (m.box[3] - m.box[1] + 8) * s;
              const col = `rgb(${Math.round(190 + 37 * r)},${Math.round(205 - 185 * r)},${Math.round(232 - 205 * r)})`;
              return <rect key={i} x={x} y={y} width={bw} height={bh} fill={col} opacity={0.85} />;
            })}
          </svg>
        </div>
      </AbsoluteFill>
      {/* light pool + falloff */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 50% at ${lx}% ${ly}%, rgba(255,246,230,.10) 0%, rgba(0,0,0,0) 45%, rgba(3,5,8,.72) 100%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,9,12,.9) 0%, rgba(7,9,12,0) 22%)" }} />
    </AbsoluteFill>
  );
};
