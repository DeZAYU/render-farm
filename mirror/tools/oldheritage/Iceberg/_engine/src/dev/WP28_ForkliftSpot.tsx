// WP28 device: ForkliftSpot — the yard's own CCTV (filmed off the monitor) plays full frame while a forklift crosses the apron in
// front of the burning stacks. On the forklift line the picture freezes on it: the rest of the frame drains to a dim grey, a soft
// circle of full colour stays on the forklift, and the frame pushes in on it. No text: the VO names it.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./WP01_kit";

export const ForkliftSpot: React.FC<{
  src: string; from: number; n: number; freeze: number;   // freeze = frame (in this shot) where the picture stops
  at: [number, number];                                    // the forklift at the freeze, 0-1 of the frame
  r?: number;                                              // spot radius, fraction of frame width
}> = ({ src, from, n, freeze, at, r = 0.11 }) => {
  const f = useCurrentFrame();
  const k = io(interpolate(f, [freeze + 2, freeze + 26], [0, 1], cl));                    // drain + spot
  const p = io(interpolate(f, [freeze + 6, Math.max(freeze + 7, n - 2)], [0, 1], cl));     // push in
  const s = 1.02 + 0.02 * io(Math.min(1, f / Math.max(1, freeze))) + 0.62 * p;
  const [cx, cy] = at;
  const vid = (filter?: string) => {
    const v = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter }} />;
    return f < freeze ? v : <Freeze frame={freeze}>{v}</Freeze>;
  };
  const rad = r * 1920 * (1.6 - 0.6 * k);   // the circle closes onto the forklift as the colour drains
  const mask = `radial-gradient(circle ${rad}px at ${cx * 100}% ${cy * 100}%, #000 55%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${cx * 100}% ${cy * 100}%`, willChange: "transform" }}>
        <AbsoluteFill>{vid(k > 0 ? `grayscale(${k}) brightness(${1 - 0.5 * k}) contrast(${1 - 0.1 * k})` : undefined)}</AbsoluteFill>
        {k > 0 && <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>{vid(`brightness(${1 + 0.08 * k})`)}</AbsoluteFill>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
