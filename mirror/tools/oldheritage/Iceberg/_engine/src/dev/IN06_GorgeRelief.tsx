// IN06 GorgeRelief: the real ground of the creek (USGS NAIP colour multiplied with the USGS 3DEP lidar hillshade, both public domain) on a
// plane that starts flat and tips back into 3-D while a low light rakes across it, so the incised gorge stands out as a dark trench; the
// creek's own course (OSM) is drawn in white down the gorge. No text except the place label passed in by the case.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

type P = [number, number];
const len = (p: P[]) => p.slice(1).reduce((s, q, i) => s + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);

export const GorgeRelief: React.FC<{ src: string; hs: string; iw: number; ih: number; n: number; focus: P; path: P[]; traceAt: number; traceLen: number; tilt?: number }> =
  ({ src, hs, iw, ih, n, focus, path, traceAt, traceLen, tilt = 42 }) => {
  const f = useCurrentFrame();
  const u = io(interpolate(f, [0, n], [0, 1], cl));
  const rx = tilt * io(interpolate(f, [10, n - 10], [0, 1], cl));
  const s = (1920 / iw) * (1.08 + 0.55 * u);
  const tx = (iw / 2 - focus[0]) * u, ty = (ih / 2 - focus[1]) * u;
  const rake = interpolate(f, [0, n], [-0.3, 1.2], cl);                  // light band position across the plane
  const shade = interpolate(f, [0, 40], [0.15, 0.55], cl);               // hillshade weight grows: the trench deepens
  const L = len(path), d = L * out(interpolate(f, [traceAt, traceAt + traceLen], [0, 1], cl));
  const pts = path.map((p) => p.join(",")).join(" ");
  return (
    <AbsoluteFill style={{ background: "#07090b", overflow: "hidden", perspective: 1500, perspectiveOrigin: "50% 30%" }}>
      <div style={{ position: "absolute", left: 960 - iw / 2, top: 540 - ih / 2, width: iw, height: ih,
        transform: `rotateX(${rx}deg) scale(${s}) translate(${tx}px, ${ty}px)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: iw, height: ih, filter: "brightness(1.18) contrast(1.05)" }} />
        <Img src={staticFile(hs)} style={{ position: "absolute", inset: 0, width: iw, height: ih, mixBlendMode: "multiply", opacity: shade }} />
        <div style={{ position: "absolute", inset: 0, mixBlendMode: "soft-light",
          background: `linear-gradient(115deg, rgba(0,0,0,0) ${(rake - 0.25) * 100}%, rgba(255,246,228,.75) ${rake * 100}%, rgba(0,0,0,0) ${(rake + 0.25) * 100}%)` }} />
        <svg width={iw} height={ih} style={{ position: "absolute", inset: 0 }}>
          <polyline points={pts} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${d} ${L}`} />
          <polyline points={pts} fill="none" stroke="#fff" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${d} ${L}`} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,9,.85) 0%, rgba(5,7,9,0) 28%, rgba(5,7,9,0) 75%, rgba(5,7,9,.6) 100%)", opacity: 0.4 + 0.6 * (rx / tilt) }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
