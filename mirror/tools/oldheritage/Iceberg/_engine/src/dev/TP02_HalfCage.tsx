// TP02 HalfCage: a freeze of one cabin at the base; the camera settles on it, a solid white box is drawn round the part closed in by
// safety bars, then a dashed box round the open part beside it (the side a rider is climbing out of). px = source pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Box = [number, number, number, number];
export const HalfCage: React.FC<{ src: string; iw: number; ih: number; focus: [number, number]; z0: number; z1: number; closed: Box; open: Box; closedAt: number; openAt: number }> = ({ src, iw, ih, focus, z0, z1, closed, open, closedAt, openAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(f / durationInFrames), z = z0 + (z1 - z0) * t;
  const base = (height / ih) * z; // the vertical frame fills the height; sides = its own blurred copy
  const W = iw * base, H = ih * base;
  const ox = width / 2 - focus[0] * base, oy = Math.min(0, Math.max(height - H, height / 2 - focus[1] * base));
  const R = (b: Box) => ({ x: ox + b[0] * base, y: oy + b[1] * base, w: (b[2] - b[0]) * base, h: (b[3] - b[1]) * base });
  const c = R(closed), o = R(open);
  const gc = io(interpolate(f, [closedAt, closedAt + 16], [0, 1], cl)), go = io(interpolate(f, [openAt, openAt + 16], [0, 1], cl));
  const P = (r: { w: number; h: number }) => 2 * (r.w + r.h);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(30px) brightness(.45)" }} />
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: W, height: H, boxShadow: "0 0 60px rgba(0,0,0,.7)", filter: `brightness(${1 - 0.15 * gc})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
        <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={`rgba(255,255,255,${0.12 * gc})`} stroke="#fff" strokeWidth={6} strokeDasharray={P(c)} strokeDashoffset={P(c) * (1 - gc)} />
        {go > 0 && <rect x={o.x} y={o.y} width={o.w} height={o.h} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray="18 12" opacity={go} />}
      </svg>
    </AbsoluteFill>
  );
};
