// TP17 ChainDog: why a lift hill is "the right place to stop one". Left: the real Big One lift chain in its trough beside the stairs
// (a rider's own clip, white frame). Right: a white-line section of one car on the incline: the chain dog under the car rides the moving
// chain; the chain stops (holds); the car eases back a few inches and the anti-rollback pawl drops into the next tooth of the rack (red).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const ChainDog: React.FC<{ src: string; from: number; pos?: string; stopAt: number; slipAt: number; chainLabelAt: number; pawlLabelAt: number }> = ({ src, from, pos = "80% 45%", stopAt, slipAt, chainLabelAt, pawlLabelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const enter = out(interpolate(f, [0, 12], [0, 1], cl)), d = io(f / durationInFrames);
  // car travel along the track (local px): runs with the chain, eases to a stop, then slips back 14 px into the tooth
  const v = 3.2; const run = (t: number) => (t < stopAt - 8 ? t * v : (stopAt - 8) * v + v * 8 * io(Math.min(1, (t - stopAt + 8) / 12)));
  const slip = 14 * io(interpolate(f, [slipAt, slipAt + 7], [0, 1], cl));
  const cx = -40 + run(f) - slip;
  const chainX = run(f); // chain links move with the car while it runs, then stop
  const TOOTH = 34;
  // pawl: rides up each tooth ramp, drops at its edge; after the slip it sits locked in a tooth
  const pawlBase = cx - 70;
  const ph = (((pawlBase % TOOTH) + TOOTH) % TOOTH) / TOOTH; const lift = f >= slipAt + 7 ? 0 : ph * 12;
  const caught = interpolate(f, [slipAt + 7, slipAt + 10, slipAt + 34], [0, 1, 0.5], cl);
  const W = 860, H = 620, PX = 70, PY = (height - H) / 2 - 10;
  const ox = 1420, oy = 560; // diagram centre
  const ang = -30, K = 1.3, ca = Math.cos(Math.PI / 6), sa = Math.sin(Math.PI / 6);
  const scr = (x: number, y: number) => [ox + K * (x * ca + y * sa), oy + K * (-x * sa + y * ca)] as const;
  const [px, py] = scr(pawlBase, 30 - lift), [chx, chy] = scr(-250, 82);
  const lc = out(interpolate(f, [chainLabelAt, chainLabelAt + 10], [0, 1], cl)), lp = out(interpolate(f, [pawlLabelAt, pawlLabelAt + 10], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(18px) brightness(.32) saturate(.6)", transform: `scale(${1.05 + 0.03 * d})` }} />
      <div style={{ position: "absolute", left: PX, top: PY, width: W, height: H, border: "6px solid #fff", boxShadow: "0 18px 50px rgba(0,0,0,.6)", overflow: "hidden", opacity: enter, transform: `scale(${0.95 + 0.05 * enter})` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1.25 + 0.08 * d})`, transformOrigin: pos }} />
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: enter }}>
        <g transform={`translate(${ox} ${oy}) scale(1.3) rotate(${ang})`}>
          {/* rail */}
          <line x1={-420} y1={0} x2={420} y2={0} stroke="#fff" strokeWidth={6} />
          {/* anti-rollback rack: teeth ramp up the hill, vertical face downhill */}
          <path d={Array.from({ length: 25 }, (_, i) => { const x = -420 + i * TOOTH; return `${i === 0 ? "M" : "L"} ${x} 44 L ${x + TOOTH} 30 L ${x + TOOTH} 44`; }).join(" ")} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={3} />
          <line x1={-420} y1={46} x2={420} y2={46} stroke="rgba(255,255,255,.5)" strokeWidth={2} />
          {/* chain: links in a trough under the rack */}
          {Array.from({ length: 30 }, (_, i) => { const x = -440 + ((i * 30 + chainX) % 900); return <ellipse key={i} cx={x} cy={82} rx={13} ry={6} fill="none" stroke="#fff" strokeWidth={3} />; })}
          <line x1={-420} y1={98} x2={420} y2={98} stroke="rgba(255,255,255,.35)" strokeWidth={2} />
          {/* car */}
          <rect x={cx - 120} y={-118} width={240} height={86} fill="rgba(0,0,0,.55)" stroke="#fff" strokeWidth={4} />
          <rect x={cx - 100} y={-150} width={60} height={34} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={3} />
          <rect x={cx + 10} y={-150} width={60} height={34} fill="none" stroke="rgba(255,255,255,.6)" strokeWidth={3} />
          {[-80, 80].map((k) => <circle key={k} cx={cx + k} cy={-14} r={13} fill="#000" stroke="#fff" strokeWidth={4} />)}
          {/* chain dog: hook from the car down onto the chain */}
          <path d={`M ${cx + 50} -32 L ${cx + 50} 60 L ${cx + 66} 74`} fill="none" stroke="#fff" strokeWidth={6} strokeLinejoin="round" />
          {/* anti-rollback pawl: hangs from the car, rides the teeth */}
          <line x1={pawlBase + 22} y1={-32} x2={pawlBase} y2={34 - lift} stroke={caught > 0 ? RED : "#fff"} strokeWidth={7} strokeLinecap="round" />
        </g>
        {/* leaders from the part names to the parts */}
        <line x1={1080} y1={940} x2={chx} y2={chy + 14} stroke="rgba(255,255,255,.8)" strokeWidth={2} opacity={lc} />
        <line x1={1560} y1={780} x2={px} y2={py} stroke="rgba(255,255,255,.8)" strokeWidth={2} opacity={lp} />
      </svg>
      <RedLabel text="LIFT CHAIN" at={chainLabelAt} x={1080 / 1920} y={965 / 1080} size={32} />
      <RedLabel text="ANTI-ROLLBACK" at={pawlLabelAt} x={1560 / 1920} y={800 / 1080} size={32} />
    </AbsoluteFill>
  );
};
