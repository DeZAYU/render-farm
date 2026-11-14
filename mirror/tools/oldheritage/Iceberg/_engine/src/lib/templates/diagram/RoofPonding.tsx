// diagram / RoofPonding: side section of a flat roof. Rain falls, water runs to the lowest point, the roof sags under it, more water runs there,
// it sags more (a step loop on the words), until the beam gives way. Returns with a downpipe blocked by falling objects and trusses outlined
// on their noun. REF Farrell story explainer (built on the words, "the explainer returns" #15 / #33) + VV §7 tank "hold -> burst -> hold"
// (Visual Venture TV @ 10:43.0: x2.98 / 57 f log bezier (0.326, 0, 0.143, 0.807)) for the failure, CameraMotionBlur on the shake.
// Ours: the water body is the real region between the sagging beam and a flat water line; the loop is a sequence of (sag, depth) steps with
// alternating cause labels; the failure hinges both halves at the walls and drops the water as particles.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, RC, W, EZ, MBlur, clamp01, fs as capFs, lerp, rng } from "../../core";
import { LINE, LINE_GLOW, PLATE_BG, PlanText, PlanCap } from "../../core/kits/diagram";

export type RoofPondingProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  span: { x0: number; x1: number; top: number; floor: number; lip?: number; thick?: number }; // walls at x0/x1, roof at y = top
  title?: { text: string; at: number; red?: string }; // e.g. "WATER ACCUMULATION" (red word optional)
  rainAt: number; rainStop?: number;
  pondAt: number; // water starts collecting at the low point
  steps: { at: number; sag: number; depth: number; label?: string }[]; // loop: each step deepens the sag and the water
  fail?: { at: number; zoom?: number; frames?: number; label?: string };
  downpipe?: { at: number; side?: "left" | "right"; drops?: { at: number; kind: "nest" | "ball"; label?: string }[] };
  trusses?: { at: number; n?: number; highlightAt?: number; colour?: string; label?: string };
  labels?: { text: string; at: number; x: number; y: number }[];
};

