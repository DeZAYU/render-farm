// ND04 LockOn — "Pick one of those parked cars": the footage freezes on its own last frame, the picture dims around one parked car
// and white corner brackets close in on it while the camera pushes toward it (a freeze + white bracket zoom into a detail).
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** src = graded clip; sec = source second to freeze; tx,ty = target centre (0..1 of the frame); tw,th = target box (fraction of frame);
 *  at = frame the brackets start; z1 = final push */
export const LockOn: React.FC<{ src: string; sec: number; tx: number; ty: number; tw: number; th: number; at?: number; z1?: number }> = ({ src, sec, tx, ty, tw, th, at = 10, z1 = 1.45 }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const k = io(interpolate(f, [0, D], [0, 1], cl));
  const z = 1 + (z1 - 1) * k;
  // the push keeps the target drifting toward the centre
  const cx = 0.5 + (tx - 0.5) * (1 - k * 0.85), cy = 0.5 + (ty - 0.5) * (1 - k * 0.85);
  const ox = W / 2 - tx * W * z + (cx - 0.5) * W, oy = H / 2 - ty * H * z + (cy - 0.5) * H;
  const toScr = (x: number, y: number) => [ox + x * W * z, oy + y * H * z];
  const g = out(interpolate(f, [at, at + 16], [0, 1], cl));
  const dim = 0.55 * out(interpolate(f, [at, at + 20], [0, 1], cl));
  const [x0, y0] = toScr(tx - tw / 2, ty - th / 2), [x1, y1] = toScr(tx + tw / 2, ty + th / 2);
  // brackets start wide and close onto the box
  const pad = (1 - g) * 120, bx0 = x0 - pad - 10, by0 = y0 - pad - 10, bx1 = x1 + pad + 10, by1 = y1 + pad + 10;
  const L = Math.min(bx1 - bx0, by1 - by0) * 0.28;
  const corner = (x: number, y: number, sx: number, sy: number) => `M${x + sx * L} ${y} L${x} ${y} L${x} ${y + sy * L}`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: ox, top: oy, width: W * z, height: H * z }}>
        <Freeze frame={Math.round(sec * 30)}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </div>
      {/* dim everything but the car */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><mask id="lockm"><rect width={W} height={H} fill="#fff" /><rect x={x0 - 8} y={y0 - 8} width={x1 - x0 + 16} height={y1 - y0 + 16} rx={6} fill="#000" /></mask></defs>
        <rect width={W} height={H} fill={`rgba(0,0,0,${dim})`} mask="url(#lockm)" />
        <g opacity={g} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="square" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
          <path d={corner(bx0, by0, 1, 1)} /><path d={corner(bx1, by0, -1, 1)} /><path d={corner(bx0, by1, 1, -1)} /><path d={corner(bx1, by1, -1, -1)} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
