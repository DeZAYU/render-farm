// diagram / MeasureOnPhoto (set "midway", Amusement Park "MIDWAY AFTER DARK" height / depth device, REFERENCE_SYNTHESIS §I3 AP-1 + §I4 #3).
// REF Visual Venture §11 dashed bracket "X2" @3:28.0 (the dashed dimension bracket slides out over 0.5 s on its word; camera in phases, here
// phase C settle bezier(0.242,0,0,1)) + Dashcam Vol.3 E5 two-tone stat @1:47.87 (number one colour, unit the other) + Dashcam Vol.1 typed
// "40 minutes" @0:15.6 (2 f / char).
// Our version: a dashed accent bracket between two points ON THE REAL PHOTO of the ride (wheel height, drop, pool depth), end ticks at both
// ends; the value types 2 f/char beside it on its word (number neutral, unit accent, Oswald 600), an optional Oswald 200 note rises under it,
// and the camera makes a VV phase-C push toward the bracket when the value lands. Footage/photo keeps a slow linear push underneath.
// FIX 2026-10-19 (review #14, M-024): bright-plate guard = a soft local darken of the photo under the value + note (fades in with the value)
// and a stronger two-layer shadow on the type; the note is Oswald >= 400 (was 200 on bright sky).
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { EZ, H, Media, Vignette, W, clamp01, lerpLog, linPush, measure } from "../../core";
import { typedN } from "../../core/kits/labels";
import { type MWord, RiseWords, fsFace, pickAccent } from "../../core/kits/led";
import { WATERPARK, type Theme } from "../../core/themes";

const SLIDE = Easing.bezier(0.31, 0, 0, 0.957); // VV §11 phase A quick start / long settle (bracket slide-out)
export type MeasureOnPhotoProps = {
  media: string; // real photo (or clip) of the ride, 1920x1080 cover; points are in these px
  mediaStart?: number;
  push?: number; // linear push / s under everything
  a: { x: number; y: number }; // bracket start (the base: ground, water line)
  b: { x: number; y: number }; // bracket end (the top)
  at: number; // bracket slides out from a to b over 15 f
  value: string; // "165"
  unit?: string; // "M" (accent)
  valueAt: number; // the value's spoken word: typing starts, phase-C push starts
  note?: MWord[]; // Oswald 400 under the value (e.g. "tall")
  noteWeight?: number; // note weight (>= 400)
  guard?: number; // bright-plate guard: local darken strength under value + note (0.5; 0 = off)
  side?: 1 | -1; // value right (1) or left (-1) of a vertical bracket
  cap?: number; // value cap height (72)
  pushTo?: number; // phase-C push factor (1.1)
  theme?: Theme;
  fire?: boolean;
  plate?: boolean; // false = overlay only (no media, transparent): lay the bracket + value ABOVE a transition (e.g. PushIntoLight) so it stays readable
};

