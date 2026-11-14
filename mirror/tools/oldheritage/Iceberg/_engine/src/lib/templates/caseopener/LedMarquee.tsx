// caseopener / LedMarquee (set "midway", Amusement Park "MIDWAY AFTER DARK", REFERENCE_SYNTHESIS §I3 AP-1 + §I4 #7).
// REF Farrell FB F10 @V4 2:49.6 (LED/neon figure card: dot-matrix core + bloom, slight push, ~3 s) + Farrell FA F3 @V3 12:41-12:53 (fine 3-4 px
// pixel texture, 30-40 px glow, the number fades in over 8 f) + Dashcam Vol.3 E2 word label numbers (rise 18-20 px, alpha 14-18 f, stagger 6 f).
// Our version: the case number is park signage (5x7 dot-matrix, magenta LEDs, the unlit board faintly visible) over the case's OWN first
// footage blurred sigma 30 at 35 % brightness (Zoo Q2: never on black); place (Oswald 600 caps) and date (Oswald 200 caps) rise in on their words.
// `clearAt`: figure and labels leave and the plate focuses back to the sharp live shot (FA F10 focus pull, shortened to 18 f).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, W, clamp01, lerp } from "../../core";
import { FootPlate } from "../../core/kits/labels";
import { LedText, type MWord, RiseWords, ledSize, pickAccent } from "../../core/kits/led";
import { WATERPARK, type Theme } from "../../core/themes";

export type LedMarqueeProps = {
  number: string; // "7" (DD style: no leading zero)
  media: string; // the case's first footage (public-relative)
  mediaStart?: number;
  push?: number; // linear footage push / s under the blur
  numberAt?: number; // first frame of the figure (8 f fade-in)
  placeWords?: MWord[]; // Oswald 600 caps, on their words
  dateWords?: MWord[]; // Oswald 200 caps, on their words
  clearAt?: number; // figure + labels exit, plate focuses back to the live shot
  cell?: number; // matrix cell px (figure height = 7 cells)
  blur?: number; // plate blur sigma (30)
  dim?: number; // plate brightness (0.35)
  theme?: Theme;
  fire?: boolean; // M-024: white LEDs on fire / red plates
};

export const LedMarquee: React.FC<LedMarqueeProps> = ({
  number, media, mediaStart = 0, push = 0.02, numberAt = 0, placeWords = [], dateWords = [], clearAt, cell = 36, blur = 30, dim = 0.35, theme = WATERPARK, fire,
}) => {
  const f = useCurrentFrame();
  const acc = pickAccent(theme, fire);
  const glow = fire ? "rgba(255,255,255,.55)" : theme.accentGlow;
  // plate: blurred + dimmed until clearAt, then an 18 f ease-out focus back to the live shot
  const c = clearAt === undefined ? 0 : EZ.out3((f - clearAt) / 18);
  const plateFilter = c >= 1 ? undefined : `blur(${(blur * (1 - c)).toFixed(2)}px) brightness(${lerp(dim, 1, c).toFixed(3)})`;
  // figure: 8 f fade + 6 -> 0 px focus, slight push (+1.8 %/s), exit 10 f ease-in with a small lift in scale
  const k = f - numberAt;
  const ex = clearAt === undefined ? 0 : EZ.in2((f - clearAt) / 10);
  const o = k < 0 ? 0 : EZ.out2(k / 8) * (1 - ex);
  const sc = (1 + 0.0006 * Math.max(0, k)) * (1 + 0.05 * ex);
  const { h } = ledSize(number, cell);
  const figY = H * 0.37;
  const placeY = figY + h / 2 + 118, dateY = placeY + 96;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <FootPlate src={media} startFrom={mediaStart} push={push} base={c >= 1 ? 1 : lerp(1.15, 1, c)} filter={plateFilter}>
        {o > 0.002 ? (
          <div style={{ position: "absolute", inset: 0, transform: `scale(${sc.toFixed(5)})`, transformOrigin: `${W / 2}px ${figY}px`, filter: k < 6 ? `blur(${(6 * (1 - clamp01(k / 6))).toFixed(2)}px)` : undefined }}>
            <LedText text={number} cell={cell} x={W / 2} y={figY} colour={acc} glow={glow} glowPx={[10, 34]} ghost={0.24} bloom={0.55} ghostColour={theme.dim} opacity={o} />
          </div>
        ) : null}
        <RiseWords words={placeWords} cap={72} y={placeY} face={theme.title.face} weight={theme.title.weight} colour={theme.neutral} hot={acc} hotGlow={glow} exitAt={clearAt} />
        <RiseWords words={dateWords} cap={50} y={dateY} face={theme.light.face} weight={theme.light.weight} colour={theme.neutral} hot={acc} hotGlow={glow} exitAt={clearAt} />
      </FootPlate>
    </AbsoluteFill>
  );
};
