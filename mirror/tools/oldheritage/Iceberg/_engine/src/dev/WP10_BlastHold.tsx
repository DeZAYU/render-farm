// WP10 device: BlastHold. The surveillance camera's blast replayed full frame at half speed; at the fireball's peak the picture holds
// for a beat while the frame pushes in and white corner brackets close on the fireball over the unit (the rest dims), then the
// replay runs on into the blast and smoke. Source time is remapped per frame (0.5x -> hold -> 0.5x).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FrameAt, cl, io, out } from "./WP01_kit";

export const BlastHold: React.FC<{ src: string; t0: number; peak: number; n: number; hold: number; box: [number, number, number, number] }> = ({ src, t0, peak, n, hold, box }) => {
  const f = useCurrentFrame();
  const fPeak = Math.round((peak - t0) / 0.5 * 30); // frames until the peak at 0.5x
  const tSrc = f < fPeak ? t0 + f / 60 : f < fPeak + hold ? peak : peak + (f - fPeak - hold) / 60;
  const [x0, y0, x1, y1] = box; const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const s = 1.02 + 0.22 * io(interpolate(f, [0, n], [0, 1], cl));
  const b = out(interpolate(f, [fPeak, fPeak + 12], [0, 1], cl)) * interpolate(f, [fPeak + hold, fPeak + hold + 10], [1, 0], cl);
  const dim = b * 0.5;
  const pad = (1 - b) * 0.06;
  const L = 46;
  const corner = (x: number, y: number, dx: number, dy: number, k: number) => (
    <path key={k} d={`M${x + dx * L} ${y} L${x} ${y} L${x} ${y + dy * L}`} stroke="#F2F2F0" strokeWidth={5} fill="none" opacity={b} />
  );
  const X0 = (x0 - pad) * 1920, Y0 = (y0 - pad) * 1080, X1 = (x1 + pad) * 1920, Y1 = (y1 + pad) * 1080;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${cx * 100}% ${cy * 100}%` }}>
        <FrameAt src={src} t={tSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse ${(x1 - x0) * 90}% ${(y1 - y0) * 90}% at ${cx * 100}% ${cy * 100}%, rgba(0,0,0,0) 50%, rgba(0,0,0,${dim}) 100%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {corner(X0, Y0, 1, 1, 0)}{corner(X1, Y0, -1, 1, 1)}{corner(X0, Y1, 1, -1, 2)}{corner(X1, Y1, -1, -1, 3)}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
