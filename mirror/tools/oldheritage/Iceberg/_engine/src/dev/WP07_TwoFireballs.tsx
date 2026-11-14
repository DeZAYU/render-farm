// WP07 device: "The first fireball came twenty five minutes after the derailment, and the last of thirteen came more than ten hours
// later." The window filmer's fireball over the rooftops replays slowed at full frame; on "the last of thirteen" it narrows to the left
// half while a second filmer's fireball (portrait, filling the frame) slides in on the right, a white seam drawn down between them.
// Two filmers, two of the thirteen fireballs, both big; no timing labels (which fireball each one was is not known).
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useWpFonts, io, cl } from "./WP01_kit";

type Clip = { src: string; from: number; rate: number; w: number; h: number; fx: number; fy: number; s0: number; s1: number };
type P = { n: number; a: Clip; b: Clip; split: number /* frame the second clip enters */ };

/** a clip covering a box (x, w) of the full-height frame, with its own push (focus fx, fy in 0..1 of the source) */
const Panel: React.FC<{ c: Clip; x: number; w: number; f: number; n: number }> = ({ c, x, w, f, n }) => {
  const { height } = useVideoConfig();
  const sc = Math.max(w / c.w, height / c.h);             // cover
  const W = c.w * sc, H = c.h * sc;
  const s = c.s0 + (c.s1 - c.s0) * io(f / Math.max(1, n - 1));
  const left = Math.min(0, Math.max(w - W, w / 2 - c.fx * W)), top = Math.min(0, Math.max(height - H, height / 2 - c.fy * H));
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: w, height, overflow: "hidden", background: "#000" }}>
      <div style={{ position: "absolute", left, top, width: W, height: H, transform: `scale3d(${s},${s},1)`, transformOrigin: `${c.fx * 100}% ${c.fy * 100}%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(c.src)} startFrom={Math.round(c.from * 30)} playbackRate={c.rate} muted style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export const WP07_TwoFireballs: React.FC<P> = ({ n, a, b, split }) => {
  useWpFonts();
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const k = io(interpolate(f, [split, split + 26], [0, 1], cl));      // the split opening, eased both ends (an ease-out jumped)
  const seam = io(interpolate(f, [split + 6, split + 24], [0, 1], cl));  // the white seam drawing down
  const gap = 6, half = (width - gap) / 2;
  const wA = width - (width - half) * k;                                // left panel narrows from full width to half
  const xB = width - (half) * k + gap * k;                               // right panel slides in from the right edge
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Panel c={a} x={0} w={wA} f={f} n={n} />
      {f >= split && <Panel c={b} x={xB} w={half} f={f - split} n={n - split} />}
      {f >= split && <div style={{ position: "absolute", left: wA, top: 0, width: gap * k, height: height * seam, background: "#fff", boxShadow: "0 0 18px rgba(0,0,0,.6)" }} />}
    </AbsoluteFill>
  );
};
