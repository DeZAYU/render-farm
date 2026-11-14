// TOR18 StampLoupe: the doorbell camera's own frame, frozen, shown whole (4:3) in a white frame over its blurred copy; white corner
// brackets close round the camera's burned-in clock and the camera pushes into it, so the date/time comes from the footage itself.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** src = still (iw x ih); box = the stamp in image px [x0,y0,x1,y1]; push = when the camera moves in (frames) */
export const StampLoupe: React.FC<{ src: string; iw: number; ih: number; box: [number, number, number, number]; bracketAt?: number; pushAt?: number; pushLen?: number; zEnd?: number }> = ({ src, iw, ih, box, bracketAt = 12, pushAt = 30, pushLen = 40, zEnd = 3.6 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const H = height * 0.86, W = H * (iw / ih); // framed picture on screen
  const X0 = (width - W) / 2, Y0 = (height - H) / 2;
  const k = W / iw;
  const bx = X0 + box[0] * k, by = Y0 + box[1] * k, bw = (box[2] - box[0]) * k, bh = (box[3] - box[1]) * k;
  // camera: eased push that centres the stamp, then a slow constant drift (never stops inside the shot)
  const p = io(interpolate(f, [pushAt, pushAt + pushLen], [0, 1], cl));
  const drift = interpolate(f, [pushAt, durationInFrames], [0, 0.06], cl);
  const z = 1 + (zEnd - 1) * p + drift * p;
  const cx = width / 2 + (bx + bw / 2 - width / 2) * p, cy = height / 2 + (by + bh / 2 - height / 2) * p;
  const tf = `translate3d(${(width / 2 - cx * z).toFixed(2)}px, ${(height / 2 - cy * z).toFixed(2)}px, 0) scale3d(${z.toFixed(4)}, ${z.toFixed(4)}, 1)`;
  const fin = out(interpolate(f, [0, 10], [0, 1], cl));
  const g = out(interpolate(f, [bracketAt, bracketAt + 14], [0, 1], cl));
  const pad = 10 / Math.max(1, z * 0.6), L = Math.min(bw, bh) * 0.9 + 14; // corner arm length
  const ax = bx - pad, ay = by - pad, aw = bw + 2 * pad, ah = bh + 2 * pad;
  const sw = 5 / z; // stroke stays ~5 px on screen
  const s = 1.5 - 0.5 * g; // brackets close in from 1.5x
  const ccx = ax + aw / 2, ccy = ay + ah / 2;
  const C = (x: number, y: number) => [ccx + (x - ccx) * s, ccy + (y - ccy) * s];
  const corner = (x: number, y: number, dx: number, dy: number, i: number) => {
    const [px, py] = C(x, y);
    return <path key={i} d={`M ${px + dx * L} ${py} L ${px} ${py} L ${px} ${py + dy * L * 0.8}`} fill="none" stroke="#fff" strokeWidth={sw} strokeLinecap="square" />;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.55)" }} />
      <AbsoluteFill style={{ transform: tf, transformOrigin: "0 0", willChange: "transform" }}>
        <div style={{ position: "absolute", left: X0, top: Y0, width: W, height: H, outline: `${6 / z}px solid #fff`, boxShadow: "0 18px 50px rgba(0,0,0,.6)", opacity: fin, transform: `scale(${0.95 + 0.05 * fin})`, transformOrigin: "50% 50%" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%" }} />
        </div>
        <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: g, filter: "drop-shadow(0 1px 3px rgba(0,0,0,.7))" }}>
          {corner(ax, ay, 1, 1, 0)}{corner(ax + aw, ay, -1, 1, 1)}{corner(ax, ay + ah, 1, -1, 2)}{corner(ax + aw, ay + ah, -1, -1, 3)}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
