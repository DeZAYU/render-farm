// DC15 DarkAhead: the CHP dashcam's first frame held (wet road, the yellow diamond sign, black beyond). The camera drifts in toward
// the sign; on "look past that sign" the frame sinks into shadow except a soft pool of light on the dark stretch of road beyond it
// and the camera pushes into that darkness; on the last words the light comes back, the camera eases out to the full frame and the
// raw runs on from this exact frame (the debris flow comes out of that stretch).
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

export const DarkAhead: React.FC<{ src: string; t: number; keys: CK[]; pool: [number, number, number, number]; at: number; backAt: number; lift?: string }> = ({ src, t, keys, pool, at, backAt, lift = "brightness(1.25) contrast(1.05)" }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const k = ease(f, at, at + 22) * (1 - ease(f, backAt, backAt + 16));
  const [cx, cy, rx, ry] = pool;
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const m = `radial-gradient(ellipse ${rx * 100}% ${ry * 100}% at ${cx * 100}% ${cy * 100}%, rgba(0,0,0,0) 35%, #000 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter: lift }} /></Freeze>
        <div style={{ ...st, background: "#000", opacity: 0.82 * k, WebkitMaskImage: m, maskImage: m } as React.CSSProperties} />
      </div>
    </AbsoluteFill>
  );
};
