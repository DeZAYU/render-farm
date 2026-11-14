// diagram / MechanismLoop: a side-elevation schematic of a ride mechanism: a flume / channel on supports with section joints, a conveyor whose belt
// keeps running, loads (riders as dots, rafts as empty outlines) travelling along it; on cue they stop and bunch at a point, weight arrows stack
// above it, the line goes brittle, a joint cracks and the section between two joints drops out of the drawing (loads removed with it, never
// figures falling), with a 4 f white flash. REF Farrell story explainer (built on the words, returns #15 / #33) + VV §11 world camera (Visual
// Venture TV @ 3:28.0: quick-start / long-settle) + D1 white flash (Dashcam Vol.1, 4 f) on the failure.
// Ours (vs TopDownFlow): side elevation with height rule, supports and joints, a load clock that compresses into a bunch, a segment drop-out.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, RC, W, EZ, FLASH4, MBlur, camFast, clamp01, envAt, fs as capFs, lerp, rng, type Cam } from "../../core";
import { LINE, LINE_GLOW, PLATE_BG, PlanText, arcTable, camOf, pointAt, ptsD, smoothPts, toKeys, worldTf, type CamSpec, type P2, PlanCap } from "../../core/kits/diagram";

export type MechanismLoopProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  path: P2[]; // side-view centreline (left -> right), smoothed
  ground: number; // ground y
  drawAt?: number;
  supports?: { every?: number; at?: number }; // vertical supports down to the ground
  joints?: number[]; // 0..1 along the path
  conveyor?: { u0: number; u1: number; at: number }; // belt section with moving chevrons (never stops)
  loads?: { n: number; at: number; kind?: "dot" | "raft"; spacing?: number; speed?: number; start?: number; bunch?: { u: number; spread: number; at: number } };
  water?: { at: number; dropAt?: number };
  heightRule?: { x: number; top: number; label: string; at: number };
  weights?: { label: string; at: number }[]; // stacked arrows above the bunch point
  counter?: { value: string; at: number };
  brittleAt?: number; // the line goes dry / crackled
  fail?: { joint: number; at: number }; // the section joints[i] .. joints[i+1] drops out
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
};

