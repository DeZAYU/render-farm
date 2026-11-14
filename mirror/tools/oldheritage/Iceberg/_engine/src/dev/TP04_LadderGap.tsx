// TP04 LadderGap — true-scale elevation drawn over the case's own darkened footage: the 52 m ride arm with its gondola at 50 m, a 16-storey
// block of flats rising beside it floor by floor, the fire brigade's 30 m ladder leaning on the block's wall (wall + window lit on their words),
// then the block fades, the ladder slides across to the arm, and the 20 m nobody can reach is bracketed in red.
// Channel look only: white 4-6 px lines, RedLabel (ArchivoBlk), no other fonts or colours. Times are frames inside the shot.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const LadderGap: React.FC<{
  bg: string; bgFrom: number;
  tStorey: number; tLadder: number; tWall: number; tWindow: number; tArm: number; tGap: number;
}> = ({ bg, bgFrom, tStorey, tLadder, tWall, tWindow, tArm, tGap }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const G = 940, M = 15; // ground y, px per metre
  const y = (m: number) => G - m * M;
  const AX = 1180, BX0 = 600, BX1 = 930, FLOOR = 50 / 16;
  const k = (a: number, len = 14) => out(interpolate(f, [a, a + len], [0, 1], cl));
  const plate = interpolate(f, [0, 10], [0, 1], cl);
  // camera: slow push, then a drift toward the arm for the gap
  const z = 1.0 + 0.05 * io(f / durationInFrames);
  const cx = interpolate(io(interpolate(f, [tArm - 6, tArm + 22], [0, 1], cl)), [0, 1], [0, -120]);
  // the building rises floor by floor from 6 f to tStorey + 6
  const floors = Math.round(16 * io(interpolate(f, [6, tStorey + 4], [0, 1], cl)));
  const bOut = 1 - io(interpolate(f, [tArm, tArm + 16], [0, 1], cl));
  // ladder: leaning on the block's wall, then slides to the arm
  const lk = k(tLadder, 20), mv = io(interpolate(f, [tArm + 4, tArm + 28], [0, 1], cl));
  const lx0 = interpolate(mv, [0, 1], [BX1 + 120, AX + 120]), lx1 = interpolate(mv, [0, 1], [BX1 + 6, AX + 14]);
  const lTop = y(30), lyEnd = G + (lTop - G) * lk, lxEnd = lx0 + (lx1 - lx0) * lk;
  const rungs = 18;
  const wall = k(tWall, 10) * bOut, win = k(tWindow, 10) * bOut, gap = io(interpolate(f, [tGap, tGap + 18], [0, 1], cl));
  const arm = k(2, 18);
  const ticks = [0, 10, 20, 30, 40, 50];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(9px) brightness(.32) saturate(.7)" }} />
      <AbsoluteFill style={{ opacity: plate, transform: `translateX(${cx}px) scale(${z})`, transformOrigin: "62% 55%" }}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,.8))" }}>
            {/* ground */}
            <line x1={300} y1={G} x2={1640} y2={G} stroke="rgba(255,255,255,.8)" strokeWidth={4} />
            {/* the block of flats, floor by floor */}
            <g opacity={bOut}>
              {Array.from({ length: floors }, (_, i) => (
                <g key={i}>
                  <rect x={BX0} y={y((i + 1) * FLOOR)} width={BX1 - BX0} height={FLOOR * M} fill="rgba(10,10,10,.35)" stroke="#fff" strokeWidth={2.5} />
                  {[0, 1, 2, 3, 4].map((w) => <rect key={w} x={BX0 + 22 + w * 62} y={y((i + 1) * FLOOR) + 10} width={36} height={FLOOR * M - 20} fill="none" stroke="rgba(255,255,255,.45)" strokeWidth={1.5} />)}
                </g>
              ))}
              {/* the wall the ladder leans on, and the window at its top */}
              <line x1={BX1} y1={G} x2={BX1} y2={y(50)} stroke="#fff" strokeWidth={4 + 6 * wall} opacity={0.4 + 0.6 * wall} />
              <rect x={BX0 + 22 + 4 * 62} y={y(10 * FLOOR) + 10} width={36} height={FLOOR * M - 20} fill={`rgba(255,215,150,${0.85 * win})`} stroke="#fff" strokeWidth={2 + 2 * win} />
            </g>
            {/* the ride arm, LED-lit, gondola ring at the top */}
            <g opacity={arm}>
              <line x1={AX} y1={G} x2={AX} y2={G - (G - y(50)) * arm} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
              <line x1={AX} y1={G} x2={AX} y2={G - (G - y(50)) * arm} stroke="rgba(255,255,255,.35)" strokeWidth={26} strokeLinecap="round" style={{ filter: "blur(6px)" }} />
              {arm > 0.95 && <g><ellipse cx={AX} cy={y(50) - 6} rx={58} ry={16} fill="none" stroke="#fff" strokeWidth={5} />
                {Array.from({ length: 8 }, (_, i) => <rect key={i} x={AX - 50 + i * 13} y={y(50) - 34} width={9} height={18} fill="#fff" opacity={0.85} />)}</g>}
            </g>
            {/* height ruler */}
            <g opacity={arm}>
              <line x1={1400} y1={G} x2={1400} y2={y(50)} stroke="rgba(255,255,255,.75)" strokeWidth={3} />
              {ticks.map((m) => <g key={m}><line x1={1388} y1={y(m)} x2={1412} y2={y(m)} stroke="#fff" strokeWidth={3} />
                <text x={1430} y={y(m) + 10} fill="#fff" fontFamily="ArchivoBlk, Archivo" fontWeight={900} fontSize={30}>{m} M</text></g>)}
            </g>
            {/* the ladder */}
            {lk > 0 && <g>
              {[-9, 9].map((o) => <line key={o} x1={lx0 + o} y1={G} x2={lxEnd + o} y2={lyEnd} stroke="#fff" strokeWidth={4} strokeLinecap="round" />)}
              {Array.from({ length: rungs }, (_, i) => { const u = (i + 1) / (rungs + 1); if (u > lk) return null;
                const xx = lx0 + (lx1 - lx0) * u, yy = G + (lTop - G) * u; return <line key={i} x1={xx - 9} y1={yy} x2={xx + 9} y2={yy} stroke="#fff" strokeWidth={2.5} />; })}
            </g>}
            {/* the gap: 30 m to 50 m, nothing to lean on */}
            {gap > 0 && <g>
              <line x1={AX + 70} y1={y(30)} x2={AX + 70} y2={y(30) + (y(50) - y(30)) * gap} stroke={RED} strokeWidth={6} />
              <line x1={AX + 52} y1={y(30)} x2={AX + 88} y2={y(30)} stroke={RED} strokeWidth={6} />
              {gap > 0.98 && <line x1={AX + 52} y1={y(50)} x2={AX + 88} y2={y(50)} stroke={RED} strokeWidth={6} />}
              <rect x={AX - 34} y={y(50)} width={68} height={(y(30) - y(50)) * gap} fill="rgba(227,20,27,.16)" />
            </g>}
          </g>
        </svg>
        <RedLabel text="16 STOREYS" at={tStorey} hold={tArm - tStorey - 4} x={(BX0 + BX1) / 2 / width} y={(y(50) - 50) / height} size={38} />
        <RedLabel text="LADDER 30 M" at={tLadder + 14} hold={tArm - tLadder - 18} x={(BX1 + 150) / width} y={(y(30) - 10) / height} size={34} />
        <RedLabel text="20 M" at={tGap + 16} x={(AX + 150) / width} y={y(40) / height} size={44} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
