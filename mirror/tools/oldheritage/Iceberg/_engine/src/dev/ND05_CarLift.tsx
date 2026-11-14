// ND05 CarLift — the NWS rule of thumb as a measured side view: a white line drawing of a small car (to scale: 1.45 m tall, 4.3 m long)
// over a dark copy of the street footage; moving water rises to a 30 cm bracket, the tyres leave the road, and the car is carried off
// sideways with the current ("Once a car floats, the brakes and the steering stop mattering").
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), inn = Easing.bezier(0.55, 0, 0.85, 0.35);

export const CarLift: React.FC<{ bg: string; bgFrom: number; riseAt: number; riseLen: number; floatAt: number; driftAt: number; label?: string }> = ({ bg, bgFrom, riseAt, riseLen, floatAt, driftAt, label = "30 CM" }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const PXM = 230;                                   // px per metre
  const road = H * 0.78, cx0 = W * 0.46;
  const water = 0.3 * io(interpolate(f, [riseAt, riseAt + riseLen], [0, 1], cl)) + 0.04 * io(interpolate(f, [floatAt, floatAt + 30], [0, 1], cl));
  const lift = 0.09 * io(interpolate(f, [floatAt, floatAt + 26], [0, 1], cl));          // tyres off the road
  const drift = inn(interpolate(f, [driftAt, driftAt + 90], [0, 1], cl));
  const dx = drift * 700, rot = -4 * drift + Math.sin(f * 0.12) * 1.2 * (lift / 0.09);
  const appear = interpolate(f, [0, 12], [0, 1], cl);
  const m = (v: number) => v * PXM;
  // car profile in metres (x from the rear bumper, y up from the road)
  const body: [number, number][] = [[0, 0.35], [0, 0.78], [0.25, 0.95], [1.05, 1.02], [1.55, 1.42], [2.85, 1.45], [3.45, 1.0], [4.15, 0.88], [4.3, 0.7], [4.3, 0.35]];
  const bodyD = "M" + body.map(([x, y]) => `${m(x)} ${-m(y)}`).join(" L");
  const wy = -m(0.31), wr = m(0.31);
  const wave = Array.from({ length: 33 }, (_, i) => `${(i / 32) * W} ${road - m(water) + Math.sin(i * 0.8 - f * 0.35) * 6}`).join(" L");
  const bx = cx0 - m(2.15) - 70;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(10px) brightness(.3) saturate(.7)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: appear }}>
        <line x1={0} y1={road} x2={W} y2={road} stroke="rgba(255,255,255,.55)" strokeWidth={4} />
        <g transform={`translate(${cx0 - m(2.15) + dx} ${road - m(lift)}) rotate(${rot} ${m(2.15)} ${-m(0.5)})`}>
          <path d={bodyD} fill="rgba(0,0,0,.35)" stroke="#fff" strokeWidth={6} strokeLinejoin="round" />
          <path d={`M${m(1.2)} ${-m(1.02)} L${m(1.62)} ${-m(1.36)} L${m(2.8)} ${-m(1.38)} L${m(3.25)} ${-m(1.0)} Z`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.8} />
          {[0.8, 3.4].map((x) => <g key={x}><circle cx={m(x)} cy={wy} r={wr} fill="#000" stroke="#fff" strokeWidth={6} /><circle cx={m(x)} cy={wy} r={wr * 0.45} fill="none" stroke="#fff" strokeWidth={3} /></g>)}
        </g>
        {/* moving water: a moving surface line over a brown, translucent body */}
        <path d={`M0 ${H} L${wave} L${W} ${H} Z`} fill="rgba(150,105,60,.62)" />
        <path d={`M${wave}`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.9} />
        {/* the 30 cm bracket at the front of the car */}
        <g stroke="#fff" strokeWidth={5} opacity={interpolate(f, [riseAt + riseLen - 10, riseAt + riseLen], [0, 1], cl) * (1 - drift)}>
          <line x1={bx} y1={road} x2={bx} y2={road - m(0.3)} /><line x1={bx - 16} y1={road} x2={bx + 16} y2={road} /><line x1={bx - 16} y1={road - m(0.3)} x2={bx + 16} y2={road - m(0.3)} />
        </g>
      </svg>
      <RedLabel text={label} at={riseAt + riseLen - 4} hold={driftAt - riseAt - riseLen} x={(bx - 120) / W} y={(road - m(0.15)) / H} size={46} />
    </AbsoluteFill>
  );
};
