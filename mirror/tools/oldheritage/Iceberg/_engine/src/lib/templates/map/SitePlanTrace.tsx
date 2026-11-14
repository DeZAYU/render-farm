// map / SitePlanTrace: a site plan traced over a darkened aerial. A scan line sweeps down and leaves the vector trace behind it; elements light up on
// their nouns, dashed routes draw (marching) and can turn red, icons travel a route and stop, a sight-line cone opens, a lock closes a gate.
// REF FA evidence E1 (Instagram @ 2:47.5: one element per noun, white line work) + D1 E10 / E4 map language (Dashcam Vol.1 @ 0:05.0: red leader +
// outlined callout) + Farrell evidence rule 10 (the map stays still while one element changes).
// Ours: the scan-reveal entry, routes with marching dashes that recolour on their word, route-following icons with a hard stop.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, RC, W, EZ, MBlur, Media, Vignette, camFast, type Cam } from "../../core";
import { Glyph } from "../../core/kits/glyphs";
import { PlanText, arcTable, camOf, pointAt, ptsD, toKeys, worldTf, type CamSpec, type P2, PlanCap } from "../../core/kits/diagram";

type F2 = [number, number]; // fractions of the frame (0..1)
export type SitePlanTraceProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  src: string; // aerial still
  scanFrames?: number;
  elements?: { pts: F2[]; at: number; label?: string; labelAt?: number; redAt?: number; fill?: boolean }[];
  routes?: { pts: F2[]; at: number; frames?: number; colour?: "white" | "green" | "red"; redAt?: number; label?: string; labelAt?: number }[];
  icons?: { glyph: string; at: number; route?: number; from?: number; to?: number; moveAt?: number; moveFrames?: number; x?: number; y?: number; size?: number; colour?: string }[];
  cones?: { x: number; y: number; dir: number; spread: number; len: number; at: number; label?: string }[];
  locks?: { x: number; y: number; at: number }[];
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
};
const fx = (q: F2): P2 => ({ x: q[0] * W, y: q[1] * H });
const COL = { white: "#F4F6F6", green: "#5BFF7A", red: RC.lineRed };

