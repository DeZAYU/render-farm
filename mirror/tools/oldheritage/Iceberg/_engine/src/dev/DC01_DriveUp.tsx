// DC01 DriveUp: the real aerial (USGS NAIP) of the Tallman property off Scott Road, Hardwick. Opens wide on the road through the
// woods, eases down toward the house while the dirt driveway the troopers used is drawn in white from Scott Road to the yard
// ("drove up a dirt driveway"), then a white box closes round the house (E911 address point) and the place label wipes on.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { cl, ease, io, out } from "./DC01_kit";

export const DriveUp: React.FC<{ src: string; iw: number; ih: number; path: [number, number][]; box: [number, number, number, number];
  z0: number; z1: number; focus0: [number, number]; focus1: [number, number]; traceAt: number; traceLen: number; boxAt: number;
  labels: { text: string; at: number; hold?: number }[] }> = ({ src, iw, ih, path, box, z0, z1, focus0, focus1, traceAt, traceLen, boxAt, labels }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / durationInFrames);
  const z = z0 + (z1 - z0) * u, fx = focus0[0] + (focus1[0] - focus0[0]) * u, fy = focus0[1] + (focus1[1] - focus0[1]) * u;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const P = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const d = "M" + path.map((p) => P(p).join(" ")).join(" L");
  const g = ease(f, traceAt, traceAt + traceLen);
  const b = out(interpolate(f, [boxAt, boxAt + 16], [0, 1], cl));
  const [bx, by] = P([box[0], box[1]]), bw = (box[2] - box[0]) * base, bh = (box[3] - box[1]) * base, BP = 2 * (bw + bh);
  const o = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "saturate(.92) contrast(1.06)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.45) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={13} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={BP} strokeDashoffset={BP * (1 - b)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
      </svg>
      {labels.map((l, i) => <RedLabel key={i} text={l.text} at={l.at} hold={l.hold ?? 9999} />)}
    </AbsoluteFill>
  );
};
