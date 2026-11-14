// ND16 device: why a failed sliding door can take the roof. A white line section of a one-storey Keys house drawn over the case's own
// darkened glass-door footage: the door pane gives -> wind streams in through the gap -> the inside fills (pressure, red) and pushes
// out on every wall and up on the ceiling -> the roof lifts off from underneath. Beats are frame props so they land on the VO words.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const PressureSection: React.FC<{ bg: string; bgFrom: number; failAt: number; windAt: number; pressAt: number; roofAt: number }> = ({ bg, bgFrom, failAt, windAt, pressAt, roofAt }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const k = out(interpolate(f, [0, 14], [0, 1], cl));
  // house geometry (screen px)
  const X0 = 700, X1 = 1500, FL = 800, WT = 520, RIDGE = 330, RX = (X0 + X1) / 2;
  const doorTop = 600; // sliding door in the left (sea-side) wall: FL..doorTop
  const fail = io(interpolate(f, [failAt, failAt + 10], [0, 1], cl));
  const wind = interpolate(f, [windAt, windAt + 30], [0, 1], cl);
  const press = io(interpolate(f, [pressAt, pressAt + 30], [0, 1], cl));
  const roof = io(interpolate(f, [roofAt, roofAt + 46], [0, 1], cl));
  const lift = roof * 150, rot = roof * -7;
  // outside streamlines (from the sea side, left), some turn in through the open door once it has failed
  const st = { fill: "none", stroke: "#fff", strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(7px) brightness(.32) saturate(.6)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: k }}>
        <defs>
          <clipPath id="nd16in"><polygon points={`${X0 + 3},${FL - 3} ${X0 + 3},${WT} ${X1 - 3},${WT} ${X1 - 3},${FL - 3}`} /></clipPath>
          <marker id="nd16ar" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#fff" /></marker>
          <marker id="nd16arR" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={RED} /></marker>
        </defs>
        {/* ground + sea line */}
        <line x1={120} y1={FL} x2={1800} y2={FL} stroke="rgba(255,255,255,.55)" strokeWidth={3} />
        {/* pressure fill inside */}
        <rect x={X0} y={WT} width={X1 - X0} height={FL - WT} fill={RED} opacity={0.24 * press} clipPath="url(#nd16in)" />
        {/* walls */}
        <polyline points={`${X0},${doorTop} ${X0},${WT}`} {...st} />
        <polyline points={`${X1},${FL} ${X1},${WT}`} {...st} />
        {/* the sliding door: a glass pane in the frame, it gives and falls in */}
        <line x1={X0} y1={FL} x2={X0} y2={doorTop} stroke="rgba(255,255,255,.5)" strokeWidth={2} />
        <g transform={`translate(${X0 + fail * 60}, ${FL}) rotate(${fail * 74})`} opacity={1 - fail * 0.55}>
          <rect x={-6} y={-(FL - doorTop)} width={12} height={FL - doorTop} fill="rgba(200,230,255,.35)" stroke="#fff" strokeWidth={3} />
        </g>
        {/* ceiling line (the roof's underside) */}
        <g transform={`translate(0, ${-lift}) rotate(${rot}, ${X1}, ${WT})`}>
          <polyline points={`${X0 - 40},${WT + 6} ${RX},${RIDGE} ${X1 + 40},${WT + 6}`} {...st} strokeWidth={6} />
          <line x1={X0 - 10} y1={WT} x2={X1 + 10} y2={WT} stroke="#fff" strokeWidth={4} />
        </g>
        {/* wind from the sea side (left): lanes of moving arrows. Over the roof they ride up and over; at wall height they stop at the
            wall until the door fails, then they pour in through the opening and curl up under the ceiling */}
        {[300, 380, 460].map((y, i) => [0, 1, 2].map((j) => { const ph = ((f * 0.012 + j / 3 + i * 0.17) % 1); const x = 100 + ph * 1600;
          const lift = x > X0 - 120 && x < X1 + 60 ? -Math.sin(Math.PI * (x - X0 + 120) / (X1 - X0 + 180)) * 70 : 0; const o = interpolate(ph, [0, 0.08, 0.9, 1], [0, 0.85, 0.85, 0]);
          return <line key={`t${i}${j}`} x1={x} y1={y + lift} x2={x + 110} y2={y + lift - (lift < 0 && x < RX ? 18 : 0)} stroke="#fff" strokeWidth={5} opacity={o} markerEnd="url(#nd16ar)" />; }))}
        {[640, 700, 760].map((y, i) => [0, 1].map((j) => { const ph = ((f * 0.014 + j / 2 + i * 0.23) % 1);
          if (fail < 0.5) { const x = 120 + ph * (X0 - 260); return <line key={`w${i}${j}`} x1={x} y1={y} x2={x + 110} y2={y} stroke="#fff" strokeWidth={5} opacity={interpolate(ph, [0, 0.1, 0.85, 1], [0, 0.85, 0.85, 0])} markerEnd="url(#nd16ar)" />; }
          const x = 120 + ph * 820; const inside = Math.max(0, x - X0); const yy = y - Math.min(1, inside / 380) * (y - WT - 50);
          return <path key={`w${i}${j}`} d={`M${x - 120},${y} Q${x - 30},${y} ${x},${yy}`} fill="none" stroke="#fff" strokeWidth={5} opacity={interpolate(ph, [0, 0.08, 0.88, 1], [0, 0.9, 0.9, 0]) * Math.min(1, 0.3 + wind)} markerEnd="url(#nd16ar)" />; }))}
        {/* pressure pushing out: arrows normal to the right wall and up on the ceiling */}
        {press > 0.02 && [0, 1, 2].map((i) => { const y = WT + 70 + i * 80; const g = press * (0.8 + 0.2 * Math.sin(f / 4 + i)); return <line key={"w" + i} x1={X1 - 70} y1={y} x2={X1 - 70 + 55 * g} y2={y} stroke={RED} strokeWidth={6} markerEnd="url(#nd16arR)" />; })}
        {press > 0.02 && [0, 1, 2, 3, 4].map((i) => { const x = X0 + 120 + i * 140; const g = press * (0.8 + 0.2 * Math.sin(f / 4 + i)); return <line key={"c" + i} x1={x} y1={WT + 80 - lift * 0.4} x2={x} y2={WT + 80 - 60 * g - lift * 0.4} stroke={RED} strokeWidth={6} markerEnd="url(#nd16arR)" />; })}
        {/* roof going: upward wind arrows over it */}
        {roof > 0.05 && [0, 1, 2].map((i) => <line key={"r" + i} x1={RX - 200 + i * 200} y1={RIDGE - lift - 20} x2={RX - 200 + i * 200 + 20} y2={RIDGE - lift - 20 - 80 * roof} stroke="#fff" strokeWidth={4} opacity={roof} markerEnd="url(#nd16ar)" />)}
      </svg>
    </AbsoluteFill>
  );
};
