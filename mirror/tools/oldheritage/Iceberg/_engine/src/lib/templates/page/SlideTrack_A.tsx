// page / SlideTrack_A (EDITOR A sibling of VVPushHighlight / ParagraphFocus; Amusement Park 2026-10-19).
// REF VV 2026 9:41.4-9:46.0 + 5:54 (TEMPLATE_UPGRADES #13): the captured page SLIDES IN from the right (~0.5 s, decelerating, peak ~-540 px/s),
// then the camera TRACKS ALONG the marked line while the mark wipes word by word (~1 s per line), with a slight pull (-1.4 %/s) and +0.2 deg/s roll.
// Marks: DD red bar under the multiplied page (default) or VV yellow #D5DE10 marker. Behind the page: the same page blurred and dimmed (no black
// side bars, M-073). Real captures only (headless Chrome, 2x DPR, phrase rects in CSS px). Silent (dip_whoosh on the slide-in is the case's call).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, H, W, asset, clamp01, lerp } from "../../core";

export type STMark = { r: [number, number, number, number]; at: number; dur?: number }; // CSS px [x, y, w, h] of one line
export type SlideTrackAProps = {
  src: string; cssW: number; cssH: number; // capture (PNG at 2x DPR, cssW x cssH CSS px)
  scale?: number; // screen px per CSS px (1.25 default: a 1280 px page -> 1600 px wide)
  marks: STMark[]; mode?: "bar" | "yellow"; start?: { x: number; y: number }; // CSS px point centred when the slide lands
  slide?: number; credit?: string; exitAt?: number;
};
export const SlideTrack_A: React.FC<SlideTrackAProps> = ({ src, cssW, cssH, scale = 1.25, marks, mode = "bar", start, slide = 15, credit, exitAt }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  // camera target: the start point, then each mark's line (centre-left of the line, tracking right as it wipes)
  const s0 = start ?? { x: marks[0].r[0] + marks[0].r[2] / 2, y: marks[0].r[1] };
  let cx = s0.x, cy = s0.y;
  for (const m of marks) {
    const d = m.dur ?? 30;
    const u = EZ.quick(clamp01((f - m.at + 8) / 22));
    const w = clamp01((f - m.at) / d);
    cx = lerp(cx, m.r[0] + m.r[2] * (0.35 + 0.3 * w), u); cy = lerp(cy, m.r[1] + m.r[3] / 2, u);
  }
  const sc = scale * (1 - 0.014 * t);
  const inU = EZ.quick(clamp01(f / slide));
  const slideX = lerp(W * 0.9, 0, inU);
  const rot = 0.2 * t;
  const ex = exitAt === undefined ? 0 : EZ.in2((f - exitAt) / 12);
  const left = W / 2 - cx * sc + slideX, top = H / 2 - cy * sc;
  return (
    <AbsoluteFill style={{ background: "#0d0b0b", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(.5) saturate(.6)", transform: "scale(1.3)" }}>
        {/* full-frame cover, centred on the camera point: never leaves an uncovered band (M-073; the old cssW*0.9 placement went black when the camera sat near a page edge) */}
        <Img src={asset(src)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, objectFit: "cover", objectPosition: `${(100 * clamp01(cx / cssW)).toFixed(2)}% ${(100 * clamp01(cy / cssH)).toFixed(2)}%` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `rotate(${rot.toFixed(3)}deg)`, opacity: (1 - ex) * clamp01(f / 4) }}>
        <div style={{ position: "absolute", left, top, width: cssW * sc, height: cssH * sc, boxShadow: "0 30px 90px rgba(0,0,0,.6)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: cssW, height: cssH, transform: `scale(${sc.toFixed(5)})`, transformOrigin: "0 0", background: "#fff" }}>
            {mode === "bar" ? marks.map((m, i) => { const p = ddW(clamp01((f - m.at) / (m.dur ?? 30))); return p > 0 ? <div key={i} style={{ position: "absolute", left: m.r[0] - 4, top: m.r[1] - 2, width: (m.r[2] + 8) * p, height: m.r[3] + 4, background: "#E01E1E" }} /> : null; }) : null}
            <Img src={asset(src)} style={{ position: "absolute", left: 0, top: 0, width: cssW, height: cssH, mixBlendMode: mode === "bar" ? "multiply" : undefined }} />
            {mode === "yellow" ? marks.map((m, i) => { const p = EZ.hlWipe(clamp01((f - m.at) / (m.dur ?? 30))); return p > 0 ? <div key={i} style={{ position: "absolute", left: m.r[0] - 4, top: m.r[1] - 1, width: (m.r[2] + 8) * p, height: m.r[3] + 2, background: "#D5DE10", mixBlendMode: "multiply", opacity: 0.85 }} /> : null; }) : null}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 58%, rgba(10,6,6,.42) 100%)", pointerEvents: "none" }} />
      {credit ? <div style={{ position: "absolute", left: 40, bottom: 26, fontFamily: "Inter", fontWeight: 500, fontSize: 28, color: "#F2F2F2", opacity: 0.8 * (1 - ex), textShadow: "0 1px 4px rgba(0,0,0,.85)" }}>{credit}</div> : null}
    </AbsoluteFill>
  );
};
const ddW = (x: number) => EZ.hlWipe(x);
