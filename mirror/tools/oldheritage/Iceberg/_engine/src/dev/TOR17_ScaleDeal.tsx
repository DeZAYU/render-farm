// TOR17 ScaleDeal: "EF1, a hundred and ten miles an hour, near the bottom of the scale" on the NWS Jacksonville survey statement.
// Phase A: the statement's header block, the "Rating: EF1" and "Estimated Peak Wind: 110 mph" lines are cut out of the real page as
// paper strips and lift toward the camera (shadow, page sinks). Phase B: the page falls away and the statement's own six EF-scale rows
// are dealt one by one into a 3-D stack, EF5 at the top, EF0 at the bottom; the EF1 row (second from the bottom) stays lit in a white
// frame and slides out of the stack while the five others sink. Real page pixels only, no drawn text.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const out = Easing.bezier(0.2, 0.7, 0.2, 1);
type R = [number, number, number, number]; // x0 y0 x1 y1 in page px

/** a rectangle of the page image shown at `s` px per page px, its top-left at (x, y) */
const Cut: React.FC<{ src: string; iw: number; ih: number; r: R; s: number; style?: React.CSSProperties }> = ({ src, iw, ih, r, s, style }) => (
  <div style={{ position: "absolute", width: (r[2] - r[0]) * s, height: (r[3] - r[1]) * s, overflow: "hidden", background: "#fff", ...style }}>
    <Img src={staticFile(src)} style={{ position: "absolute", left: -r[0] * s, top: -r[1] * s, width: iw * s, height: ih * s, maxWidth: "none" }} />
  </div>
);

export const ScaleDeal: React.FC<{
  src: string; iw: number; ih: number;
  block: R;            // header block shown in phase A
  lifts: { r: R; at: number }[]; // lines lifted in phase A (frame)
  rows: R[];           // EF0..EF5 rows of the page's scale table
  lit: number;         // index of the rated row
  bAt: number;         // frame phase B starts
}> = ({ src, iw, ih, block, lifts, rows, lit, bAt }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  // ---- phase A
  const sA = (W * 0.86) / (block[2] - block[0]);
  const bx = (W - (block[2] - block[0]) * sA) / 2, by = (H - (block[3] - block[1]) * sA) / 2;
  const aIn = io(interpolate(f, [0, 14], [0, 1], cl));
  const aOut = io(interpolate(f, [bAt - 4, bAt + 10], [0, 1], cl));
  const push = 1 + 0.04 * (f / D);
  const sink = interpolate(f, [lifts[0].at, lifts[0].at + 12], [0, 0.55], cl);
  const tiltA = interpolate(aIn, [0, 1], [16, 6]) - 10 * aOut;
  // ---- phase B
  const n = rows.length, rw = Math.max(...rows.map((r) => r[2] - r[0])), rh = rows[0][3] - rows[0][1];
  const sB = (W * 0.5) / rw, gap = rh * sB * 1.55;
  const stackH = (n - 1) * gap + rh * sB, top = (H - stackH) / 2;
  const litAt = bAt + 6 + n * 4 + 4;
  const litK = out(interpolate(f, [litAt, litAt + 16], [0, 1], cl));
  const bIn = io(interpolate(f, [bAt, bAt + 12], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#060606", overflow: "hidden", perspective: 1600 }}>
      <AbsoluteFill style={{ opacity: aIn * (1 - aOut), transformStyle: "preserve-3d", transformOrigin: "50% 50%",
        transform: `translateY(${-80 * aOut}px) rotateX(${tiltA}deg) scale(${push * (1 - 0.12 * aOut)})` }}>
        <Cut src={src} iw={iw} ih={ih} r={block} s={sA} style={{ left: bx, top: by, boxShadow: "0 30px 80px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: bx, top: by, width: (block[2] - block[0]) * sA, height: (block[3] - block[1]) * sA, background: "#000", opacity: sink }} />
        {lifts.map((l, i) => {
          const k = out(interpolate(f, [l.at, l.at + 14], [0, 1], cl));
          const pad = 10 / sA, r: R = [l.r[0] - pad, l.r[1] - 2, l.r[2] + pad * 6, l.r[3] + 2];
          return <Cut key={i} src={src} iw={iw} ih={ih} r={r} s={sA} style={{
            left: bx + (r[0] - block[0]) * sA, top: by + (r[1] - block[1]) * sA, opacity: k > 0 ? 1 : 0,
            transform: `translate(${18 * k}px, ${-10 * k}px) scale(${1 + 0.07 * k})`, transformOrigin: "0% 50%",
            boxShadow: `0 ${22 * k}px ${50 * k}px rgba(0,0,0,${0.7 * k})`, outline: `${5 * k}px solid rgba(255,255,255,${k})` }} />;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: bIn, transformStyle: "preserve-3d",
        transform: `rotateY(${-16 + 6 * io(f / D)}deg) rotateX(5deg) scale(${1.02 + 0.05 * (f - bAt) / (D - bAt)})` }}>
        {rows.map((r, i) => {
          const pos = n - 1 - i; // EF5 at the top
          const dAt = bAt + 6 + i * 4;
          const d = out(interpolate(f, [dAt, dAt + 12], [0, 1], cl));
          const isLit = i === lit;
          const dim = isLit ? 0 : 0.62 * litK;
          const x = (W - (r[2] - r[0]) * sB) / 2 - W * 0.06 + (isLit ? 70 * litK : 0);
          const y = top + pos * gap + (1 - d) * 140;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, opacity: d, transform: `translateZ(${isLit ? 90 * litK : 0}px)`, transformStyle: "preserve-3d" }}>
              <Cut src={src} iw={iw} ih={ih} r={[r[0] - 8, r[1] - 4, r[2] + 8, r[3] + 4]} s={sB} style={{ position: "relative",
                boxShadow: `0 ${10 + 20 * (isLit ? litK : 0)}px 40px rgba(0,0,0,.65)`, outline: isLit ? `${5 * litK}px solid rgba(255,255,255,${litK})` : "none" }} />
              <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dim }} />
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
