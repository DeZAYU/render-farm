// evidence / StackFlyThrough: a loose stack of sources in depth, the camera dollies THROUGH it. Each print waits in depth (smaller, darker,
// defocused by its distance), comes into focus as the camera arrives (quick start, long settle on its noun), then flies past the lens
// (scale x(1 + 2.2 u^2) while fading and blurring) as the camera goes on to the next; the last one holds with a life drift.
// REF Farrell B3 headline montage (GF 13:50.8: one outlet per ~1.0 s on the words) + the Abyssal iceberg level fly-through
// (zoom x(1 + 2.2 u^2) while fading; refs/iceberg ICEBERG_MOTION.md). Our version: one continuous z-dolly instead of hard cuts / flashes.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, MBlur, clamp01 } from "../../core";
import { ItemFace, itemSize, type EvItem } from "./shared";

export type StackItem = Omit<EvItem, "x" | "y"> & { x?: number; y?: number }; // x / y = small parallax offsets from the centre (px at focus)
export type StackFlyThroughProps = {
  items: StackItem[]; // in order; items[i].at = frame the camera ARRIVES at item i (items[0].at is ignored: it is there on frame 0)
  travel?: number; // frames of each dolly move (default 16)
  gap?: number; // apparent depth gap (default 0.55: next item at 1/(1+gap) scale)
  bg?: string;
};
const Inner: React.FC<StackFlyThroughProps> = (p) => {
  const f = useCurrentFrame();
  const D = p.travel ?? 16, G = p.gap ?? 0.55;
  let camZ = 0;
  for (let i = 1; i < p.items.length; i++) camZ += EZ.quick((f - (p.items[i].at - D)) / D);
  const last = p.items[p.items.length - 1];
  const drift = 1 + 0.008 * Math.max(0, (f - last.at) / 30);
  const order = p.items.map((_, i) => i).sort((a, b) => b - a); // far first
  return (
    <AbsoluteFill style={{ background: p.bg ?? "#0c0b0b" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(80,70,60,.35) 0%, rgba(0,0,0,0) 100%)" }} />
      {order.map((i) => {
        const it = p.items[i];
        const d = i - camZ;
        if (d <= -1 || d > 3.2) return null;
        let s: number, o: number, blur: number, bright: number;
        if (d >= 0) { s = 1 / (1 + G * d); o = clamp01(3.2 - d); blur = Math.min(10, 7 * d); bright = 1 - 0.38 * Math.min(1, d) - 0.1 * Math.max(0, d - 1); }
        else { const u = -d; s = 1 + 2.2 * u * u; o = 1 - EZ.in2(u); blur = 9 * u; bright = 1 + 0.15 * u; }
        if (i === p.items.length - 1) s *= drift;
        const { w, h } = itemSize({ ...it, x: 0, y: 0 });
        const rot = (it.rot ?? 0) * (d >= 0 ? 1 : 1 + 0.5 * -d);
        return (
          <div key={i} style={{ position: "absolute", left: 960 - w / 2, top: 540 - h / 2, width: w, height: h, opacity: o,
            transform: `translate(${((it.x ?? 0) * s).toFixed(1)}px, ${((it.y ?? 0) * s).toFixed(1)}px) rotate(${rot}deg) scale(${s.toFixed(4)})`,
            boxShadow: "0 30px 80px rgba(0,0,0,.7)", filter: `brightness(${bright.toFixed(3)})${blur > 0.2 ? ` blur(${blur.toFixed(2)}px)` : ""}` }}>
            <ItemFace it={{ ...it, x: 0, y: 0 }} />
          </div>
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,.7) 100%)" }} />
    </AbsoluteFill>
  );
};
export const StackFlyThrough: React.FC<StackFlyThroughProps> = (p) => {
  const f = useCurrentFrame();
  const D = p.travel ?? 16;
  const moving = p.items.slice(1).some((it) => f > it.at - D + 1 && f < it.at - D * 0.35);
  return <MBlur on={moving}><Inner {...p} /></MBlur>;
};
