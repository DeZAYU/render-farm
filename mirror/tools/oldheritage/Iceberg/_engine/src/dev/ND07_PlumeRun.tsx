// ND07 PlumeRun — NASA's Landsat 8 image of the Camp Fire at 10:45 that morning (Earth Observatory, public domain), seen from above.
// The fire's origin up the canyon gets a white ring; a white fire-front line creeps down-wind toward Paradise, but embers (bright points)
// leap far ahead of it on long arcs and land INSIDE the town first, each landing starting a small ring (a spot fire) before the front
// gets there. Built for "A strong, dry wind carried embers far out in front of the flames, so new fires were starting inside Paradise
// before the main fire got there." Points are image pixels of the graded crop (3017 x 2011).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, random } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const PlumeRun: React.FC<{ src: string; iw: number; ih: number; origin: [number, number]; town: [number, number]; spots: [number, number][];
  originLabel: string; townLabel: string; frontAt: [number, number]; emberAt: number; emberEvery: number }> = ({ src, iw, ih, origin, town, spots, originLabel, townLabel, frontAt, emberAt, emberEvery }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const t = io(interpolate(f, [0, D], [0, 1], cl));
  // camera: from the origin side toward the town, slow push
  const fx = origin[0] + (town[0] - origin[0]) * (0.25 + 0.55 * t), fy = origin[1] + (town[1] - origin[1]) * (0.25 + 0.55 * t);
  const z = 1.25 + 0.3 * t;
  const base = Math.max(W / iw, H / ih) * z;
  const ox = Math.min(0, Math.max(W - iw * base, W / 2 - fx * base)), oy = Math.min(0, Math.max(H - ih * base, H / 2 - fy * base));
  const S = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const [Ox, Oy] = S(origin), [Tx, Ty] = S(town);
  const dx = Tx - Ox, dy = Ty - Oy, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  // the front: a short line perpendicular to the wind, advancing from the origin but only ~55% of the way during the shot
  const fp = io(interpolate(f, frontAt, [0, 0.55], cl));
  const cx = Ox + dx * fp, cy = Oy + dy * fp, half = 150 + 120 * fp;
  const ring = out(interpolate(f, [4, 20], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "brightness(.82) saturate(.95)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={Ox} cy={Oy} r={18 + 30 * ring} fill="none" stroke="#fff" strokeWidth={5} opacity={ring} />
        <circle cx={Ox} cy={Oy} r={8} fill={RED} stroke="#fff" strokeWidth={3} opacity={ring} />
        {/* fire front: white line across the wind, a soft red wash behind it */}
        {fp > 0.01 && <g>
          <path d={`M${Ox + nx * 60} ${Oy + ny * 60} L${cx + nx * half} ${cy + ny * half} L${cx - nx * half} ${cy - ny * half} L${Ox - nx * 60} ${Oy - ny * 60} Z`} fill="rgba(227,20,27,.18)" />
          <line x1={cx + nx * half} y1={cy + ny * half} x2={cx - nx * half} y2={cy - ny * half} stroke="rgba(0,0,0,.5)" strokeWidth={12} strokeLinecap="round" />
          <line x1={cx + nx * half} y1={cy + ny * half} x2={cx - nx * half} y2={cy - ny * half} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        </g>}
        {/* embers: launched from the front, long arcs, land on the town; each landing leaves a spot fire */}
        {spots.map((sp, i) => {
          const st = emberAt + i * emberEvery, k = interpolate(f, [st, st + 22], [0, 1], cl);
          if (k <= 0) return null;
          const s0x = cx + nx * (random("e" + i) - 0.5) * half * 1.4, s0y = cy + ny * (random("e" + i) - 0.5) * half * 1.4;
          const [ex, ey] = S(sp);
          const e = io(k), lift = Math.sin(Math.PI * e) * 120;
          const x = s0x + (ex - s0x) * e, y = s0y + (ey - s0y) * e - lift;
          const land = out(interpolate(f, [st + 22, st + 34], [0, 1], cl));
          return <g key={i}>
            {k < 1 && <><circle cx={x} cy={y} r={7} fill="#FFD9A0" /><circle cx={x} cy={y} r={14} fill="rgba(255,190,120,.35)" /></>}
            {land > 0 && <><circle cx={ex} cy={ey} r={6 + 16 * land} fill="none" stroke="#fff" strokeWidth={3.5} opacity={1 - 0.3 * land} /><circle cx={ex} cy={ey} r={6} fill={RED} /></>}
          </g>;
        })}
      </svg>
      <RedLabel text={originLabel} at={10} hold={70} x={Math.min(0.82, Math.max(0.18, Ox / W))} y={Math.min(0.9, Math.max(0.12, (Oy - 80) / H))} size={38} />
      <RedLabel text={townLabel} at={emberAt + 20} x={Math.min(0.82, Math.max(0.18, Tx / W))} y={Math.min(0.9, (Ty + 110) / H)} size={42} />
    </AbsoluteFill>
  );
};
