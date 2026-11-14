// TP17 HillStops: The Big One's lift hill as a side profile drawn to scale (214 ft climb, ~30 deg, run ~370 ft; the crest and first drop
// after it), the emergency stair line stepping up beside the track, and the walk-down stops marked where each train halted:
// 23 Apr 2023 a little over halfway (u 0.55), 11 Apr 2023 just feet from the top (u 0.97), April 2021 reported near the top (u 0.9).
// Modes per pass: a train glides up and stops at a mark; past stops stay as red bars; `walkAt` sends the riders' walk down the stairs
// (white dots stepping down the stair line to the ground) from every stop at once. Over the darkened real footage.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

// geometry (px): 1 ft = 2.55 px. Lift: 214 ft up over ~370 ft run.
const FT = 2.55, GROUND = 900, X0 = 330, RISE = 214 * FT, RUN = 370 * FT;
const P = (u: number) => [X0 + u * RUN, GROUND - u * RISE] as const;
const ANG = Math.atan2(RISE, RUN); // rad
const NX = Math.sin(ANG), NY = Math.cos(ANG); // unit normal pointing down-right of the track (below it)
const CREST: [number, number] = [X0 + RUN, GROUND - RISE];

export type Stop = { u: number; label: string; lx: number; ly: number; at: number; glide?: [number, number]; bar?: boolean; num?: string };

