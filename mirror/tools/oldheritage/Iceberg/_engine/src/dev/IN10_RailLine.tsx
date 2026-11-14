// IN10 RailLine: the filmer's frame frozen on the man beyond the guard rail. A thin white line is drawn along the top of the rail itself,
// left to right, and becomes the boundary: everything past it (the man, the ledge, the drop) slowly cools and dims while our side of the
// rail keeps its warm daylight. Slow eased push toward the man. No text, no arrows: the rail is the only mark.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, cl, io, out, type CK } from "./DC01_kit";

type P = [number, number];
export const RailLine: React.FC<{ src: string; t: number; keys: CK[]; rail: P[]; at: number; len: number }> = ({ src, t, keys, rail, at, len }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const d = io(interpolate(f, [at, at + len], [0, 1], cl));
  const cool = out(interpolate(f, [at + len * 0.6, at + len + 30], [0, 1], cl));
  const L = rail.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - rail[i][0], q[1] - rail[i][1]), 0);
  const pts = rail.map((q) => q.join(",")).join(" ");
  // region past the rail = above the polyline, in 1920x1080 picture coordinates
  const poly = `0,0 1920,0 ${[...rail].reverse().map((q) => q.join(",")).join(" ")}`;
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
      <div style={st}>
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs><clipPath id="past"><polygon points={poly} /></clipPath></defs>
          <rect x={0} y={0} width={1920} height={1080} fill="rgb(18,34,58)" opacity={0.42 * cool} clipPath="url(#past)" style={{ mixBlendMode: "multiply" }} />
          <rect x={0} y={0} width={1920} height={1080} fill="rgb(0,0,0)" opacity={0.25 * cool} clipPath="url(#past)" />
          <polyline points={pts} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={11} strokeLinecap="round" strokeDasharray={`${L * d} ${L}`} />
          <polyline points={pts} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeDasharray={`${L * d} ${L}`} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
