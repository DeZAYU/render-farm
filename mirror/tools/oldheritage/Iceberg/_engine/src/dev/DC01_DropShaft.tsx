// DC01 DropShaft: the dashcam frozen at the bottom of the sweep, the bucket right above the people struggling on the ground. A tall
// soft shaft of colour runs from the bucket down to them while the rest of the frame drains to a dim grey, a dashed white plumb line
// drops from the bucket's lip to the pile, and the camera pushes in along the shaft ("swinging a steel bucket over two officers").
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

export const DropShaft: React.FC<{ src: string; t: number; keys: CK[]; shaft: [number, number, number, number]; lip: [number, number]; ground: number; at: number }> = ({ src, t, keys, shaft, lip, ground, at }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const k = ease(f, at, at + 20), ln = ease(f, at + 14, at + 40);
  const [cx, cy, rx, ry] = shaft;
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const frame = (filter?: string) => <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter }} /></Freeze>;
  const m = `radial-gradient(ellipse ${rx * 100}% ${ry * 100}% at ${cx * 100}% ${cy * 100}%, rgba(0,0,0,0) 55%, #000 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        {frame()}
        <div style={{ ...st, opacity: k, WebkitMaskImage: m, maskImage: m } as React.CSSProperties}>{frame("grayscale(1) brightness(.38)")}</div>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ ...st }}>
          <line x1={lip[0] * 1000} y1={lip[1] * 1000} x2={lip[0] * 1000} y2={(lip[1] + (ground - lip[1]) * ln) * 1000} stroke="rgba(0,0,0,.5)" strokeWidth={7} vectorEffect="non-scaling-stroke" strokeDasharray="10 8" />
          <line x1={lip[0] * 1000} y1={lip[1] * 1000} x2={lip[0] * 1000} y2={(lip[1] + (ground - lip[1]) * ln) * 1000} stroke="#fff" strokeWidth={3.5} vectorEffect="non-scaling-stroke" strokeDasharray="10 8" />
          {ln > 0.98 && <line x1={(lip[0] - 0.03) * 1000} y1={ground * 1000} x2={(lip[0] + 0.03) * 1000} y2={ground * 1000} stroke="#fff" strokeWidth={3.5} vectorEffect="non-scaling-stroke" />}
          {ln > 0 && <line x1={(lip[0] - 0.03) * 1000} y1={lip[1] * 1000} x2={(lip[0] + 0.03) * 1000} y2={lip[1] * 1000} stroke="#fff" strokeWidth={3.5} vectorEffect="non-scaling-stroke" />}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