export const HillStops: React.FC<{ bg: string; bgFrom?: number; draw?: [number, number]; stops: Stop[]; bracketAt?: number; walkAt?: number; hillAt?: number }> = ({ bg, bgFrom = 0, draw, stops, bracketAt = -1, walkAt = -1, hillAt = -1 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const d = draw ? io(interpolate(f, draw, [0, 1], cl)) : 1;
  const z = 1 + 0.035 * io(f / durationInFrames);
  // track path: ground run-in, lift, rounded crest, first drop (~65 deg) into the valley, pull-out
  const [cx, cy] = CREST;
  const track = `M ${X0 - 170} ${GROUND} L ${X0} ${GROUND} L ${cx - 30} ${cy + 30 * RISE / RUN} Q ${cx + 20} ${cy - 10} ${cx + 62} ${cy + 26} L ${cx + 250} ${GROUND - 40} Q ${cx + 285} ${GROUND + 6} ${cx + 360} ${GROUND - 10} L ${cx + 520} ${GROUND - 60}`;
  // stairs: a stepped line 22 px below the track, one tread every 8 steps drawn (the real flight is 400+ steps)
  const SN = 54, so = 22;
  let stairs = ""; for (let i = 0; i <= SN; i++) { const u0 = i / SN, u1 = (i + 1) / SN; const [ax, ay] = P(u0), [bx, by] = P(Math.min(1, u1));
    const sx = ax + NX * so, sy = ay + NY * so, tx = bx + NX * so, ty = by + NY * so;
    stairs += (i === 0 ? `M ${sx} ${sy}` : "") + (i < SN ? ` L ${sx} ${ty} L ${tx} ${ty}` : ""); }
  const hl = hillAt >= 0 ? interpolate(f, [hillAt, hillAt + 10, hillAt + 40], [0, 1, 0.35], cl) : 0;
  const bm = bracketAt >= 0 ? out(interpolate(f, [bracketAt, bracketAt + 18], [0, 1], cl)) : 0;
  const BX = X0 - 120;
  const walk = walkAt >= 0 ? f - walkAt : -1;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(12px) brightness(.28) saturate(.5)", transform: `scale(${1.04 + 0.04 * io(f / durationInFrames)})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "40% 60%" }}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {/* ground */}
          <line x1={120} y1={GROUND} x2={1820} y2={GROUND} stroke="rgba(255,255,255,.5)" strokeWidth={3} strokeDasharray={`${1700 * d} 4000`} />
          {/* support columns under the lift, to scale every ~40 ft */}
          {Array.from({ length: 9 }, (_, i) => { const u = (i + 1) / 10; const [x, y] = P(u); return <line key={i} x1={x} y1={y + 6} x2={x} y2={GROUND} stroke="rgba(255,255,255,.22)" strokeWidth={2} opacity={d} />; })}
          {/* stairs beside the track */}
          <path d={stairs} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth={2} strokeDasharray={`${2600 * d} 9000`} />
          {/* track */}
          <path d={track} fill="none" stroke="#fff" strokeWidth={5 + 3 * hl} strokeLinejoin="round" strokeDasharray={`${2400 * d} 9000`} style={{ filter: hl > 0 ? `drop-shadow(0 0 ${10 * hl}px rgba(255,255,255,.8))` : undefined }} />
          {/* height bracket, ground -> crest */}
          {bm > 0 && <g opacity={bm}>
            <line x1={BX} y1={GROUND} x2={BX} y2={GROUND - (GROUND - cy) * bm} stroke="#fff" strokeWidth={5} />
            <line x1={BX - 16} y1={GROUND} x2={BX + 16} y2={GROUND} stroke="#fff" strokeWidth={5} />
            {bm > 0.98 && <line x1={BX - 16} y1={cy} x2={BX + 16} y2={cy} stroke="#fff" strokeWidth={5} />}
            <line x1={BX + 22} y1={cy} x2={cx - 40} y2={cy} stroke="rgba(255,255,255,.45)" strokeWidth={2} strokeDasharray="8 10" />
          </g>}
          {/* stops */}
          {stops.map((s, i) => {
            if (f < s.at) return null;
            const g = out(interpolate(f, [s.at, s.at + 10], [0, 1], cl));
            const uu = s.glide ? s.u * io(interpolate(f, s.glide, [0, 1], cl)) : s.u;
            const [x, y] = P(uu);
            if (s.bar) {
              return <g key={i} opacity={g}>
                <line x1={x - NX * 30} y1={y - NY * 30} x2={x + NX * 40} y2={y + NY * 40} stroke={RED} strokeWidth={10} />
                <line x1={x - NX * 30} y1={y - NY * 30} x2={x + NX * 40} y2={y + NY * 40} stroke="#fff" strokeWidth={2} />
              </g>;
            }
            // a 5-car train (~50 ft) whose front is at uu, sat on the track
            const L = 50 * FT, cars = 5, gap = 4, cw = (L - gap * (cars - 1)) / cars;
            const deg = -ANG * 180 / Math.PI;
            return <g key={i} opacity={g} transform={`translate(${x} ${y}) rotate(${deg})`}>
              {Array.from({ length: cars }, (_, k) => <rect key={k} x={-L + k * (cw + gap)} y={-20} width={cw} height={16} fill={RED} stroke="#fff" strokeWidth={2.5} />)}
            </g>;
          })}
          {/* walk-down: dots stepping down the stair line from every stop to the ground */}
          {walk >= 0 && stops.map((s, i) => {
            const len = 70; // frames for the walk
            return Array.from({ length: 7 }, (_, k) => {
              const t = interpolate(walk - k * 6, [0, len], [0, 1], cl); if (walk - k * 6 < 0) return null;
              const u = s.u * (1 - io(t)); const [x, y] = P(u);
              return <circle key={i + "w" + k} cx={x + NX * so} cy={y + NY * so - 6} r={6} fill="#fff" opacity={0.95 - k * 0.1} />;
            });
          })}
        </svg>
      </AbsoluteFill>
      {stops.map((s, i) => <RedLabel key={i} text={s.label} at={s.at + 6} x={s.lx} y={s.ly} size={34} />)}
      {bracketAt >= 0 && <RedLabel text="214 FT" at={bracketAt + 14} x={(BX + 110) / width} y={((GROUND + cy) / 2) / height} size={40} />}
    </AbsoluteFill>
  );
};
