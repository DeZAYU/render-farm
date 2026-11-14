// diagram / MoatSection (NEW, zoo rebuild 2026-10-18): an animal enclosure in side section — visitors' path / barrier / wall, the moat (water),
// the island or far bank, an optional live wire — told on its nouns, then RETURNS with movers (a visitor figure, a keeper, the animal glyph)
// travelling along paths, splash rings, thrown-stone arcs, a typed corner tag, and structural changes (a wall raised, the moat drained).
// REF: StructureSection (wp3 sec_A/B line-art section system: white glowing strokes, colour = meaning) + Farrell story "the explainer returns"
// (#15/#33) + Waterpark c04 Cutaway3D water gauge (dimension bracket). Ours: zoo-specific presets (island moat / visitors' moat wall), the live
// dashed wire, movers on paths with motion blur, splash rings, stone arcs. Never injured figures; the animal is a dark silhouette glyph.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, clamp01, lerp } from "../../core";
import { Glyph } from "../../core/kits/glyphs";
import { LINE, LINE_GLOW, PlanText, type P2 } from "../../core/kits/diagram";
import { StructureSection, type Member, type SectionEvent } from "./StructureSection";

export type Mover = { kind: "person" | "keeper" | "animal"; pts: P2[]; at: number; frames?: number; size?: number; until?: number; hold?: boolean; colour?: string };
export type MoatSectionProps = {
  members: Member[]; events?: SectionEvent[];
  labels?: { text: string; x: number; y: number; at: number; red?: boolean }[];
  dims?: { x0: number; y0: number; x1: number; y1: number; text: string; at: number }[];
  wires?: { pts: P2[]; at: number; colour?: string }[];
  splashes?: { x: number; y: number; at: number }[];
  stones?: { x0: number; y0: number; x1: number; y1: number; at: number; n?: number }[];
  movers?: Mover[];
  tag?: { text: string; at: number };
  drift?: number; // px/frame-ish slow push (M-020), default 0.0006 scale/f
  labelCap?: number;
};

const ptAt = (pts: P2[], u: number): P2 => {
  if (pts.length === 1) return pts[0];
  const segs = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.y - pts[i].y)); const tot = segs.reduce((a, b) => a + b, 0) || 1;
  let d = clamp01(u) * tot;
  for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const t = segs[i] ? d / segs[i] : 0; return { x: lerp(pts[i].x, pts[i + 1].x, t), y: lerp(pts[i].y, pts[i + 1].y, t) }; } d -= segs[i]; }
  return pts[pts.length - 1];
};

/** the animal: a dark knuckle-walking silhouette with a light rim (reads as gorilla / large mammal, never a person) */
const Animal: React.FC<{ size: number; flip: boolean }> = ({ size, flip }) => (
  <g transform={`scale(${(flip ? -1 : 1) * size / 100} ${size / 100})`}>
    <path d="M-48 10 C-50 -20 -30 -42 -2 -44 C18 -46 30 -40 38 -30 C48 -34 58 -28 56 -16 C54 -8 46 -6 42 -8 L44 30 L34 30 L30 6 L-20 8 L-24 30 L-34 30 L-34 12 Z"
      fill="#0D0D0F" stroke="#E9E9E9" strokeWidth={4} strokeLinejoin="round" />
  </g>
);

