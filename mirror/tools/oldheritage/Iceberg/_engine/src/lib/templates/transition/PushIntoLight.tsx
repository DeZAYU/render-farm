// transition / PushIntoLight (set "midway", Amusement Park "MIDWAY AFTER DARK" signature case exit, REFERENCE_SYNTHESIS §I3 AP-1 + §I4 #8).
// REF Farrell FB F8 push-into-light @V5 10:03.3 (also V2 9:22): the camera pushes into a lamp in the outgoing shot, its white disc grows from
// 0.34 W to full white over 68 f EASE-IN, the bed drops away over the last 0.9 s; cut on full white. Incoming side: Farrell exposure-flash decay
// (SG 5: decay 8-12 f) = a short white decay over B.
// Our version: the push is anchored on a REAL light point of the outgoing shot (`light`, screen px of A: ride bulbs, show lights), so the disc
// is born from that lamp. Same a/b or A/B API as the transition family. Host mix: dip the bed to 0.35 over the last 27 f (never silent, M-030).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, W, clamp01, lerp, lerpLog } from "../../core";
import { SideA, SideB, type TransitionProps } from "./shared";

export type PushIntoLightProps = TransitionProps & {
  light?: { x: number; y: number }; // the lamp in the outgoing frame (screen px at scale 1)
  dur?: number; // frames of the push / white-out before the cut (68)
  decay?: number; // white decay frames over B (10)
  maxScale?: number; // camera push at full white (x1.6, log, ease-in)
  disc0?: number; // disc diameter at birth, fraction of W (0.34)
  tint?: string; // light colour (white; a warm "255,246,240" for bulbs)
};

export const PushIntoLight: React.FC<PushIntoLightProps> = (p) => {
  const { cut, light = { x: W * 0.62, y: H * 0.34 }, dur = 68, decay = 10, maxScale = 1.6, disc0 = 0.34, tint = "255,255,255" } = p;
  const f = useCurrentFrame();
  if (f >= cut) {
    const k = f - cut;
    const w = k < decay ? Math.pow(1 - k / decay, 2) : 0;
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <SideB {...p} />
        {w > 0 ? <AbsoluteFill style={{ background: `rgb(${tint})`, opacity: w }} /> : null}
      </AbsoluteFill>
    );
  }
  const u = clamp01((f - (cut - dur)) / dur);
  const e = EZ.in2(u); // ease-in: slow start, fast white-out
  const sc = lerpLog(1, maxScale, e);
  // FIX 2026-10-19 (review #7): no hard disc. The lamp is a GAUSSIAN light (exp falloff, screen-blended) whose sigma grows from the lamp
  // (disc0 = its visible ~2 sigma diameter) past the farthest frame corner; the real highlights of A around the lamp threshold-bloom
  // (bright-pass copy of A, blurred, screen, radial mask about the lamp), and a global screen lift carries the frame to full white.
  const far = Math.max(Math.hypot(light.x, light.y), Math.hypot(W - light.x, light.y), Math.hypot(light.x, H - light.y), Math.hypot(W - light.x, H - light.y));
  const born = clamp01(u / 0.15); // the light swells out of the lamp over the first ~10 f
  const sig = lerp((disc0 * W) / 4, far * 0.9, Math.pow(e, 1.2));
  const Rg = 2.6 * sig;
  const stops = Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    const a = born * Math.exp(-Math.pow(t * 2.6, 2) / 2) * (i === 13 ? 0 : 1);
    return `rgba(${tint},${a.toFixed(4)}) ${(t * 100).toFixed(1)}%`;
  }).join(", ");
  const hot = lerp(26, 120, e); // the lamp's own hot core (filament), tight gaussian
  const lift = Math.pow(e, 2.4) * 0.9; // whole-frame screen lift toward white
  const fin = clamp01((u - 0.9) / 0.1); // guarantee pure white on the last frames
  const camT = { transform: `scale(${sc.toFixed(5)})`, transformOrigin: `${light.x}px ${light.y}px` };
  const bloomR = lerp(0.3 * W, 1.1 * far, e);
  const mask = `radial-gradient(circle ${bloomR.toFixed(0)}px at ${light.x}px ${light.y}px, #000 0%, rgba(0,0,0,.6) 45%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ ...camT, filter: `brightness(${(1 + 0.6 * e).toFixed(3)})` }}>
        <SideA {...p} />
      </AbsoluteFill>
      {u > 0 ? (
        <>
          {/* threshold bloom of A's own highlights around the lamp (bright-pass: brightness .55 x contrast 5 ~ luma > 0.73) */}
          <AbsoluteFill style={{ ...camT, filter: `brightness(.55) contrast(5) blur(${lerp(10, 34, e).toFixed(1)}px)`, mixBlendMode: "screen", opacity: lerp(0.55, 1, e) * born,
            WebkitMaskImage: mask, maskImage: mask }}>
            <SideA {...p} />
          </AbsoluteFill>
          <AbsoluteFill style={{ background: `radial-gradient(circle ${Rg.toFixed(1)}px at ${light.x}px ${light.y}px, ${stops})`, mixBlendMode: "screen" }} />
          <AbsoluteFill style={{ background: `radial-gradient(circle ${(2.6 * hot).toFixed(1)}px at ${light.x}px ${light.y}px, rgba(${tint},${born.toFixed(3)}) 0%, rgba(${tint},${(0.6 * born).toFixed(3)}) 18%, rgba(${tint},${(0.14 * born).toFixed(3)}) 45%, rgba(${tint},0) 100%)`, mixBlendMode: "screen" }} />
          {lift > 0.002 ? <AbsoluteFill style={{ background: `rgb(${tint})`, opacity: lift, mixBlendMode: "screen" }} /> : null}
        </>
      ) : null}
      {fin > 0 ? <AbsoluteFill style={{ background: `rgb(${tint})`, opacity: fin }} /> : null}
    </AbsoluteFill>
  );
};
