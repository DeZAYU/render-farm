// AM16 WireFold: the real Associated Press story as it ran in The Daily Herald (Everett), 24 Oct 2001, "Weight blamed in woman's
// death during water ride" (captured with _tools/capture_page.py; headline block + the article paragraphs, the ad slot between them
// cut out). The sheet arrives folded in half like a wire printout and unfolds toward the camera over the dim, blurred ride photo; then
// it settles, tilted a touch, and the camera steps down it paragraph by paragraph with the VO: the paragraph in play stays full
// strength while the rest of the sheet sinks back under a paper wash. The case's one red mark: a rule drawn under "at least 4 feet tall"
// (the only rule posted at the ride).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type WKey = { at: number; y: number; k: number; para: [number, number] }; // focus y (page px), zoom, live paragraph band

const pick = (f: number, keys: WKey[]) => {
  let c = { y: keys[0].y, k: keys[0].k, p0: keys[0].para[0], p1: keys[0].para[1] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (f <= b.at - 18) break;
    const u = io(interpolate(f, [b.at - 18, b.at + 6], [0, 1], cl));
    c = { y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u, p0: a.para[0] + (b.para[0] - a.para[0]) * u, p1: a.para[1] + (b.para[1] - a.para[1]) * u };
  }
  return c;
};

export const WireFold: React.FC<{ page: string; pw: number; ph: number; bg: string; keys: WKey[]; rule: { segs: [number, number, number][]; at: number } }> = ({ page, pw, ph, bg, keys, rule }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = pick(f, keys);
  const arrive = out(interpolate(f, [0, 16], [0, 1], cl));
  const unfold = io(interpolate(f, [8, 34], [0, 1], cl));            // 0 folded -> 1 flat
  const settle = io(interpolate(f, [30, 60], [0, 1], cl));
  const k = c.k, half = ph / 2;
  const left = 960 - (pw / 2) * k, top = 540 - c.y * k + (1 - arrive) * 140;
  const dimA = 0.55 * settle;
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const wash = (y0: number, y1: number) => <div style={{ position: "absolute", left: 0, top: y0, width: pw, height: Math.max(0, y1 - y0), background: `rgba(244,241,234,${dimA})` }} />;
  const layer = (oy: number, h: number) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: h, overflow: "hidden", background: "#fff" }}>
      <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: -oy, width: pw, height: ph }} />
      <div style={{ position: "absolute", left: 0, top: -oy, width: pw, height: ph }}>
        {wash(0, c.p0 - 14)}{wash(c.p1 + 14, ph)}
        {ru > 0 && rule.segs.map(([x0, x1, y], i) => <div key={i} style={{ position: "absolute", left: x0, top: y, height: 6, width: (x1 - x0) * Math.min(1, Math.max(0, ru * rule.segs.length - i)), background: RED }} />)}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 60% at 45% 40%, rgba(0,0,0,0) 40%, rgba(60,50,40,.22) 100%)" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.15 + 0.05 * f / dur})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) brightness(.3) saturate(.65)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left, top, width: pw * k, height: ph * k, opacity: arrive, transformStyle: "preserve-3d",
          transform: `rotateX(${6 * settle + 12 * (1 - unfold)}deg) rotateZ(${-1.6 + 0.8 * io(f / dur)}deg)`, transformOrigin: `50% ${(c.y / ph) * 100}%` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${k})`, transformOrigin: "0 0", transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", left: 0, top: half, width: pw, height: half, boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>{layer(half, half)}</div>
            <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: half, transformOrigin: "50% 100%", transformStyle: "preserve-3d", transform: `rotateX(${-178 * (1 - unfold)}deg)` }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>{layer(0, half)}</div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateX(180deg)", background: "linear-gradient(180deg, #e9e5dc, #d8d3c8)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: `linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,${0.18 * (1 - settle * 0.6)}))` }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 48%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
