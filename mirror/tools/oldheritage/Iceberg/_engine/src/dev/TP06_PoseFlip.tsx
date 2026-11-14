// TP06 PoseFlip — what "flying" means on this coaster, built on the real picture: the stopped train on the lift is pushed into a white-
// framed close-up (left), and beside it a white line profile of one seat under the track shows the rider being tipped from sitting to
// face-down (the car pivots forward on its word); the inset can instead be a real photo of the ride running (Commons, CC BY-SA), the harness drawn across the back. Profile only; no invented detail beyond the layout.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const PoseFlip: React.FC<{ src: string; from: number; pos: string; zoom: number; tipAt: number; tipLen?: number; still?: string }> = ({ src, from, pos, zoom, tipAt, tipLen = 30, still }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 14], [0, 1], cl)), d = io(f / durationInFrames);
  const tip = io(interpolate(f, [tipAt, tipAt + tipLen], [0, 1], cl));
  // profile: track beam at the top, the seat hangs from a pivot; rider rotates about the hip with the seat (0 = seated, 1 = face-down)
  const PX = 1470, PY = 400, a = 90 * tip; // clockwise: body swings back, face turns to the ground, head leads // car rotation (deg)
  const W = 760, H = 560, X0 = 110, Y0 = (height - H) / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted
        style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(14px) brightness(.4)" }} />
      <div style={{ position: "absolute", left: X0, top: Y0, width: W, height: H, border: "6px solid #fff", overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,.6)",
        opacity: k, transform: `scale(${0.95 + 0.05 * k})` }}>
        {still ? <Img src={staticFile(still)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom * (1 + 0.05 * d)})`, transformOrigin: pos }} />
          : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom * (1 + 0.05 * d)})`, transformOrigin: pos }} />}
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: k, transform: "scale(1.12)", transformOrigin: "1470px 400px", filter: "drop-shadow(0 0 3px rgba(255,255,255,.5)) drop-shadow(0 3px 10px rgba(0,0,0,.8))" }}>
        {/* track beam + the arm down to the car pivot */}
        <line x1={1010} y1={PY - 110} x2={1800} y2={PY - 110} stroke="#fff" strokeWidth={14} strokeLinecap="round" />
        <line x1={PX} y1={PY - 110} x2={PX} y2={PY} stroke="#fff" strokeWidth={8} />
        <circle cx={PX} cy={PY} r={12} fill="#000" stroke="#fff" strokeWidth={5} />
        <g transform={`rotate(${a} ${PX} ${PY})`}>
          {/* seat back + base (hang below the pivot when seated) */}
          <path d={`M${PX - 40} ${PY + 20} L${PX - 40} ${PY + 230} L${PX + 70} ${PY + 230}`} fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
          {/* rider: head, torso, thigh, shin */}
          <circle cx={PX - 10} cy={PY + 52} r={26} fill="none" stroke="#fff" strokeWidth={6} />
          <line x1={PX - 14} y1={PY + 80} x2={PX - 14} y2={PY + 210} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          <line x1={PX - 14} y1={PY + 210} x2={PX + 90} y2={PY + 214} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          <line x1={PX + 90} y1={PY + 214} x2={PX + 96} y2={PY + 330} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          {/* harness over the chest, leg cuffs */}
          <path d={`M${PX - 40} ${PY + 70} Q${PX + 40} ${PY + 100} ${PX + 10} ${PY + 200}`} fill="none" stroke="#E3141B" strokeWidth={9} strokeLinecap="round" />
          <rect x={PX + 76} y={PY + 296} width={40} height={22} fill="none" stroke="#E3141B" strokeWidth={6} />
        </g>
        {/* direction of travel */}
        <path d={`M1620 ${PY - 150} L1760 ${PY - 150}`} stroke="rgba(255,255,255,.7)" strokeWidth={4} markerEnd="url(#tp06arr)" />
        <defs><marker id="tp06arr" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="rgba(255,255,255,.8)" /></marker></defs>
      </svg>
    </AbsoluteFill>
  );
};
