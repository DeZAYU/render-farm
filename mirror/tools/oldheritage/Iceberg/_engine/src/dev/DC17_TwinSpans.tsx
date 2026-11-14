// DC17 TwinSpans: the real Sentinel-2 plate of the Mactan Channel (EOX s2cloudless, CC BY 4.0). Eases in over the water between
// Mandaue (north-west) and Mactan Island while the two bridges that cross it are drawn in white, one after the other, across the
// channel ("two bridges link Mandaue City to Mactan Island"); on "where Cebu's airport sits" a white outline runs round the runway.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { cl, ease, io } from "./DC01_kit";

type P = [number, number];
export const TwinSpans: React.FC<{ src: string; iw: number; ih: number; z0: number; z1: number; focus0: P; focus1: P;
  spans: { a: P; b: P; at: number }[]; runway: P[]; runwayAt: number; labels: { text: string; at: number; hold?: number; x?: number; y?: number }[] }> = ({ src, iw, ih, z0, z1, focus0, focus1, spans, runway, runwayAt, labels }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / durationInFrames);
  const z = z0 + (z1 - z0) * u, fx = focus0[0] + (focus1[0] - focus0[0]) * u, fy = focus0[1] + (focus1[1] - focus0[1]) * u;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const Q = (p: P) => [ox + p[0] * base, oy + p[1] * base];
  const rw = "M" + runway.map((p) => Q(p).join(" ")).join(" L") + " Z";
  const r = ease(f, runwayAt, runwayAt + 22);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: interpolate(f, [0, 10], [0, 1], cl) }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "contrast(1.05)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 66% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {spans.map((s, i) => {
          const g = ease(f, s.at, s.at + 18); const [ax, ay] = Q(s.a), [bx, by] = Q(s.b);
          const ex = ax + (bx - ax) * g, ey = ay + (by - ay) * g;
          return <g key={i}>
            <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="rgba(0,0,0,.5)" strokeWidth={14} strokeLinecap="round" />
            <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
          </g>;
        })}
        <path d={rw} fill="none" stroke="#fff" strokeWidth={4} pathLength={1} strokeDasharray={`${r} 1`} strokeLinejoin="round" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} />
      </svg>
      {labels.map((l, i) => <RedLabel key={i} text={l.text} at={l.at} hold={l.hold ?? 9999} x={l.x} y={l.y} />)}
    </AbsoluteFill>
  );
};
