// TP09 (Berlin Stargate): freeze-frame + white bracket. The clip stops on the riders hanging head-down; four white corner brackets close in
// on them, the frame darkens outside the bracket and the bracketed part lifts forward (a slight 3-D tilt-in, Farrell-style) so the
// inverted seats read at a glance. px = screen px of the 1920x1080 still.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const FreezeBracket: React.FC<{ src: string; box: [number, number, number, number]; at?: number }> = ({ src, box, at = 6 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const flash = interpolate(f, [0, 3, 9], [0, 0.18, 0], cl); // the freeze "click": a soft lift, not a white flash
  const g = out(interpolate(f, [at, at + 16], [0, 1], cl));
  const lift = io(interpolate(f, [at + 14, at + 38], [0, 1], cl));
  const [x0, y0, x1, y1] = box, bw = x1 - x0, bh = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  // brackets start at the frame edges and close onto the box
  const L = 0 + (x0 - 0) * g, T = 0 + (y0 - 0) * g, R = width + (x1 - width) * g, B = height + (y1 - height) * g;
  const arm = 60;
  const sc = 1 + 0.35 * lift, tx = (width / 2 - cx) * lift * 0.9, ty = (height / 2 - cy) * lift * 0.9;
  const z = 1.02 + 0.03 * io(f / durationInFrames);
  const corner = (x: number, y: number, dx: number, dy: number) => <path d={`M ${x + dx * arm} ${y} L ${x} ${y} L ${x} ${y + dy * arm}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="square" />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - 0.5 * lift}) blur(${3 * lift}px)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      {/* the bracketed detail lifted forward */}
      <div style={{ position: "absolute", left: x0, top: y0, width: bw, height: bh, overflow: "hidden", opacity: lift > 0 ? 1 : 0,
        transform: `perspective(1400px) translate(${tx}px, ${ty}px) scale(${sc}) rotateY(${-6 * (1 - lift)}deg)`, boxShadow: `0 ${24 * lift}px ${60 * lift}px rgba(0,0,0,.7)`, border: lift > 0.05 ? "5px solid #fff" : "none" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: -x0, top: -y0, width: width, height: height, objectFit: "cover" }} />
      </div>
      {lift < 0.2 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: g * (1 - lift * 5), filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
          {corner(L, T, 1, 1)}{corner(R, T, -1, 1)}{corner(L, B, 1, -1)}{corner(R, B, -1, -1)}
        </svg>
      )}
    </AbsoluteFill>
  );
};
