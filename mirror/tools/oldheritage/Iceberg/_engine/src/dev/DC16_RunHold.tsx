// DC16 RunHold: the cruiser camera's frame held the instant before Officer Duncan gets out (wet road, the gates down, the AT&T van
// across the tracks). The picture drains to a cold dim grey except a soft lane of colour from the cruiser's hood out to the van, the
// ground he is about to cover; on "the clock ticking in the corner" the light slides down to the camera's own date/time stamp in the
// bottom corner and the camera follows it; then colour returns, the camera eases back to the full frame and the raw runs from here.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

type Pool = { f: number; x: number; y: number; rx: number; ry: number };
export const RunHold: React.FC<{ src: string; t: number; keys: CK[]; pools: Pool[]; at: number; backAt: number }> = ({ src, t, keys, pools, at, backAt }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const k = ease(f, at, at + 20) * (1 - ease(f, backAt, backAt + 16));
  let q = pools[0];
  for (let i = 1; i < pools.length; i++) {
    const a = pools[i - 1], b = pools[i];
    if (f >= a.f && f <= b.f) { const u = ease(f, a.f, b.f); q = { f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, rx: a.rx + (b.rx - a.rx) * u, ry: a.ry + (b.ry - a.ry) * u }; break; }
    if (f > b.f) q = b;
  }
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const m = `radial-gradient(ellipse ${q.rx * 100}% ${q.ry * 100}% at ${q.x * 100}% ${q.y * 100}%, rgba(0,0,0,0) 40%, #000 100%)`;
  const frame = (filter?: string) => <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter }} /></Freeze>;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        {frame()}
        <div style={{ ...st, opacity: k, WebkitMaskImage: m, maskImage: m } as React.CSSProperties}>{frame("grayscale(1) brightness(.36) contrast(1.05)")}</div>
      </div>
    </AbsoluteFill>
  );
};
