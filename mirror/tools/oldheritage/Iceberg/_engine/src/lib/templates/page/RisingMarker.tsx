// page / RisingMarker: an excerpt of the page RISES from below over a dark, defocused plate (Abyssal E5: top edge .73 H -> settled in 1.3 s,
// ease-out, scale .65 -> 1, then a +0.2 % H/s upward drift), and a yellow marker (#F5B800) wipes the spoken phrase while it is said.
// The plate is the article's own photo / the story's footage, blurred 22 px at ~32 % brightness (Abyssal dark plate at 35-50 %).
// REF Abyssal (Chinese iceberg) E5 page excerpt + marker @19:50.6-20:00.4; wp3 sec_C PtsInner part (a) @ abs 6325.
// Our version: the excerpt keeps the page's own layout (headline + photo), a soft depth shadow, and the plate breathes with a slow push.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, Media, RC, W, lerp } from "../../core";
import { PageSheet, markBars, type Mark, type PageSrc } from "./shared";

export type RisingMarkerProps = PageSrc & {
  clip: [number, number]; // CSS y range of the excerpt
  x0?: number; x1?: number; // CSS x range of the excerpt
  width?: number; // settled excerpt width on screen (px)
  top?: number; // settled top edge (fraction of H, default 0.2)
  plate?: string; // background media (still or clip), shown dark + defocused
  riseDur?: number; // frames (default 39 = 1.3 s)
  marks?: Mark[]; // yellow marker phrases (omit = no highlight)
  markColour?: string;
};
const Inner: React.FC<RisingMarkerProps> = (p) => {
  const f = useCurrentFrame();
  const rd = p.riseDur ?? 39;
  const rise = EZ.out3(f / rd);
  const t = Math.max(0, f - rd) / 30;
  const x0 = p.x0 ?? 0, x1 = p.x1 ?? p.cssW;
  const sFinal = (p.width ?? 1480) / (x1 - x0);
  const s = sFinal * (0.65 + 0.35 * rise) * (1 + 0.002 * t);
  const top = lerp(0.73 * H, (p.top ?? 0.2) * H, rise) - 0.002 * H * t;
  const bars = markBars(f, p.marks, { c: p.markColour ?? RC.abYellow, ease: EZ.hlWipe, perLine: 20, px: 4, py: 3, radius: 2 });
  return (
    <AbsoluteFill style={{ background: "#070707" }}>
      {p.plate ? (
        <AbsoluteFill style={{ transform: `scale(${1.1 * (1 + 0.006 * (Math.max(0, f) / 30))})`, filter: "blur(22px) brightness(0.32) saturate(0.8)" }}>
          <Media src={p.plate} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ opacity: Math.min(1, f / 3 + 0.35) }}>
        <PageSheet {...p} cx={(x0 + x1) / 2} cy={p.clip[0]} ox={W / 2} oy={top} s={s} bars={bars} x0={x0} x1={x1}
          slices={[{ y0: p.clip[0], y1: p.clip[1], vy: p.clip[0] }]} shadow="0 30px 70px rgba(0,0,0,.7)" />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.4) 100%)" }} />
    </AbsoluteFill>
  );
};
export const RisingMarker: React.FC<RisingMarkerProps> = (p) => {
  const f = useCurrentFrame();
  return <MBlur on={f >= 0 && f < 12}><Inner {...p} /></MBlur>;
};
