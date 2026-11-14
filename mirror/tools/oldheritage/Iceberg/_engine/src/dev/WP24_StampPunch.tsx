// WP24 device: StampPunch — Buncefield's own garden CCTV (HSE evidence), the vapour cloud creeping over the lawn, plays full frame
// (top-aligned so the camera's burned-in date/time line stays in view). It freezes a moment before the blast; the picture sinks into
// shadow except the camera's time stamp, white corner brackets close on it and the frame pushes in until the stamp ("11.DEC05 6:01")
// fills the view: the hour is the camera's own evidence, not a caption.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./WP01_kit";

export const StampPunch: React.FC<{
  src: string; from: number; n: number; freeze: number;          // freeze = frame (in this shot) where the picture stops
  box: [number, number, number, number];                          // stamp box in 1920x1080 shot coords (x0, y0, x1, y1)
  rate?: number;
}> = ({ src, from, n, freeze, box, rate = 1 }) => {
  const f = useCurrentFrame();
  const [x0, y0, x1, y1] = box, cx = x0, cy = y0;   // push anchored on the stamp's top-left so the whole line stays in view
  const k = io(interpolate(f, [freeze + 4, freeze + 46], [0, 1], cl));              // shadow + brackets
  const p = io(interpolate(f, [freeze + 30, Math.max(freeze + 31, n - 4)], [0, 1], cl)); // push into the stamp
  const s = 1.02 + 0.03 * io(Math.min(1, f / Math.max(1, freeze))) + 0.5 * p;
  const pad = 70 * (1 - out(interpolate(f, [freeze + 8, freeze + 36], [0, 1], cl))) + 14;
  const L = 46, W = 5;
  const corner = (x: number, y: number, dx: number, dy: number) => (
    <path d={`M${x + dx * L},${y} L${x},${y} L${x},${y + dy * L}`} stroke="#fff" strokeWidth={W} fill="none" strokeLinecap="square" />
  );
  const sx = (x: number) => cx + (x - cx) * s, sy = (y: number) => cy + (y - cy) * s;
  const bx0 = x0 - pad, by0 = y0 - pad, bx1 = x1 + pad, by1 = y1 + pad;
  const vid = (
    <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
      style={{ width: "100%", height: "133.333%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${(cx / 1920) * 100}% ${(cy / 1080) * 100}%`, willChange: "transform" }}>
        {f < freeze ? vid : <Freeze frame={freeze}>{vid}</Freeze>}
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <filter id="sp_b" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480"><feGaussianBlur stdDeviation="26" /></filter>
            <mask id="sp_m"><rect width="1920" height="1080" fill="#fff" />
              <rect x={x0 - 30} y={y0 - 24} width={x1 - x0 + 60} height={y1 - y0 + 48} fill="#000" filter="url(#sp_b)" /></mask>
          </defs>
          <rect width="1920" height="1080" fill="#000" opacity={0.66 * k} mask="url(#sp_m)" />
        </svg>
      </AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {k > 0 && <g opacity={k}>
          {corner(sx(bx0), sy(by0), 1, 1)}{corner(sx(bx1), sy(by0), -1, 1)}{corner(sx(bx0), sy(by1), 1, -1)}{corner(sx(bx1), sy(by1), -1, -1)}
        </g>}
      </svg>
    </AbsoluteFill>
  );
};
