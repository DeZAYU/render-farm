// diagram / ElevationDrop: a side elevation of a hall with a run of suspended elements (duct sections, lights, panels) hanging on cables under
// the roof. A height rule measures the drop; the elements fall one after another like dominoes onto the floor / pool; close-up phases show WHY:
// water fills the sections, rust creeps along them, the hanger cables thin and turn red against a weight arrow; or the steel sections morph into
// a soft fabric sock. REF Farrell story explainer (built on the words, returns #15 / #33) + VV §7 hold -> burst (Visual Venture TV @ 10:43.0) for
// the fall + D1 E4 red HUD language for the cable warning.
// Ours (vs RoofPonding / StructureSection): a hanging array with a staggered gravity cascade, per-section condition states, a material morph.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CHIP_TONE, FONT, H, RC, W, EZ, MBlur, camFast, clamp01, fs as capFs, lerp, rng, type Cam } from "../../core";
import { LINE, LINE_GLOW, PLATE_BG, PlanText, camOf, toKeys, worldTf, type CamSpec, PlanCap } from "../../core/kits/diagram";

export type ElevationDropProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  hall: { x0: number; x1: number; roof: number; floor: number };
  pool?: { x0: number; x1: number; depth: number; at?: number };
  run: { x0: number; x1: number; y: number; n: number; h?: number; gap?: number; at: number };
  rule?: { x: number; label: string; at: number };
  drop?: { at: number; stagger?: number; order?: "ltr" | "rtl"; frames?: number };
  waterAt?: number; rustAt?: number; cablesAt?: number; fabricAt?: number;
  chip?: { text: string; at: number }; // e.g. "ALLEGED"
  labels?: { text: string; x: number; y: number; at: number; red?: boolean }[];
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
};

