// toll / IconGrid: a wall of tiles, one object/person icon each (lockers with bags, beds, seats, people); on their words some turn red, take a
// red cross, dim, empty out or light up; a big figure and short tags land in a column beside the wall. REF: Farrell pixel/icon grids (wp3 C#4
// Fifteen; Farrell CC @ 12:41.6 R16 icon + number) + Farrell story #12/#34 (icon arithmetic, each change on its word) + VV §7 red X drawn in 3 f
// (VV @ 19:26.4: semi-transparent red strokes) + Dashcam Vol.1 corkboard tile/item timing (10 f, settle) + Dashcam Vol.3 @ 1:47.87 E5 stat for the
// figure. Differs from GridTurnRed (a dense anonymous pixel-people field): a few dozen LARGE tiles of a chosen object, five kinds of state change,
// crosses, and a figure + tags column.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, RC, RoundText, clamp01, rng } from "../../core";
import { Glyph } from "../../core/kits/glyphs";
import { Plate } from "../../core/kits/toll";

export type IconOp = { at: number; op: "red" | "cross" | "dim" | "empty" | "light"; ids?: number[]; n?: number; seed?: number; stagger?: number; others?: boolean }; // others: every icon no earlier op touched
export type IconGridProps = {
  count: number;
  cols?: number;
  icon?: string; // a glyphs-kit name (person, house, car, phone, …) or "bag" / "bed"
  events?: IconOp[];
  figure?: { text: string; at: number; red?: boolean }; // big figure in the side column
  tags?: { text: string; at: number; red?: boolean }[];
};

const BAG = "M-62 -20 Q-62 -34 -48 -34 H48 Q62 -34 62 -20 V64 Q62 78 48 78 H-48 Q-62 78 -62 64 Z M-30 -34 V-52 Q-30 -66 -16 -66 H16 Q30 -66 30 -52 V-34 M-62 14 H62";
const BED = "M-80 40 V-30 M-80 10 H80 V40 M-80 -4 H-36 Q-24 -4 -24 -16 Q-24 -28 -36 -28 H-80 M-20 -6 H70 Q80 -6 80 4";
const LocalIcon: React.FC<{ d: string; colour: string; size: number }> = ({ d, colour, size }) => (
  <g transform={`scale(${(size / 200).toFixed(4)})`}><path d={d} fill="none" stroke={colour} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /></g>
);

/** the ids an op applies to: explicit, else n seeded picks */
const opIds = (e: IconOp, count: number) => {
  if (e.ids) return e.ids;
  const r = rng(e.seed ?? 3), s = new Set<number>();
  while (s.size < Math.min(e.n ?? 0, count)) s.add(Math.floor(r() * count));
  return [...s].sort((a, b) => a - b);
};

