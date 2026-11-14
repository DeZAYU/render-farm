// WP27 device: ThreePhones — "firefighters, depot workers and onlookers were all standing close to it". Three people's vertical phone
// videos of the same burning depot that night. The firefighters' phone view holds the centre at full height over its own blurred copy;
// on "firefighters" it punches in a touch; on "depot workers" a second phone slides in from the left (a depot worker's own live,
// silhouettes in front of the fire), on "onlookers" a third from the right (the crowd under a shed watching). Thin white frames
// settle on all three: three phones, three kinds of people, all within reach of the fire. Footage stays full height; no text.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AR, BlurBed, cl, io, out } from "./WP01_kit";

type P = { src: string; from: number };
const Panel: React.FC<{ p: P; x: number; s: number; fx?: number; fy?: number; frame: number }> = ({ p, x, s, fx = 0.5, fy = 0.5, frame }) => {
  const { height } = useVideoConfig(); const W = height * AR;
  return (
    <div style={{ position: "absolute", left: x - W / 2, top: 0, width: W, height, overflow: "hidden", boxShadow: "0 0 50px rgba(0,0,0,.75)" }}>
      <OffthreadVideo src={staticFile(p.src)} startFrom={Math.round(p.from * 30)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }} />
      <div style={{ position: "absolute", inset: 0, border: `5px solid rgba(255,255,255,${0.92 * frame})` }} />
    </div>
  );
};

export const ThreePhones: React.FC<{ n: number; mid: P; left: P; right: P; punch: number; inL: number; inR: number }> = ({ n, mid, left, right, punch, inL, inR }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const W = height * AR, gap = 22;
  const cx = width / 2, lx = cx - W - gap, rx = cx + W + gap;
  const sMid = 1.02 + 0.06 * io(Math.min(1, f / n)) + 0.05 * out(interpolate(f, [punch, punch + 14], [0, 1], cl));
  const eL = out(interpolate(f, [inL, inL + 20], [0, 1], cl)), eR = out(interpolate(f, [inR, inR + 20], [0, 1], cl));
  const fr = io(interpolate(f, [inL + 8, inR + 24], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <BlurBed src={mid.src} from={mid.from} dim={0.42} />
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.25 * fr})` }} />
      <Sequence from={Math.max(0, inL - 2)} layout="none">
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - eL) * -(lx + W)}px)`, opacity: Math.min(1, eL * 3) }}>
          <Panel p={left} x={lx} s={1.04 + 0.04 * io(interpolate(f, [inL, n], [0, 1], cl))} frame={fr} />
        </div>
      </Sequence>
      <Sequence from={Math.max(0, inR - 2)} layout="none">
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - eR) * (width - rx + W)}px)`, opacity: Math.min(1, eR * 3) }}>
          <Panel p={right} x={rx} s={1.04 + 0.04 * io(interpolate(f, [inR, n], [0, 1], cl))} frame={fr} />
        </div>
      </Sequence>
      <Panel p={mid} x={cx} s={sMid} fy={0.55} frame={fr} />
    </AbsoluteFill>
  );
};
