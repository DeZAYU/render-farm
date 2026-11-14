// TP14 DownRiver: a real orthophoto (IGN PNOA) of the Nervión estuary. The town is named, then a white line runs down the river from
// Bilbao's old town to Barakaldo as "downstream from Bilbao" is spoken, then the camera dives onto the exhibition centre and a
// white box draws round it. All coordinates are image px.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Cam = { at: number; cx: number; cy: number; z: number };
export const DownRiver: React.FC<{ src: string; iw: number; ih: number; river: [number, number][]; traceAt: number; traceLen: number; cams: Cam[];
  site: [number, number, number, number]; siteAt: number; labels: { text: string; x: number; y: number; at: number; hold?: number }[] }> = ({ src, iw, ih, river, traceAt, traceLen, cams, site, siteAt, labels }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const k1 = cams[cams.length - 1];
  const nxt = cams.find((c) => c.at > f); const prv = [...cams].reverse().find((c) => c.at <= f) ?? cams[0];
  const t = nxt ? io(interpolate(f, [prv.at, nxt.at], [0, 1], cl)) : 1; const A = nxt ? prv : k1, B = nxt ?? k1;
  const cx = A.cx + (B.cx - A.cx) * t, cy = A.cy + (B.cy - A.cy) * t, z = A.z * Math.pow(B.z / A.z, t);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - cx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - cy * base));
  const S = (x: number, y: number) => [ox + x * base, oy + y * base];
  const d = "M" + river.map(([x, y]) => S(x, y).join(" ")).join(" L");
  const g = io(interpolate(f, [traceAt, traceAt + traceLen], [0, 1], cl));
  const [bx0, by0] = S(site[0], site[1]), [bx1, by1] = S(site[2], site[3]); const P = 2 * (bx1 - bx0 + by1 - by0);
  const gb = out(interpolate(f, [siteAt, siteAt + 16], [0, 1], cl));
  const head = river[0]; const [hx, hy] = S(head[0], head[1]);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "saturate(.95) contrast(1.04)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.45) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        {f >= traceAt && <circle cx={hx} cy={hy} r={11} fill="#fff" stroke="rgba(0,0,0,.5)" strokeWidth={3} />}
        <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - gb)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
      </svg>
      {labels.map((l, j) => { const [x, y] = S(l.x, l.y); return <RedLabel key={j} text={l.text} at={l.at} hold={l.hold ?? 9999} x={x / width} y={y / height} size={40} />; })}
    </AbsoluteFill>
  );
};
