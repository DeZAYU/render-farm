// DC15 NorthLine: the real NAIP aerial of Montecito laid back in 3-D like a map on a table, looking north. A thin white line draws
// itself up Olive Mill Road from the 101 toward the hills (the officers' way north) while the plane slowly tips up and the camera
// glides along the line; the rest of the town sits a little darker so the road reads. Place label only.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, ease, out } from "./DC01_kit";

export const NorthLine: React.FC<{ src: string; iw: number; ih: number; path: [number, number][]; drawAt: number; drawLen: number; children?: React.ReactNode }> = ({ src, iw, ih, path, drawAt, drawLen, children }) => {
  const f = useCurrentFrame();
  const W = 4600, k = W / iw, H = ih * k;                          // plane size on screen (px)
  const d = ease(f, drawAt, drawAt + drawLen);
  const enter = out(interpolate(f, [0, 26], [0, 1], cl));
  const glide = ease(f, 0, drawAt + drawLen + 20);
  // polyline length + head position
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const L = seg.reduce((a, b) => a + b, 0);
  let rem = L * d, head = path[0];
  for (let i = 0; i < seg.length; i++) { if (rem <= seg[i]) { const u = rem / seg[i]; head = [path[i][0] + (path[i + 1][0] - path[i][0]) * u, path[i][1] + (path[i + 1][1] - path[i][1]) * u]; break; } rem -= seg[i]; head = path[i + 1]; }
  // camera focus follows from the start of the line to a point a little ahead of the head
  const fx = interpolate(glide, [0, 1], [path[0][0], path[path.length - 1][0]]) * k, fy = interpolate(glide, [0, 1], [path[0][1], path[path.length - 1][1]]) * k;
  const tilt = 46 - 10 * glide;
  const pts = path.map((p) => `${p[0] * k},${p[1] * k}`).join(" ");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1400, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left: 960 - fx, top: 640 - fy, width: W, height: H, transformOrigin: `${fx}px ${fy}px`, opacity: enter,
          transform: `translateZ(${-200 * (1 - enter)}px) rotateX(${tilt}deg) scale(${0.62 + 0.08 * glide})` }}>
          <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "brightness(.8) saturate(.9)" }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <polyline points={pts} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L * k} strokeDashoffset={L * k * (1 - d)} />
            <polyline points={pts} fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L * k} strokeDashoffset={L * k * (1 - d)} />
            {d > 0 && d < 1 && <circle cx={head[0] * k} cy={head[1] * k} r={11} fill="#fff" />}
          </svg>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 80%, rgba(0,0,0,.5) 100%)" }} />
      {children}
    </AbsoluteFill>
  );
};
