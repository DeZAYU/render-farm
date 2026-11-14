// diagram / Cutaway3D: a tilted 3-D line model of a round object (a ride raft / ring / basin) in true perspective: EMPTY seats light on their
// nouns, belts click shut, then the object is posed by keyframes: it travels, hits an obstacle, lifts, drops, rolls over (the belts then hang
// under the hull, glowing red). A depth gauge, a weight tag and fading flow arrows on the water complete it. Never figures.
// REF VV §11 world-space infographic (Visual Venture TV @ 3:28.0: one plane, a camera in quick-start / long-settle phases) + Farrell story
// "the explainer returns" (#15 / #33) + VV §7 colour = meaning (belts white -> red).
// Ours: a real 3-D ring (outer/inner rims, depth-sorted seats) posed by roll/lift/travel keys; physical roll-over makes the belts hang.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CHIP_TONE, FONT, H, RC, W, EZ, MBlur, clamp01, fs as capFs, lerp, rng } from "../../core";
import { LINE, LINE_GLOW, PLATE_BG, PlanText, ptsD, smoothPts, type P2, PlanCap } from "../../core/kits/diagram";

type Pose = { x: number; z: number; lift: number; roll: number; yaw: number };
export type Cutaway3DProps = {
  labelCap?: number; // on-screen cap (px) of every plan label / tag / rule text (M-024: >= 28)
  radius?: number; tube?: number; seats?: number; tilt?: number;
  drawAt?: number;
  seatMarks?: { seat: number; at: number; label?: string }[];
  beltsAt?: number; beltsRedAt?: number;
  pose0?: Partial<Pose>;
  poses?: ({ at: number; d: number; ease?: keyof typeof EZ } & Partial<Pose>)[];
  water?: { at: number; y?: number; flowFadeAt?: number };
  rock?: { x: number; z: number; at: number; r?: number };
  gauge?: { at: number; label: string; x?: number };
  tag?: { at: number; text: string };
  shakeAt?: number[]; // impact frames (short shake + blur)
};

