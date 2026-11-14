// toll / RowCompare: two groups of pixel people compared row against row (e.g. injured vs dead, before vs after). REF: Farrell YT @ 4:10.6 (cyan
// and red pixel family icons, "two lives in stark contrast", slow lateral drift 0.56 %W/s) + Farrell story #12 (ICO arithmetic, each step on its
// word) + Dashcam Vol.3 @ 1:47.87 (E5 stat: rounded white figure + red word). Row A sweeps in left -> right on its word, then row B; each row
// carries its own figure and word on the left (DD stat face). Same glyph scale in both rows so the difference is read, not told.
// Our version: row B red with glow, row A dims to grey when B lands (focus moves), the plane drifts sideways (Farrell drift) until the cut.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, H, RC, RoundText, W, clamp01 } from "../../core";
import { P, PPDefs, PP_H, PP_W, Plate, RED, RED_GLOW, WHITE, WHITE_GLOW } from "./shared";

export type RowGroup = { count: number; value: string; word: string; at: number; red?: boolean };
export type RowCompareProps = { a: RowGroup; b: RowGroup; perLine?: number; sweep?: number };

export const RowCompare: React.FC<RowCompareProps> = ({ a, b, perLine = 25, sweep = 20 }) => {
  const k = useCurrentFrame();
  const x0 = 700, x1 = 1800;
  const pitchX = (x1 - x0) / perLine, px = pitchX * (4.2 / 46), pitchY = pitchX * (62 / 46);
  const drift = -0.0056 * W * (k / 30) * 0.4;
  const row = (g: RowGroup, cy: number, dimBy?: RowGroup) => {
    const lines = Math.ceil(g.count / perLine);
    const top = cy - (lines * pitchY) / 2;
    const dim = dimBy ? 1 - 0.55 * clamp01((k - dimBy.at) / 12) : 1;
    const q = k - g.at;
    if (q < 0) return null;
    const shown = EZ.out2(q / sweep) * g.count;
    const fill = g.red ? RED : dim < 0.99 ? `rgb(${Math.round(59 + (236 - 59) * dim)},${Math.round(61 + (238 - 61) * dim)},${Math.round(63 + (238 - 63) * dim)})` : WHITE;
    return (
      <g key={g.word} style={{ filter: g.red ? RED_GLOW : dim > 0.6 ? WHITE_GLOW : undefined }}>
        {Array.from({ length: g.count }, (_, i) => {
          const t = shown - i;
          if (t <= 0) return null;
          return <P key={i} x={x0 + (i % perLine) * pitchX + (pitchX - PP_W * px) / 2} y={top + Math.floor(i / perLine) * pitchY + (pitchY - PP_H * px) / 2} px={px} fill={fill} o={0.3 + 0.7 * clamp01(t)} />;
        })}
      </g>
    );
  };
  const label = (g: RowGroup, cy: number, dimBy?: RowGroup) => {
    const q = k - g.at;
    if (q < 0) return null;
    const dim = dimBy ? 1 - 0.45 * clamp01((k - dimBy.at) / 12) : 1;
    return (
      <div style={{ position: "absolute", left: 80, width: 540, top: cy - 92, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, opacity: clamp01(q / 4) * dim,
        filter: "drop-shadow(0 3px 10px rgba(0,0,0,.6))" }}>
        <RoundText text={g.value} cap={88} colour="#FFFFFF" />
        <div style={{ opacity: clamp01((q - 6) / 8), transform: `translateY(${(12 * (1 - EZ.out3((q - 6) / 14))).toFixed(2)}px)` }}>
          <RoundText text={g.word} cap={44} colour={g.red ? RC.labelRed : "#BEBFC0"} />
        </div>
      </div>
    );
  };
  const ya = 330, yb = 760;
  return (
    <Plate>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <PPDefs />
        <g transform={`translate(${drift.toFixed(2)} 0)`}>
          {row(a, ya, b)}
          {row(b, yb)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 640 + drift, top: (ya + yb) / 2 - 1, width: 1180, height: 2, background: "rgba(233,233,230,.18)", opacity: clamp01((k - b.at) / 10) }} />
      {label(a, ya, b)}
      {label(b, yb)}
    </Plate>
  );
};