const Plan: React.FC<SitePlanTraceProps> = (p) => {
  const f = useCurrentFrame();
  const c = camOf(f, p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1.02 }, p.cam ?? [], p.drift ?? 0.01);
  const scan = EZ.out2(f / (p.scanFrames ?? 26)) * H;
  const tabs = React.useMemo(() => (p.routes ?? []).map((r) => arcTable(r.pts.map(fx), false)), [p.routes]);
  const glow = "drop-shadow(0 0 3px rgba(255,255,255,.7)) drop-shadow(0 0 12px rgba(255,255,255,.25))";
  return (
    <AbsoluteFill style={{ transformOrigin: "0 0" }}>
      <AbsoluteFill style={{ transform: `translate(${W / 2}px, ${H / 2}px) scale(${c.s}) translate(${-c.cx}px, ${-c.cy}px)`, transformOrigin: "0 0" }}>
        <Media src={p.src} style={{ filter: "grayscale(.55) brightness(.42) contrast(1.1)" }} />
      </AbsoluteFill>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: c.s }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id="spScan"><rect x={-W} y={-H} width={3 * W} height={H + (scan - H / 2) / c.s + c.cy} /></clipPath></defs>
        <g transform={worldTf(c)}>
          <g clipPath="url(#spScan)">
            {(p.elements ?? []).map((e, i) => {
              const k = f - e.at;
              if (k < 0) return null;
              const red = e.redAt !== undefined && f >= e.redAt;
              const col = red ? RC.lineRed : "#F4F6F6", pts = e.pts.map(fx);
              const lit = EZ.out3(k / 10);
              return <path key={i} d={ptsD(pts, true)} fill={e.fill === false ? "none" : red ? "rgba(255,26,26,.22)" : "rgba(255,255,255,.10)"} fillOpacity={lit} stroke={col} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${lit} 1`} style={{ filter: red ? `drop-shadow(0 0 7px ${RC.lineRed})` : glow }} />;
            })}
            {(p.routes ?? []).map((r, i) => {
              const k = f - r.at;
              if (k < 0) return null;
              const red = r.redAt !== undefined && f >= r.redAt;
              const col = red ? RC.lineRed : COL[r.colour ?? "white"];
              const u = EZ.out3(k / (r.frames ?? 24)), t = tabs[i];
              const head = pointAt(t, u * t.total, false);
              const pts: P2[] = [];
              for (let j = 0; j < t.cum.length && t.cum[j] <= u * t.total; j++) pts.push(t.P[j]);
              pts.push(head);
              return (
                <g key={i} style={{ filter: `drop-shadow(0 0 6px ${col})` }}>
                  <path d={ptsD(pts)} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="18 14" strokeDashoffset={-k * 1.2} />
                  {u >= 1 ? <path d="M -18 -12 L 2 0 L -18 12" transform={`translate(${head.x} ${head.y}) rotate(${(head.ang * 180) / Math.PI})`} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" /> : null}
                </g>
              );
            })}
            {(p.cones ?? []).map((cn, i) => {
              const k = f - cn.at;
              if (k < 0) return null;
              const o = fx([cn.x, cn.y]), L = cn.len * W * EZ.out3(k / 14), a0 = ((cn.dir - cn.spread / 2) * Math.PI) / 180, a1 = ((cn.dir + cn.spread / 2) * Math.PI) / 180;
              return (
                <g key={i}>
                  <path d={`M${o.x} ${o.y} L${o.x + Math.cos(a0) * L} ${o.y + Math.sin(a0) * L} A${L} ${L} 0 0 1 ${o.x + Math.cos(a1) * L} ${o.y + Math.sin(a1) * L} Z`} fill="rgba(255,240,180,.16)" stroke="#FFE9A8" strokeWidth={3} strokeDasharray="10 8" />
                  {cn.label ? <PlanText f={f} at={cn.at + 8} x={o.x + Math.cos((cn.dir * Math.PI) / 180) * L * 0.6} y={o.y + Math.sin((cn.dir * Math.PI) / 180) * L * 0.6} text={cn.label} size={24} colour="#FFE9A8" /> : null}
                </g>
              );
            })}
          </g>
          {(p.icons ?? []).map((ic, i) => {
            const k = f - ic.at;
            if (k < 0) return null;
            let q: P2 = fx([ic.x ?? 0.5, ic.y ?? 0.5]);
            if (ic.route !== undefined && tabs[ic.route]) {
              const t = tabs[ic.route], u = (ic.from ?? 0) + ((ic.to ?? 1) - (ic.from ?? 0)) * EZ.quick((f - (ic.moveAt ?? ic.at)) / (ic.moveFrames ?? 40));
              q = pointAt(t, u * t.total, false);
            }
            const sz = ic.size ?? 64;
            return <g key={i} transform={`translate(${q.x} ${q.y - sz * 0.6})`} opacity={EZ.out2(k / 5)} style={{ filter: glow }}><circle r={sz * 0.62} cy={0} fill="rgba(5,8,10,.8)" stroke={ic.colour ?? "#F4F6F6"} strokeWidth={3} /><Glyph name={ic.glyph} colour={ic.colour ?? "#F4F6F6"} size={sz * 0.8} mode="line" lineW={10} /></g>;
          })}
          {(p.locks ?? []).map((l, i) => {
            const k = f - l.at;
            if (k < 0) return null;
            const q = fx([l.x, l.y]), drop = 30 * (1 - EZ.out3(k / 8));
            return <g key={i} transform={`translate(${q.x} ${q.y - drop})`} style={{ filter: `drop-shadow(0 0 7px ${RC.lineRed})` }} opacity={EZ.out2(k / 4)}><Glyph name="lock" colour={RC.lineRed} size={70} /></g>;
          })}
          {(p.elements ?? []).map((e, i) => {
            if (!e.label || f < (e.labelAt ?? e.at + 6)) return null;
            const pts = e.pts.map(fx), cx = pts.reduce((a, q) => a + q.x, 0) / pts.length, cy = pts.reduce((a, q) => a + q.y, 0) / pts.length;
            return <PlanText key={`l${i}`} f={f} at={e.labelAt ?? e.at + 6} x={cx} y={cy + 9} text={e.label} size={26} colour={e.redAt !== undefined && f >= e.redAt ? RC.lineRed : "#F4F6F6"} />;
          })}
          {(p.routes ?? []).map((r, i) => {
            if (!r.label || f < (r.labelAt ?? r.at + 10)) return null;
            const t = tabs[i], q = pointAt(t, t.total * 0.5, false);
            return <PlanText key={`r${i}`} f={f} at={r.labelAt ?? r.at + 10} x={q.x} y={q.y - 22} text={r.label} size={24} colour={r.redAt !== undefined && f >= r.redAt ? RC.lineRed : COL[r.colour ?? "white"]} />;
          })}
        </g>
        {/* scan line */}
        {scan < H ? <rect x={0} y={scan - 2} width={W} height={3} fill="#BFE6FF" opacity={0.85} style={{ filter: "drop-shadow(0 0 10px #8FD3FF)" }} /> : null}
      </svg></PlanCap.Provider>
      <Vignette />
    </AbsoluteFill>
  );
};

export const SitePlanTrace: React.FC<SitePlanTraceProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false;
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><MBlur on={fast}><Plan {...p} /></MBlur></AbsoluteFill>;
};

export const SITEPLAN_DEMO: SitePlanTraceProps = {
  src: "demo/mapstill.png",
  scanFrames: 26,
  elements: [
    { pts: [[0.16, 0.42], [0.36, 0.33], [0.5, 0.44], [0.3, 0.55]], at: 20, label: "PLAZA" },
    { pts: [[0.27, 0.36], [0.37, 0.32], [0.39, 0.36], [0.29, 0.41]], at: 34, label: "STAGE", redAt: 120 },
    { pts: [[0.42, 0.29], [0.47, 0.27], [0.49, 0.3], [0.44, 0.32]], at: 44, label: "SERVICE GATE" },
  ],
  routes: [
    { pts: [[0.95, 0.9], [0.75, 0.75], [0.6, 0.5], [0.47, 0.31]], at: 60, frames: 36, colour: "white", label: "ACCESS ROAD" },
    { pts: [[0.3, 0.5], [0.22, 0.68], [0.14, 0.92]], at: 96, frames: 24, colour: "green", redAt: 124, label: "EXIT ROUTE" },
  ],
  icons: [{ glyph: "car", at: 64, route: 0, from: 0, to: 0.92, moveAt: 64, moveFrames: 40, size: 70 }],
  locks: [{ x: 0.5, y: 0.27, at: 104 }],
  cones: [],
  cam0: { cx: 960, cy: 540, s: 1.04 },
};
