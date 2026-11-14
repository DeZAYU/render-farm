// lookhere / RideTrace (set "midway", Amusement Park "MIDWAY AFTER DARK" signature look-here, REFERENCE_SYNTHESIS §I3 AP-1 + §I4 #1).
// REF Visual Venture E14 @12:52 (line-art outline traced over dimmed real footage) + Farrell FA evidence E1 @IG 2:47.5 (one element per noun)
// + VV §7 colour = meaning @19:26.4 (the meaningful part changes colour) + Dashcam Vol.3 E3 circle draw timing (p = bezier(0.45,0,0.35,1),
// 12-15 f) + Dashcam Vol.1 E6 release @3:03.0 (4 f white flash back to the live clip).
// Our version: the ride's own geometry (polylines in SOURCE px of the 1920x1080 media) draws in the accent over the frozen (or live) REAL
// frame in 12 f (2 f stagger per line); on its word the failing segment pulses white <-> accent twice (2 x 12 f, cosine), then a 4 f white
// flash releases to the live clip. Never on black. Use for "keep your eye on the pylons", the arm / cord / track that fails.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { EZ, FLASH4, H, W, clamp01, envAt, lerp, linPush } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "../../core/kits/labels";
import { mixHex, pickAccent } from "../../core/kits/led";
import { WATERPARK, type Theme } from "../../core/themes";

const DRAW = Easing.bezier(0.45, 0, 0.35, 1);
export type TracePoly = { pts: [number, number][]; closed?: boolean };
export type RideTraceProps = {
  media: string;
  mediaStart?: number;
  push?: number; // linear push / s (DD freeze push 0.4-0.7 %/s)
  outline: TracePoly[]; // the ride's geometry, source px
  fail: TracePoly; // the failing segment (drawn last, pulses on failAt)
  at: number; // trace starts drawing (and the frame freezes unless live)
  failAt: number; // the failing part's word: 2 pulses
  releaseAt?: number; // 4 f white flash, live clip resumes, trace gone
  live?: boolean; // trace over live footage (no freeze); use `track` to follow a moving camera
  track?: TrackKey[]; // offsets the whole trace by (track(f) - track[0])
  dim?: number; // footage brightness under the trace (VV E14 dims the shot)
  stroke?: number; // px on screen (5)
  drawDur?: number; // 12
  theme?: Theme;
  fire?: boolean;
};

const ptsStr = (pts: [number, number][], map: (p: { x: number; y: number }) => { x: number; y: number }, closed?: boolean) => {
  const q = pts.map(([x, y]) => map({ x, y }));
  if (closed && q.length) q.push(q[0]);
  return q.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
};

export const RideTrace: React.FC<RideTraceProps> = ({
  media, mediaStart = 0, push = 0.006, outline, fail, at, failAt, releaseAt, live = false, track, dim = 0.55, stroke = 5, drawDur = 12, theme = WATERPARK, fire,
}) => {
  const f = useCurrentFrame();
  const acc = pickAccent(theme, fire);
  const glow = fire ? "rgba(255,255,255,.5)" : theme.accentGlow;
  const released = releaseAt !== undefined && f >= releaseAt;
  const s = linPush(f, push);
  const t0 = track?.length ? trackAt(track, track[0].f) : null;
  const tc = track?.length ? trackAt(track, f) : null;
  const off = t0 && tc ? { x: tc.x - t0.x, y: tc.y - t0.y } : { x: 0, y: 0 };
  const map = (p: { x: number; y: number }) => scr({ x: p.x + off.x, y: p.y + off.y }, s);
  const dk = EZ.out2((f - at) / drawDur);
  const bright = released ? 1 : lerp(1, dim, dk);
  const all = [...outline, fail];
  // pulse: two cosine cycles white <-> accent over 24 f from failAt
  const kp = f - failAt;
  const pw = kp >= 0 && kp < 24 ? 0.5 - 0.5 * Math.cos((2 * Math.PI * kp) / 12) : 0;
  const failCol = pw > 0 ? mixHex(acc, "#FFFFFF", pw) : acc;
  const fl = releaseAt === undefined ? 0 : envAt(FLASH4, f - releaseAt);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <FootPlate src={media} startFrom={mediaStart} push={push} freezeAt={live ? undefined : at} resumeAt={live ? undefined : releaseAt}
        filter={bright < 0.999 ? `brightness(${bright.toFixed(3)}) saturate(${lerp(1, 0.8, dk).toFixed(3)})` : undefined}>
        {!released && f >= at ? (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {all.map((poly, i) => {
              const isFail = i === all.length - 1;
              const p = DRAW(clamp01((f - at - 2 * i) / drawDur));
              if (p <= 0) return null;
              const d = ptsStr(poly.pts, map, poly.closed);
              const col = isFail ? failCol : acc;
              const sw = isFail ? stroke * (1 + 0.5 * pw) + (kp >= 0 ? 1 : 0) : stroke;
              const dash = `${p.toFixed(4)} 2`;
              return (
                <g key={i}>
                  <polyline points={d} pathLength={1} fill="none" stroke="rgba(20,0,10,.5)" strokeWidth={sw + 5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={dash} style={{ filter: "blur(2px)" }} />
                  <polyline points={d} pathLength={1} fill="none" stroke={col} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={dash}
                    style={{ filter: `drop-shadow(0 0 4px ${isFail && pw > 0.5 ? "rgba(255,255,255,.8)" : glow}) drop-shadow(0 0 14px ${glow})` }} />
                </g>
              );
            })}
          </svg>
        ) : null}
      </FootPlate>
      {fl > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: fl }} /> : null}
    </AbsoluteFill>
  );
};
