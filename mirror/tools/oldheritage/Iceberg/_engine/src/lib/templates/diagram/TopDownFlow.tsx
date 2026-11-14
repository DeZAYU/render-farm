// diagram / TopDownFlow: a top-down channel; current chevrons and boat glyphs flow along it past an obstacle, driven by pump glyphs. A pump
// switches OFF on its word, the current decays and the boats stall. REF VV §11 world-space camera (Visual Venture TV @ 3:28.0, quick-start /
// long-settle) + Farrell story explainer (built on the words) + the c02-08 legend "flow arrows" intent.
// Ours: one integrated flow clock drives arrows, boats and the pump impellers together, so "off" decays everything physically (exp tau);
// the channel is a single smoothed centreline drawn as banks + water; the obstacle is a seeded rock outline.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, RC, W, EZ, MBlur, camFast, clamp01, rng, type Cam } from "../../core";
import { PlanText, arcTable, camOf, pointAt, ptsD, smoothPts, toKeys, worldTf, type CamSpec, type P2, PlanCap } from "../../core/kits/diagram";

export type TopDownFlowProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  path: P2[]; // channel centreline control points (world px)
  closed?: boolean;
  width?: number; // channel width
  drawAt?: number;
  flow: { at: number; speed?: number; offAt?: number; tau?: number; spacing?: number };
  boats?: { n: number; at: number; colour?: string; size?: number };
  obstacles?: { x: number; y: number; r: number; at: number; label?: string }[];
  pumps?: { s: number; at: number; label?: string; offLabel?: string; side?: 1 | -1 }[]; // s = 0..1 position along the channel
  labels?: { text: string; at: number; x: number; y: number; red?: boolean }[];
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
};

