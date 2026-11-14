// page / MacroPan: an extreme macro on ONE line of the page, the camera travelling sideways along it like an eye reading. Very shallow depth of
// field (only the line is sharp), a held roll, a constant lateral pan (eased in, never stops), and the soft Farrell marker lands on the key
// words as the pan reaches them. Enters with a rack focus (starts fully defocused and pulls focus onto the line).
// REF Farrell PG4 macro + shallow DOF + lateral pan 1.7-2 % W/s (CC 17:28.8, IS 4:54.8, AR 2:25.2; GF headline macros @13:50.8) + HL2
// soft marker #F4D086 (CC 14:10.9); Smoothness guide 4.1 page motions. Not a cut-to-macro (HeadlineCrop): the whole shot IS the macro.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DOFBand, EZ, H, W, clamp01, lerp } from "../../core";
import { PageSheet, markBars, type Mark, type PageSrc } from "./shared";

export type MacroPanProps = PageSrc & {
  clip?: [number, number];
  line: { y: number; x0: number; x1: number }; // CSS centre y of the line, pan from x0 to x1 (CSS centre x of the frame)
  s?: number; // macro scale (screen px per CSS px, default 4)
  panFrames?: number; // frames for x0 -> x1 (default 120; keeps going at the same speed after)
  roll?: number; // deg (default -2.6)
  rack?: number; // rack-focus frames (default 20)
  marks?: Mark[]; // marker phrases (omit = no highlight)
  markColour?: string;
};
export const MacroPan: React.FC<MacroPanProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const pf = p.panFrames ?? 120;
  const ease = Math.min(f, 14) ** 2 / 28 + Math.max(0, f - 14); // eased-in constant speed (frames of travel)
  const u = (ease - 7) / pf; // 0 at the start (after the ease) -> 1 at pf
  const cx = lerp(p.line.x0, p.line.x1, Math.max(0, u + 7 / pf));
  const s = (p.s ?? 4) * (1 + 0.006 * t);
  const rk = EZ.out2(f / (p.rack ?? 20));
  const bars = markBars(f, p.marks, { c: p.markColour ?? "#F4D086", ease: EZ.hlWipe, perLine: 22, px: 4, py: 4, radius: 3 });
  return (
    <AbsoluteFill style={{ background: "#e9e9e7" }}>
      <AbsoluteFill style={{ filter: rk < 1 ? `blur(${(14 * (1 - rk)).toFixed(2)}px) brightness(${(0.75 + 0.25 * rk).toFixed(3)})` : undefined }}>
        <DOFBand y={H / 2} half={58} blur={6.5} feather={120}>
          <PageSheet {...p} cx={cx} cy={p.line.y} s={s} rot={p.roll ?? -2.6} bars={bars} slices={p.clip ? [{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }] : undefined} shadow="0 0 0 rgba(0,0,0,0)" />
        </DOFBand>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${(0.42).toFixed(2)}) 100%)` }} />
      <AbsoluteFill style={{ background: "#000", opacity: clamp01(1 - f / 4) * 0.5, width: W }} />
    </AbsoluteFill>
  );
};
