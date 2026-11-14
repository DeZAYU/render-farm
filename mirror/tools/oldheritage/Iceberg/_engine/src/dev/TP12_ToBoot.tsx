// TP12 | ToBoot: where it was first blamed vs where it was traced. A photo taken on the morning of the fire (smoke at the collar) with
// white corner brackets locked on the collar; on the investigation's words the bracket travels down the figure to the right boot,
// the camera following, and the boot gets its red label. Image px coordinates; boxes are [x0, y0, x1, y1].
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const ToBoot: React.FC<{ src: string; iw: number; ih: number; a: Box; b: Box; aAt: number; moveAt: number; moveLen?: number; z: [number, number]; label: string }> = ({ src, iw, ih, a, b, aAt, moveAt, moveLen = 30, z, label }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const m = io(interpolate(f, [moveAt, moveAt + moveLen], [0, 1], cl));
  const bx: Box = [lerp(a[0], b[0], m), lerp(a[1], b[1], m), lerp(a[2], b[2], m), lerp(a[3], b[3], m)];
  const zz = lerp(z[0], z[1], io(f / durationInFrames));
  const base = Math.max(width / iw, height / ih) * zz;
  const fx = (bx[0] + bx[2]) / 2 + 260 * (1 - m) * 0, fy = (bx[1] + bx[3]) / 2;
  const ox = Math.min(0, Math.max(width - iw * base, width * 0.42 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const X = (x: number) => ox + x * base, Y = (y: number) => oy + y * base;
  const g = out(interpolate(f, [aAt, aAt + 12], [0, 1], cl));
  const x0 = X(bx[0]), y0 = Y(bx[1]), x1 = X(bx[2]), y1 = Y(bx[3]);
  const c = 38 * g, pad = 14 * (1 - g);
  const corner = (x: number, y: number, sx: number, sy: number) => `M${x + sx * c} ${y} L${x} ${y} L${x} ${y + sy * c}`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, maxWidth: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 70% at 42% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      {g > 0 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }}>
          <path d={[corner(x0 - pad, y0 - pad, 1, 1), corner(x1 + pad, y0 - pad, -1, 1), corner(x0 - pad, y1 + pad, 1, -1), corner(x1 + pad, y1 + pad, -1, -1)].join(" ")}
            fill="none" stroke="#fff" strokeWidth={6} opacity={g} strokeLinecap="square" />
        </svg>
      )}
      <RedLabel text={label} at={moveAt + moveLen - 2} x={Math.min(0.85, Math.max(0.15, (x0 + x1) / 2 / width + 0.16))} y={Math.min(0.9, ((y0 + y1) / 2) / height)} size={42} />
    </AbsoluteFill>
  );
};