const drop = (k: number) => (k < 0 ? 0 : EZ.in2(clamp01(k / 12)));
const Scene: React.FC<RoofPondingProps> = (p) => {
  const f = useCurrentFrame();
  const { x0, x1, top, floor } = p.span, lip = p.span.lip ?? 26, th = p.span.thick ?? 22, mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
  let sag = 0, depth = 0;
  for (const s of p.steps) { const e = EZ.quick(clamp01((f - s.at) / 18)); sag = lerp(sag, s.sag, e); depth = lerp(depth, s.depth, e); }
  depth *= clamp01((f - p.pondAt) / 20);
  const fk = p.fail ? f - p.fail.at : -1;
  const ang = fk < 0 ? 0 : 27 * EZ.in2(clamp01(fk / 12)); // each half rotates down about its wall
  const beamY = (x: number) => top + sag * Math.sin((Math.PI * (x - x0)) / (x1 - x0));
  const level = top + sag - depth; // flat water line
  // rotate a point of the left / right half about its wall support
  const rot = (x: number, y: number) => {
    if (fk < 0) return { x, y };
    const left = x <= mid, px = left ? x0 : x1, a = ((left ? 1 : -1) * ang * Math.PI) / 180;
    const dx = x - px, dy = y - top;
    return { x: px + dx * Math.cos(a) - dy * Math.sin(a), y: top + dx * Math.sin(a) + dy * Math.cos(a) };
  };
  const N = 48;
  const curve = (dy: number) => Array.from({ length: N + 1 }, (_, i) => { const x = x0 + ((x1 - x0) * i) / N; return rot(x, beamY(x) + dy); });
  const half1 = (pts: { x: number; y: number }[]) => pts.slice(0, N / 2 + 1), half2 = (pts: { x: number; y: number }[]) => pts.slice(N / 2);
  const D = (pts: { x: number; y: number }[]) => pts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
  const topC = curve(0), botC = curve(th);
  const beamPath = (a: typeof topC, b: typeof topC) => `${D(a)} ${D(b.slice().reverse()).replace("M", "L")} Z`;
  // water region (before failure): curve points under the level line
  let water: string | null = null;
  if (depth > 0.5 && fk < 4) {
    const pts = Array.from({ length: N + 1 }, (_, i) => { const x = x0 + ((x1 - x0) * i) / N; return { x, y: beamY(x) }; }).filter((q) => q.y >= level);
    if (pts.length > 1) water = `M${pts[0].x} ${level} ${pts.map((q) => `L${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ")} L${pts[pts.length - 1].x} ${level} Z`;
  }
  const rain = React.useMemo(() => { const r = rng(808); return Array.from({ length: 90 }, () => ({ x: r(), ph: r() * 40, v: 26 + r() * 10 })); }, []);
  const rainOn = f >= p.rainAt && (p.rainStop === undefined || f < p.rainStop);
  const spill = React.useMemo(() => { const r = rng(919); return Array.from({ length: 260 }, () => ({ x: r(), vy: 4 + r() * 6, vx: (r() - 0.5) * 6, r: 4 + r() * 6 })); }, []);
  const dp = p.downpipe, dpx = dp ? (dp.side === "left" ? x0 - 46 : x1 + 46) : 0;
  const tr = p.trusses, trCol = tr && tr.highlightAt !== undefined && f >= tr.highlightAt ? tr.colour ?? "#FFB347" : LINE;
  return (
    <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: 1 }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {/* rain */}
      {rainOn ? (
        <g stroke="rgba(190,225,255,.55)" strokeWidth={3} strokeLinecap="round">
          {rain.map((d, i) => {
            const x = x0 - 120 + d.x * (x1 - x0 + 240), yy = ((f - p.rainAt) * d.v + d.ph * 30) % (top + 60 - 40);
            const y = 40 + yy;
            return y < beamY(Math.min(x1, Math.max(x0, x))) - 6 ? <path key={i} d={`M${x} ${y} l -4 22`} opacity={clamp01((f - p.rainAt) / 8)} /> : null;
          })}
        </g>
      ) : null}
      <g style={{ filter: LINE_GLOW }} stroke={LINE} fill="none" strokeLinejoin="round">
        {/* ground + walls */}
        <path d={`M 0 ${floor} L ${W} ${floor}`} strokeWidth={4} />
        <rect x={x0 - 34} y={top} width={34} height={floor - top} strokeWidth={4} fill="#0a0d0f" />
        <rect x={x1} y={top} width={34} height={floor - top} strokeWidth={4} fill="#0a0d0f" />
        {/* parapet lips */}
        <path d={`M ${x0 - 34} ${top} L ${x0 - 34} ${top - lip} L ${x0} ${top - lip} L ${x0} ${top}`} strokeWidth={4} />
        <path d={`M ${x1} ${top} L ${x1} ${top - lip} L ${x1 + 34} ${top - lip} L ${x1 + 34} ${top}`} strokeWidth={4} />
        {/* trusses under the roof */}
        {tr && f >= tr.at ? (
          <g stroke={trCol} strokeWidth={3} opacity={EZ.out2((f - tr.at) / 8)} style={trCol !== LINE ? { filter: `drop-shadow(0 0 6px ${trCol})` } : undefined}>
            {Array.from({ length: tr.n ?? 6 }, (_, i) => {
              const n = tr.n ?? 6, a = x0 + ((x1 - x0) * i) / n, b = x0 + ((x1 - x0) * (i + 1)) / n, m = (a + b) / 2;
              const A = rot(a, beamY(a) + th), B = rot(b, beamY(b) + th), M = rot(m, beamY(m) + th + 70);
              return <path key={i} d={`M${A.x} ${A.y} L${M.x} ${M.y} L${B.x} ${B.y} M${A.x} ${A.y} L${B.x} ${B.y}`} />;
            })}
          </g>
        ) : null}
      </g>
      {/* water on the roof */}
      {water ? <path d={water} opacity={fk < 0 ? 1 : 1 - fk / 4} fill="rgba(63,190,255,.45)" stroke="#BFEAFF" strokeWidth={3} style={{ filter: "drop-shadow(0 0 8px rgba(63,190,255,.6))" }} /> : null}
      {/* beam (two halves after failure) */}
      <g style={{ filter: fk >= 0 ? `drop-shadow(0 0 7px ${RC.lineRed})` : LINE_GLOW }} stroke={fk >= 0 ? RC.lineRed : LINE} strokeWidth={4} strokeLinejoin="round" fill="#0a0d0f">
        {fk < 0 ? <path d={beamPath(topC, botC)} /> : <><path d={beamPath(half1(topC), half1(botC))} /><path d={beamPath(half2(topC), half2(botC))} /></>}
      </g>
      {/* failure: water falls through */}
      {fk >= 0 ? (
        <g fill="rgba(110,205,255,.75)" style={{ filter: "blur(.8px)" }}>
          {spill.map((s, i) => {
            const k = fk - s.x * 6;
            if (k < 0) return null;
            const x = mid + (s.x - 0.5) * half * 0.7 + s.vx * k, y = top + sag - (depth * 0.5) * (1 - Math.abs(s.x - 0.5) * 2) + s.vy * k + 0.9 * k * k;
            return y < floor ? <circle key={i} cx={x} cy={y} r={s.r} opacity={1 - clamp01((y - floor + 60) / 60)} /> : null;
          })}
        </g>
      ) : null}
      {/* downpipe + falling objects */}
      {dp && f >= dp.at ? (
        <g opacity={EZ.out2((f - dp.at) / 8)}>
          <g style={{ filter: LINE_GLOW }} stroke={LINE} strokeWidth={4} fill="#0a0d0f">
            <path d={`M ${dpx - 30} ${top - 10} L ${dpx + 30} ${top - 10} L ${dpx + 12} ${top + 30} L ${dpx + 12} ${floor - 20} L ${dpx + 34} ${floor - 4} M ${dpx - 12} ${floor - 20} L ${dpx - 12} ${top + 30} L ${dpx - 30} ${top - 10}`} fill="none" />
          </g>
          {(dp.drops ?? []).map((d, i) => {
            const k = f - d.at, y = lerp(60, top + 22, drop(k));
            if (k < 0) return null;
            const col = d.kind === "ball" ? "#DDF35A" : "#C9A26B";
            return (
              <g key={i}>
                {d.kind === "ball" ? <circle cx={dpx} cy={y} r={15} fill={col} stroke="#fff" strokeWidth={2} /> : (
                  <g transform={`translate(${dpx} ${y})`} stroke={col} strokeWidth={3} fill="none">
                    <ellipse rx={26} ry={11} /><path d="M -22 -4 L 18 6 M -18 6 L 22 -6 M -10 -10 L 6 10" />
                  </g>
                )}
                {d.label && k > 12 ? <PlanText f={f} at={d.at + 12} x={dpx + (dp.side === "left" ? -50 : 50)} y={top + 30} text={d.label} size={26} anchor={dp.side === "left" ? "end" : "start"} colour={RC.lineRed} /> : null}
              </g>
            );
          })}
        </g>
      ) : null}
      {tr && tr.label && tr.highlightAt !== undefined ? <PlanText f={f} at={tr.highlightAt + 4} x={mid} y={top + th + 120} text={tr.label} size={28} colour={trCol} /> : null}
      {/* loop labels near the low point */}
      {p.steps.map((s, i) => {
        if (!s.label || f < s.at || fk >= 0) return null;
        const nxt = p.steps[i + 1];
        if (nxt && nxt.label && f >= nxt.at) return null;
        return <PlanText key={`s${i}`} f={f} at={s.at} x={mid} y={level - 46} text={s.label} size={30} colour={i % 2 ? "#BFEAFF" : "#FFFFFF"} />;
      })}
      {(p.labels ?? []).map((l, i) => <PlanText key={`l${i}`} f={f} at={l.at} x={l.x} y={l.y} text={l.text} size={26} />)}
      {p.fail && p.fail.label ? <PlanText f={f} at={p.fail.at + 6} x={mid} y={top - 90} text={p.fail.label} size={34} colour={RC.lineRed} /> : null}
    </svg></PlanCap.Provider>
  );
};

