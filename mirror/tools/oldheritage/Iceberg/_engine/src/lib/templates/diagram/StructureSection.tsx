// diagram / StructureSection: the line-art section generalised to BUILDINGS: members (columns, walls, arcs/ribs, glazing panes, slabs, grates,
// pipes) draw on their nouns, then the structure fails in PHASES on cue: a crack crawls along a member, glazing shatters into shards, dust puffs at
// a column base, columns fall outward one after another (dominoes), a span drops, a grate lifts away, and the whole drawing can turn red.
// REF wp3 sec_A/B line-art section system (white glowing strokes, colour = meaning) + Farrell story "the explainer returns" (#15 / #33: the same
// drawing comes back in phases) + VV §7 hold -> burst for the collapse moment.
// Ours (vs BuildOnWords / SpreadPullback): generic member geometry + a phased failure event list; no figures in any failure beat.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, RC, W, EZ, MBlur, camFast, clamp01, lerp, rng, type Cam } from "../../core";
import { Glyph } from "../../core/kits/glyphs";
import { LINE, LINE_GLOW, PLATE_BG, PlanText, camOf, toKeys, worldTf, type CamSpec, type P2, PlanCap } from "../../core/kits/diagram";

export type Member = {
  id: string; at: number; drawFrames?: number; width?: number;
  pts?: P2[]; closed?: boolean; // polyline / polygon
  arc?: { cx: number; cy: number; rx: number; ry: number; a0: number; a1: number }; // degrees, 0 = +x, 90 = down
  fill?: "glass" | "solid" | "water" | "none"; colour?: string; pivot?: P2;
};
export type SectionEvent =
  | { kind: "crack"; target: string; at: number; frames?: number; u0?: number; u1?: number }
  | { kind: "shatter"; target: string; at: number }
  | { kind: "dust"; x: number; y: number; at: number; n?: number }
  | { kind: "fall"; target: string; at: number; dir: 1 | -1; frames?: number; angle?: number }
  | { kind: "drop"; target: string; at: number; dy: number; frames?: number; rot?: number }
  | { kind: "lift"; target: string; at: number; dx: number; dy: number; frames?: number; rot?: number }
  | { kind: "red"; at: number };
export type StructureSectionProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  members: Member[];
  events?: SectionEvent[];
  marks?: { glyph: string; x: number; y: number; at: number; size?: number; colour?: string; until?: number }[]; // line glyphs (never figures in failures)
  dims?: { x0: number; y0: number; x1: number; y1: number; text: string; at: number }[]; // dimension lines
  labels?: { text: string; x: number; y: number; at: number; red?: boolean }[];
  cam0?: Cam; cam?: CamSpec[]; drift?: number;
};

const arcPts = (a: NonNullable<Member["arc"]>, n = 40): P2[] => Array.from({ length: n + 1 }, (_, i) => { const t = ((a.a0 + ((a.a1 - a.a0) * i) / n) * Math.PI) / 180; return { x: a.cx + Math.cos(t) * a.rx, y: a.cy + Math.sin(t) * a.ry }; });
const memberPts = (m: Member) => (m.arc ? arcPts(m.arc) : m.pts ?? []);
const D = (pts: P2[], closed?: boolean) => pts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ") + (closed ? " Z" : "");

