// toll / FillInsideShape: a plan outline (a pool hall, a room, a deck) draws on, then pixel people fill it up to a RANGE: the lower bound solid,
// the upper part of the band as faint ghosts ("somewhere between 50 and 100"). REF: wp3 sec_A explainer @ 1827 (pool outline draws, pixel crowd
// fills on "thousand") + Farrell evidence E1 (one element per noun, clean white line art) + Farrell CC @ 12:41.6 (figure on its word) + Dashcam
// Vol.3 @ 1:47.87 E5 stat (rounded white figure + red word). Differs from FillCounter (a block beside a rolling counter): the people fill a real
// outline, and the uncertainty band is drawn, not counted.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, H, RC, RoundText, W, clamp01, rng } from "../../core";
import { P, PPDefs, PP_H, PP_W, Plate, WHITE, WHITE_GLOW } from "../../core/kits/toll";

export type FillInsideShapeProps = {
  shape?: number[]; // polygon x1,y1,x2,y2… in frame fractions (default: an L-shaped hall)
  min: number; // solid people
  max: number; // band top (ghosts from min to max)
  at?: number; // fill start
  bandAt?: number; // ghosts start
  figure?: string; // e.g. "50–100"
  word?: string; // red word
  figureAt?: number;
  px?: number; // glyph cell size
  seed?: number;
};

const inside = (x: number, y: number, p: [number, number][]) => {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    if ((p[i][1] > y) !== (p[j][1] > y) && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) c = !c;
  }
  return c;
};

export const FillInsideShape: React.FC<FillInsideShapeProps> = ({
  shape = [0.06, 0.2, 0.58, 0.2, 0.58, 0.52, 0.47, 0.52, 0.47, 0.82, 0.06, 0.82], min, max, at = 26, bandAt, figure, word, figureAt, px = 3.8, seed = 7,
}) => {
  const k = useCurrentFrame();
  const poly = Array.from({ length: shape.length / 2 }, (_, i) => [shape[2 * i] * W, shape[2 * i + 1] * H] as [number, number]);
  const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
  const pw = PP_W * px, ph = PP_H * px, m = 18;
  // candidate spots: a jittered grid inside the outline, shuffled (seeded)
  const r = rng(seed);
  const spots: [number, number][] = [];
  for (let y = Math.min(...ys) + m; y < Math.max(...ys) - ph - m; y += ph * 1.25)
    for (let x = Math.min(...xs) + m; x < Math.max(...xs) - pw - m; x += pw * 1.7) {
      const jx = x + (r() - 0.5) * pw * 0.6, jy = y + (r() - 0.5) * ph * 0.25;
      if (inside(jx, jy, poly) && inside(jx + pw, jy + ph, poly) && inside(jx, jy + ph, poly) && inside(jx + pw, jy, poly)) spots.push([jx, jy]);
    }
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
  const nMax = Math.min(max, spots.length), nMin = Math.min(min, nMax);
  const draw = EZ.out2(clamp01(k / 24));
  const solid = EZ.quick(clamp01((k - at) / 40)) * nMin;
  const ba = bandAt ?? at + 44;
  const ghost = EZ.out2(clamp01((k - ba) / 24)) * (nMax - nMin);
  const fa = figureAt ?? ba;
  const d = `M${poly.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} Z`;
  const z = 1.03 * Math.exp(-0.007 * (k / 30));
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  return (
    <Plate bg="#050506">
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <PPDefs />
        <g transform={`translate(${cx} ${H / 2}) scale(${z.toFixed(5)}) translate(${-cx} ${-H / 2})`}>
          <path d={d} fill="rgba(120,170,200,.05)" stroke="#E9ECEE" strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`}
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.35))" }} />
          <g style={{ filter: WHITE_GLOW }}>
            {spots.slice(0, nMax).map(([x, y], i) => {
              if (i < nMin) {
                const t = solid - i;
                return t > 0 ? <P key={i} x={x} y={y} px={px} fill={WHITE} o={0.3 + 0.7 * clamp01(t)} /> : null;
              }
              const t = ghost - (i - nMin);
              return t > 0 ? <P key={i} x={x} y={y} px={px} fill={WHITE} o={0.22 * clamp01(t)} /> : null;
            })}
          </g>
        </g>
      </svg>
      {figure && k >= fa ? (
        <div style={{ position: "absolute", left: Math.max(...xs) + 80, top: H / 2 - 120, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ opacity: clamp01((k - fa) / 3), filter: "drop-shadow(0 4px 10px rgba(0,0,0,.6))" }}><RoundText text={figure} cap={104} colour="#FFFFFF" /></div>
          {word ? <div style={{ opacity: clamp01((k - fa - 6) / 8), filter: "drop-shadow(0 0 8px rgba(242,37,34,.55))" }}><RoundText text={word} cap={56} colour={RC.labelRed} /></div> : null}
        </div>
      ) : null}
    </Plate>
  );
};
