// DC08 TwoClocks: the two moments the man gave his name, frozen from the same tape, each whole 4:3 frame with its own burned-in
// clock. The first ("Robert Jones", 16:07) comes forward alone; on "Jimmy Jones" it slides left and turns away a little while the
// second frame (16:12) arrives beside it, then the camera settles on the second. The clocks on the tape are the only text: they
// show the five minutes between the two answers. Over a soft, dim copy of the tape.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC08_kit";

const Frame: React.FC<{ src: string; w: number; dim: number }> = ({ src, w, dim }) => (
  <div style={{ position: "absolute", left: -w / 2, top: -(w * 0.75) / 2, width: w, height: w * 0.75, outline: "5px solid #F2F2F0",
    boxShadow: "0 30px 60px rgba(0,0,0,.65)", overflow: "hidden", background: "#000" }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: `brightness(${1 - dim})` }} />
  </div>
);

/** f1 / f2 = the two frames as stills (whole 4:3 frames extracted from the graded tape) */
export const TwoClocks: React.FC<{ f1: string; f2: string; at2: number; settle: number }> = ({ f1, f2, at2, settle }) => {
  const f = useCurrentFrame();
  const a = out(interpolate(f, [0, 24], [0, 1], cl));
  const b = io(interpolate(f, [at2 - 8, at2 + 22], [0, 1], cl));
  const s = io(interpolate(f, [settle, settle + 50], [0, 1], cl));
  const W = 860;
  const x1 = 960 - 470 * b - 120 * s, x2 = 960 + 470 - 120 * s + (1 - b) * 900;
  const zoom = 1 + 0.12 * s;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(f1)} style={{ position: "absolute", left: -60, top: -300, width: 2040, height: 1530, filter: "blur(14px) brightness(.32) saturate(.6)" }} />
      <AbsoluteFill style={{ perspective: 1800, transform: `scale(${zoom})`, transformOrigin: `${50 + 14 * s}% 50%` }}>
        <div style={{ position: "absolute", left: x1, top: 540, transform: `translateZ(${-200 * (1 - a) - 60 * b}px) rotateY(${10 * b}deg)`, opacity: a }}>
          <Frame src={f1} w={W} dim={0.35 * s} />
        </div>
        <div style={{ position: "absolute", left: x2, top: 540, transform: `translateZ(${40 * s}px) rotateY(${-10 * (1 - s)}deg)`, opacity: b }}>
          <Frame src={f2} w={W} dim={0} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