export const MeasureOnPhoto: React.FC<MeasureOnPhotoProps> = ({
  media, mediaStart = 0, push = 0.008, a, b, at, value, unit = "", valueAt, note = [], side = 1, cap = 72, pushTo = 1.1, noteWeight = 400, guard = 0.5, theme = WATERPARK, fire, plate = true,
}) => {
  const f = useCurrentFrame();
  const acc = pickAccent(theme, fire);
  const glow = fire ? "rgba(255,255,255,.5)" : theme.accentGlow;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  // camera: linear push (footage rule) x VV phase-C settle push on the value word, both about the bracket midpoint
  const S = linPush(f, push) * lerpLog(1, pushTo, EZ.settle((f - valueAt) / 75));
  const map = (p: { x: number; y: number }) => ({ x: mid.x + (p.x - mid.x) * S, y: mid.y + (p.y - mid.y) * S });
  const A = map(a), B = map(b), M = map(mid);
  const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
  const nx = -(B.y - A.y) / len, ny = (B.x - A.x) / len; // normal (for the end ticks)
  const p = SLIDE(clamp01((f - at) / 15));
  const E = { x: A.x + (B.x - A.x) * p, y: A.y + (B.y - A.y) * p };
  const tick = 26;
  const tA = clamp01((f - at) / 4), tB = clamp01((f - at - 13) / 4);
  // typed value: number + unit as one string, 2 f / char
  const full = unit ? `${value} ${unit}` : value;
  const n = typedN(full, f - valueAt, 2);
  const shownNum = full.slice(0, Math.min(n, value.length));
  const shownUnit = n > value.length ? full.slice(value.length, n) : "";
  const vertical = Math.abs(B.x - A.x) < Math.abs(B.y - A.y);
  const size = fsFace(theme.title.face, cap);
  const lx = vertical ? M.x + side * 54 : M.x, ly = vertical ? M.y : Math.min(A.y, B.y) - 70;
  const align = vertical ? (side === 1 ? "translate(0,-50%)" : "translate(-100%,-50%)") : "translate(-50%,-100%)";
  const vw = measure(full, `${theme.title.weight} ${size}px "${theme.title.face}"`);
  const noteX = vertical ? lx + (side === 1 ? 1 : -1) * (vw / 2) : lx;
  const noteY = vertical ? ly + size * 0.95 : ly + 40;
  // guard box (screen px) around value + note
  const gx0 = vertical ? (side === 1 ? lx : lx - vw) : lx - vw / 2, gx1 = gx0 + vw;
  const gy0 = vertical ? ly - size * 0.6 : ly - size * 1.1, gy1 = note.length ? noteY + 34 : (vertical ? ly + size * 0.6 : ly + 10);
  const gk = guard * EZ.out2((f - valueAt) / 8);
  const shadow = "0 0 18px rgba(0,0,0,.5), 0 3px 12px rgba(0,0,0,.8)";
  return (
    <AbsoluteFill style={{ background: plate ? "#000" : "transparent", overflow: "hidden" }}>
      {plate ? (
        <AbsoluteFill style={{ transform: `scale(${S.toFixed(5)})`, transformOrigin: `${mid.x}px ${mid.y}px` }}>
          <Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence>
        </AbsoluteFill>
      ) : null}
      <Vignette />
      {f >= at ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g style={{ filter: `drop-shadow(0 0 5px ${glow}) drop-shadow(0 0 14px ${glow})` }}>
            <line x1={A.x} y1={A.y} x2={E.x} y2={E.y} stroke={acc} strokeWidth={5} strokeDasharray="20 12" strokeLinecap="butt" />
            <line x1={A.x - nx * tick} y1={A.y - ny * tick} x2={A.x + nx * tick} y2={A.y + ny * tick} stroke={acc} strokeWidth={5} strokeLinecap="round" opacity={tA} />
            <line x1={B.x - nx * tick} y1={B.y - ny * tick} x2={B.x + nx * tick} y2={B.y + ny * tick} stroke={acc} strokeWidth={5} strokeLinecap="round" opacity={tB} />
          </g>
        </svg>
      ) : null}
      {gk > 0.002 ? (
        <div style={{ position: "absolute", left: gx0 - 80, top: gy0 - 56, width: gx1 - gx0 + 160, height: gy1 - gy0 + 112, borderRadius: 80, background: `rgba(8,3,6,${gk.toFixed(3)})`, filter: "blur(46px)" }} />
      ) : null}
      {n > 0 ? (
        <div style={{ position: "absolute", left: lx, top: ly, transform: align, whiteSpace: "pre", fontFamily: theme.title.face, fontWeight: theme.title.weight, fontSize: size, lineHeight: 1 }}>
          <span style={{ color: theme.neutral, textShadow: shadow }}>{shownNum}</span>
          <span style={{ color: acc, textShadow: `0 0 16px ${glow}, 0 3px 12px rgba(0,0,0,.75)` }}>{shownUnit}</span>
        </div>
      ) : null}
      {note.length ? <RiseWords words={note} cap={40} y={noteY} cx={noteX} face={theme.light.face} weight={Math.max(400, noteWeight)} shadow={shadow} colour={theme.neutral} hot={acc} hotGlow={glow} /> : null}
    </AbsoluteFill>
  );
};
