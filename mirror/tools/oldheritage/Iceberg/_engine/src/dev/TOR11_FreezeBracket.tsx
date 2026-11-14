// TOR11 FreezeBracket: the witness frame freezes (a soft desaturating settle, no flash), four white corner brackets close in on the
// detail the VO explains, the camera eases into the bracket while everything outside it sinks into shadow.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export const FreezeBracket: React.FC<{ src: string; at: number; r: [number, number, number, number]; runIn?: number; closeAt?: number }> = ({ src, at, r, runIn = 12, closeAt = 16 }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  // plays `runIn` frames up to the frozen frame, then holds it
  const fr = Math.round(at * 30) - runIn + Math.min(f, runIn);
  const frz = interpolate(f, [runIn - 2, runIn + 10], [0, 1], cl);
  const g = out(interpolate(f, [closeAt, closeAt + 18], [0, 1], cl));
  const z = 1 + 0.55 * io(interpolate(f, [closeAt + 6, n], [0, 1], cl));
  const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2;
  // bracket rect in screen space (it rides the zoom)
  const X = (x: number) => cx * 1920 + (x - cx) * 1920 * z, Y = (y: number) => cy * 1080 + (y - cy) * 1080 * z;
  const x0 = X(r[0]), x1 = X(r[2]), y0 = Y(r[1]), y1 = Y(r[3]);
  const pad = (1 - g) * 120, L = 46;
  const corner = (x: number, y: number, sx: number, sy: number) => <path d={`M${x + sx * L} ${y} L${x} ${y} L${x} ${y + sy * L}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="square" />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${cx * 100}% ${cy * 100}%`, filter: `saturate(${1 - 0.35 * frz}) contrast(${1 + 0.08 * frz})` }}>
        <Freeze frame={fr}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </AbsoluteFill>
      {/* shadow outside the bracket */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><mask id="tor11fb"><rect width={1920} height={1080} fill="#fff" /><rect x={x0 - pad} y={y0 - pad} width={x1 - x0 + 2 * pad} height={y1 - y0 + 2 * pad} fill="#000" /></mask></defs>
        <rect width={1920} height={1080} fill={`rgba(0,0,0,${0.5 * g})`} mask="url(#tor11fb)" />
        <g opacity={g} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
          {corner(x0 - pad, y0 - pad, 1, 1)}{corner(x1 + pad, y0 - pad, -1, 1)}{corner(x0 - pad, y1 + pad, 1, -1)}{corner(x1 + pad, y1 + pad, -1, -1)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
