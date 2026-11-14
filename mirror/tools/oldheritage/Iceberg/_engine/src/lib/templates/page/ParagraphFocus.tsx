// page / ParagraphFocus: we cut in mid-scroll; the page is already moving and settles exponentially (Nocturn CP2 eased settle, tau ~0.9 s)
// with the spoken paragraph in the middle. Then the paragraph LIFTS: it comes up off the page (scale + shadow), the rest of the page
// blurs back and dims, and a red side rule draws down its left edge. Optional DD red bar inside it; optional `softenAt` blurs everything
// back (for "...was never made public").
// REF Dashcam Vol.3 E4 scroll @0:08.0-0:14.4 + VV §6 depth-of-field (key block sharp, rest defocused) + Nocturn CP2 eased settle
// (urban 10:59.5, +4.4 -> -0.2 %/s). Differs from ScrollToParagraph: cut-in mid-scroll, block lift + side rule instead of a glow bar.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, RC, asset, clamp01, lerp } from "../../core";
import { PageSheet, ddWipe, markBars, WhiteInk, type Mark, type PageSrc } from "./shared";

export type ParagraphFocusProps = PageSrc & {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  x1?: number;
  para: [number, number, number, number]; // CSS [x0, y0, x1, y1] of the paragraph that lifts
  fromY: number; // CSS y at the screen centre on the first frame (mid-scroll)
  cx: number; s: number;
  tau?: number; // settle time constant in frames (default 27)
  liftAt?: number; // default 34
  bars?: Mark[];
  barColour?: string; // bar + side-rule colour (default DD page red; per-video identity accent)
  softenAt?: number;
};
const Inner: React.FC<ParagraphFocusProps> = (p) => {
  const f = useCurrentFrame();
  const k = Math.max(0, f);
  const [x0, y0, x1, y1] = p.para;
  const ty = (y0 + y1) / 2;
  const cy = lerp(p.fromY, ty, 1 - Math.exp(-k / (p.tau ?? 27)));
  const s = p.s * (1 + 0.006 * (k / 30));
  const lu = EZ.quick((f - (p.liftAt ?? 34)) / 20);
  const rule = EZ.out2((f - (p.liftAt ?? 34) - 6) / 12);
  const soft = p.softenAt !== undefined ? EZ.out2((f - p.softenAt) / 20) : 0;
  const bars = markBars(f, p.bars, { ink: p.ink, c: p.barColour ?? RC.pageRed, ease: ddWipe, perLine: 18, px: 3, py: 3, radius: 0 });
  const sx = 960 + ((x0 + x1) / 2 - p.cx) * s, sy = 540 + (ty - cy) * s; // paragraph centre on screen
  const ls = s * (1 + 0.04 * lu);
  return (
    <AbsoluteFill style={{ background: "#151414", filter: soft > 0 ? `blur(${(5 * soft).toFixed(2)}px)` : undefined }}>
      <AbsoluteFill style={{ filter: `blur(${(4.5 * lu).toFixed(2)}px) brightness(${(1 - 0.48 * lu).toFixed(3)})` }}>
        <PageSheet src={p.src} cssW={p.cssW} cssH={p.cssH} cx={p.cx} cy={cy} s={s} x1={p.x1} shadow="0 0 0 rgba(0,0,0,0)" />
      </AbsoluteFill>
      {lu > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${sx.toFixed(2)}px, ${(sy - 6 * lu).toFixed(2)}px) scale(${ls.toFixed(4)}) translate(${-(x0 + x1) / 2}px, ${-ty}px)` }}>
          <div style={{ position: "absolute", left: x0 - 14, top: y0 - 10, width: x1 - x0 + 28, height: y1 - y0 + 20, background: "#fff", overflow: "hidden", isolation: "isolate",
            boxShadow: `0 ${(18 * lu).toFixed(1)}px ${(40 * lu).toFixed(1)}px rgba(0,0,0,${(0.55 * lu).toFixed(2)})` }}>
            {bars.filter((b) => b.p > 0).map((b, i) => (
              <div key={i} style={{ position: "absolute", left: b.r[0] - x0 + 14 - 3, top: b.r[1] - y0 + 10 - 3, width: (b.r[2] + 6) * b.p, height: b.r[3] + 6, background: b.c }} />
            ))}
            <Img src={asset(p.src)} style={{ position: "absolute", left: -x0 + 14, top: -y0 + 10, width: p.cssW, height: p.cssH, mixBlendMode: "multiply" }} />
            {p.ink === "white" ? <WhiteInk bars={bars} src={p.src} cssW={p.cssW} cssH={p.cssH} ix={-x0 + 14} iy={-y0 + 10} /> : null}
          </div>
          <div style={{ position: "absolute", left: x0 - 26, top: y0 - 10, width: 5, height: (y1 - y0 + 20) * clamp01(rule), background: p.barColour ?? RC.pageRed, boxShadow: "0 0 6px rgba(0,0,0,.35)" }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
export const ParagraphFocus: React.FC<ParagraphFocusProps> = (p) => {
  const f = useCurrentFrame();
  // M-072: vignette outside the motion-blur subtree
  return (
    <AbsoluteFill>
      <MBlur on={f < 14}><Inner {...p} /></MBlur>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
