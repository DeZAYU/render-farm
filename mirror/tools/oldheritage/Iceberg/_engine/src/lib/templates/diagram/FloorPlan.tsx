// diagram / FloorPlan (also the "PlanView" intent): a top-down clean plan built on its nouns. Zones (hall, pools, rooms) draw their outline
// and fill, flow arrows run along paths, dot crowds fill zones (small dots = children), a marker pins one spot, one zone hatches red, and
// columns can be counted one by one with a "?" on one of them. REF Farrell story #3 (explainer built on the words, elements pop / fade
// 0.2-0.3 s each, the diagram returns twice) + FA evidence E1 (Instagram @ 2:47.5: white line work, one element per noun) + VV §11 camera
// (quick-start / long-settle re-framing between parts).
// Ours: hatch + label for the failure zone, a marker ring that draws in 5 f (D1 E5 language), seeded dot crowds, numbered columns with ticks.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, RC, W, EZ, MBlur, camFast, clamp01, rng, type Cam } from "../../core";
import { HatchDef, PlanText, arcTable, camOf, centroid, pointAt, ptsD, toKeys, worldTf, type CamSpec, type P2, PlanCap } from "../../core/kits/diagram";

export type PlanZone = { id: string; pts?: P2[]; rect?: { x: number; y: number; w: number; h: number; r?: number }; kind?: "room" | "water" | "floor"; label?: string; labelAt?: number; labelPos?: P2; at: number; drawFrames?: number };
export type FloorPlanProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  zones: PlanZone[];
  flows?: { pts: P2[]; at: number; spacing?: number; speed?: number; colour?: string }[]; // chevrons moving along a path
  crowds?: { zone: string; n: number; at: number; frames?: number; small?: number; seed?: number; colour?: string }[];
  markers?: { x: number; y: number; at: number; label?: string; red?: boolean; side?: "right" | "left" | "above" }[];
  hatches?: { zone: string; at: number; label?: string }[];
  columns?: { pts: P2[]; at: number; countAt?: number; countStep?: number; question?: { index: number; at: number }; size?: number };
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
  bg?: string;
};

const rectPts = (r: { x: number; y: number; w: number; h: number; r?: number }): P2[] => {
  const k = Math.min(r.r ?? 0, r.w / 2, r.h / 2);
  if (k <= 0) return [{ x: r.x, y: r.y }, { x: r.x + r.w, y: r.y }, { x: r.x + r.w, y: r.y + r.h }, { x: r.x, y: r.y + r.h }];
  const out: P2[] = [];
  const corner = (cx: number, cy: number, a0: number) => { for (let i = 0; i <= 6; i++) { const a = a0 + (i / 6) * (Math.PI / 2); out.push({ x: cx + Math.cos(a) * k, y: cy + Math.sin(a) * k }); } };
  corner(r.x + r.w - k, r.y + k, -Math.PI / 2); corner(r.x + r.w - k, r.y + r.h - k, 0); corner(r.x + k, r.y + r.h - k, Math.PI / 2); corner(r.x + k, r.y + k, Math.PI);
  return out;
};
const zonePts = (z: PlanZone) => z.pts ?? (z.rect ? rectPts(z.rect) : []);
const inside = (p: P2, poly: P2[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) c = !c; } return c; };

