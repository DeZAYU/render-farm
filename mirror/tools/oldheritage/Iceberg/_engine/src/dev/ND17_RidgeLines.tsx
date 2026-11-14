// ND17 device: the Erft valley at Bad Muenstereifel as 33 real terrain sections (west -> east, 7.8 km wide, from the Mapzen/AWS
// terrarium DEM), stacked back to front like a ridge-line plot. Rain lands on the steep sides and runs down every section at once into the
// same narrow floor; the floor lights red down the whole valley (the Erft), and the town's section is marked where it sits on that floor.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { RIDGE } from "./ND17_data";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const RidgeLines: React.FC<{ rainAt: number; floorAt: number; townAt: number }> = ({ rainAt, floorAt, townAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const { prof, floor, rows, cols, townRow } = RIDGE as { prof: number[][]; floor: number[]; rows: number; cols: number; townRow: number };
  const drift = io(f / D);
  const cx = width / 2 + 40 - 80 * drift;
  const P = (i: number, c: number) => {
    const d = i / (rows - 1); const sx = 8.2 + 5.2 * d + 0.8 * drift; const by = 380 + 560 * d; const vz = 0.9 + 0.8 * d;
    const ci = Math.max(0, Math.min(cols - 1, c)); const c0 = Math.floor(ci), c1 = Math.min(cols - 1, c0 + 1), u = ci - c0;
    const el = prof[i][c0] * (1 - u) + prof[i][c1] * u;
    return [cx + (c - (cols - 1) / 2) * sx, by - (el - 250) * vz] as [number, number];
  };
  const appear = (i: number) => out(interpolate(f, [i * 0.9, i * 0.9 + 14], [0, 1], cl));
  const glow = io(interpolate(f, [floorAt, floorAt + 26], [0, 1], cl));
  const town = out(interpolate(f, [townAt, townAt + 12], [0, 1], cl));
  // rain: drops land on the slopes of every 2nd section and run down to its floor, all arriving together by floorAt
  const drops = Array.from({ length: 150 }, (_, k) => k).map((k) => {
    const i = 1 + ((k * 2) % (rows - 1)); const side = rnd(k) < 0.5 ? -1 : 1;
    const c0 = floor[i] + side * (14 + rnd(k + 9) * 60); const born = rainAt + rnd(k + 3) * 30;
    const u = interpolate(f, [born, floorAt], [0, 1], cl); if (f < born - 8 || f > floorAt + 6) return null;
    const fallIn = interpolate(f, [born - 8, born], [0, 1], cl);
    const c = c0 + (floor[i] - c0) * Easing.in(Easing.quad)(u);
    const [x, y] = P(i, c);
    return <circle key={k} cx={x} cy={y - 3 - (1 - fallIn) * 60} r={2.2 + 1.6 * (i / rows)} fill="#fff" opacity={0.9 * fallIn} />;
  });
  const floorLine = Array.from({ length: rows }, (_, i) => P(i, floor[i]));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 80% at 50% 45%, #121718 0%, #050607 100%)", overflow: "hidden" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: rows }, (_, i) => i).map((i) => {
          const a = appear(i); if (a <= 0) return null;
          const pts = Array.from({ length: cols }, (_, c) => P(i, c));
          const line = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
          const isTown = i === townRow;
          return <g key={i} opacity={a} transform={`translate(0 ${(1 - a) * 30})`}>
            <path d={`${line} L ${pts[cols - 1][0]} ${height + 50} L ${pts[0][0]} ${height + 50} Z`} fill="#070909" />
            <path d={line} fill="none" stroke={isTown && town > 0 ? `rgba(255,255,255,${0.55 + 0.45 * town})` : "rgba(255,255,255,.62)"} strokeWidth={isTown && town > 0 ? 2.2 + 2 * town : 1.6 + 1.2 * (i / rows)} />
            {glow > 0 && (() => { const [x, y] = P(i, floor[i]); return <ellipse cx={x} cy={y - 2} rx={10 + 14 * (i / rows)} ry={3 + 3 * (i / rows)} fill={RED} opacity={glow * 0.9} />; })()}
          </g>;
        })}
        {drops}
        {glow > 0 && <path d={"M" + floorLine.map((p) => p.join(" ")).join(" L")} fill="none" stroke={RED} strokeWidth={3} opacity={glow * 0.5} pathLength={1} strokeDasharray={`${glow} 1`} />}
        {town > 0 && (() => { const [x, y] = P(townRow, floor[townRow]); const s = 26 * (1.5 - 0.5 * town); return <rect x={x - s / 2} y={y - s / 2 - 4} width={s} height={s} fill="none" stroke="#fff" strokeWidth={4} opacity={town} />; })()}
      </svg>
      {(() => { const [x, y] = P(townRow, floor[townRow]); return <RedLabel text="BAD MÜNSTEREIFEL" at={townAt + 6} x={x / width} y={Math.min(0.92, (y + 70) / height)} size={38} />; })()}
    </AbsoluteFill>
  );
};
