// toll / GridTurnRed: Farrell pixel-people field where N of them turn red. REF: Farrell CC @ 12:41.6 (glowing icon + number, R16: red #C80912 /
// cyan, 30-40 px glow, number pops <= 3 f on its word, pull -0.8..-1.4 %/s linear) + Farrell YT @ 22:36 pixel glyphs + Farrell story #34 ("5 stay
// white and 13 go red"); wp3 sec_C Fifteen @ 5660. A dim grey field (the context: the injured / the crowd) pops on the cut; on the word the red
// ones flip one every 2 f with a glow and a short bloom; the field pulls back -1 %/s linear through the hold. Optional number + red word below
// (DD rounded stat face), popped on its word.
import React from "react";
import { useCurrentFrame } from "remotion";
import { H, RC, RoundText, W, clamp01 } from "../../core";
import { GREY, P, PPDefs, PP_H, PP_W, Plate, RED, RED_GLOW, pickSpread } from "./shared";

export type GridTurnRedProps = {
  total?: number; // people in the field
  red: number; // how many turn red
  redAt: number; // local frame of the first flip
  stagger?: number; // frames between flips
  number?: string; // optional big figure under the field
  word?: string; // red word after the number
  numberAt?: number;
  seed?: number;
  pull?: number; // pull-back per second (Farrell -1 %/s)
};

export const GridTurnRed: React.FC<GridTurnRedProps> = ({ total = 500, red, redAt, stagger = 2, number, word, numberAt, seed = 11, pull = 0.01 }) => {
  const k = useCurrentFrame();
  const areaH = number ? 760 : 930, areaW = 1560;
  // grid that fits `total` into the area at the 46:62 pitch ratio
  const cols = Math.max(1, Math.round(Math.sqrt((total * areaW * 62) / (areaH * 46))));
  const rows = Math.ceil(total / cols);
  const pitchX = Math.min(areaW / cols, (areaH / rows) * (46 / 62)), pitchY = pitchX * (62 / 46);
  const px = pitchX * (3.6 / 46);
  const reds = pickSpread(red, cols, rows, seed);
  const sc = 1.06 * Math.exp(-pull * (k / 30));
  const gw = cols * pitchX, gh = rows * pitchY;
  const cy = number ? 80 + areaH / 2 : H / 2 + 10;
  const na = numberAt ?? redAt + red * stagger + 6;
  return (
    <Plate>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <PPDefs />
        <g transform={`translate(${W / 2} ${cy}) scale(${sc.toFixed(5)}) translate(${-gw / 2 + (pitchX - PP_W * px) / 2} ${-gh / 2 + (pitchY - PP_H * px) / 2})`}>
          {Array.from({ length: total }, (_, i) => {
            const j = reds.indexOf(i);
            if (j >= 0 && k >= redAt + stagger * j) return null;
            return <P key={i} x={(i % cols) * pitchX} y={Math.floor(i / cols) * pitchY} px={px} fill={GREY} />;
          })}
          <g style={{ filter: RED_GLOW }}>
            {reds.map((i, j) => {
              const q = k - (redAt + stagger * j);
              if (q < 0) return null;
              const bloom = 1 + 0.25 * Math.max(0, 1 - q / 6);
              const x = (i % cols) * pitchX, y = Math.floor(i / cols) * pitchY;
              return <P key={i} x={x - (bloom - 1) * PP_W * px / 2} y={y - (bloom - 1) * PP_H * px / 2} px={px * bloom} fill={RED} o={0.55 + 0.45 * clamp01(q / 2)} />;
            })}
          </g>
        </g>
      </svg>
      {number && k >= na ? (
        <div style={{ position: "absolute", left: 0, width: W, top: 880, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 30, filter: "drop-shadow(0 3px 10px rgba(0,0,0,.65))" }}>
          <RoundText text={number} cap={96} colour="#FFFFFF" />
          {word ? <div style={{ opacity: clamp01((k - na - 4) / 6), filter: "drop-shadow(0 0 8px rgba(242,37,34,.6))" }}><RoundText text={word} cap={96} colour={RC.labelRed} /></div> : null}
        </div>
      ) : null}
    </Plate>
  );
};