const Scene: React.FC<MechanismLoopProps> = (p) => {
  const f = useCurrentFrame();
  const c = camOf(f, p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 }, p.cam ?? [], p.drift ?? 0.007);
  const pts = React.useMemo(() => smoothPts(p.path, false, 12), [p.path]);
  const tab = React.useMemo(() => arcTable(pts, false), [pts]);
  const at = (u: number) => pointAt(tab, clamp01(u) * tab.total, false);
  const dr = EZ.out3((f - (p.drawAt ?? 0)) / 22);
  const brittle = p.brittleAt !== undefined && f >= p.brittleAt;
  const fl = p.fail, fk = fl ? f - fl.at : -1;
  const J = p.joints ?? [];
  const seg = fl && J[fl.joint] !== undefined ? [J[fl.joint], J[fl.joint + 1] ?? 1] : null;
  const inSeg = (u: number) => !!seg && u >= seg[0] && u <= seg[1];
  const dropY = fk < 0 ? 0 : 0.8 * fk * fk, dropR = fk < 0 ? 0 : 1.5 * fk;
  const sub = (u0: number, u1: number) => { const out: P2[] = []; for (let i = 0; i <= 30; i++) { const q = at(lerp(u0, u1, i / 30)); out.push(q); } return out; };
  const lineCol = brittle ? "#B9B4AA" : LINE;
  const lineDash = brittle ? "22 6 4 6" : undefined;
  // segment pieces
  const pieces: [number, number][] = seg && fk >= 0 ? [[0, seg[0]], [seg[1], 1]] : [[0, 1]];
  const segMid = seg ? at((seg[0] + seg[1]) / 2) : { x: 0, y: 0 };
  // loads
  const L = p.loads;
  const loadPos = (i: number) => {
    if (!L) return 0;
    const t = Math.max(0, f - L.at), sp = L.spacing ?? 0.045, v = L.speed ?? 0.004;
    let u = (L.start ?? 0.05) + v * t - i * sp;
    if (L.bunch && f >= L.bunch.at) { const k = EZ.quick((f - L.bunch.at) / 22); const u0 = (L.start ?? 0.05) + v * (L.bunch.at - L.at) - i * sp; u = lerp(u0, L.bunch.u - (i * L.bunch.spread) / Math.max(1, L.n), k); }
    return u;
  };
  const rule = p.heightRule;
  return (
    <AbsoluteFill>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: c.s }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          <path d={`M0 ${p.ground} H1920`} stroke={LINE} strokeWidth={4} opacity={dr} style={{ filter: LINE_GLOW }} />
          {/* supports */}
          {(() => {
            const every = p.supports?.every ?? 0.1, sAt = p.supports?.at ?? 6, out: React.ReactNode[] = [];
            for (let u = every / 2; u < 1; u += every) {
              const q = at(u), k = EZ.out3((f - sAt - u * 14) / 10);
              if (k <= 0) continue;
              const off = inSeg(u) ? dropY : 0;
              out.push(<path key={u} d={`M${q.x - 18} ${p.ground} L${q.x} ${q.y + 22 + off} L${q.x + 18} ${p.ground} M${q.x - 12} ${(q.y + p.ground) / 2} H${q.x + 12}`} fill="none" stroke={LINE} strokeWidth={3} opacity={k * (inSeg(u) && fk > 10 ? 0 : 1)} style={{ filter: LINE_GLOW }} />);
            }
            return out;
          })()}
          {/* flume */}
          {dr > 0.02 ? pieces.map(([a, b], i) => <path key={i} d={ptsD(sub(a, a + (b - a) * dr))} fill="none" stroke={lineCol} strokeWidth={12} strokeLinecap="round" strokeDasharray={lineDash} style={{ filter: LINE_GLOW }} />) : null}
          {seg && dr >= 1 && fk < 30 ? (
            <g transform={`translate(0 ${dropY.toFixed(1)}) rotate(${dropR.toFixed(2)} ${segMid.x} ${segMid.y})`} opacity={1 - clamp01((fk - 16) / 14)}>
              <path d={ptsD(sub(seg[0], seg[1]))} fill="none" stroke={fk >= 0 ? RC.lineRed : lineCol} strokeWidth={12} strokeLinecap="round" />
            </g>
          ) : null}
          {/* water line inside the channel */}
          {p.water && f >= p.water.at ? (() => {
            const dropK = p.water.dropAt === undefined ? 0 : EZ.out2((f - p.water.dropAt) / 30);
            const w = sub(0, 1).map((q) => ({ x: q.x, y: q.y - 14 + 10 * dropK }));
            return <path d={ptsD(w)} fill="none" stroke="#3FBEFF" strokeWidth={6 - 4 * dropK} opacity={EZ.out2((f - p.water.at) / 8) * (1 - 0.6 * dropK)} strokeDasharray="30 10" strokeDashoffset={-f * 2} />;
          })() : null}
          {/* joints */}
          {J.map((u, i) => { const q = at(u); return f >= (p.drawAt ?? 0) + 16 ? <path key={`j${i}`} d={`M${q.x} ${q.y - 20} V${q.y + 20}`} stroke={fl && (i === fl.joint || i === fl.joint + 1) && f >= fl.at - 20 ? RC.lineRed : "#FFE9A8"} strokeWidth={4} /> : null; })}
          {/* conveyor */}
          {p.conveyor && f >= p.conveyor.at ? (() => {
            const cv = p.conveyor, a = at(cv.u0), b = at(cv.u1), ang = Math.atan2(b.y - a.y, b.x - a.x), len = Math.hypot(b.x - a.x, b.y - a.y), n = Math.floor(len / 46);
            return (
              <g opacity={EZ.out2((f - cv.at) / 8)}>
                <path d={`M${a.x} ${a.y + 24} L${b.x} ${b.y + 24}`} stroke={LINE} strokeWidth={4} />
                {Array.from({ length: n }, (_, i) => { const t = ((i * 46 + (f - cv.at) * 3) % len) / len; return <path key={i} d="M -10 -8 L 2 0 L -10 8" transform={`translate(${lerp(a.x, b.x, t)} ${lerp(a.y, b.y, t) + 24}) rotate(${(ang * 180) / Math.PI})`} fill="none" stroke="#FFE9A8" strokeWidth={4} />; })}
              </g>
            );
          })() : null}
          {/* loads (empty outlines / dots) */}
          {L && f >= L.at ? Array.from({ length: L.n }, (_, i) => {
            const u = loadPos(i);
            if (u < 0 || u > 1) return null;
            if (seg && fk >= 0 && inSeg(u)) return null; // removed with the section
            const q = at(u);
            return L.kind === "raft" ? (
              <ellipse key={i} cx={q.x} cy={q.y - 26} rx={34} ry={14} transform={`rotate(${(q.ang * 180) / Math.PI} ${q.x} ${q.y - 26})`} fill="none" stroke="#FFFFFF" strokeWidth={5} />
            ) : <circle key={i} cx={q.x} cy={q.y - 18} r={9} fill="#FFFFFF" style={{ filter: "drop-shadow(0 0 5px #fff)" }} />;
          }) : null}
          {/* height rule */}
          {rule && f >= rule.at ? (() => {
            const u = EZ.out3((f - rule.at) / 12), y = lerp(p.ground, rule.top, u);
            return (
              <g stroke="#FFE9A8" strokeWidth={3}>
                <path d={`M${rule.x} ${p.ground} V${y} M${rule.x - 14} ${p.ground} H${rule.x + 14} M${rule.x - 14} ${y} H${rule.x + 14}`} />
                <PlanText f={f} at={rule.at + 8} x={rule.x - 24} y={(p.ground + rule.top) / 2} text={rule.label} size={30} anchor="end" colour="#FFE9A8" />
              </g>
            );
          })() : null}
          {/* weight arrows above the bunch */}
          {L?.bunch ? (p.weights ?? []).map((w, i) => {
            if (f < w.at) return null;
            const q = at(L.bunch!.u - L.bunch!.spread / 2), y0 = q.y - 70 - i * 70, k = EZ.out3((f - w.at) / 8);
            return (
              <g key={`w${i}`} opacity={k}>
                <path d={`M${q.x} ${y0 - 40 * k} V${y0} M${q.x - 12} ${y0 - 12} L${q.x} ${y0} L${q.x + 12} ${y0 - 12}`} stroke={RC.lineRed} strokeWidth={5} fill="none" />
                <PlanText f={f} at={w.at} x={q.x + 26} y={y0 - 12} text={w.label} size={24} anchor="start" colour="#FFFFFF" />
              </g>
            );
          }) : null}
        </g>
      </svg></PlanCap.Provider>
      {p.counter && L?.bunch && f >= p.counter.at ? (() => {
        const q = at(L.bunch!.u - L.bunch!.spread / 2), sx = (q.x - c.cx) * c.s + W / 2, sy = (q.y - c.cy) * c.s + H / 2;
        return <div style={{ position: "absolute", left: sx - 200, width: 400, top: sy + 40, textAlign: "center", fontFamily: FONT.inter, fontWeight: 800, fontSize: capFs("inter", 54), color: "#F2F2F2", textShadow: "0 4px 10px rgba(0,0,0,.6)", opacity: EZ.out2((f - p.counter.at) / 5) }}>{p.counter.value}</div>;
      })() : null}
    </AbsoluteFill>
  );
};