const Scene: React.FC<ElevationDropProps> = (p) => {
  const f = useCurrentFrame();
  const c = camOf(f, p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 }, p.cam ?? [], p.drift ?? 0.007);
  const { x0, x1, roof, floor } = p.hall;
  const R = p.run, n = R.n, h = R.h ?? 46, gap = R.gap ?? 10, w = (R.x1 - R.x0 - gap * (n - 1)) / n;
  const dr = EZ.out3(f / 18);
  const rust = React.useMemo(() => { const r = rng(61); return Array.from({ length: n * 18 }, () => ({ u: r(), v: r(), s: 2 + r() * 4 })); }, [n]);
  const water = p.waterAt === undefined ? 0 : EZ.out2((f - p.waterAt) / 24);
  const rustK = p.rustAt === undefined ? 0 : clamp01((f - p.rustAt) / 30);
  const cab = p.cablesAt === undefined ? 0 : EZ.out2((f - p.cablesAt) / 12);
  const fab = p.fabricAt === undefined ? 0 : EZ.out2((f - p.fabricAt) / 20);
  const landY = (i: number) => {
    const cx = R.x0 + i * (w + gap) + w / 2;
    if (p.pool && cx > p.pool.x0 && cx < p.pool.x1) return floor + p.pool.depth - h / 2 - 4;
    return floor - h / 2 - 2;
  };
  return (
    <AbsoluteFill>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: c.s }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          <g style={{ filter: LINE_GLOW }} stroke={LINE} fill="none" strokeLinejoin="round" opacity={dr}>
            <path d={`M${x0} ${floor} V${roof} L${(x0 + x1) / 2} ${roof - 80} L${x1} ${roof} V${floor}`} strokeWidth={6} />
            <path d={p.pool ? `M60 ${floor} H${p.pool.x0} V${floor + p.pool.depth} H${p.pool.x1} V${floor} H1860` : `M60 ${floor} H1860`} strokeWidth={4} />
          </g>
          {p.pool ? <rect x={p.pool.x0} y={floor + 12} width={p.pool.x1 - p.pool.x0} height={p.pool.depth - 12} fill="rgba(63,190,255,.25)" opacity={EZ.out2((f - (p.pool.at ?? 6)) / 10)} /> : null}
          {Array.from({ length: n }, (_, i) => {
            const k = f - R.at - i * 1.5;
            if (k < 0) return null;
            const order = p.drop?.order === "rtl" ? n - 1 - i : i;
            const dk = p.drop ? f - p.drop.at - order * (p.drop.stagger ?? 5) : -1;
            const fallU = dk < 0 ? 0 : EZ.in2(clamp01(dk / (p.drop?.frames ?? 14)));
            const x = R.x0 + i * (w + gap), y = R.y, cy = lerp(y + h / 2, landY(i), fallU);
            const rot = fallU * (i % 2 ? 9 : -7);
            const cabCol = cab > 0 ? RC.lineRed : "#CFCFCF", cabW = lerp(3, 1.4, cab);
            const wobble = fab > 0 ? 6 * fab : 0;
            const outline = fab > 0
              ? `M${x} ${-h / 2} ${Array.from({ length: 9 }, (_, j) => `Q${x + (w * (j + 0.5)) / 9} ${-h / 2 - wobble * (j % 2 ? 1 : -1)} ${x + (w * (j + 1)) / 9} ${-h / 2}`).join(" ")} L${x + w} ${h / 2} ${Array.from({ length: 9 }, (_, j) => `Q${x + w - (w * (j + 0.5)) / 9} ${h / 2 + wobble * (j % 2 ? 1 : -1)} ${x + w - (w * (j + 1)) / 9} ${h / 2}`).join(" ")} Z`
              : `M${x} ${-h / 2} H${x + w} V${h / 2} H${x} Z`;
            return (
              <g key={i} opacity={EZ.out2(k / 6)}>
                {fallU < 0.05 ? (
                  <g stroke={cabCol} strokeWidth={cabW} style={{ filter: cab > 0 ? `drop-shadow(0 0 5px ${RC.lineRed})` : undefined }}>
                    <path d={`M${x + w * 0.2} ${roof} V${y}`} /><path d={`M${x + w * 0.8} ${roof} V${y}`} />
                  </g>
                ) : null}
                <g transform={`translate(0 ${cy.toFixed(1)}) rotate(${rot.toFixed(2)} ${x + w / 2} 0)`}>
                  <defs><clipPath id={`edc${i}`}><path d={outline} /></clipPath></defs>
                  <path d={outline} fill={fab > 0.5 ? "rgba(220,225,230,.18)" : "#101417"} stroke={fab > 0.5 ? "#E8ECEF" : LINE} strokeWidth={4} style={{ filter: LINE_GLOW }} />
                  {water > 0 ? <rect x={x} y={h / 2 - h * 0.75 * water} width={w} height={h} fill="rgba(63,190,255,.55)" clipPath={`url(#edc${i})`} /> : null}
                  {rustK > 0 ? rust.slice(i * 18, i * 18 + 18).map((q, j) => (q.u < rustK ? <circle key={j} cx={x + q.u * w} cy={-h / 2 + q.v * h} r={q.s} fill={j % 2 ? "#B5541B" : "#8A3A12"} opacity={0.85} clipPath={`url(#edc${i})`} /> : null)) : null}
                  {fab <= 0 ? <path d={`M${x + w / 2} ${-h / 2} V${h / 2}`} stroke="#6E7377" strokeWidth={2} /> : null}
                </g>
              </g>
            );
          })}
          {cab > 0 ? (() => {
            const xm = R.x0 + w * 0.5 + (Math.floor(n / 2)) * (w + gap);
            return (
              <g opacity={cab}>
                <path d={`M${xm} ${R.y + h + 30} V${R.y + h + 30 + 110 * cab} M${xm - 20} ${R.y + h + 116 * cab} L${xm} ${R.y + h + 30 + 110 * cab} L${xm + 20} ${R.y + h + 116 * cab}`} stroke={RC.lineRed} strokeWidth={8} fill="none" style={{ filter: `drop-shadow(0 0 6px ${RC.lineRed})` }} />
                <PlanText f={f} at={p.cablesAt! + 4} x={xm + 34} y={R.y + h + 110} text="WEIGHT" size={26} anchor="start" colour={RC.lineRed} />
              </g>
            );
          })() : null}
          {p.rule && f >= p.rule.at ? (() => {
            const u = EZ.out3((f - p.rule.at) / 12), y = lerp(floor, R.y, u);
            return (
              <g stroke="#FFE9A8" strokeWidth={3}>
                <path d={`M${p.rule.x} ${floor} V${y} M${p.rule.x - 14} ${floor} H${p.rule.x + 14} M${p.rule.x - 14} ${y} H${p.rule.x + 14}`} />
                <PlanText f={f} at={p.rule.at + 8} x={p.rule.x - 24} y={(floor + R.y) / 2} text={p.rule.label} size={30} anchor="end" colour="#FFE9A8" />
              </g>
            );
          })() : null}
          {(p.labels ?? []).map((l, i) => <PlanText key={i} f={f} at={l.at} x={l.x} y={l.y} text={l.text} size={28} colour={l.red ? RC.lineRed : "#F4F6F6"} />)}
        </g>
      </svg></PlanCap.Provider>
      {p.chip && f >= p.chip.at ? <div style={{ position: "absolute", left: 120, top: 110, padding: "8px 20px", border: `3px solid ${RC.lineRed}`, background: CHIP_TONE.light.fill, fontFamily: FONT.inter, fontWeight: 800, fontSize: capFs("inter", 34), letterSpacing: "0.1em", color: CHIP_TONE.light.text, textShadow: CHIP_TONE.light.shadow, opacity: EZ.out2((f - p.chip.at) / 5) }}>{p.chip.text}</div> : null}
    </AbsoluteFill>
  );
};

export const ElevationDrop: React.FC<ElevationDropProps> = (p) => {
  const f = useCurrentFrame();
  const n = p.run.n, st = p.drop?.stagger ?? 5, fr = p.drop?.frames ?? 14;
  const fast = (p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false) || (!!p.drop && f >= p.drop.at + 4 && f < p.drop.at + (n - 1) * st + fr);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <MBlur on={fast} samples={6}><Scene {...p} /></MBlur>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const ELEVATION_DEMO: ElevationDropProps = {
  hall: { x0: 160, x1: 1760, roof: 260, floor: 860 },
  pool: { x0: 620, x1: 1300, depth: 80 },
  run: { x0: 220, x1: 1700, y: 360, n: 10, h: 46, gap: 8, at: 10 },
  rule: { x: 1730, label: "≈ 35 FT", at: 22 },
  waterAt: 44, rustAt: 58, cablesAt: 72,
  chip: { text: "ALLEGED", at: 44 },
  drop: { at: 108, stagger: 4, order: "ltr", frames: 14 },
  cam0: { cx: 960, cy: 560, s: 1.0 },
  cam: [{ at: 38, d: 28, cx: 980, cy: 400, s: 2.0, ease: "quick" }, { at: 94, d: 24, cx: 960, cy: 560, s: 1.0, ease: "settle" }],
};
