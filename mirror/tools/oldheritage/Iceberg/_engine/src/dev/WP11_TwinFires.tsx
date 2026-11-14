// WP11 device: TwinFires. Two refinery cameras, three years apart, side by side at full height: Woods Cross 2009 holds the frame,
// then Richmond 2012 slides in from the right behind a white seam until each owns half the picture; both burn on, pushed slowly,
// each with its own RedLabel (place · year).
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { cl, io } from "./WP01_kit";

const Half: React.FC<{ src: string; from: number; s: number; ox: number }> = ({ src, from, s, ox }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted
      style={{ position: "absolute", left: "50%", top: 0, width: 1920, height: 1080, marginLeft: -960 + ox, objectFit: "cover", transform: `scale(${s})`, transformOrigin: "50% 50%" }} />
  </div>
);
export const TwinFires: React.FC<{ a: { src: string; from: number; ox: number; label: string }; b: { src: string; from: number; ox: number; label: string }; n: number; slide: [number, number] }> = ({ a, b, n, slide }) => {
  const f = useCurrentFrame();
  const u = io(interpolate(f, [slide[0], slide[1]], [0, 1], cl));
  const seam = 1920 - u * 960; // x of the seam: right edge -> centre
  const s = 1.1 + 0.08 * io(interpolate(f, [0, n], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: seam, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: (seam - 1920) / 2, top: 0, width: 1920, height: 1080 }}><Half src={a.src} from={a.from} s={s} ox={a.ox * (1 - u) * 0 + a.ox * u} /></div>
      </div>
      <div style={{ position: "absolute", left: seam, top: 0, bottom: 0, right: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: (1920 - seam - 1920) / 2, top: 0, width: 1920, height: 1080 }}><Half src={b.src} from={b.from} s={s} ox={b.ox} /></div>
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: seam - 3, width: 6, background: "#F2F2F0", boxShadow: "0 0 20px rgba(0,0,0,.6)" }} />
      <RedLabel text={a.label} at={8} x={0.25 + 0.25 * (1 - u)} y={0.88} size={40} />
      <RedLabel text={b.label} at={slide[1] - 4} x={0.75} y={0.88} size={40} />
    </AbsoluteFill>
  );
};
