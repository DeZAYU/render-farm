// stat / StuckClock (set "midway", Amusement Park "MIDWAY AFTER DARK" stranded-ride timer, REFERENCE_SYNTHESIS §I3 AP-1 + §I4 #4).
// REF Farrell FA F3b counter @GoFundMe 4:08.2 (counter rolls in 17 f ease-out, holds, flips colour in ONE frame) + Dashcam Vol.1 E4
// "40 minutes" @0:15.6 (the elapsed time is written while the VO says it, 2 f / char).
// Our version: an elapsed-time readout in the LED kit (same dot-matrix as caseopener/LedMarquee) ANCHORED to the stranded car in the footage
// (tracked keys, source px; a leader draws down to the car). It runs through `time` keys (frame -> story seconds, piecewise linear: jump-scale
// time by spacing the keys) while the VO covers the hours, stops on the last key, and flips neutral -> accent in 1 f on `flipAt` ("rescued").
// FIX 2026-10-19 (review #6): digits + caption sit on a real dark LED sign board (80 %, kit LedBoard) instead of a radial smudge; white lamps,
// accent only on the flip; caption Oswald 600 caps >= 36 px cap inside the board.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, W, clamp01, lerp, linPush, measure } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "../../core/kits/labels";
import { LedBoard, LedText, fsFace, ledSize, pad2, pickAccent } from "../../core/kits/led";
import { WATERPARK, type Theme } from "../../core/themes";

export type ClockKey = { f: number; v: number }; // local frame -> story seconds
export type StuckClockProps = {
  media: string;
  mediaStart?: number;
  push?: number;
  track: TrackKey[]; // the stranded car, source px
  dy?: number; // readout centre above the car (screen px, negative = up)
  at: number; // readout appears (roll-in 17 f)
  time: ClockKey[]; // e.g. [{f:0,v:0},{f:90,v:5400}] = 1 h 30 in 3 s
  format?: "mm:ss" | "h:mm" | "h:mm:ss";
  flipAt?: number; // 1 f colour flip to the accent ("rescued")
  caption?: string; // Oswald 600 caps on the board under the digits ("stranded")
  flipCaption?: string; // replaces the caption on the flip, accent ("rescued")
  capCap?: number; // caption cap height (36)
  board?: number; // LED board plate opacity (0.8)
  outAt?: number; // 8 f fade out
  cell?: number; // LED cell px (16)
  theme?: Theme;
  fire?: boolean;
};

const valueAt = (keys: ClockKey[], f: number) => {
  if (!keys.length) return 0;
  if (f <= keys[0].f) return keys[0].v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) return lerp(a.v, b.v, (f - a.f) / Math.max(1e-6, b.f - a.f));
  }
  return keys[keys.length - 1].v;
};
const fmt = (sec: number, format: StuckClockProps["format"]) => {
  const t = Math.max(0, Math.floor(sec));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  if (format === "h:mm") return `${h}:${pad2(m)}`;
  if (format === "h:mm:ss") return `${h}:${pad2(m)}:${pad2(s)}`;
  return `${pad2(Math.floor(t / 60))}:${pad2(s)}`;
};

export const StuckClock: React.FC<StuckClockProps> = ({
  media, mediaStart = 0, push = 0.02, track, dy = -270, at, time, format = "mm:ss", flipAt, caption, flipCaption, outAt, cell = 16, capCap = 36, board = 0.8, theme = WATERPARK, fire,
}) => {
  const f = useCurrentFrame();
  const k = f - at;
  const acc = pickAccent(theme, fire);
  const flipped = flipAt !== undefined && f >= flipAt;
  const s = linPush(f, push);
  const car = scr(trackAt(track, f), s);
  const ex = outAt === undefined ? 0 : EZ.in2((f - outAt) / 8);
  const o = k < 0 ? 0 : EZ.out2(k / 6) * (1 - ex);
  // FA F3b roll-in. FIX 2026-10-19 (M-069): the readout shows its own time keys from the first frame (it never counts up from 0:00 or
  // from below its start); the 17 f entry is the board fade only.
  const v = valueAt(time, f);
  const text = fmt(v, format);
  const { w, h } = ledSize(text, cell);
  const capTxt = flipped && flipCaption ? flipCaption : caption;
  const capSize = fsFace(theme.title.face, Math.max(36, capCap));
  const pad = Math.round(cell * 1.5);
  const capRow = capTxt ? Math.round(capCap * 1.0 + pad * 0.8) : 0;
  const capW = capTxt ? measure(capTxt.toUpperCase(), `600 ${capSize}px "${theme.title.face}"`) + 0.06 * capSize * capTxt.length : 0;
  const bw = Math.max(w, capW); // board fits the longer of digits / caption
  // anchor: above the car, kept inside the frame (board included)
  const cx = Math.min(W - bw / 2 - pad - 60, Math.max(bw / 2 + pad + 60, car.x));
  const cy = Math.min(H - h / 2 - pad - capRow - 120, Math.max(h / 2 + pad + 60, car.y + dy));
  const lead = EZ.out2((k - 2) / 6);
  const col = flipped ? acc : theme.neutral;
  const glow = flipped ? (fire ? "rgba(255,255,255,.55)" : theme.accentGlow) : "rgba(255,244,250,.45)";
  const boardBottom = cy + h / 2 + pad + capRow;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <FootPlate src={media} startFrom={mediaStart} push={push}>
        {o > 0.002 ? (
          <div style={{ position: "absolute", inset: 0, opacity: o }}>
            <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <line x1={car.x} y1={car.y - 18} x2={lerp(car.x, cx, lead)} y2={lerp(car.y - 18, boardBottom, lead)} stroke="rgba(0,0,0,.55)" strokeWidth={6} strokeLinecap="round" opacity={clamp01(k / 2)} />
              <line x1={car.x} y1={car.y - 18} x2={lerp(car.x, cx, lead)} y2={lerp(car.y - 18, boardBottom, lead)} stroke={col} strokeWidth={3} strokeLinecap="round" opacity={0.95 * clamp01(k / 2)}
                style={{ filter: `drop-shadow(0 0 5px ${glow})` }} />
              <circle cx={car.x} cy={car.y - 18} r={8 * lead} fill="rgba(0,0,0,.55)" />
              <circle cx={car.x} cy={car.y - 18} r={6 * lead} fill={col} />
            </svg>
            {/* the LED sign board (dark 80 % plate, like the LedMarquee ghost board) */}
            <LedBoard w={bw} h={h} x={cx} y={cy} pad={pad} extraBottom={capRow} alpha={board} />
            <LedText text={text} cell={cell} x={cx} y={cy} colour={col} glow={glow} glowPx={[4, 16]} ghost={0.3} ghostColour={theme.dim} bloom={0.5} />
            {capTxt ? (
              <div style={{ position: "absolute", left: cx, top: cy + h / 2 + pad * 0.55, height: capRow, display: "flex", alignItems: "center", transform: "translateX(-50%)", whiteSpace: "nowrap", lineHeight: 1,
                fontSize: capSize, fontFamily: theme.title.face, fontWeight: Math.max(600, theme.title.weight), letterSpacing: "0.06em",
                color: flipped && flipCaption ? acc : theme.neutral, textShadow: flipped && flipCaption ? `0 0 10px ${glow}` : "none" }}>
                {capTxt.toUpperCase()}
              </div>
            ) : null}
          </div>
        ) : null}
      </FootPlate>
    </AbsoluteFill>
  );
};