export const MoatSection: React.FC<MoatSectionProps> = (p) => {
  const f = useCurrentFrame();
  const s = 1 + (p.drift ?? 0.0006) * f;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s.toFixed(5)})` }}>
        <StructureSection members={p.members} events={p.events} labels={p.labels} dims={p.dims} labelCap={p.labelCap ?? 30} drift={0} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {(p.wires ?? []).map((w, i) => {
            const k = f - w.at; if (k < 0) return null;
            const d = w.pts.map((q, j) => `${j ? "L" : "M"}${q.x} ${q.y}`).join(" ");
            return (
              <g key={`w${i}`} opacity={EZ.out2(k / 8)}>
                <path d={d} fill="none" stroke={w.colour ?? "#FFE24A"} strokeWidth={4} strokeDasharray="18 12" strokeDashoffset={-k * 3} style={{ filter: "drop-shadow(0 0 8px rgba(255,226,74,.85))" }} />
              </g>
            );
          })}
          {(p.splashes ?? []).map((sp, i) => {
            const k = f - sp.at; if (k < 0 || k > 40) return null;
            return [0, 8, 16].map((o) => { const kk = k - o; if (kk < 0) return null; const u = EZ.out2(kk / 24);
              return <ellipse key={`s${i}${o}`} cx={sp.x} cy={sp.y} rx={20 + 140 * u} ry={6 + 30 * u} fill="none" stroke="#9FE3FF" strokeWidth={4} opacity={(1 - u).toFixed(3)} style={{ filter: LINE_GLOW }} />; });
          })}
          {(p.stones ?? []).map((st, i) => {
            const k = f - st.at; if (k < 0) return null;
            return Array.from({ length: st.n ?? 4 }, (_, j) => { const kk = k - j * 6; if (kk < 0) return null; const u = clamp01(kk / 18);
              const x = lerp(st.x0, st.x1 + (j - 1.5) * 40, u), y = lerp(st.y0, st.y1, u) - Math.sin(u * Math.PI) * 160;
              return <g key={`st${i}${j}`}>{u < 1 ? <circle cx={x} cy={y} r={9} fill={LINE} style={{ filter: LINE_GLOW }} /> : <ellipse cx={x} cy={st.y1} rx={22 * (1 - clamp01((kk - 18) / 14))} ry={6} fill="none" stroke="#9FE3FF" strokeWidth={3} />}</g>; });
          })}
          {(p.movers ?? []).map((m, i) => {
            const k = f - m.at; if (k < 0 || (m.until !== undefined && f >= m.until)) return null;
            const u = EZ.settle(clamp01(k / (m.frames ?? 30)));
            const q = ptAt(m.pts, u), q2 = ptAt(m.pts, Math.min(1, u + 0.02)), flip = q2.x < q.x - 0.01;
            const moving = u > 0.02 && u < 0.98;
            return (
              <g key={`m${i}`} transform={`translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`} opacity={EZ.out2(k / 6)} style={{ filter: moving ? "blur(1.2px)" : undefined }}>
                {m.kind === "animal" ? <Animal size={m.size ?? 110} flip={flip} />
                  : <g transform={`translate(0 ${-(m.size ?? 70) / 2})`} style={{ filter: LINE_GLOW }}><Glyph name={moving ? "runner" : "person"} colour={m.colour ?? (m.kind === "keeper" ? "#8FD3FF" : "#F2F2F2")} size={m.size ?? 70} mode="line" lineW={9} /></g>}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
      {p.tag && f >= p.tag.at ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <PlanText f={f} at={p.tag.at} x={1650} y={150} text={p.tag.text} size={44} colour="#FFE9A8" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- presets (props-driven geometry; the case passes timings)
/** island in a moat seen from the visitors' path (left): path, low barrier, moat with water, island bank rising right, an electric wire at the island edge */
export const moatIsland = (t: { path: number; moat: number; island: number; water: number }): Member[] => [
  { id: "path", pts: [{ x: 80, y: 700 }, { x: 640, y: 700 }], at: t.path, width: 5 },
  { id: "barrier", pts: [{ x: 600, y: 700 }, { x: 600, y: 640 }, { x: 640, y: 640 }], at: t.path + 4, width: 5 },
  { id: "moatL", pts: [{ x: 640, y: 700 }, { x: 680, y: 880 }, { x: 1140, y: 880 }, { x: 1180, y: 690 }], at: t.moat, width: 6, drawFrames: 18 },
  { id: "water", pts: [{ x: 668, y: 790 }, { x: 1156, y: 790 }, { x: 1140, y: 880 }, { x: 680, y: 880 }], at: t.water, fill: "water", width: 2, colour: "#7FD6FF" },
  { id: "island", pts: [{ x: 1180, y: 690 }, { x: 1260, y: 600 }, { x: 1480, y: 520 }, { x: 1760, y: 500 }, { x: 1860, y: 520 }], at: t.island, width: 6, drawFrames: 20 },
  { id: "islandWall", pts: [{ x: 1180, y: 690 }, { x: 1180, y: 640 }], at: t.island + 6, width: 8 },
];
/** visitors' wall on the left (barricade on top, sheer wall down to the water), moat, far island bank right */
export const moatVisitors = (t: { top: number; barricade: number; wall: number; water: number; island: number }): Member[] => [
  { id: "top", pts: [{ x: 80, y: 360 }, { x: 560, y: 360 }], at: t.top, width: 5 },
  { id: "barricade", pts: [{ x: 520, y: 360 }, { x: 520, y: 280 }, { x: 560, y: 280 }, { x: 560, y: 360 }], at: t.barricade, width: 5, colour: "#D8D8D8" },
  { id: "wall", pts: [{ x: 560, y: 360 }, { x: 560, y: 900 }], at: t.wall, width: 9, drawFrames: 18 },
  { id: "bed", pts: [{ x: 560, y: 900 }, { x: 1340, y: 900 }, { x: 1420, y: 760 }], at: t.water, width: 5 },
  { id: "water", pts: [{ x: 560, y: 760 }, { x: 1420, y: 760 }, { x: 1340, y: 900 }, { x: 560, y: 900 }], at: t.water, fill: "water", width: 2, colour: "#7FD6FF" },
  { id: "island", pts: [{ x: 1420, y: 760 }, { x: 1560, y: 640 }, { x: 1860, y: 610 }], at: t.island, width: 6, drawFrames: 18 },
];

export const MOAT_DEMO: MoatSectionProps = {
  members: moatIsland({ path: 0, moat: 8, island: 20, water: 28 }),
  wires: [{ pts: [{ x: 1186, y: 636 }, { x: 1260, y: 596 }], at: 44 }],
  dims: [{ x0: 640, y0: 930, x1: 1180, y1: 930, text: "≈ 3.5 M", at: 36 }],
  labels: [{ text: "MOAT", x: 910, y: 840, at: 40 }, { text: "ISLAND", x: 1560, y: 470, at: 30 }],
  splashes: [{ x: 900, y: 790, at: 70 }],
  movers: [{ kind: "animal", pts: [{ x: 1500, y: 515 }, { x: 1200, y: 640 }, { x: 900, y: 790 }], at: 56, frames: 18, size: 110 }, { kind: "person", pts: [{ x: 360, y: 700 }], at: 50 }],
  tag: { text: "≈ 14:30", at: 60 },
};
