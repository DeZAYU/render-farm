// ND01 BayFunnel: the real bay (Sentinel-2 cloudless 2016, EOX, CC BY 4.0) laid as a plane tilted in perspective; the camera flies up the
// bay from its mouth to the town while white width bars drop across the water one after another, each narrower than the last, their
// measured widths in red (km, measured on the image). Mode "inland": the camera settles on the head of the bay and a white line runs up
// the valley the measured distance the water reached. Points in image px. Built for ND01 ("as the bay narrows ... it climbs").
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];

const Tag: React.FC<{ x: number; y: number; text: string; g: number; s: number }> = ({ x, y, text, g, s }) => (
  <g opacity={g} transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-6} y={-30} width={text.length * 24 + 16} height={40} fill={RED} />
    <text x={0} y={2} fill="#0B0B0B" fontFamily="ArchivoBlk" fontWeight={900} fontSize={34}>{text}</text>
  </g>
);

export const BayFunnel: React.FC<{
  src: string; iw: number; ih: number;
  cam: { at: number; p: P; z: number; tilt: number }[]; // camera keys (frame, image point centred, px scale, tilt deg)
  bars?: { a: P; b: P; label: string; at: number }[];
  path?: { pts: P[]; at: number; len: number; label: string };
}> = ({ src, iw, ih, cam, bars = [], path }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  // one smooth curve through the keys: eased between neighbours
  let c = cam[0];
  for (let i = 1; i < cam.length; i++) {
    const k = io(interpolate(f, [cam[i - 1].at, cam[i].at], [0, 1], cl));
    if (f >= cam[i - 1].at) c = { at: 0, p: [cam[i - 1].p[0] + (cam[i].p[0] - cam[i - 1].p[0]) * k, cam[i - 1].p[1] + (cam[i].p[1] - cam[i - 1].p[1]) * k], z: cam[i - 1].z + (cam[i].z - cam[i - 1].z) * k, tilt: cam[i - 1].tilt + (cam[i].tilt - cam[i - 1].tilt) * k };
  }
  const s = c.z, W = iw * s, H = ih * s;
  const ox = c.p[0] * s, oy = c.p[1] * s;
  const o = interpolate(f, [0, 8], [0, 1], cl);
  const lw = 5 / Math.max(0.6, s);
  const pathD = path ? "M" + path.pts.map((q) => q.join(" ")).join(" L") : "";
  const pg = path ? io(interpolate(f, [path.at, path.at + path.len], [0, 1], cl)) : 0;
  const end = path ? path.pts[path.pts.length - 1] : [0, 0];
  return (
    <AbsoluteFill style={{ background: "#03060a", overflow: "hidden", opacity: o, perspective: 1300, perspectiveOrigin: "50% 40%" }}>
      <RedLabel text="" at={1e9} />{/* loads the channel fonts for the in-plane tags */}
      <div style={{ position: "absolute", left: width / 2 - ox, top: height * 0.55 - oy, width: W, height: H, transformOrigin: `${ox}px ${oy}px`, transform: `rotateX(${c.tilt}deg)`, transformStyle: "preserve-3d" }}>
        <Img src={staticFile(src)} style={{ width: W, height: H, filter: "contrast(1.08) saturate(.9)" }} />
        <svg width={W} height={H} viewBox={`0 0 ${iw} ${ih}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {bars.map((b, i) => {
            const g = out(interpolate(f, [b.at, b.at + 12], [0, 1], cl)); if (g <= 0) return null;
            const mx = (b.a[0] + b.b[0]) / 2, my = (b.a[1] + b.b[1]) / 2;
            const ax = mx + (b.a[0] - mx) * g, ay = my + (b.a[1] - my) * g, bx = mx + (b.b[0] - mx) * g, by = my + (b.b[1] - my) * g;
            const tk = 9;
            return <g key={i}>
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="rgba(0,0,0,.5)" strokeWidth={lw * 2.2} />
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#fff" strokeWidth={lw} />
              <line x1={ax} y1={ay - tk} x2={ax} y2={ay + tk} stroke="#fff" strokeWidth={lw} />
              <line x1={bx} y1={by - tk} x2={bx} y2={by + tk} stroke="#fff" strokeWidth={lw} />
              <Tag x={Math.max(b.a[0], b.b[0]) + 14} y={my + 8} text={b.label} g={interpolate(f, [b.at + 8, b.at + 16], [0, 1], cl)} s={1.35 / Math.max(0.6, s)} />
            </g>;
          })}
          {path && pg > 0 && <g>
            <path d={pathD} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={lw * 2.4} pathLength={1} strokeDasharray={`${pg} 1`} strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathD} fill="none" stroke="#fff" strokeWidth={lw * 1.2} pathLength={1} strokeDasharray={`${pg} 1`} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={path.pts[0][0]} cy={path.pts[0][1]} r={7} fill="#fff" />
            {pg > 0.98 && <circle cx={end[0]} cy={end[1]} r={9} fill={RED} stroke="#fff" strokeWidth={3} />}
            <Tag x={end[0] + 16} y={end[1] + 8} text={path.label} g={interpolate(f, [path.at + path.len, path.at + path.len + 8], [0, 1], cl)} s={1.35 / Math.max(0.6, s)} />
          </g>}
        </svg>
      </div>
      {/* atmospheric falloff toward the horizon + vignette */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,6,10,.95) 0%, rgba(3,6,10,.35) 22%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 80%, rgba(0,0,0,.45) 100%)" }} />
    </AbsoluteFill>
  );
};
