// TP07 (Joker's Jinx): why a launched coaster can strand riders at an angle. A side elevation in white line over a dark, blurred
// still of the real ride. mode "chain": an old-style lift hill, the chain creeping up it and a train dragged slowly to the top.
// mode "launch": a flat launch run (the linear-motor fins in red), the train fired along it, slowing on the climb and stopping partway
// up; the track it never reached dims, the stopped train turns red. Geometry is a schematic of the principle, not a survey of the ride.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];

const sample = (fn: (t: number) => P, n = 240) => {
  const pts: P[] = Array.from({ length: n + 1 }, (_, i) => fn(i / n));
  const acc = [0]; for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, acc, total: acc[acc.length - 1] };
};
const at = (c: ReturnType<typeof sample>, s: number) => {
  s = Math.max(0, Math.min(c.total, s));
  let i = 1; while (i < c.acc.length - 1 && c.acc[i] < s) i++;
  const t = (s - c.acc[i - 1]) / Math.max(1e-6, c.acc[i] - c.acc[i - 1]);
  const a = c.pts[i - 1], b = c.pts[i];
  return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, r: Math.atan2(b[1] - a[1], b[0] - a[0]) };
};
const pathD = (c: ReturnType<typeof sample>, s0 = 0, s1 = Infinity) => {
  const p = c.pts.filter((_, i) => c.acc[i] >= s0 && c.acc[i] <= s1);
  return p.length ? "M" + p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L") : "";
};
const bez = (p0: P, p1: P, p2: P, p3: P) => (t: number): P => {
  const u = 1 - t;
  return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
};
// a piecewise track: straight (a->b) then a bezier climb
const track = (a: P, b: P, c1: P, c2: P, e: P) => {
  const flat = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const curve = bez(b, c1, c2, e);
  return sample((t) => {
    const k = 0.42; // first 42 % of t is the flat run
    if (t <= k) { const u = t / k; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; }
    return curve((t - k) / (1 - k));
  }, 360 + Math.round(flat / 8));
};

const Train: React.FC<{ c: ReturnType<typeof sample>; s: number; color: string; cars?: number }> = ({ c, s, color, cars = 4 }) => (
  <g>
    {Array.from({ length: cars }, (_, i) => {
      const p = at(c, s - i * 58);
      return (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${(p.r * 180) / Math.PI})`}>
          <rect x={-26} y={-30} width={52} height={24} rx={6} fill="none" stroke={color} strokeWidth={5} />
          <line x1={-20} y1={-6} x2={20} y2={-6} stroke={color} strokeWidth={4} />
        </g>
      );
    })}
  </g>
);

export const LaunchProfile: React.FC<{ mode: "chain" | "launch"; bg: string; bgPos?: string }> = ({ mode, bg, bgPos = "50% 50%" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: n } = useVideoConfig();
  const fade = out(interpolate(f, [0, 10], [0, 1], cl));
  const cam = 1.0 + 0.05 * io(f / n);
  const W = "rgba(255,255,255,.95)";
  let body: React.ReactNode;
  if (mode === "chain") {
    // lift hill: flat station run, a long straight incline, a crest; trestle bents under the incline
    const c = track([180, 820], [560, 820], [700, 820], [760, 780], [1240, 330]);
    const crest = sample(bez([1240, 330], [1330, 250], [1420, 250], [1520, 360]));
    const draw = io(interpolate(f, [0, 22], [0, 1], cl));
    const s = interpolate(f, [8, n], [c.total * 0.38, c.total * 0.78], cl); // dragged: slow and steady
    const chain = (f * 1.4) % 28;
    const inc = sample(bez([760, 780], [900, 650], [1100, 450], [1240, 330]));
    body = (
      <g>
        {Array.from({ length: 9 }, (_, i) => { const p = at(inc, (inc.total * (i + 0.5)) / 9); return <line key={i} x1={p.x} y1={p.y + 8} x2={p.x} y2={860} stroke="rgba(255,255,255,.35)" strokeWidth={3} opacity={draw} />; })}
        <line x1={120} y1={860} x2={1800} y2={860} stroke="rgba(255,255,255,.35)" strokeWidth={2} />
        <path d={pathD(c, 0, c.total * draw)} fill="none" stroke={W} strokeWidth={6} strokeLinecap="round" />
        <path d={pathD(crest, 0, crest.total * draw)} fill="none" stroke={W} strokeWidth={6} strokeLinecap="round" />
        <path d={pathD(inc)} fill="none" stroke={RED} strokeWidth={4} strokeDasharray="10 18" strokeDashoffset={-chain} opacity={draw} transform="translate(0 10)" />
        <Train c={c} s={s} color={W} />
      </g>
    );
  } else {
    // launch: a long flat run with the motor fins, then the climb out of it; the train stops on the climb
    const c = track([140, 800], [900, 800], [1180, 800], [1300, 700], [1560, 230]);
    const draw = io(interpolate(f, [0, 16], [0, 1], cl));
    const t0 = 12, t1 = Math.round(n * 0.62);
    const sStop = c.total * 0.80;
    // fired: fast across the fins, then decelerating up the climb to a dead stop (ease-out cubic of the whole run)
    const u = interpolate(f, [t0, t1], [0, 1], cl);
    const s = 120 + (sStop - 120) * (1 - Math.pow(1 - u, 3));
    const stopped = f >= t1;
    const g = out(interpolate(f, [t1, t1 + 14], [0, 1], cl));
    const fins = Array.from({ length: 16 }, (_, i) => 260 + i * 40);
    body = (
      <g>
        <line x1={100} y1={840} x2={1820} y2={840} stroke="rgba(255,255,255,.35)" strokeWidth={2} />
        {fins.map((x, i) => <rect key={i} x={x - 4} y={806} width={8} height={18} fill={RED} opacity={draw * (u > 0 && u < 0.5 ? 0.6 + 0.4 * Math.abs(Math.sin(f * 0.8 + i)) : 0.85)} />)}
        <path d={pathD(c, 0, c.total * draw)} fill="none" stroke={W} strokeWidth={6} strokeLinecap="round" opacity={1} />
        {stopped && <path d={pathD(c, sStop + 20)} fill="none" stroke="#000" strokeWidth={8} opacity={0.55 * g} />}
        <Train c={c} s={s} color={stopped ? RED : W} />
        {stopped && (() => { const p = at(c, sStop - 87); return <circle cx={p.x} cy={p.y - 18} r={70 + 20 * (1 - g)} fill="none" stroke="#fff" strokeWidth={3} opacity={g * 0.9} />; })()}
      </g>
    );
  }
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fade }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", objectPosition: bgPos, filter: "blur(14px) brightness(.32) saturate(.5)" }} />
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: mode === "chain" ? "60% 55%" : "70% 50%" }}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }}>{body}</svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
