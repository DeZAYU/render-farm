// DC19 BankEdge: "The trees to watch are on the bank as he comes around the bend." The dashcam's frame just before the bend held;
// the road side of the frame sinks a little darker while a white dashed line runs along the foot of the wooded bank on the left, from
// the bonnet out to the bend, and the camera eases toward the slope; the line fades and the raw runs on from this exact frame.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

type P = [number, number];
export const BankEdge: React.FC<{ src: string; t: number; keys: CK[]; path: P[]; at: number; outAt: number }> = ({ src, t, keys, path, at, outAt }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const g = ease(f, at, at + 30), o = 1 - ease(f, outAt, outAt + 10), d = ease(f, at - 6, at + 18) * o;
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const dpath = "M" + path.map((q) => `${q[0] * 1000} ${q[1] * 1000}`).join(" L");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
        <div style={{ ...st, opacity: d * 0.75, background: "linear-gradient(110deg, rgba(0,0,0,0) 38%, rgba(0,0,0,.55) 62%)" }} />
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ ...st, opacity: o }}>
          <path d={dpath} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={8} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={`${g} 1`} />
          <path d={dpath} fill="none" stroke="#fff" strokeWidth={4} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={`${g} 1`} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
