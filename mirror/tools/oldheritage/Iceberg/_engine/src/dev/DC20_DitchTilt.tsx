// DC20 DitchTilt: "...finished the night nose down in a ditch in another state." The cruiser camera's frame of the Humvee in the
// ditch held and slowly pushed in; a dashed white level line is drawn across the Humvee, then a solid white line settles along its
// tilted roof edge (measured from the frame) and a thin arc closes the angle between them. No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CK, camAt, ease, placeOf } from "./DC01_kit";

type P = [number, number];
export const DitchTilt: React.FC<{ src: string; t: number; keys: CK[]; pivot: P; roof: P; levelAt: number; roofAt: number }> = ({ src, t, keys, pivot, roof, levelAt, roofAt }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const a = ease(f, levelAt, levelAt + 20), b = ease(f, roofAt, roofAt + 22), c = ease(f, roofAt + 16, roofAt + 36);
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  // work in frame pixels so the angle is true on screen
  const X = (q: P) => p.left + q[0] * p.w, Y = (q: P) => p.top + q[1] * p.h;
  const px = X(pivot), py = Y(pivot), rx = X(roof), ry = Y(roof);
  const len = Math.hypot(rx - px, ry - py), ang = Math.atan2(ry - py, rx - px);
  const R = len * 0.55;
  const arcEnd = [px + R * Math.cos(ang * c), py + R * Math.sin(ang * c)];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 1px 3px rgba(0,0,0,.7))" }}>
        <line x1={px - len * 0.35} y1={py} x2={px - len * 0.35 + (len * 1.6) * a} y2={py} stroke="#fff" strokeWidth={3} strokeDasharray="12 10" />
        <line x1={px} y1={py} x2={px + (rx - px) * b * 1.15} y2={py + (ry - py) * b * 1.15} stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
        {c > 0 && <path d={`M${px + R} ${py} A ${R} ${R} 0 0 0 ${arcEnd[0]} ${arcEnd[1]}`} fill="none" stroke="#fff" strokeWidth={3} />}
      </svg>
    </AbsoluteFill>
  );
};
