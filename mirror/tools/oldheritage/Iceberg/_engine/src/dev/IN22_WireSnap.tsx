// IN22 WireSnap: the helmet-cam frame a moment before the hit is held; the picture sinks into shadow except a soft horizontal band
// at chin height, and a thin dashed white line (a reconstruction, not the real wire, which the camera never shows) draws across the
// trail from both edges toward the middle. On "then snapped" the line breaks at the centre, both halves whip away and fade, the
// shadow lifts and the real footage runs on at quarter speed into the jerk up to the treetops. No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { io } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const WireSnap: React.FC<{ src: string; t: number; n: number; y: number; drawAt: number; drawLen: number; snapAt: number; z0?: number; z1?: number; rate?: number }> =
  ({ src, t, n, y, drawAt, drawLen, snapAt, z0 = 1.04, z1 = 1.16, rate = 0.25 }) => {
  const f = useCurrentFrame();
  const z = z0 + (z1 - z0) * io(Math.min(1, f / n));
  const dim = interpolate(f, [6, 26, snapAt, snapAt + 14], [0, 1, 1, 0], cl);
  const draw = io(interpolate(f, [drawAt, drawAt + drawLen], [0, 1], cl));
  const s = io(interpolate(f, [snapAt, snapAt + 16], [0, 1], cl));
  const lineO = interpolate(f, [snapAt + 4, snapAt + 18], [1, 0], cl);
  const Y = y * 1080;
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: `50% ${y * 100}%` };
  const half = 960 * draw;
  const dash = "repeating-linear-gradient(90deg, #fff 0 26px, rgba(255,255,255,0) 26px 40px)";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {f < snapAt
        ? <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
        : <Sequence from={snapAt} layout="none"><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} playbackRate={rate} muted style={st} /></Sequence>}
      {/* shadow outside the chin-height band */}
      <AbsoluteFill style={{ opacity: dim * 0.78, background: `linear-gradient(180deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.9) ${y * 100 - 14}%, rgba(0,0,0,0) ${y * 100 - 4}%, rgba(0,0,0,0) ${y * 100 + 4}%, rgba(0,0,0,.9) ${y * 100 + 14}%, rgba(0,0,0,.95) 100%)` }} />
      {/* the line: two halves drawn in from the edges, broken at the centre on the snap */}
      <div style={{ position: "absolute", left: 0, top: Y - 2, width: half, height: 4, background: dash, opacity: lineO, boxShadow: "0 0 10px rgba(255,255,255,.5)",
        transformOrigin: "0% 50%", transform: `rotate(${-s * 34}deg) translateY(${-s * 60}px)` }} />
      <div style={{ position: "absolute", right: 0, top: Y - 2, width: half, height: 4, background: dash, opacity: lineO, boxShadow: "0 0 10px rgba(255,255,255,.5)",
        transformOrigin: "100% 50%", transform: `rotate(${s * 34}deg) translateY(${-s * 60}px)` }} />
      {/* end ticks at the frame edges (tied off either side) */}
      <div style={{ position: "absolute", left: 0, top: Y - 16, width: 4, height: 32, background: "#fff", opacity: interpolate(f, [drawAt, drawAt + 8], [0, 1], cl) * lineO }} />
      <div style={{ position: "absolute", right: 0, top: Y - 16, width: 4, height: 32, background: "#fff", opacity: interpolate(f, [drawAt, drawAt + 8], [0, 1], cl) * lineO }} />
    </AbsoluteFill>
  );
};
