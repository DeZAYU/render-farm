// DC17 PostWatch: "Watch the lamp posts first, then the riders along that rail." The dashcam's first frame held full screen; the
// frame sinks to a cold dim grey except one soft pool of the real picture, which sits on the lamp posts and the lit sign, then glides
// down the railing to the motorbikes on the right; on the last beat the grey lifts and the raw runs on from this exact frame.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, io, placeOf } from "./DC01_kit";

type Pool = { f: number; x: number; y: number; rx: number; ry: number };
const poolAt = (f: number, k: Pool[]) => {
  if (f <= k[0].f) return k[0];
  for (let i = 1; i < k.length; i++) { const a = k[i - 1], b = k[i]; if (f <= b.f) { const u = io((f - a.f) / Math.max(1, b.f - a.f)); return { f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, rx: a.rx + (b.rx - a.rx) * u, ry: a.ry + (b.ry - a.ry) * u }; } }
  return k[k.length - 1];
};

export const PostWatch: React.FC<{ src: string; t: number; keys: CK[]; pools: Pool[]; dimAt: number; liftAt: number }> = ({ src, t, keys, pools, dimAt, liftAt }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys)); const q = poolAt(f, pools);
  const k = ease(f, dimAt, dimAt + 16) * (1 - ease(f, liftAt, liftAt + 12));
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const frame = (filter?: string) => <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter }} /></Freeze>;
  const m = `radial-gradient(ellipse ${q.rx * 100}% ${q.ry * 100}% at ${q.x * 100}% ${q.y * 100}%, rgba(0,0,0,0) 40%, #000 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        {frame()}
        <div style={{ ...st, opacity: k, WebkitMaskImage: m, maskImage: m } as React.CSSProperties}>{frame("grayscale(1) brightness(.16)")}</div>
      </div>
    </AbsoluteFill>
  );
};