const D3 = 1700;
export const Cutaway3D: React.FC<Cutaway3DProps> = (p) => {
  const f = useCurrentFrame();
  const R = p.radius ?? 190, T = p.tube ?? 42, n = p.seats ?? 6, tilt = ((p.tilt ?? 62) * Math.PI) / 180;
  let pose: Pose = { x: 0, z: 0, lift: 0, roll: 0, yaw: 0, ...p.pose0 };
  for (const k of p.poses ?? []) {
    const u = (EZ[k.ease ?? "quick"])(clamp01((f - k.at) / k.d));
    pose = { x: lerp(pose.x, k.x ?? pose.x, u), z: lerp(pose.z, k.z ?? pose.z, u), lift: lerp(pose.lift, k.lift ?? pose.lift, u), roll: lerp(pose.roll, k.roll ?? pose.roll, u), yaw: lerp(pose.yaw, k.yaw ?? pose.yaw, u) };
  }
  const wy = p.water?.y ?? 0;
  // object space: x right, y up, z toward viewer. roll about x, yaw about y, then translate; view tilt about x; perspective
  const proj = (x: number, y: number, z: number, obj = true) => {
    let X = x, Y = y, Z = z;
    if (obj) {
      const rl = (pose.roll * Math.PI) / 180, yw = (pose.yaw * Math.PI) / 180;
      const y1 = Y * Math.cos(rl) - Z * Math.sin(rl), z1 = Y * Math.sin(rl) + Z * Math.cos(rl);
      const x2 = X * Math.cos(yw) + z1 * Math.sin(yw), z2 = -X * Math.sin(yw) + z1 * Math.cos(yw);
      X = x2 + pose.x; Y = y1 + pose.lift + wy; Z = z2 + pose.z;
    }
    const y3 = Y * Math.cos(tilt) + Z * Math.sin(tilt), z3 = -Y * Math.sin(tilt) + Z * Math.cos(tilt);
    const k = D3 / (D3 - z3);
    return { x: W / 2 + X * k, y: H * 0.56 - y3 * k, d: z3 };
  };
  const ring = (rad: number, h: number, N = 64) => Array.from({ length: N + 1 }, (_, i) => { const a = (i / N) * Math.PI * 2; return proj(Math.cos(a) * rad, h, Math.sin(a) * rad); });
  const dr = EZ.out3((f - (p.drawAt ?? 0)) / 18);
  const red = p.beltsRedAt !== undefined && f >= p.beltsRedAt;
  const beltK = p.beltsAt === undefined ? 0 : f - p.beltsAt;
  // seats sorted by depth
  const seats = Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + Math.PI / n; const c = proj(Math.cos(a) * R, T * 0.2, Math.sin(a) * R); return { i, a, d: c.d }; }).sort((a, b) => a.d - b.d);
  const shake = (p.shakeAt ?? []).reduce((acc, at) => { const k = f - at; return k >= 0 && k < 10 ? Math.max(acc, 12 * (1 - k / 10)) : acc; }, 0);
  const sr = rng(Math.floor(f) + 21);
  const fast = shake > 4 || (p.poses ?? []).some((k) => (k.roll !== undefined || k.lift !== undefined) && f > k.at + 2 && f < k.at + k.d * 0.6);
  const water = p.water && f >= p.water.at;
  const flowO = p.water?.flowFadeAt === undefined ? 1 : 1 - clamp01((f - p.water.flowFadeAt) / 20);
  const scene = (
    <AbsoluteFill style={{ transform: `translate(${((sr() - 0.5) * 2 * shake).toFixed(1)}px, ${((sr() - 0.5) * 2 * shake).toFixed(1)}px)` }}>
      <PlanCap.Provider value={{ cap: p.labelCap ?? 30, scale: 1 }}><svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {water ? (
          <g opacity={EZ.out2((f - p.water!.at) / 8)}>
            {[-3, -2, -1, 0, 1, 2, 3].map((j) => { const a = proj(-1100, wy, j * 140, false), b = proj(1100, wy, j * 140, false); return <path key={j} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke="rgba(63,190,255,.35)" strokeWidth={2} />; })}
            {flowO > 0 ? Array.from({ length: 10 }, (_, j) => { const xx = ((j * 230 + f * 6) % 2200) - 1100, zz = ((j * 97) % 5 - 2) * 140, q = proj(xx, wy, zz, false); return <path key={`a${j}`} d="M -14 -9 L 4 0 L -14 9" transform={`translate(${q.x} ${q.y})`} fill="none" stroke="#BFEAFF" strokeWidth={4} opacity={flowO} />; }) : null}
          </g>
        ) : null}
        {p.rock && f >= p.rock.at ? (() => {
          const rr = p.rock.r ?? 120, r = rng(5);
          const pts: P2[] = Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i / 8) * Math.PI, q = proj(p.rock!.x + Math.cos(a) * rr * (0.8 + r() * 0.3), wy - Math.sin(a) * rr * (0.7 + r() * 0.3), p.rock!.z, false); return { x: q.x, y: q.y }; });
          return <path d={ptsD(smoothPts(pts, false, 6)) + " Z"} fill="#15191b" stroke={LINE} strokeWidth={4} opacity={EZ.out2((f - p.rock.at) / 6)} style={{ filter: LINE_GLOW }} />;
        })() : null}
        <g opacity={dr} style={{ filter: LINE_GLOW }} fill="none" stroke={LINE} strokeLinejoin="round">
          <path d={ptsD(ring(R + T, 0))} strokeWidth={4} />
          <path d={ptsD(ring(R + T, T * 1.2))} strokeWidth={5} fill="rgba(10,14,16,.55)" />
          <path d={ptsD(ring(R - T, T * 1.2))} strokeWidth={4} />
          <path d={ptsD(ring(R - T, -T * 0.4))} strokeWidth={3} strokeDasharray="8 8" opacity={0.5} />
          {Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2, o1 = proj(Math.cos(a) * (R + T), 0, Math.sin(a) * (R + T)), o2 = proj(Math.cos(a) * (R + T), T * 1.2, Math.sin(a) * (R + T)); return <path key={i} d={`M${o1.x} ${o1.y} L${o2.x} ${o2.y}`} strokeWidth={2} opacity={0.6} />; })}
        </g>
        {seats.map(({ i, a }) => {
          const mark = (p.seatMarks ?? []).find((m) => m.seat === i && f >= m.at);
          const back = proj(Math.cos(a) * (R + T * 0.6), T * 1.2, Math.sin(a) * (R + T * 0.6)), seat = proj(Math.cos(a) * R, T * 0.5, Math.sin(a) * R), front = proj(Math.cos(a) * (R - T * 0.7), T * 1.2, Math.sin(a) * (R - T * 0.7));
          const top = proj(Math.cos(a) * (R + T * 0.6), T * 3.2, Math.sin(a) * (R + T * 0.6));
          const bk = clamp01((beltK - i * 2) / 4);
          return (
            <g key={i} opacity={dr}>
              <path d={`M${back.x} ${back.y} L${top.x} ${top.y}`} stroke={LINE} strokeWidth={6} strokeLinecap="round" style={{ filter: LINE_GLOW }} />
              <circle cx={seat.x} cy={seat.y} r={11} fill={mark ? "#FFFFFF" : "#0d1214"} stroke={LINE} strokeWidth={3} style={{ filter: mark ? "drop-shadow(0 0 8px #fff)" : undefined }} />
              {bk > 0 ? <path d={`M${top.x} ${top.y} Q${seat.x} ${seat.y - 10} ${lerp(top.x, front.x, bk)} ${lerp(top.y, front.y, bk)}`} fill="none" stroke={red ? RC.lineRed : "#FFE9A8"} strokeWidth={5} strokeLinecap="round" style={{ filter: red ? `drop-shadow(0 0 7px ${RC.lineRed})` : undefined }} /> : null}
            </g>
          );
        })}
        {p.gauge && f >= p.gauge.at ? (() => {
          const gx = p.gauge.x ?? 760, a = proj(gx, wy, 0, false), b = proj(gx, wy - 160, 0, false), k = EZ.out3((f - p.gauge.at) / 10);
          return (
            <g stroke="#FFE9A8" strokeWidth={3}>
              <path d={`M${a.x} ${a.y} L${lerp(a.x, b.x, k)} ${lerp(a.y, b.y, k)} M${a.x - 14} ${a.y} H${a.x + 14} M${b.x - 14} ${lerp(a.y, b.y, k)} H${b.x + 14}`} />
              <PlanText f={f} at={p.gauge.at + 6} x={a.x + 28} y={(a.y + b.y) / 2} text={p.gauge.label} size={30} anchor="start" colour="#FFE9A8" />
            </g>
          );
        })() : null}
      </svg></PlanCap.Provider>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <MBlur on={fast}>{scene}</MBlur>
      {(p.seatMarks ?? []).map((m, i) => {
        if (!m.label || f < m.at) return null;
        const a = (m.seat / n) * Math.PI * 2 + Math.PI / n, q = proj(Math.cos(a) * (R + T * 2.6), T * 1.2, Math.sin(a) * (R + T * 2.6));
        return <div key={i} style={{ position: "absolute", left: q.x - 200, width: 400, top: q.y - 16, textAlign: "center", fontFamily: FONT.inter, fontWeight: 700, fontSize: capFs("inter", p.labelCap ?? 30), letterSpacing: "0.08em", color: "#F4F6F6", opacity: EZ.out2((f - m.at) / 5), textShadow: "0 2px 6px #000" }}>{m.label}</div>;
      })}
      {p.tag && f >= p.tag.at ? <div style={{ position: "absolute", right: 140, top: 130, padding: "10px 22px", border: `3px solid ${RC.lineRed}`, background: CHIP_TONE.light.fill, fontFamily: FONT.inter, fontWeight: 800, fontSize: capFs("inter", 40), color: CHIP_TONE.light.text, textShadow: CHIP_TONE.light.shadow, opacity: EZ.out2((f - p.tag.at) / 5) }}>{p.tag.text}</div> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const CUTAWAY_DEMO: Cutaway3DProps = {
  radius: 190, tube: 42, seats: 6, tilt: 60, drawAt: 0,
  seatMarks: [{ seat: 0, at: 12 }, { seat: 1, at: 16 }, { seat: 2, at: 20 }, { seat: 3, at: 24 }, { seat: 4, at: 26 }, { seat: 5, at: 28 }],
  beltsAt: 36, beltsRedAt: 118,
  pose0: { x: -380, z: 0 },
  poses: [
    { at: 50, d: 18, x: 120, ease: "in2" },
    { at: 68, d: 12, lift: 170, roll: 24, ease: "out3" },
    { at: 80, d: 10, lift: 0, roll: 8, ease: "in2" },
    { at: 92, d: 22, roll: 180, lift: 40, x: 260, ease: "quick" },
    { at: 114, d: 16, lift: -30, ease: "settle" },
  ],
  water: { at: 0, y: 0, flowFadeAt: 120 },
  rock: { x: 360, z: -40, at: 44, r: 120 },
  gauge: { at: 126, label: "≈ 2 FT", x: -700 },
  tag: { at: 104, text: "≈ 1,700 LB" },
  shakeAt: [68, 90],
};
