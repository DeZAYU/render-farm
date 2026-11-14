// page / InfoboxBar: the fact box lifts off the page. The whole page sits behind (it blurs and darkens in 16 f); the infobox / lead block is
// LIFTED out as its own card (rises ~70 px and settles with a small clockwise turn, Farrell B4 lift-out), the camera then glides down the
// card to the fact row and the DD red bar wipes the value on its word.
// REF Dashcam Vol.1 E9 Guardian red bar @4:15.8 (wp3 sec_C Wiki red bars @ abs 5744) + Farrell B4 UI lift-out (OF 4:29.5: page blurs
// Laplacian 1000 -> 270 in 16 f, the card rises and settles in 20-24 f with a 3.4 deg turn).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, RC, asset, clamp01, lerp, lerpLog } from "../../core";
import { PageSheet, ddWipe, markBars, WhiteInk, type Mark, type PageSrc } from "./shared";

export type InfoboxBarProps = PageSrc & {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  box: [number, number, number, number]; // CSS [x0, y0, x1, y1] of the infobox / lead block that lifts
  page: { cx: number; cy: number; s: number }; // framing of the page behind
  liftAt?: number; // default 8
  row?: { cy: number; s: number; at: number; d?: number }; // glide down the card to this CSS y (and zoom), on its word
  bars?: Mark[]; // DD red bar on the value (CSS px)
};
const Inner: React.FC<InfoboxBarProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const la = p.liftAt ?? 8;
  const lu = EZ.quick((f - la) / 22);
  const pb = EZ.out2((f - la) / 16);
  const [x0, y0, x1, y1] = p.box;
  const bw = x1 - x0, bh = y1 - y0;
  const sc0 = p.page.s; // card starts at the page scale, in place
  const sFit = Math.min(1500 / bw, 920 / bh);
  const ru = p.row ? EZ.move((f - p.row.at) / (p.row.d ?? 32)) : 0;
  const sCard = lerpLog(lerpLog(sc0, sFit, lu), p.row?.s ?? sFit, ru) * (1 + 0.007 * t);
  // card centre in screen px: from its spot on the page to the frame centre; then the camera glides to the row
  const homeX = 960 + ((x0 + x1) / 2 - p.page.cx) * sc0, homeY = 540 + ((y0 + y1) / 2 - p.page.cy) * sc0;
  const focusY = p.row ? lerp((y0 + y1) / 2, p.row.cy, ru) : (y0 + y1) / 2;
  const cardX = lerp(homeX, 960, lu), cardY = lerp(homeY, 540, lu) - 70 * lu * (1 - ru);
  const rot = lerp(0, -3.4, clamp01((f - la) / 14)) * (1 - EZ.out3((f - la - 14) / 12)) + 0.08 * t - 0.6 * lu;
  const bars = markBars(f, p.bars, { ink: p.ink, c: RC.pageRed, ease: ddWipe, perLine: 18, px: 3, py: 3, radius: 0 });
  return (
    <AbsoluteFill style={{ background: "#141313" }}>
      <AbsoluteFill style={{ filter: `blur(${(6 * pb).toFixed(2)}px) brightness(${(1 - 0.62 * pb).toFixed(3)})` }}>
        <PageSheet src={p.src} cssW={p.cssW} cssH={p.cssH} cx={p.page.cx} cy={p.page.cy} s={p.page.s * (1 + 0.004 * t)} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0",
        transform: `translate(${cardX.toFixed(2)}px, ${cardY.toFixed(2)}px) rotate(${rot.toFixed(3)}deg) scale(${sCard.toFixed(4)}) translate(${-(x0 + x1) / 2}px, ${-focusY}px)` }}>
        <div style={{ position: "absolute", left: x0 - 10, top: y0 - 10, width: bw + 20, height: bh + 20, background: "#fff", overflow: "hidden", isolation: "isolate",
          boxShadow: `0 ${(8 + 30 * lu).toFixed(1)}px ${(16 + 40 * lu).toFixed(1)}px rgba(0,0,0,${(0.2 + 0.5 * lu).toFixed(2)})` }}>
          {bars.filter((b) => b.p > 0).map((b, i) => (
            <div key={i} style={{ position: "absolute", left: b.r[0] - x0 + 10 - 3, top: b.r[1] - y0 + 10 - 3, width: (b.r[2] + 6) * b.p, height: b.r[3] + 6, background: b.c }} />
          ))}
          <Img src={asset(p.src)} style={{ position: "absolute", left: -x0 + 10, top: -y0 + 10, width: p.cssW, height: p.cssH, mixBlendMode: "multiply" }} />
          {p.ink === "white" ? <WhiteInk bars={bars} src={p.src} cssW={p.cssW} cssH={p.cssH} ix={-x0 + 10} iy={-y0 + 10} /> : null}
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
export const InfoboxBar: React.FC<InfoboxBarProps> = (p) => {
  const f = useCurrentFrame();
  const la = p.liftAt ?? 8;
  const ra = p.row?.at ?? -99;
  return <MBlur on={(f > la + 1 && f < la + 12) || (f > ra + 2 && f < ra + 18)}><Inner {...p} /></MBlur>;
};
