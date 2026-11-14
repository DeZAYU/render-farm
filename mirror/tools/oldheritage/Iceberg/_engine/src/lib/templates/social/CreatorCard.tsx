// social / CreatorCard: the uploader's own burned-in text (a title card, an on-video caption, a thumbnail line) is LIFTED out of the frame
// as a page object: the frame behind defocuses and darkens, the text region rises out of its place to the centre with a slight tilt and a
// slow VV push, its type dims, then the words BRIGHTEN line by line (soft-edged light wipe + glow) as the VO paraphrases them.
// Optional typed translation (D3 boxed caption) for non-English cards.
// REF D3 I13 typed text (Dashcam Vol.3 @8:12.5) + Caving watch-page red bars as the line being read (@22:06.8 / 35:38.6) -> here a light
// wipe on the creator's own pixels + Farrell B4 lift-out (OF 4:29.5). Works on a still or a clip (the card shows the live clip).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, MBlur, Media, clamp01, lerp, lerpLog, type Rect } from "../../core";
import { TypedCaption, type CaptionLine } from "../page/shared";

export type CreatorCardProps = {
  src: string; // the frame (still) or the clip
  srcW: number; srcH: number; // natural size in the units the rects use (px, or CSS px of a capture)
  view?: [number, number, number, number]; // region of src shown full-frame before the lift (default all)
  card: Rect; // the burned-in text region [x, y, w, h]
  lines?: { r: Rect; at: number; dur?: number }[]; // text lines that brighten on their words
  liftAt?: number; // default 10
  tilt?: number; // settled roll (default -2.2)
  captions?: CaptionLine[]; captionCap?: number; // typed caption cap (default 40)
  /** what the source plate does during the lift (la -> la+14): "ghost" (default, original look: defocus 16 px + darken -68 %; the lifted
   *  text can still ghost at its original spot on bright plates, M-057), "black" (fades the plate fully to black: no ghost),
   *  "footage" (heavier defocus 26 px, darken -50 %: the card sits on real moving footage, source text unreadable) */
  bg?: "ghost" | "black" | "footage";
};
const Layer: React.FC<{ src: string; w: number; h: number; x: number; y: number }> = ({ src, w, h, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}><Media src={src} fit="cover" /></div>
);
const Inner: React.FC<CreatorCardProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const [vx, vy, vx1, vy1] = p.view ?? [0, 0, p.srcW, p.srcH];
  const k0 = Math.max(1920 / (vx1 - vx), 1080 / (vy1 - vy)) * (1 + 0.012 * t);
  const ox = 960 - ((vx + vx1) / 2) * k0, oy = 540 - ((vy + vy1) / 2) * k0;
  const la = p.liftAt ?? 10;
  const lu = EZ.quick((f - la) / 26);
  const bg = EZ.out2((f - la) / 14);
  const [cx, cy, cw, ch] = p.card;
  const kc = Math.min(1560 / cw, 760 / ch);
  const ks = lerpLog(k0, kc, lu) * (1 + 0.01 * Math.max(0, f - la - 26) / 30);
  const homeX = ox + (cx + cw / 2) * k0, homeY = oy + (cy + ch / 2) * k0;
  const sx = lerp(homeX, 960, lu), sy = lerp(homeY, 520, lu);
  const rot = (p.tilt ?? -2.2) * lu + 0.06 * Math.max(0, f - la) / 30;
  const W2 = cw * ks, H2 = ch * ks;
  const inner = (filter?: string) => (
    <div style={{ position: "absolute", inset: 0, filter }}>
      <Layer src={p.src} w={p.srcW * ks} h={p.srcH * ks} x={-cx * ks} y={-cy * ks} />
    </div>
  );
  const dim = 0.55 * lu;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: `blur(${((p.bg === "footage" ? 26 : 16) * bg).toFixed(2)}px) brightness(${(1 - (p.bg === "footage" ? 0.5 : 0.68) * bg).toFixed(3)})`,
        opacity: p.bg === "black" ? 1 - bg : undefined }}>
        <Layer src={p.src} w={p.srcW * k0} h={p.srcH * k0} x={ox} y={oy} />
      </AbsoluteFill>
      {f >= la ? (
        <div style={{ position: "absolute", left: sx - W2 / 2, top: sy - H2 / 2, width: W2, height: H2, transform: `rotate(${rot.toFixed(3)}deg)`, overflow: "hidden", borderRadius: 6 * lu,
          boxShadow: `0 ${(30 * lu).toFixed(1)}px ${(80 * lu).toFixed(1)}px rgba(0,0,0,${(0.8 * lu).toFixed(2)}), 0 0 0 ${(2 * lu).toFixed(1)}px rgba(255,255,255,.12)` }}>
          {inner(`brightness(${(1 - dim).toFixed(3)}) saturate(${(1 - 0.4 * lu).toFixed(3)})`)}
          {(p.lines ?? []).map((l, i) => {
            const u = EZ.hlWipe((f - l.at) / (l.dur ?? 20));
            if (u <= 0) return null;
            const [lx, ly, lw, lh] = l.r;
            const m = `linear-gradient(to right, #000 ${Math.max(0, u * 100 - 8)}%, transparent ${u * 100}%)`;
            return (
              <div key={i} style={{ position: "absolute", left: (lx - cx) * ks, top: (ly - cy) * ks, width: lw * ks, height: lh * ks, overflow: "hidden", WebkitMaskImage: m, maskImage: m }}>
                <div style={{ position: "absolute", left: -(lx - cx) * ks, top: -(ly - cy) * ks, width: W2, height: H2, filter: "brightness(1.18) drop-shadow(0 0 10px rgba(255,255,255,.55))" }}>
                  {inner()}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 74% 72% at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)", opacity: clamp01(bg + 0.4) }} />
    </AbsoluteFill>
  );
};
export const CreatorCard: React.FC<CreatorCardProps> = (p) => {
  const f = useCurrentFrame();
  const la = p.liftAt ?? 10;
  return (
    <AbsoluteFill>
      <MBlur on={f > la + 1 && f < la + 12}><Inner {...p} /></MBlur>
      <TypedCaption cap={p.captionCap ?? 40} lines={p.captions} />
    </AbsoluteFill>
  );
};
