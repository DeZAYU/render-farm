// TP15 SwingDiagram: how a tower chain swing works, drawn in clean white line over the darkened real footage (2.5-D: the crown is a
// projected ring, seats sort by depth). `rise` window: the crown climbs the tower while it spins and the seats fly out on their
// chains; `stopAt`: it stops dead, the seats fall to hanging; `markAt`: a bracket from the ground to the seats, labelled.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const SwingDiagram: React.FC<{ bg: string; bgFrom?: number; rise: [number, number]; stopAt: number; markAt?: number; mark?: string; startUp?: boolean }> = ({ bg, bgFrom = 0, rise, stopAt, markAt = -1, mark = "25 M", startUp }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const cx = width * 0.5, ground = height * 0.9, top = height * 0.08, towerH = ground - top;
  const metre = towerH / 34; // the tower drawn ~34 m tall
  const lift = startUp ? 1 : io(interpolate(f, [rise[0], rise[1]], [0, 1], cl));
  const crownY = ground - metre * (5 + 22 * lift);           // crown climbs to ~27 m, seats end ~25 m
  // spin: speed builds with the rise, drops to 0 at stopAt (eased stop); swing-out angle follows the speed
  const spd = startUp ? 0 : interpolate(f, [rise[0], rise[0] + 20, stopAt - 6, stopAt + 10], [0.02, 0.09, 0.09, 0], cl);
  let ang = 0; for (let i = 0; i < f; i++) ang += startUp ? 0 : interpolate(i, [rise[0], rise[0] + 20, stopAt - 6, stopAt + 10], [0.02, 0.09, 0.09, 0], cl);
  const fly = Math.min(1, spd / 0.09);
  const out1 = interpolate(f, [stopAt + 10, stopAt + 30], [1, 0], cl); // after the stop the seats settle (small sway)
  const sway = f > stopAt ? Math.sin((f - stopAt) / 6) * 0.06 * out1 : 0;
  const R0 = metre * 4.2, chain = metre * 6.5, N = 16, flat = 0.22;
  const seats = Array.from({ length: N }, (_, i) => {
    const th = ang + (i / N) * Math.PI * 2;
    const a = fly * 0.95 + sway;              // chain angle from vertical
    const r = R0 + Math.sin(a) * chain, dy = Math.cos(a) * chain;
    const x = cx + Math.cos(th) * r, z = Math.sin(th);
    const hx = cx + Math.cos(th) * R0, hy = crownY + Math.sin(th) * R0 * flat;
    return { x, y: crownY + Math.sin(th) * r * flat + dy, hx, hy, z };
  }).sort((a, b) => a.z - b.z);
  const enter = out(interpolate(f, [0, 12], [0, 1], cl));
  const gm = markAt >= 0 ? out(interpolate(f, [markAt, markAt + 16], [0, 1], cl)) : 0;
  const seatY = crownY + chain; const mx = cx + metre * 14;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.3) saturate(.6)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: enter }}>
        <line x1={cx - 400} y1={ground} x2={cx + 400} y2={ground} stroke="rgba(255,255,255,.55)" strokeWidth={3} />
        {/* tower: two rails + lattice */}
        {[-1, 1].map((s) => <line key={s} x1={cx + s * 16} y1={ground} x2={cx + s * 12} y2={top} stroke="#fff" strokeWidth={4} />)}
        {Array.from({ length: 30 }, (_, i) => { const y0 = ground - (i * towerH) / 30, y1 = ground - ((i + 1) * towerH) / 30;
          return <line key={i} x1={cx - 15} y1={y0} x2={cx + 15} y2={y1} stroke="rgba(255,255,255,.55)" strokeWidth={2} />; })}
        {/* back half of the seats, crown ring, front half */}
        {seats.filter((s) => s.z < 0).map((s, i) => <g key={"b" + i} opacity={0.55}><line x1={s.hx} y1={s.hy} x2={s.x} y2={s.y} stroke="#fff" strokeWidth={1.5} /><rect x={s.x - 9} y={s.y - 4} width={18} height={12} fill="#fff" /></g>)}
        <ellipse cx={cx} cy={crownY} rx={R0} ry={R0 * flat} fill="rgba(0,0,0,.35)" stroke="#fff" strokeWidth={4} />
        <rect x={cx - 26} y={crownY - 16} width={52} height={20} fill="#000" stroke="#fff" strokeWidth={3} />
        {seats.filter((s) => s.z >= 0).map((s, i) => <g key={"f" + i}><line x1={s.hx} y1={s.hy} x2={s.x} y2={s.y} stroke="#fff" strokeWidth={2} /><rect x={s.x - 11} y={s.y - 5} width={22} height={14} fill="#fff" /></g>)}
        {/* the height bracket, ground -> seats */}
        {gm > 0 && <g opacity={gm}>
          <line x1={mx} y1={ground} x2={mx} y2={ground - (ground - seatY) * gm} stroke={RED} strokeWidth={6} />
          <line x1={mx - 18} y1={ground} x2={mx + 18} y2={ground} stroke={RED} strokeWidth={6} />
          {gm > 0.98 && <line x1={mx - 18} y1={seatY} x2={mx + 18} y2={seatY} stroke={RED} strokeWidth={6} />}
          <line x1={cx + R0 + 30} y1={seatY} x2={mx - 22} y2={seatY} stroke="rgba(255,255,255,.6)" strokeWidth={2} strokeDasharray="8 8" />
        </g>}
      </svg>
      {markAt >= 0 && <RedLabel text={mark} at={markAt + 12} x={(mx + 110) / width} y={((ground + seatY) / 2) / height} size={46} />}
    </AbsoluteFill>
  );
};
