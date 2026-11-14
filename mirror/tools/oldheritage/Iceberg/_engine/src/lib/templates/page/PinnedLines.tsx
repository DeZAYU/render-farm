// page / PinnedLines: the page is PINNED flat to a dark wall (four red pushpins); the shot opens with a pull-out reveal of the whole sheet,
// then the camera TILTS from line to line (each move pitches the view a few degrees, like a head tilting down the page) and a DD red bar
// lands on each line 0.3-0.5 s before it is said. The sheet itself never moves. Optional `softenAt` defocuses the body at the end.
// REF Dashcam Vol.3 E4 red multiply bars (bar 0:10.0; 0.3-0.5 s early, ~0.6 s per line) + Nocturn CP4 zoom-out reveal then push (psy 23:28.0,
// -8.7 %/s) + DD V1 E12 pin (D1 corkboard pushpin). One sheet, one wall: not a board of items (Corkboard).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, MBlur, PushPin, RC, asset, lerp, lerpLog } from "../../core";
import { ddWipe, markBars, WhiteInk, type Mark, type PageSrc } from "./shared";

export type PinnedLinesProps = PageSrc & {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  crop: [number, number, number, number]; // CSS [x0, y0, x1, y1] of the pinned sheet
  wide: number; // screen px per CSS px that shows the whole sheet
  lines: (Mark & { s?: number })[]; // each line: rects + bar start; camera tilts onto it ~14 f before (zoom s, default 2.3)
  softenAt?: number;
};
const Inner: React.FC<PinnedLinesProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const [x0, y0, x1, y1] = p.crop;
  const cx = (x0 + x1) / 2;
  let cy = (y0 + y1) / 2, s = p.wide * lerp(1.22, 1, EZ.settle(f / 40)), pitch = 0;
  for (const l of p.lines) {
    const u = EZ.inout((f - (l.at - 16)) / 26);
    const ly = (l.rects[0][1] + l.rects[l.rects.length - 1][1] + l.rects[l.rects.length - 1][3]) / 2;
    const dir = ly > cy ? 1 : -1;
    pitch += dir * 5 * Math.sin(Math.PI * u);
    cy = lerp(cy, ly, u); s = lerpLog(s, l.s ?? 2.3, u); // x stays on the sheet centre (lines are read whole)
  }
  s *= 1 + 0.004 * t;
  const bars = markBars(f, p.lines, { ink: p.ink, c: RC.pageRed, ease: ddWipe, perLine: 18, px: 2, py: 3, radius: 0 });
  const soft = p.softenAt !== undefined ? EZ.out2((f - p.softenAt) / 20) : 0;
  const pins: [number, number][] = [[x0 + 18, y0 + 18], [x1 - 18, y0 + 18], [x0 + 18, y1 - 18], [x1 - 18, y1 - 18]];
  return (
    <AbsoluteFill style={{ background: "#0d0c0c" }}>
      <AbsoluteFill style={{ perspective: "1700px" }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${pitch.toFixed(3)}deg)`, transformOrigin: "50% 50%" }}>
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px, 540px) scale(${s.toFixed(4)}) translate(${-cx}px, ${-cy}px)` }}>
            <div style={{ position: "absolute", left: x0 - 2000, top: y0 - 1500, width: x1 - x0 + 4000, height: y1 - y0 + 3000, background: "radial-gradient(ellipse 30% 30% at 50% 50%, #2b2827 0%, #141212 60%, #0b0a0a 100%)" }} />
            <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, background: "#fff", overflow: "hidden", isolation: "isolate",
              boxShadow: "6px 12px 24px rgba(0,0,0,.6)", filter: soft > 0 ? `blur(${(2.5 * soft).toFixed(2)}px)` : undefined }}>
              {bars.filter((b) => b.p > 0).map((b, i) => (
                <div key={i} style={{ position: "absolute", left: b.r[0] - x0 - 2, top: b.r[1] - y0 - 3, width: (b.r[2] + 4) * b.p, height: b.r[3] + 6, background: b.c }} />
              ))}
              <Img src={asset(p.src)} style={{ position: "absolute", left: -x0, top: -y0, width: p.cssW, height: p.cssH, mixBlendMode: "multiply" }} />
              {p.ink === "white" ? <WhiteInk bars={bars} src={p.src} cssW={p.cssW} cssH={p.cssH} ix={-x0} iy={-y0} px={2} py={3} /> : null}
            </div>
            {pins.map(([x, y], i) => <PushPin key={i} x={x} y={y} r={10} />)}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 66% at 50% 50%, rgba(0,0,0,0) 46%, rgba(0,0,0,.66) 100%)" }} />
    </AbsoluteFill>
  );
};
export const PinnedLines: React.FC<PinnedLinesProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.lines.some((l) => { const u = (f - (l.at - 16)) / 26; return u > 0.2 && u < 0.8; });
  return <MBlur on={fast}><Inner {...p} /></MBlur>;
};
