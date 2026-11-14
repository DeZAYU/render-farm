// IN03 RopeCatch: the filmer's wide shot held where the slide ended: the climber is a yellow speck far down the slab. The rope that
// finally held him is drawn in white from the anchor end (frame edge) down the granite to him; everything off that line falls into
// shadow; a slow push follows the line toward him (no text).
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { type CK, camAt, placeOf, cl, io } from "./DC01_kit";

export const RopeCatch: React.FC<{ src: string; t: number; keys: CK[]; path: [number, number][]; at?: number; len?: number }> = ({ src, t, keys, path, at = 8, len = 40 }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const pts = path.map(([x, y]) => [p.left + x * p.w, p.top + y * p.h]);
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const u = io(interpolate(f, [at, at + len], [0, 1], cl));
  const d = "M " + pts.map((q) => `${q[0]} ${q[1]}`).join(" L ");
  const end = pts[pts.length - 1];
  const shade = io(interpolate(f, [at, at + 24], [0, 1], cl));
  const mid = pts[Math.floor(pts.length / 2)];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, filter: `saturate(${1 - 0.25 * shade})` }} /></Freeze>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 360px 620px at ${mid[0]}px ${mid[1]}px, rgba(0,0,0,0) 40%, rgba(0,0,0,${0.55 * shade}) 100%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={9} strokeLinecap="round" strokeDasharray={`${total * u} ${total}`} />
        <path d={d} fill="none" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" strokeDasharray={`${total * u} ${total}`} />
        {u > 0.98 && <circle cx={end[0]} cy={end[1]} r={7} fill="#fff" opacity={interpolate(f, [at + len, at + len + 8], [0, 1], cl)} />}
      </svg>
    </AbsoluteFill>
  );
};
