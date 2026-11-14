// DC01 ArmKeep: the dashcam's first frame held. The camera starts tight on the troopers on the ground, travels up the excavator's
// stick to the family name painted on it (TALLMAN) as Wayne is named, holds, then pulls back to the whole frame; on "keep your eye on
// the long orange arm" everything except the arm and bucket drains to a cold dim grey (hand-drawn mask of that frame, soft edge).
// At the end the colour floods back and the camera lands on the full frame, so the raw that follows starts on this exact picture.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, cl, ease, placeOf } from "./DC01_kit";

export const ArmKeep: React.FC<{ src: string; t: number; mask: string; maskOut: string; keys: CK[]; drainAt: number; drainLen: number; backAt: number; backLen: number; children?: React.ReactNode }> = ({ src, t, mask, maskOut, keys, drainAt, drainLen, backAt, backLen, children }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const k = ease(f, drainAt, drainAt + drainLen) * (1 - ease(f, backAt, backAt + backLen));
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const frame = (filter?: string) => <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter }} /></Freeze>;
  const mk = `url(${staticFile(mask)})`, mo = `url(${staticFile(maskOut)})`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        {frame()}
        {/* the drained world: grey + dim, cut away where the arm is */}
        <div style={{ ...st, opacity: k, WebkitMaskImage: mo, maskImage: mo, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" } as React.CSSProperties}>
          {frame("grayscale(1) brightness(.42) contrast(1.05)")}
        </div>
        {/* the arm itself lifts a touch */}
        <div style={{ ...st, opacity: k * 0.5, mixBlendMode: "screen", WebkitMaskImage: mk, maskImage: mk, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", filter: `blur(${interpolate(k, [0, 1], [0, 2], cl)}px)` } as React.CSSProperties}>
          {frame("saturate(1.6) brightness(.55)")}
        </div>
      </div>
      {children}
    </AbsoluteFill>
  );
};
