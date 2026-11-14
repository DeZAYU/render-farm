// WP04 / WP05 helpers (not devices): full-frame footage shot with an eased push and speed control, a frozen frame, and a Blender
// shot with RedLabels pinned to the per-frame screen positions Blender wrote (labels.json -> WP0n_*Labels.ts).
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { FrameAt, cl, io } from "./WP01_kit";

export { cl, io };
export const F = (s: number) => Math.round(s * 30);

/** footage full frame: source second `from`, speed `rate`, push s0 -> s1 about (fx, fy) */
export const Clip: React.FC<{ src: string; from: number; n: number; rate?: number; s0?: number; s1?: number; fx?: number; fy?: number }> = ({ src, from, n, rate = 1, s0 = 1.02, s1 = 1.09, fx = 0.5, fy = 0.5 }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** one frame of a clip, full frame, pushed s0 -> s1 */
export const Still: React.FC<{ src: string; t: number; n: number; s0?: number; s1?: number; fx?: number; fy?: number; filter?: string }> = ({ src, t, n, s0 = 1.0, s1 = 1.08, fx = 0.5, fy = 0.5, filter }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, filter }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Blender shot + RedLabels following projected points: labels = [key, text, frame in, hold, dy] */
export const BlenderShot: React.FC<{ src: string; track: Record<string, [number, number][]>; labels: [string, string, number, number, number][]; scale?: number; oy?: number }> = ({ src, track, labels, scale = 1, oy = 0.5 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#05070a", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `50% ${oy * 100}%` }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%" }} />
        {labels.map(([k, text, at, hold, dy]) => {
          const p = track[k][Math.min(track[k].length - 1, f)];
          return <RedLabel key={k} text={text} at={at} hold={hold} x={Math.min(0.8, Math.max(0.2, p[0]))} y={p[1] + dy} size={38} />;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const fadeIn = (f: number, a: number, len = 10) => interpolate(f, [a, a + len], [0, 1], cl);
