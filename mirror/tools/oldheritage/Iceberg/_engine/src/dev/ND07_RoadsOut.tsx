// ND07 RoadsOut — Paradise's ridge on a real USGS NAIP aerial laid back in perspective (AE-style camera): the town's few roads out are
// drawn from the town outward one after the other (US Census TIGER geometry, so the lines sit on the real roads). Mode "jam": the camera
// settles on the Skyway, the other roads dim, the Skyway turns red and a queue of white car marks fills it from town outward and stops.
// Built for "a town of about 26,000 people on a ridge … with only a handful of roads in and out" and "The Skyway, the main way out, jammed".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type Road = { pts: [number, number][]; at: number; len: number; main?: boolean };
const plen = (p: [number, number][]) => p.reduce((a, q, i) => (i ? a + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);
const along = (p: [number, number][], d: number): [number, number, number] => {
  let acc = 0;
  for (let i = 1; i < p.length; i++) {
    const s = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    if (acc + s >= d) { const k = (d - acc) / s; return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k, Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0])]; }
    acc += s;
  }
  const n = p.length - 1; return [p[n][0], p[n][1], 0];
};

export const RoadsOut: React.FC<{ src: string; iw: number; ih: number; roads: Road[]; f0: [number, number]; f1: [number, number]; z0: number; z1: number; tilt?: number;
  mode?: "draw" | "jam"; label?: string; labelAt?: number; jamAt?: number }> = ({ src, iw, ih, roads, f0, f1, z0, z1, tilt = 24, mode = "draw", label, labelAt = 20, jamAt = 18 }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const t = io(interpolate(f, [0, D], [0, 1], cl));
  const z = z0 + (z1 - z0) * t, fx = f0[0] + (f1[0] - f0[0]) * t, fy = f0[1] + (f1[1] - f0[1]) * t;
  const base = Math.max(W / iw, H / ih) * z;
  const ox = W / 2 - fx * base, oy = H / 2 - fy * base;
  const sw = 7 / base; // stroke in image px so it stays ~7 screen px
  const fade = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#07080a", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1700, opacity: fade }}>
        <AbsoluteFill style={{ transform: `rotateX(${tilt * (1 - 0.25 * t)}deg) scale(1.18)`, transformOrigin: "50% 60%" }}>
          <div style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }}>
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: `saturate(.85) brightness(${mode === "jam" ? 0.78 : 0.92})` }} />
            <svg viewBox={`0 0 ${iw} ${ih}`} width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              {roads.map((r, i) => {
                const d = "M" + r.pts.map((p) => p.join(" ")).join(" L");
                const g = mode === "jam" ? 1 : io(interpolate(f, [r.at, r.at + r.len], [0, 1], cl));
                const dim = mode === "jam" && !r.main;
                const red = mode === "jam" && r.main ? out(interpolate(f, [jamAt - 6, jamAt + 6], [0, 1], cl)) : 0;
                const L = plen(r.pts);
                const head = g > 0 && g < 1 ? along(r.pts, L * g) : null;
                return (
                  <g key={i} opacity={dim ? 0.35 : 1}>
                    <path d={d} fill="none" stroke="rgba(0,0,0,.55)" strokeWidth={sw * 2.2} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
                    <path d={d} fill="none" stroke={red > 0 ? RED : "#fff"} strokeOpacity={1} strokeWidth={sw * (dim ? 0.7 : 1)} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
                    {head && <circle cx={head[0]} cy={head[1]} r={sw * 1.4} fill="#fff" />}
                    {mode === "jam" && r.main && Array.from({ length: 34 }, (_, k) => {
                      // car marks queue up from town outward, each arrives and stops (the jam)
                      const st = jamAt + k * 2.2; const a = out(interpolate(f, [st, st + 10], [0, 1], cl)); if (a <= 0) return null;
                      const [x, y, ang] = along(r.pts, 40 + k * (L * 0.62 / 34));
                      return <rect key={k} x={-sw * 1.1} y={-sw * 0.55} width={sw * 2.2} height={sw * 1.1} fill="#fff" opacity={a} transform={`translate(${x} ${y}) rotate(${(ang * 180) / Math.PI})`} />;
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* sky falloff: the far edge of the tilted plate fades into haze */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,8,10,.85) 0%, rgba(7,8,10,0) 26%, rgba(7,8,10,0) 80%, rgba(7,8,10,.5) 100%)" }} />
      {label && <RedLabel text={label} at={labelAt} />}
    </AbsoluteFill>
  );
};