const Plan: React.FC<TopDownFlowProps> = (p) => {
  const f = useCurrentFrame();
  const closed = p.closed !== false;
  const c = camOf(f, p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 }, p.cam ?? [], p.drift ?? 0.006);
  const pts = React.useMemo(() => smoothPts(p.path, closed, 14), [p.path, closed]);
  const tab = React.useMemo(() => arcTable(pts, closed), [pts, closed]);
  const v = p.flow.speed ?? 4, tau = p.flow.tau ?? 14, off = p.flow.offAt;
  const t = Math.max(0, f - p.flow.at);
  const tOff = off === undefined ? Infinity : Math.max(0, off - p.flow.at);
  const sClock = t <= tOff ? v * t : v * tOff + v * tau * (1 - Math.exp(-(t - tOff) / tau));
  const vNow = t <= tOff ? 1 : Math.exp(-(t - tOff) / tau);
  const wd = p.width ?? 120;
  const dr = EZ.out3((f - (p.drawAt ?? 0)) / 20);
  const d = ptsD(pts, closed);
  const sp = p.flow.spacing ?? 90, nA = Math.floor(tab.total / sp);
  const rock = (o: { x: number; y: number; r: number }, i: number) => { const r = rng(55 + i); return smoothPts(Array.from({ length: 9 }, (_, j) => { const a = (j / 9) * Math.PI * 2, rr = o.r * (0.75 + r() * 0.4); return { x: o.x + Math.cos(a) * rr, y: o.y + Math.sin(a) * rr }; }), true, 6); };
  return (
    <AbsoluteFill>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: c.s }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          {/* banks (wide white stroke) + water (narrower stroke) = an outlined channel */}
          <g opacity={dr}>
            <path d={d} fill="none" stroke="#F4F6F6" strokeWidth={wd + 10} strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,.6)) drop-shadow(0 0 14px rgba(255,255,255,.18))" }} />
            <path d={d} fill="none" stroke="#0D2A38" strokeWidth={wd} strokeLinejoin="round" />
            <path d={d} fill="none" stroke="rgba(63,190,255,.30)" strokeWidth={wd} strokeLinejoin="round" />
          </g>
          {/* current chevrons */}
          {f >= p.flow.at ? (
            <g fill="none" stroke="#DDF4FF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={(0.15 + 0.85 * vNow) * clamp01((f - p.flow.at) / 8)}>
              {Array.from({ length: nA }, (_, j) => {
                const q = pointAt(tab, j * sp + sClock * 0.9, true);
                return <path key={j} d="M -14 -13 L 4 0 L -14 13" transform={`translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${((q.ang * 180) / Math.PI).toFixed(1)})`} />;
              })}
            </g>
          ) : null}
          {(p.obstacles ?? []).map((o, i) => (f >= o.at ? (
            <g key={`o${i}`} opacity={EZ.out2((f - o.at) / 6)}>
              <path d={ptsD(rock(o, i), true)} fill="#1a1f22" stroke="#F4F6F6" strokeWidth={4} style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,.6))" }} />
              {o.label ? <PlanText f={f} at={o.at + 2} x={o.x} y={o.y + o.r + 40} text={o.label} size={24} /> : null}
            </g>
          ) : null))}
          {/* boats: ring rafts riding the clock (spread evenly) */}
          {p.boats && f >= p.boats.at ? Array.from({ length: p.boats.n }, (_, i) => {
            const q = pointAt(tab, (i * tab.total) / p.boats!.n + sClock, true);
            const sz = p.boats!.size ?? 26, col = p.boats!.colour ?? "#FFFFFF";
            const wob = Math.sin(f * 0.2 + i * 1.7) * 5 * vNow;
            return (
              <g key={`b${i}`} transform={`translate(${q.x.toFixed(1)} ${(q.y + wob).toFixed(1)}) rotate(${((q.ang * 180) / Math.PI).toFixed(1)})`} opacity={EZ.out2((f - p.boats!.at) / 6)} style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,.7))" }}>
                <circle r={sz} fill="#0B1A22" stroke={col} strokeWidth={6} />
                {[0, 1, 2, 3].map((k) => <circle key={k} cx={Math.cos((k * Math.PI) / 2 + 0.78) * sz * 0.48} cy={Math.sin((k * Math.PI) / 2 + 0.78) * sz * 0.48} r={4} fill={col} />)}
              </g>
            );
          }) : null}
          {/* pumps */}
          {(p.pumps ?? []).map((pm, i) => {
            if (f < pm.at) return null;
            const q = pointAt(tab, pm.s * tab.total, true), side = pm.side ?? 1;
            const nx = -Math.sin(q.ang) * side, ny = Math.cos(q.ang) * side, dist = wd / 2 + 70;
            const x = q.x + nx * dist, y = q.y + ny * dist;
            const isOff = off !== undefined && f >= off;
            const lamp = isOff ? RC.lineRed : "#5BFF7A";
            return (
              <g key={`p${i}`} opacity={EZ.out2((f - pm.at) / 6)}>
                <path d={`M ${x - nx * 46} ${y - ny * 46} L ${q.x + nx * (wd / 2 + 4)} ${q.y + ny * (wd / 2 + 4)}`} stroke="#F4F6F6" strokeWidth={8} />
                <rect x={x - 46} y={y - 46} width={92} height={92} rx={10} fill="#0d1214" stroke="#F4F6F6" strokeWidth={4} style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,.6))" }} />
                <g transform={`translate(${x} ${y}) rotate(${(sClock * 3) % 360})`} stroke="#F4F6F6" strokeWidth={5} fill="none" strokeLinecap="round">
                  <circle r={26} strokeWidth={3} />
                  {[0, 120, 240].map((a) => <path key={a} d="M 0 0 Q 10 -12 0 -24" transform={`rotate(${a})`} />)}
                </g>
                <circle cx={x + 34} cy={y - 34} r={8} fill={lamp} style={{ filter: `drop-shadow(0 0 8px ${lamp})` }} />
                <PlanText f={f} at={pm.at + 2} x={x} y={y + 78} text={isOff ? pm.offLabel ?? "OFF" : pm.label ?? "PUMP"} size={24} colour={isOff ? RC.lineRed : "#F4F6F6"} />
              </g>
            );
          })}
          {(p.labels ?? []).map((l, i) => <PlanText key={`l${i}`} f={f} at={l.at} x={l.x} y={l.y} text={l.text} size={30} colour={l.red ? RC.lineRed : "#F4F6F6"} />)}
        </g>
      </svg></PlanCap.Provider>
    </AbsoluteFill>
  );
};

export const TopDownFlow: React.FC<TopDownFlowProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, #121719 0%, #050708 80%)", overflow: "hidden" }}>
      <MBlur on={fast}><Plan {...p} /></MBlur>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const FLOW_DEMO: TopDownFlowProps = {
  path: [{ x: 420, y: 330 }, { x: 960, y: 260 }, { x: 1500, y: 330 }, { x: 1580, y: 620 }, { x: 1300, y: 800 }, { x: 960, y: 700 }, { x: 600, y: 820 }, { x: 360, y: 620 }],
  closed: true, width: 120, drawAt: 0,
  flow: { at: 6, speed: 5, offAt: 92, tau: 16, spacing: 95 },
  boats: { n: 5, at: 14 },
  obstacles: [{ x: 960, y: 640, r: 34, at: 20, label: "ROCK" }],
  pumps: [{ s: 0.06, at: 30, side: -1 }, { s: 0.5, at: 34, side: 1 }],
  labels: [{ text: "PUMPS STOPPED", at: 96, x: 960, y: 520, red: true }],
  cam0: { cx: 960, cy: 545, s: 0.98 },
  cam: [{ at: 88, d: 34, cx: 960, cy: 545, s: 1.05, ease: "quick" }],
};