const Scene: React.FC<StructureSectionProps> = (p) => {
  const f = useCurrentFrame();
  const c = camOf(f, p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 }, p.cam ?? [], p.drift ?? 0.007);
  const ev = p.events ?? [];
  const redK = Math.max(0, ...ev.filter((e) => e.kind === "red").map((e) => EZ.out2((f - e.at) / 12)));
  const stroke = (base: string) => (redK > 0.5 ? RC.lineRed : base);
  const shardsBy = React.useMemo(() => {
    const out: Record<string, { x: number; y: number; vx: number; vy: number; r: number; s: number }[]> = {};
    ev.forEach((e, i) => {
      if (e.kind !== "shatter") return;
      const m = p.members.find((q) => q.id === e.target); if (!m) return;
      const pts = memberPts(m), r = rng(400 + i);
      const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y);
      out[e.target] = Array.from({ length: 34 }, () => ({ x: Math.min(...xs) + r() * (Math.max(...xs) - Math.min(...xs)), y: Math.min(...ys) + r() * (Math.max(...ys) - Math.min(...ys)), vx: (r() - 0.5) * 14, vy: -2 - r() * 6, r: r() * 360, s: 8 + r() * 16 }));
    });
    return out;
  }, [p.members, ev]);
  const tfOf = (m: Member) => {
    let tf = "";
    const pts = memberPts(m);
    for (const e of ev) {
      if ((e.kind === "fall" || e.kind === "drop" || e.kind === "lift") && e.target === m.id && f >= e.at) {
        if (e.kind === "fall") {
          const piv = m.pivot ?? pts.reduce((a, q) => (q.y > a.y ? q : a), pts[0]);
          tf += ` rotate(${(e.dir * (e.angle ?? 78) * EZ.in2((f - e.at) / (e.frames ?? 16))).toFixed(2)} ${piv.x} ${piv.y})`;
        } else if (e.kind === "drop") {
          const u = EZ.in2((f - e.at) / (e.frames ?? 12));
          const cx = pts.reduce((a, q) => a + q.x, 0) / pts.length, cy = pts.reduce((a, q) => a + q.y, 0) / pts.length;
          tf += ` translate(0 ${(e.dy * u).toFixed(1)}) rotate(${((e.rot ?? 0) * u).toFixed(2)} ${cx} ${cy})`;
        } else {
          const u = EZ.quick((f - e.at) / (e.frames ?? 18));
          tf += ` translate(${(e.dx * u).toFixed(1)} ${(e.dy * u).toFixed(1)}) rotate(${((e.rot ?? 0) * u).toFixed(2)})`;
        }
      }
    }
    return tf.trim() || undefined;
  };
  return (
    <AbsoluteFill>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: c.s }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          {p.members.map((m) => {
            const k = f - m.at;
            if (k < 0) return null;
            const pts = memberPts(m), dr = EZ.out3(k / (m.drawFrames ?? 14)), fk = clamp01((k - 6) / 10);
            const sh = ev.find((e) => e.kind === "shatter" && e.target === m.id && f >= e.at);
            const fillC = m.fill === "glass" ? "rgba(120,215,255,.22)" : m.fill === "water" ? "rgba(63,190,255,.32)" : m.fill === "solid" ? "rgba(150,150,150,.28)" : "none";
            const base = m.colour ?? (m.fill === "glass" ? "#BFEAFF" : LINE);
            return (
              <g key={m.id} transform={tfOf(m)}>
                {m.fill && m.fill !== "none" && !sh ? <path d={D(pts, true)} fill={fillC} opacity={fk} /> : null}
                {!sh ? <path d={D(pts, m.closed ?? !!(m.fill && m.fill !== "none"))} fill="none" stroke={stroke(base)} strokeWidth={m.width ?? 5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${dr} 1`}
                  style={{ filter: redK > 0.5 ? `drop-shadow(0 0 7px ${RC.lineRed})` : LINE_GLOW }} /> : null}
              </g>
            );
          })}
          {/* cracks crawl along a member */}
          {ev.map((e, i) => {
            if (e.kind !== "crack" || f < e.at) return null;
            const m = p.members.find((q) => q.id === e.target); if (!m) return null;
            const pts = memberPts(m), u0 = e.u0 ?? 0, u1 = e.u1 ?? 1, u = EZ.out2((f - e.at) / (e.frames ?? 24));
            const n = 26, r = rng(90 + i), path: P2[] = [];
            for (let j = 0; j <= n; j++) {
              const t = lerp(u0, u1, (j / n) * u), idx = Math.min(pts.length - 2, Math.floor(t * (pts.length - 1))), fr = t * (pts.length - 1) - idx;
              const a = pts[idx], b = pts[idx + 1], nx = -(b.y - a.y), ny = b.x - a.x, nl = Math.hypot(nx, ny) || 1, off = (j % 2 ? 1 : -1) * (6 + r() * 10);
              path.push({ x: lerp(a.x, b.x, fr) + (nx / nl) * off, y: lerp(a.y, b.y, fr) + (ny / nl) * off });
            }
            return <path key={`c${i}`} d={D(path)} transform={tfOf(m)} fill="none" stroke={RC.lineRed} strokeWidth={4} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${RC.lineRed})` }} />;
          })}
          {/* shards */}
          {ev.map((e, i) => {
            if (e.kind !== "shatter" || f < e.at) return null;
            const k = f - e.at;
            return (
              <g key={`s${i}`} fill="rgba(170,230,255,.55)" stroke="#DFF6FF" strokeWidth={1.5}>
                {(shardsBy[e.target] ?? []).map((q, j) => {
                  const x = q.x + q.vx * k, y = q.y + q.vy * k + 0.6 * k * k;
                  return <path key={j} d={`M0 ${-q.s / 2} L${q.s / 2} ${q.s / 2} L${-q.s / 2} ${q.s / 3} Z`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(q.r + k * 12).toFixed(1)})`} opacity={1 - clamp01((k - 20) / 14)} />;
                })}
              </g>
            );
          })}
          {/* dust puffs */}
          {ev.map((e, i) => {
            if (e.kind !== "dust" || f < e.at) return null;
            const k = f - e.at, r = rng(700 + i);
            return (
              <g key={`d${i}`} style={{ filter: "blur(3px)" }}>
                {Array.from({ length: e.n ?? 26 }, (_, j) => {
                  const a = Math.PI + r() * Math.PI, v = 1.2 + r() * 3, rr = 8 + r() * 18;
                  return <circle key={j} cx={e.x + Math.cos(a) * v * k} cy={e.y + Math.sin(a) * v * k * 0.5 - k * 0.4} r={rr * (1 + k / 20)} fill="#B9B4AA" opacity={(0.5 * (1 - clamp01(k / 50))).toFixed(3)} />;
                })}
              </g>
            );
          })}
          {(p.marks ?? []).map((m, i) => (f >= m.at && (m.until === undefined || f < m.until) ? (
            <g key={`m${i}`} transform={`translate(${m.x} ${m.y})`} opacity={EZ.out2((f - m.at) / 5)} style={{ filter: LINE_GLOW }}><Glyph name={m.glyph} colour={stroke(m.colour ?? LINE)} size={m.size ?? 60} mode="line" lineW={10} /></g>
          ) : null))}
          {(p.dims ?? []).map((d, i) => {
            const k = f - d.at;
            if (k < 0) return null;
            const u = EZ.out3(k / 10), x1 = lerp(d.x0, d.x1, u), y1 = lerp(d.y0, d.y1, u), ang = Math.atan2(d.y1 - d.y0, d.x1 - d.x0), nx = -Math.sin(ang) * 14, ny = Math.cos(ang) * 14;
            return (
              <g key={`dm${i}`} stroke="#FFE9A8" strokeWidth={3}>
                <path d={`M${d.x0} ${d.y0} L${x1} ${y1} M${d.x0 - nx} ${d.y0 - ny} L${d.x0 + nx} ${d.y0 + ny} M${x1 - nx} ${y1 - ny} L${x1 + nx} ${y1 + ny}`} />
                <PlanText f={f} at={d.at + 6} x={(d.x0 + d.x1) / 2 - ny * 2.6} y={(d.y0 + d.y1) / 2 + nx * 2.6 + 8} text={d.text} size={26} colour="#FFE9A8" />
              </g>
            );
          })}
          {(p.labels ?? []).map((l, i) => <PlanText key={`l${i}`} f={f} at={l.at} x={l.x} y={l.y} text={l.text} size={28} colour={l.red || redK > 0.5 ? RC.lineRed : "#F4F6F6"} />)}
        </g>
      </svg></PlanCap.Provider>
    </AbsoluteFill>
  );
};

export const StructureSection: React.FC<StructureSectionProps> = (p) => {
  const f = useCurrentFrame();
  const fast = (p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false) || (p.events ?? []).some((e) => (e.kind === "fall" || e.kind === "drop") && f >= e.at + 4 && f < e.at + (e.frames ?? 14));
  const ev = p.events ?? [];
  const shake = ev.filter((e) => e.kind === "drop" || e.kind === "fall").reduce((a, e) => { const k = f - e.at - (e.frames ?? 14); return k >= 0 && k < 10 ? Math.max(a, 10 * (1 - k / 10)) : a; }, 0);
  const r = rng(Math.floor(f) + 3);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <AbsoluteFill style={{ transform: `translate(${((r() - 0.5) * 2 * shake).toFixed(1)}px, ${((r() - 0.5) * 2 * shake).toFixed(1)}px)` }}>
        <MBlur on={fast}><Scene {...p} /></MBlur>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

// demo: a domed hall in section (ground, 5 columns, glazing between them, a dome arc with ribs, a pool on the floor)
const COLS = [360, 620, 1300, 1560];
export const SECTION_DEMO: StructureSectionProps = {
  members: [
    { id: "ground", pts: [{ x: 120, y: 860 }, { x: 1800, y: 860 }], at: 0, width: 4 },
    { id: "pool", pts: [{ x: 720, y: 860 }, { x: 740, y: 930 }, { x: 1180, y: 930 }, { x: 1200, y: 860 }], at: 4, fill: "water", closed: false },
    ...COLS.map((x, i) => ({ id: `col${i}`, pts: [{ x, y: 860 }, { x, y: 560 }], at: 8 + i * 3, width: 10 })),
    { id: "glassL", pts: [{ x: 370, y: 580 }, { x: 610, y: 580 }, { x: 610, y: 850 }, { x: 370, y: 850 }], at: 30, fill: "glass" as const, width: 3 },
    { id: "glassR", pts: [{ x: 1310, y: 580 }, { x: 1550, y: 580 }, { x: 1550, y: 850 }, { x: 1310, y: 850 }], at: 32, fill: "glass" as const, width: 3 },
    { id: "domeL", arc: { cx: 960, cy: 560, rx: 600, ry: 330, a0: 180, a1: 270 }, at: 18, drawFrames: 18, width: 8 },
    { id: "domeR", arc: { cx: 960, cy: 560, rx: 600, ry: 330, a0: 270, a1: 360 }, at: 22, drawFrames: 18, width: 8 },
    { id: "rib", arc: { cx: 960, cy: 560, rx: 420, ry: 250, a0: 195, a1: 345 }, at: 36, width: 4, colour: "#B9B9B9" },
  ],
  events: [
    { kind: "crack", target: "glassL", at: 64, frames: 22, u0: 0, u1: 0.75 },
    { kind: "shatter", target: "glassL", at: 86 },
    { kind: "dust", x: 360, y: 850, at: 92 },
    { kind: "fall", target: "col0", at: 100, dir: -1, frames: 16 },
    { kind: "fall", target: "col1", at: 108, dir: -1, frames: 16, angle: 60 },
    { kind: "drop", target: "domeL", at: 118, dy: 260, frames: 14, rot: -10 },
    { kind: "drop", target: "rib", at: 120, dy: 300, frames: 14, rot: 6 },
    { kind: "red", at: 134 },
  ],
  labels: [{ text: "GLASS", x: 490, y: 540, at: 34 }, { text: "CONCRETE", x: 960, y: 200, at: 40 }],
  cam0: { cx: 960, cy: 600, s: 1.0 },
  cam: [{ at: 58, d: 30, cx: 560, cy: 690, s: 1.45, ease: "quick" }, { at: 112, d: 30, cx: 960, cy: 620, s: 1.0, ease: "settle" }],
};
