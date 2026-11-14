// WP03 device: the drone's view across the terminal, frozen, with a slow push. The foam-white apron round the burning tanks and the
// mangroves beside it: streams of white specks run out of the foam along the ground, across the mangroves, and into the lagoon; then
// the lagoon's shoreline is traced in white and the water turns a milky foam-white. One label on the mangroves.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { FrameAt, cl, io, useWpFonts } from "./WP01_kit";

type Pt = [number, number];
type P = { src: string; t: number; n: number; paths: Pt[][]; lagoon: Pt[]; focus: Pt; zoom?: number; flowAt: number; shoreAt: number; label: string; labelAt: Pt };

const toD = (p: Pt[]) => p.map((q, i) => (i ? "L" : "M") + q[0] + "," + q[1]).join(" ");
const segs = (p: Pt[]) => { const L = [0]; for (let i = 1; i < p.length; i++) L.push(L[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return L; };
const along = (p: Pt[], L: number[], d: number): Pt => {
  const tot = L[L.length - 1], x = Math.max(0, Math.min(tot, d));
  let i = 1; while (i < L.length - 1 && L[i] < x) i++;
  const u = (x - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
  return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * u, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * u];
};

export const WP03_RunOff: React.FC<P> = ({ src, t, n, paths, lagoon, focus, zoom = 1.14, flowAt, shoreAt, label, labelAt }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const s = 1 + (zoom - 1) * io(f / n);
  const dim = interpolate(f, [0, 16], [0, 0.32], cl);
  const shore = io(interpolate(f, [shoreAt, shoreAt + 30], [0, 1], cl));
  const lagD = toD(lagoon) + " Z";
  const per = lagoon.reduce((a, q, i) => a + Math.hypot(q[0] - lagoon[(i + 1) % lagoon.length][0], q[1] - lagoon[(i + 1) % lagoon.length][1]), 0);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${focus[0]}px ${focus[1]}px`, willChange: "transform" }}>
        <FrameAt src={src} t={t} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs><filter id="ro_soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="10" /></filter></defs>
          <path d={lagD} fill="#EEF2EE" opacity={0.42 * shore} filter="url(#ro_soft)" />
          <path d={lagD} fill="none" stroke="#fff" strokeWidth={4} strokeLinejoin="round" strokeDasharray={per} strokeDashoffset={per * (1 - shore)} opacity={0.95} />
          {paths.map((p, k) => {
            const L = segs(p), tot = L[L.length - 1];
            const reach = io(interpolate(f, [flowAt + k * 8, flowAt + k * 8 + 50], [0, 1], cl)) * tot;
            return (
              <g key={k}>
                <path d={toD(p)} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray={`${tot}`} strokeDashoffset={tot - reach} opacity={0.35} />
                {Array.from({ length: 22 }, (_, i) => {
                  const speed = 7 + 3 * random(`v${k}_${i}`);
                  const d = ((f - flowAt - k * 8) * speed + (i / 22) * tot) % tot;
                  if (f < flowAt + k * 8 || d > reach) return null;
                  const [x, y] = along(p, L, d);
                  const j = (random(`j${k}_${i}`) - 0.5) * 18;
                  return <circle key={i} cx={x + j} cy={y + j * 0.5} r={4.5} fill="#fff" opacity={0.9} />;
                })}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      <RedLabel text={label} at={shoreAt - 10} hold={n - shoreAt} x={labelAt[0]} y={labelAt[1]} size={40} />
    </AbsoluteFill>
  );
};