const Plan: React.FC<FloorPlanProps> = (p) => {
  const f = useCurrentFrame();
  const c = camOf(f, p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 }, p.cam ?? [], p.drift ?? 0.006);
  const byId: Record<string, P2[]> = {};
  p.zones.forEach((z) => { byId[z.id] = zonePts(z); });
  const dots = React.useMemo(() => (p.crowds ?? []).map((cr, j) => {
    const poly = byId[cr.zone] ?? [];
    if (!poly.length) return [];
    const xs = poly.map((q) => q.x), ys = poly.map((q) => q.y);
    const x0 = Math.min(...xs) + 14, x1 = Math.max(...xs) - 14, y0 = Math.min(...ys) + 14, y1 = Math.max(...ys) - 14;
    const r = rng(cr.seed ?? 900 + j), out: { x: number; y: number; t: number; small: boolean }[] = [];
    let guard = 0;
    while (out.length < cr.n && guard++ < cr.n * 60) {
      const q = { x: x0 + r() * (x1 - x0), y: y0 + r() * (y1 - y0) };
      if (!inside(q, poly) || out.some((o) => Math.hypot(o.x - q.x, o.y - q.y) < 22)) continue;
      out.push({ ...q, t: r(), small: r() < (cr.small ?? 0) });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [p.crowds, p.zones]);
  return (
    <AbsoluteFill>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: c.s }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs><HatchDef id="fpHatch" /></defs>
        <g transform={worldTf(c)}>
          {p.zones.map((z) => {
            const k = f - z.at;
            if (k < 0) return null;
            const pts = byId[z.id], dr = EZ.out3(k / (z.drawFrames ?? 14)), fk = clamp01((k - 6) / 10);
            const kind = z.kind ?? "room";
            const fill = kind === "water" ? "rgba(63,190,255,.22)" : kind === "floor" ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.025)";
            return (
              <g key={z.id}>
                <path d={ptsD(pts, true)} fill={fill} fillOpacity={fk} stroke="none" />
                {kind === "water" && fk > 0 ? <path d={ptsD(pts, true)} fill="none" stroke="rgba(150,225,255,.25)" strokeWidth={14} opacity={fk} style={{ filter: "blur(6px)" }} /> : null}
                <path d={ptsD(pts, true)} fill="none" stroke={kind === "water" ? "#BFEAFF" : "#F4F6F6"} strokeWidth={kind === "room" ? 6 : 4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${dr} 1`}
                  style={{ filter: "drop-shadow(0 0 3px rgba(255,255,255,.6)) drop-shadow(0 0 14px rgba(255,255,255,.18))" }} />
              </g>
            );
          })}
          {(p.hatches ?? []).map((h, i) => {
            const k = f - h.at, pts = byId[h.zone];
            if (k < 0 || !pts) return null;
            return (
              <g key={`h${i}`} opacity={EZ.out2(k / 8)}>
                <path d={ptsD(pts, true)} fill="url(#fpHatch)" stroke={RC.lineRed} strokeWidth={6} style={{ filter: "drop-shadow(0 0 6px rgba(255,26,26,.8))" }} />
              </g>
            );
          })}
          {(p.flows ?? []).map((fl, i) => {
            const k = f - fl.at;
            if (k < 0) return null;
            const t = arcTable(fl.pts, false), sp = fl.spacing ?? 70, n = Math.floor(t.total / sp);
            return (
              <g key={`f${i}`} fill="none" stroke={fl.colour ?? "#E8F7FF"} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={EZ.out2(k / 8)}>
                {Array.from({ length: n }, (_, j) => {
                  const s = (j * sp + k * (fl.speed ?? 3)) % t.total, q = pointAt(t, s, false);
                  const edge = Math.min(s, t.total - s) / 60;
                  return <path key={j} d="M -12 -11 L 4 0 L -12 11" transform={`translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${((q.ang * 180) / Math.PI).toFixed(1)})`} opacity={clamp01(edge)} />;
                })}
              </g>
            );
          })}
          {(p.columns ? [p.columns] : []).map((cl, i) => {
            const k = f - cl.at;
            if (k < 0) return null;
            const sz = cl.size ?? 22;
            return (
              <g key={`c${i}`}>
                {cl.pts.map((q, j) => {
                  const tk = cl.countAt === undefined ? -1 : f - (cl.countAt + j * (cl.countStep ?? 4));
                  const isQ = cl.question && cl.question.index === j && f >= cl.question.at;
                  return (
                    <g key={j} opacity={EZ.out2(k / 8)}>
                      <rect x={q.x - sz / 2} y={q.y - sz / 2} width={sz} height={sz} fill={isQ ? "rgba(255,26,26,.35)" : "#0d1214"} stroke={isQ ? RC.lineRed : "#F4F6F6"} strokeWidth={3} />
                      {tk >= 0 ? <path d={`M ${q.x - 9} ${q.y - sz - 6} l 5 6 l 10 -14`} fill="none" stroke="#F4F6F6" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={`${EZ.out3(tk / 3)} 1`} /> : null}
                      {tk >= 0 ? <PlanText f={f} at={cl.countAt! + j * (cl.countStep ?? 4)} x={q.x} y={q.y + sz + 22} text={String(j + 1)} size={18} track={0} colour="#AEB8BC" /> : null}
                      {isQ ? <PlanText f={f} at={cl.question!.at} x={q.x + 26} y={q.y - 18} text="?" size={46} anchor="start" track={0} colour={RC.lineRed} /> : null}
                    </g>
                  );
                })}
              </g>
            );
          })}
          {(p.crowds ?? []).map((cr, j) => (
            <g key={`d${j}`}>
              {dots[j].map((d, i) => {
                const a = clamp01((f - cr.at - d.t * (cr.frames ?? 30)) / 4);
                return a > 0 ? <circle key={i} cx={d.x} cy={d.y} r={(d.small ? 5 : 8) * (0.6 + 0.4 * a)} fill={cr.colour ?? "#FFFFFF"} opacity={a} style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,.7))" }} /> : null;
              })}
            </g>
          ))}
          {p.zones.map((z) => {
            if (!z.label) return null;
            const q = z.labelPos ?? centroid(zonePts(z));
            const hz = (p.hatches ?? []).find((h) => h.zone === z.id && h.label && f >= h.at + 4);
            if (hz) return null;
            return <PlanText key={`l${z.id}`} f={f} at={z.labelAt ?? z.at + 6} x={q.x} y={q.y + 9} text={z.label} size={26} colour={z.kind === "water" ? "#D8F3FF" : "#F4F6F6"} />;
          })}
          {(p.hatches ?? []).map((h, i) => {
            const pts = byId[h.zone];
            if (!h.label || !pts) return null;
            const q = centroid(pts);
            return <PlanText key={`hl${i}`} f={f} at={h.at + 4} x={q.x} y={q.y + 10} text={h.label} size={30} colour="#FFFFFF" />;
          })}
          {(p.markers ?? []).map((m, i) => {
            const k = f - m.at;
            if (k < 0) return null;
            const col = m.red === false ? "#FFFFFF" : RC.lineRed, C = 2 * Math.PI * 26;
            return (
              <g key={`m${i}`} style={{ filter: `drop-shadow(0 0 6px ${col})` }}>
                <circle cx={m.x} cy={m.y} r={9} fill={col} opacity={EZ.out2(k / 3)} />
                <circle cx={m.x} cy={m.y} r={26} fill="none" stroke={col} strokeWidth={5} strokeDasharray={`${(C * EZ.out2((k + 1) / 5)).toFixed(1)} ${C}`} transform={`rotate(-90 ${m.x} ${m.y})`} />
                {m.label ? <PlanText f={f} at={m.at + 3} x={m.side === "above" ? m.x : m.side === "left" ? m.x - 42 : m.x + 42} y={m.side === "above" ? m.y - 44 : m.y + 9} text={m.label} size={26} anchor={m.side === "above" ? "middle" : m.side === "left" ? "end" : "start"} colour={col} /> : null}
              </g>
            );
          })}
        </g>
      </svg></PlanCap.Provider>
    </AbsoluteFill>
  );
};

export const FloorPlan: React.FC<FloorPlanProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false;
  return (
    <AbsoluteFill style={{ background: p.bg ?? "radial-gradient(ellipse 75% 70% at 50% 45%, #121719 0%, #050708 80%)", overflow: "hidden" }}>
      <MBlur on={fast}><Plan {...p} /></MBlur>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const FLOORPLAN_DEMO: FloorPlanProps = {
  zones: [
    { id: "hall", rect: { x: 300, y: 190, w: 1320, h: 700 }, kind: "room", at: 0, drawFrames: 18, label: "HALL", labelPos: { x: 960, y: 170 } },
    { id: "big", rect: { x: 380, y: 270, w: 700, h: 540, r: 24 }, kind: "water", at: 24, label: "MAIN POOL" },
    { id: "kids", pts: [{ x: 1170, y: 470 }, { x: 1540, y: 470 }, { x: 1540, y: 810 }, { x: 1260, y: 810 }, { x: 1170, y: 720 }], kind: "water", at: 46, label: "CHILDREN'S AREA", labelPos: { x: 1370, y: 520 } },
  ],
  flows: [{ pts: [{ x: 1220, y: 760 }, { x: 1320, y: 690 }, { x: 1420, y: 740 }, { x: 1500, y: 640 }], at: 60, spacing: 46, speed: 3 }],
  columns: { pts: [460, 700, 940, 1180, 1420].map((x) => ({ x, y: 248 })), at: 8, countAt: 14, countStep: 3, size: 20 },
  crowds: [{ zone: "big", n: 34, at: 76, frames: 26, small: 0.4 }, { zone: "kids", n: 16, at: 82, frames: 22, small: 0.7 }],
  markers: [{ x: 1000, y: 700, at: 104, label: "THEY SAT HERE", side: "left" }],
  hatches: [{ zone: "kids", at: 132, label: "ROOF CAME DOWN HERE" }],
  cam0: { cx: 960, cy: 520, s: 1.04 },
  cam: [{ at: 126, d: 36, cx: 1300, cy: 620, s: 1.45, ease: "quick" }],
};
