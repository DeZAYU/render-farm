// page / LayerSplit: the page comes apart in depth. It opens assembled and flat; on `splitAt` the plane turns a little in 3-D and its parts
// (headline / photo / body blocks, given as CSS rects) separate on z with parallax, the non-key layers fall back and defocus, and on `keyAt`
// the KEY layer comes forward (scale + shadow) while the camera eases onto it. Optional marker on the key layer.
// REF Visual Venture §6 page push (quick start / long settle) with VV rule 8 "depth by occlusion / parallax" (MOTION.md §15) + Farrell B4
// lift-out (OF 4:29.5: the page blurs behind while one block comes forward). Our version: every block of the page is its own depth layer.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, RC, asset, lerp, lerpLog } from "../../core";
import { markBars, type Mark, type PageSrc } from "./shared";

export type LayerSplitProps = PageSrc & {
  layers: [number, number, number, number][]; // CSS [x0, y0, x1, y1] blocks, back to front order does not matter
  key0: number; // index of the key layer (comes forward)
  cam: { cx: number; cy: number; s: number }; // assembled framing (CSS px at screen centre)
  splitAt?: number; // default 14
  keyAt?: number; // default 46
  keyS?: number; // zoom multiplier onto the key layer (default 1.3)
  marks?: Mark[]; // optional VV yellow marker on the key layer
};
const Inner: React.FC<LayerSplitProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const sp = EZ.quick((f - (p.splitAt ?? 14)) / 30);
  const ku = EZ.quick((f - (p.keyAt ?? 46)) / 36);
  const kr = p.layers[p.key0];
  const kc = { x: (kr[0] + kr[2]) / 2, y: (kr[1] + kr[3]) / 2 };
  const cx = lerp(p.cam.cx, kc.x, ku), cy = lerp(p.cam.cy, kc.y, ku);
  const s = lerpLog(p.cam.s, p.cam.s * (p.keyS ?? 1.3), ku) * (1 + 0.006 * t);
  const yaw = -13 * sp + 5 * ku, pitch = 7 * sp - 3 * ku;
  const bars = markBars(f, p.marks, { c: RC.vvHighlight, ease: EZ.hlWipe, perLine: 30, px: 3, py: 3, radius: 4 });
  return (
    <AbsoluteFill style={{ background: "#121111" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 48%, #2a2725 0%, #121111 100%)" }} />
      <AbsoluteFill style={{ perspective: "1900px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transformOrigin: "0 0",
          transform: `translate(960px, 540px) rotateY(${yaw.toFixed(3)}deg) rotateX(${pitch.toFixed(3)}deg) scale(${s.toFixed(4)}) translate(${-cx}px, ${-cy}px)` }}>
          {/* the paper the blocks came from: fades as they separate */}
          <div style={{ position: "absolute", left: Math.min(...p.layers.map((r) => r[0])) - 30, top: Math.min(...p.layers.map((r) => r[1])) - 30,
            width: Math.max(...p.layers.map((r) => r[2])) - Math.min(...p.layers.map((r) => r[0])) + 60, height: Math.max(...p.layers.map((r) => r[3])) - Math.min(...p.layers.map((r) => r[1])) + 60,
            background: "#fff", opacity: 1 - sp, transform: "translateZ(-2px)" }} />
          {p.layers.map((r, i) => {
            const isK = i === p.key0;
            const z = isK ? 60 * sp + 140 * ku : -(90 + 70 * (i % 3)) * sp - 60 * ku;
            const dx = (isK ? 0 : (i % 2 ? 1 : -1) * 26) * sp;
            const blur = isK ? 0 : 3.5 * sp + 1.5 * ku;
            const dim = isK ? 1 : 1 - 0.35 * sp - 0.2 * ku;
            const w = r[2] - r[0], h = r[3] - r[1];
            const kb = isK ? bars : [];
            return (
              <div key={i} style={{ position: "absolute", left: r[0] - 8, top: r[1] - 8, width: w + 16, height: h + 16, background: "#fff", overflow: "hidden", isolation: "isolate",
                transform: `translate3d(${dx.toFixed(2)}px, 0, ${z.toFixed(2)}px) scale(${isK ? 1 + 0.05 * ku : 1})`,
                boxShadow: `0 ${(10 + 30 * sp).toFixed(1)}px ${(20 + 50 * sp).toFixed(1)}px rgba(0,0,0,${(0.5 * sp).toFixed(2)})`,
                filter: `brightness(${dim.toFixed(3)})${blur > 0.1 ? ` blur(${blur.toFixed(2)}px)` : ""}` }}>
                {kb.filter((b) => b.p > 0).map((b, j) => (
                  <div key={j} style={{ position: "absolute", left: b.r[0] - r[0] + 8 - 3, top: b.r[1] - r[1] + 8 - 3, width: (b.r[2] + 6) * b.p, height: b.r[3] + 6, background: b.c, borderRadius: 4 }} />
                ))}
                <Img src={asset(p.src)} style={{ position: "absolute", left: -r[0] + 8, top: -r[1] + 8, width: p.cssW, height: p.cssH, mixBlendMode: "multiply" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
export const LayerSplit: React.FC<LayerSplitProps> = (p) => {
  const f = useCurrentFrame();
  const sa = p.splitAt ?? 14, ka = p.keyAt ?? 46;
  return <MBlur on={(f > sa + 1 && f < sa + 12) || (f > ka + 1 && f < ka + 14)}><Inner {...p} /></MBlur>;
};
