// AM01 CordTrace: "Two huge rubber cords run from a steel cage up to two towers." A rider's own 2010 clip of the same ride at Cobra
// (the cage at the top of its flight, both cords stretched to the tower tops) plays a beat and freezes; the sky darkens a little and the
// structure is drawn ON the picture in the channel's white: both cords traced from the cage outward on "cords", a white box closes on the
// cage on "steel cage", and on "two towers" the line carries on down each lattice tower to the frame edge. Slow push throughout.
// Geometry = points on the 960x720 frame of the source (T8gSOc_zIas @ 55.9 s), drawn in the picture's own coordinates so it moves with the push.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];
const LEFT: P[] = [[430, 271], [380, 289], [320, 310], [240, 328], [162, 336]];
const RIGHT: P[] = [[470, 258], [560, 238], [640, 196], [690, 166], [728, 144]];
const TOWER_L: P[] = [[168, 318], [0, 468]];
const TOWER_R: P[] = [[728, 118], [960, 350]];
const CAGE = { x: 418, y: 246, w: 56, h: 40 };
const len = (ps: P[]) => ps.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - ps[i][0], p[1] - ps[i][1]), 0);
const d = (ps: P[]) => ps.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");

export const CordTrace: React.FC<{ src: string; from: number; freeze: number; cordsAt: number; cageAt: number; towersAt: number; top?: number }> = ({ src, from, freeze, cordsAt, cageAt, towersAt, top = -150 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const s = 1.0 + 0.09 * io(f / dur);
  const dim = io(interpolate(f, [freeze, freeze + 14], [0, 1], cl));
  const c = out(interpolate(f, [cordsAt, cordsAt + 22], [0, 1], cl));
  const b = out(interpolate(f, [cageAt, cageAt + 10], [0, 1], cl));
  const t = io(interpolate(f, [towersAt, towersAt + 20], [0, 1], cl));
  const vid = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%" }} />;
  const line = (ps: P[], u: number, key: string, w = 4) => {
    const L = len(ps);
    return <path key={key} d={d(ps)} fill="none" stroke="#fff" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - u)}
      style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,.8))" }} />;
  };
  const g = 1 + 0.6 * (1 - b);
  const cx = CAGE.x + CAGE.w / 2, cy = CAGE.y + CAGE.h / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top, width: 1920, height: 1440, transform: `scale(${s})`, transformOrigin: "46% 32%" }}>
        {f < freeze ? vid : <Freeze frame={freeze}>{vid}</Freeze>}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,4,12,.32)", opacity: dim }} />
        <svg viewBox="0 0 960 720" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {c > 0 && line(LEFT, c, "l")}{c > 0 && line(RIGHT, c, "r")}
          {t > 0 && line(TOWER_L, t, "tl", 3)}{t > 0 && line(TOWER_R, t, "tr", 3)}
          {b > 0 && <rect x={cx - (CAGE.w / 2) * g} y={cy - (CAGE.h / 2) * g} width={CAGE.w * g} height={CAGE.h * g} fill="none" stroke="#fff" strokeWidth={3} opacity={b}
            style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,.8))" }} />}
        </svg>
      </div>
    </AbsoluteFill>
  );
};
