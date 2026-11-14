// footage / FloatingClipCard (set dash2, Dashcam "INSTRUMENT" H13): "the clip" presented as an object, without a TV frame.
// REF Nocturn NA nA6 FINAL @0:02-0:06 and @1:09.25 (the clip as a card 60 % x 60 % with a 2 px light edge + shadow, behind it the same clip
// blurred sigma 30; 0.5 s dissolve in; the card scales 0.6 -> 0.78 in 1.5 s ease-out; then a hard cut to full frame).
// Ours: replaces the banned CRT for "a man who posts as ... uploaded this" / news clips (crop logos with `zoom` + `pos`). After the 1.5 s
// settle the card keeps a slow linear drift (never dead-still), and `cutAt` is a hard cut to the clip at full frame on the same source frame.
// Silent (no SFX on the card or the cut in the ref).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { WATERPARK, EZ, H, Media, Vignette, W, clamp01, lerp, linPush, type Theme } from "../../core";

export type FloatingClipCardProps = {
  media: string; mediaStart?: number;
  s0?: number; s1?: number; settle?: number; // card scale 0.6 -> 0.78 over 45 f (1.5 s) ease-out
  creep?: number; // linear card growth per second after the settle
  dissolve?: number; // in, frames (15 = 0.5 s)
  blur?: number; // background sigma (30)
  zoom?: number; pos?: string; // crop inside the card (cut burned-in logos / tickers)
  cutAt?: number; // hard cut to full frame
  push?: number; // linear push on the full-frame part
  theme?: Theme; // edge colour = theme.neutral
};

export const FloatingClipCard: React.FC<FloatingClipCardProps> = ({ media, mediaStart = 0, s0 = 0.6, s1 = 0.78, settle = 45, creep = 0.006, dissolve = 15, blur = 30, zoom = 1, pos = "50% 50%", cutAt, push = 0.045, theme = WATERPARK }) => {
  const f = useCurrentFrame();
  const full = cutAt !== undefined && f >= cutAt;
  const op = clamp01(f / Math.max(1, dissolve));
  if (full) {
    // hard cut: same clock, full frame, the DD linear push starts at the cut
    return (
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${(zoom * linPush(f - cutAt!, push)).toFixed(5)})`, transformOrigin: pos }}><Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence></AbsoluteFill>
        <Vignette />
      </AbsoluteFill>
    );
  }
  const sc = lerp(s0, s1, EZ.out3(f / settle)) * (1 + creep * Math.max(0, f - settle) / 30);
  const cw = W * sc, ch = H * sc;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: op }}>
      {/* the same clip, blurred sigma 30, as the plate (oversized so the blur has no dark rim) */}
      <AbsoluteFill style={{ transform: "scale(1.12)", filter: `blur(${blur}px) brightness(.72)` }}><Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence></AbsoluteFill>
      <Vignette opacity={0.7} />
      <div style={{ position: "absolute", left: (W - cw) / 2, top: (H - ch) / 2, width: cw, height: ch, overflow: "hidden", border: `2px solid ${theme.neutral}`, boxSizing: "border-box",
        boxShadow: "0 24px 60px rgba(0,0,0,.65), 0 6px 18px rgba(0,0,0,.5)", background: "#000" }}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: pos }}><Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence></AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};