const Cammed: React.FC<RoofPondingProps> = (p) => {
  const f = useCurrentFrame();
  const fk = p.fail ? f - p.fail.at : -1;
  const mid = (p.span.x0 + p.span.x1) / 2;
  const bk = fk < 0 ? 0 : EZ.tankBurst(clamp01(fk / (p.fail?.frames ?? 40)));
  const s = Math.exp(0.006 * (Math.max(0, f) / 30)) * Math.exp(Math.log(p.fail?.zoom ?? 1.5) * bk);
  const cy = lerp(H / 2, p.span.top + 60, bk), cx = lerp(W / 2, mid, bk);
  const r = rng(Math.floor(Math.max(0, fk)) + 5);
  const amp = fk < 0 ? 0 : 16 * Math.exp(-fk / 8);
  const sx = (r() - 0.5) * 2 * amp, sy = (r() - 0.5) * 2 * amp;
  return (
    <AbsoluteFill style={{ transform: `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(${W / 2}px, ${H / 2}px) scale(${s.toFixed(5)}) translate(${-cx}px, ${-cy}px)`, transformOrigin: "0 0" }}>
      <Scene {...p} />
    </AbsoluteFill>
  );
};

export const RoofPonding: React.FC<RoofPondingProps> = (p) => {
  const f = useCurrentFrame();
  const fk = p.fail ? f - p.fail.at : -1;
  const t = p.title;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <MBlur on={fk >= 0 && fk < 22} samples={8}><Cammed {...p} /></MBlur>
      {t && f >= t.at ? (
        <div style={{ position: "absolute", left: 120, top: 96, fontFamily: FONT.inter, fontWeight: 800, fontSize: capFs("inter", 46), letterSpacing: "0.04em", opacity: EZ.out2((f - t.at) / 6), whiteSpace: "pre", textShadow: "0 4px 10px rgba(0,0,0,.6)" }}>
          <span style={{ color: "#F2F2F2" }}>{t.text}</span>{t.red ? <span style={{ color: RC.ringRed, textShadow: "0 0 14px rgba(227,10,16,.55)" }}> {t.red}</span> : null}
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const ROOF_DEMO: RoofPondingProps = {
  span: { x0: 420, x1: 1500, top: 470, floor: 900, lip: 30, thick: 22 },
  title: { text: "WATER", red: "ACCUMULATION", at: 4 },
  rainAt: 6,
  pondAt: 40,
  downpipe: { at: 10, side: "right", drops: [{ at: 24, kind: "nest", label: "BLOCKED" }] },
  trusses: { at: 0, n: 6 },
  steps: [
    { at: 40, sag: 10, depth: 18, label: "LOWEST POINT" },
    { at: 72, sag: 34, depth: 38, label: "IT SAGS" },
    { at: 92, sag: 58, depth: 62, label: "MORE WATER" },
    { at: 112, sag: 86, depth: 92, label: "IT SAGS MORE" },
  ],
  fail: { at: 134, zoom: 1.3, frames: 40 },
};
