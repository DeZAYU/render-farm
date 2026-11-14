// IN24 NightRun: NASA Black Marble (VIIRS night lights, public domain) of southern England laid back in 3-D; the camera starts low over
// the Essex coast at Jaywick, the real road route home (OSRM over OpenStreetMap) draws itself west in white with a soft glowing head
// while the camera eases back to hold the whole night drive, and settles on Shrewsbury as its light comes up (place labels only).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useDcFonts, io } from "./DC01_kit";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Tag: React.FC<{ text: string; x: number; y: number; o: number; inv: number }> = ({ text, x, y, o, inv }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -150%) scale(${inv})`, transformOrigin: "50% 100%", opacity: o }}>
    <div style={{ background: RED, padding: "6px 16px 4px", fontFamily: "ArchivoBlk", fontWeight: 900, fontStretch: "105%", fontSize: 40, color: "#0A0A0A", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>{text}</div>
  </div>
);

export const NightRun: React.FC<{ src: string; iw: number; ih: number; path: [number, number][]; n: number; drawAt: number; drawLen: number;
  a: string; b: string; tilt?: number }> = ({ src, iw, ih, path, n, drawAt, drawLen, a, b, tilt = 24 }) => {
  useDcFonts();
  const f = useCurrentFrame();
  // cumulative lengths
  const L = React.useMemo(() => { const c = [0]; for (let i = 1; i < path.length; i++) c.push(c[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1])); return c; }, [path]);
  const tot = L[L.length - 1];
  const u = io(interpolate(f, [drawAt, drawAt + drawLen], [0, 1], cl));
  const dl = u * tot;
  let k = 1; while (k < L.length - 1 && L[k] < dl) k++;
  const r = (dl - L[k - 1]) / Math.max(1e-6, L[k] - L[k - 1]);
  const head: [number, number] = [path[k - 1][0] + (path[k][0] - path[k - 1][0]) * r, path[k - 1][1] + (path[k][1] - path[k - 1][1]) * r];
  const s0 = path[0], s1 = path[path.length - 1];
  const mid: [number, number] = [(s0[0] + s1[0]) / 2, (s0[1] + s1[1]) / 2];
  // camera: over the start -> wide on the whole route -> ease toward the end
  const w1 = io(interpolate(f, [0, drawAt + drawLen * 0.6], [0, 1], cl));
  const w2 = io(interpolate(f, [drawAt + drawLen * 0.7, n], [0, 1], cl));
  const A = { x: s0[0] - 60, y: s0[1] - 40, z: 0.85 }, M = { x: mid[0] + 170, y: mid[1], z: 0.56 }, B = { x: s1[0] + 380, y: s1[1] + 40, z: 0.88 };
  const lerp = (p: number, q: number) => (w2 > 0 ? p + (q - p) * w2 : p);
  const z = lerp(A.z + (M.z - A.z) * w1, B.z), fx = lerp(A.x + (M.x - A.x) * w1, B.x), fy = lerp(A.y + (M.y - A.y) * w1, B.y);
  const oa = interpolate(f, [10, 24, drawAt + drawLen * 0.6, drawAt + drawLen * 0.75], [0, 1, 1, 0], cl);
  const ob = interpolate(f, [drawAt + drawLen - 6, drawAt + drawLen + 10], [0, 1], cl);
  const endGlow = interpolate(f, [drawAt + drawLen - 10, drawAt + drawLen + 20], [0, 1], cl);
  const pts = path.slice(0, k).map((p) => p.join(",")).join(" ") + ` ${head[0]},${head[1]}`;
  const inv = 1 / z;
  return (
    <AbsoluteFill style={{ background: "#03040a", overflow: "hidden", perspective: 1600 }}>
      <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transform: `rotateX(${tilt}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: iw, height: ih, transformOrigin: "0 0", transform: `scale(${z}) translate(${-fx}px, ${-fy}px)` }}>
          <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: iw, height: ih, filter: "brightness(0.92) contrast(1.05)" }} />
          <svg width={iw} height={ih} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <circle cx={s1[0]} cy={s1[1]} r={70 * endGlow} fill="rgba(255,240,200,.18)" />
            <polyline points={pts} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={14 * inv} strokeLinejoin="round" strokeLinecap="round" style={{ filter: "blur(6px)" }} />
            <polyline points={pts} fill="none" stroke="#FFFFFF" strokeWidth={4.5 * inv} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={s0[0]} cy={s0[1]} r={9 * inv} fill="#fff" />
            {u > 0 && u < 1 && <circle cx={head[0]} cy={head[1]} r={22 * inv} fill="rgba(255,255,255,.35)" style={{ filter: "blur(5px)" }} />}
            {u > 0 && <circle cx={head[0]} cy={head[1]} r={8 * inv} fill="#fff" />}
          </svg>
          <Tag text={a} x={s0[0]} y={s0[1] - 10 * inv} o={oa} inv={inv} />
          <Tag text={b} x={s1[0]} y={s1[1] - 10 * inv} o={ob} inv={inv} />
        </div>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,4,10,.85) 0%, rgba(3,4,10,0) 22%, rgba(3,4,10,0) 80%, rgba(3,4,10,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
