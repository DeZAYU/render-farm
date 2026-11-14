// photo / PhotoStack: two or three prints DEALT onto each other on a dark table; the camera settles on the last one. REF: VV photo deal (VV §5 photo
// cards entering by hard cut and settling; VV rule 4 "the information arrives at you, then settles") + Dashcam Vol.1 @ 14:44.4 E12 corkboard
// camera (moves item to item 1.0-1.5 s, small rotation drift) + VV §11 quick-start / long-settle (0.31,0,0,0.957) for each throw.
// Each print flies in from off-frame (alternating sides) spinning down to its resting angle, lands with a short shadow tighten; the prints it
// covers darken (focus moves to the newest); the camera re-centres and pushes a little on every deal, then drifts.
// Differs from Polaroid (pegs/pins, captions, pull-back to a cluster) and FilmStrip (linear strip): a pile, thrown, camera pushing in.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, Media, W, clamp01, lerp, lerpLog, rng } from "../../core";
import { CardVig, Specks, fitBox } from "../../core/kits/photo";

export type StackItem = { src: string; at: number; aspect?: number; pos?: string };
export type PhotoStackProps = { items: StackItem[]; seed?: number; maxW?: number };

export const PhotoStack: React.FC<PhotoStackProps> = ({ items, seed = 5, maxW = 1080 }) => {
  const k = useCurrentFrame();
  const r = rng(seed);
  const lay = items.map((it, i) => {
    const b = fitBox(it.aspect ?? 3 / 2, maxW, 640);
    return { ...it, w: b.w + 28, h: b.h + 28, x: (r() - 0.5) * 240, y: (r() - 0.5) * 110, rot: (i % 2 ? 1 : -1) * (2 + r() * 4.5), from: i % 2 ? 1 : -1 };
  });
  // camera: centre on the newest landed print, push +6 % per deal (log), VV settle
  let cx = lay[0].x, cy = lay[0].y, z = 0.94;
  lay.forEach((p, i) => {
    if (i === 0) return;
    const u = EZ.settle(clamp01((k - p.at - 8) / 44));
    cx = lerp(cx, p.x, u); cy = lerp(cy, p.y, u); z = lerpLog(z, 0.94 * Math.pow(1.06, i), u);
  });
  z *= 1 + 0.007 * (k / 30);
  const flying = lay.some((p) => k - p.at >= 0 && k - p.at < 14 && p.at > 0);
  const top = lay.reduce((n, p, i) => (k >= p.at ? i : n), 0);
  return (
    <AbsoluteFill style={{ background: "#0a0908" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 60% at 50% 44%, #221d18 0%, #0f0d0b 55%, #050404 100%)" }} />
      <Specks k={k} n={24} seed={41} max={0.16} colour="255,236,210" />
      <MBlur on={flying} samples={6}>
        <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) scale(${z.toFixed(5)}) rotate(${(0.6 - 0.15 * (k / 30)).toFixed(3)}deg) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)` }}>
          {lay.map((p, i) => {
            const q = k - p.at;
            if (p.at > 0 && q < 0) return null;
            const u = p.at <= 0 ? 1 : EZ.quick(clamp01(q / 18));
            const x = lerp(p.x + p.from * 1500, p.x, u), y = lerp(p.y + 260, p.y, u);
            const rot = lerp(p.rot + p.from * 24, p.rot, u);
            const land = p.at <= 0 ? 1 : clamp01((q - 12) / 8);
            const covered = lay.slice(i + 1).find((n) => k >= n.at);
            const dim = covered ? 1 - 0.42 * clamp01((k - covered.at - 10) / 12) : 1;
            const shY = lerp(48, 16, land), shB = lerp(70, 26, land);
            return (
              <div key={i} style={{ position: "absolute", left: x - p.w / 2, top: y - p.h / 2, width: p.w, height: p.h, transform: `rotate(${rot.toFixed(3)}deg)`, zIndex: i,
                background: "#F3F1EC", boxShadow: `0 ${shY.toFixed(1)}px ${shB.toFixed(1)}px rgba(0,0,0,.62), 0 2px 4px rgba(0,0,0,.4)`, filter: dim < 0.999 ? `brightness(${dim.toFixed(3)})` : undefined }}>
                <div style={{ position: "absolute", left: 14, top: 14, right: 14, bottom: 14, overflow: "hidden", background: "#111" }}>
                  <Media src={p.src} pos={p.pos} style={{ filter: "contrast(1.07) saturate(.9) brightness(.94)" }} />
                  <CardVig k={i === top ? 0.36 : 0.5} />
                  <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,.09) 0%, rgba(255,255,255,0) 30%)" }} />
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      </MBlur>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