export const IconGrid: React.FC<IconGridProps> = ({ count, cols, icon = "bag", events = [], figure, tags = [] }) => {
  const k = useCurrentFrame();
  const c = cols ?? Math.ceil(Math.sqrt(count * 1.4));
  const rows = Math.ceil(count / c);
  const areaW = 1020, areaH = 820;
  const pitch = Math.min(areaW / c, areaH / rows), tile = pitch * 0.86;
  const gx = 110 + (areaW - c * pitch) / 2, gy = (H - rows * pitch) / 2 + 10;
  const ops: { e: IconOp; ids: number[] }[] = [];
  events.forEach((e) => {
    const used = new Set(ops.flatMap((o) => o.ids));
    ops.push({ e, ids: e.others ? Array.from({ length: count }, (_, i) => i).filter((i) => !used.has(i)) : opIds(e, count) });
  });
  const state = (i: number) => {
    const st = { red: 0, cross: 0, dim: 0, empty: 0, light: 0, crossK: -1 };
    ops.forEach(({ e, ids }) => {
      const j = ids.indexOf(i);
      if (j < 0) return;
      const q = k - (e.at + j * (e.stagger ?? 2));
      if (q < 0) return;
      const v = clamp01(q / 6);
      st[e.op] = Math.max(st[e.op], v);
      if (e.op === "cross") st.crossK = q;
    });
    return st;
  };
  const z = 1.02 * Math.exp(-0.008 * (k / 30));
  return (
    <Plate bg="#060606">
      <div style={{ position: "absolute", inset: 0, transformOrigin: "35% 50%", transform: `scale(${z.toFixed(5)})` }}>
        {Array.from({ length: count }, (_, i) => {
          const col = i % c, row = Math.floor(i / c);
          const q = k - (col + row) * 1.5;
          const a = clamp01(q / 8);
          if (a <= 0) return null;
          const st = state(i);
          const base = st.light > 0 ? "#FFFFFF" : "#CFD1D3";
          const colour = st.red > 0 ? RC.d1Red : base;
          const o = (1 - 0.78 * st.dim) * (1 - st.empty) * (st.cross > 0 ? 1 - 0.45 * st.cross : 1);
          const x = gx + col * pitch + (pitch - tile) / 2, y = gy + row * pitch + (pitch - tile) / 2;
          const xd = st.crossK < 0 ? 0 : EZ.out2(st.crossK / 3), xd2 = st.crossK < 0 ? 0 : EZ.out2((st.crossK - 2) / 3);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: tile, height: tile, opacity: a, transform: `scale(${(0.92 + 0.08 * EZ.out3(q / 10)).toFixed(4)})`,
              borderRadius: tile * 0.1, background: st.red > 0 ? `rgba(60,4,6,${(0.55 * st.red).toFixed(3)})` : "linear-gradient(160deg, #1b1c1f, #111214)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,.05), 0 6px 14px rgba(0,0,0,.55)${st.red > 0 ? `, 0 0 ${(18 * st.red).toFixed(1)}px rgba(235,24,25,${(0.35 * st.red).toFixed(3)})` : ""}` }}>
              <svg width={tile} height={tile} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <g transform={`translate(${tile / 2} ${tile / 2 + tile * 0.02})`} opacity={o}
                  style={{ filter: st.red > 0 ? "drop-shadow(0 0 4px rgba(255,30,40,.8))" : st.light > 0 ? "drop-shadow(0 0 6px rgba(255,255,255,.7))" : undefined }}>
                  {icon === "bag" ? <LocalIcon d={BAG} colour={colour} size={tile * 0.64} /> : icon === "bed" ? <LocalIcon d={BED} colour={colour} size={tile * 0.7} /> : <Glyph name={icon} colour={colour} size={tile * 0.66} />}
                </g>
                {st.crossK >= 0 ? (
                  <g stroke={RC.lineRed} strokeWidth={Math.max(4, tile * 0.07)} strokeLinecap="round" opacity={0.85} style={{ filter: "drop-shadow(0 0 5px rgba(255,26,26,.7))" }}>
                    <line x1={tile * 0.2} y1={tile * 0.2} x2={tile * (0.2 + 0.6 * xd)} y2={tile * (0.2 + 0.6 * xd)} />
                    {xd2 > 0 ? <line x1={tile * 0.8} y1={tile * 0.2} x2={tile * (0.8 - 0.6 * xd2)} y2={tile * (0.2 + 0.6 * xd2)} /> : null}
                  </g>
                ) : null}
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 1230, top: 300, width: 640 }}>
        {figure && k >= figure.at ? (
          <div style={{ opacity: clamp01((k - figure.at) / 3), filter: figure.red ? "drop-shadow(0 0 10px rgba(242,37,34,.55))" : "drop-shadow(0 4px 10px rgba(0,0,0,.6))",
            transform: `scale(${(1.08 - 0.08 * EZ.out3((k - figure.at) / 8)).toFixed(4)})`, transformOrigin: "0 50%" }}>
            <RoundText text={figure.text} cap={110} colour={figure.red ? RC.labelRed : "#FFFFFF"} />
          </div>
        ) : null}
        <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22 }}>
          {tags.map((t, i) => {
            const q = k - t.at;
            if (q < 0) return null;
            return (
              <div key={i} style={{ opacity: EZ.out2(q / 12), transform: `translateY(${(16 * (1 - EZ.out3(q / 20))).toFixed(2)}px)`, filter: t.red ? "drop-shadow(0 0 6px rgba(242,37,34,.6))" : "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}>
                <RoundText text={t.text} cap={40} colour={t.red ? RC.placeRed : "#E8E8E8"} />
              </div>
            );
          })}
        </div>
      </div>
      <AbsoluteFill style={{ pointerEvents: "none", background: "linear-gradient(90deg, rgba(0,0,0,0) 60%, rgba(0,0,0,.25) 100%)" }} />
    </Plate>
  );
};