export const MechanismLoop: React.FC<MechanismLoopProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false;
  const fl = p.fail ? envAt(FLASH4, f - p.fail.at) : 0;
  const r = rng(Math.floor(f) + 9), sh = p.fail && f >= p.fail.at && f < p.fail.at + 10 ? 8 * (1 - (f - p.fail.at) / 10) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <AbsoluteFill style={{ transform: `translate(${((r() - 0.5) * 2 * sh).toFixed(1)}px, ${((r() - 0.5) * 2 * sh).toFixed(1)}px)` }}><MBlur on={fast}><Scene {...p} /></MBlur></AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
      {fl > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: fl }} /> : null}
    </AbsoluteFill>
  );
};

export const MECH_DEMO: MechanismLoopProps = {
  path: [{ x: 160, y: 300 }, { x: 520, y: 360 }, { x: 900, y: 470 }, { x: 1260, y: 600 }, { x: 1560, y: 700 }, { x: 1780, y: 760 }],
  ground: 900, drawAt: 0,
  supports: { every: 0.09, at: 8 },
  joints: [0.2, 0.38, 0.56, 0.74, 0.9],
  loads: { n: 12, at: 30, kind: "dot", spacing: 0.035, speed: 0.006, start: 0.1, bunch: { u: 0.71, spread: 0.13, at: 64 } },
  heightRule: { x: 120, top: 300, label: "≈ 10 M", at: 20 },
  counter: { value: "12", at: 74 },
  weights: [{ label: "STRUCTURE", at: 84 }, { label: "WATER", at: 90 }, { label: "PEOPLE", at: 96 }],
  brittleAt: 104,
  fail: { joint: 2, at: 118 },
  cam0: { cx: 960, cy: 560, s: 1.0 },
  cam: [{ at: 60, d: 30, cx: 1060, cy: 470, s: 1.35, ease: "quick" }, { at: 114, d: 26, cx: 980, cy: 560, s: 1.08, ease: "settle" }],
};
