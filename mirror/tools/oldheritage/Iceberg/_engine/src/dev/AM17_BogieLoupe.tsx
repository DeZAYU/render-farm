// AM17 BogieLoupe (Mindbender, "the back car started to fishtail. Its wheel assembly had come apart."): a real photo of a Mindbender
// car on the track (Simon Law, 2007) held big and dimmed; a round magnifier with a thin white rim glides in from the riders to the
// car's wheel assembly (the bogie: road, side and up-stop wheels on their yellow arms) and settles on it at 2.3x. Inside the glass the
// photo is full colour and sharp, outside it drops to dim and soft. A slow push the whole time; no text, no red.
// Props: src (graded still), iw/ih (its pixel size), from/to = image points (0..1) the glass starts on / settles on, r = glass radius px,
// mag, at = frame the glass arrives.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const BogieLoupe: React.FC<{ src: string; iw: number; ih: number; from: [number, number]; to: [number, number]; r?: number; mag?: number; at?: number; fx?: number; fy?: number }> = ({ src, iw, ih, from, to, r = 250, mag = 2.3, at = 46, fx = 0.6, fy = 0.4 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const s = 1.06 + 0.07 * (f / dur);                                    // slow push
  const k = Math.max(1920 / iw, 1080 / ih) * s;
  const cx0 = (a: number, lo: number) => Math.min(0, Math.max(lo, a));
  const ox = cx0(960 - fx * iw * k, 1920 - iw * k), oy = cx0(540 - fy * ih * k, 1080 - ih * k); // image origin (focus centred, edges never inside the frame)
  const X = (u: number) => ox + u * iw * k, Y = (v: number) => oy + v * ih * k;
  const g = io(interpolate(f, [8, at], [0, 1], cl));
  const lx = X(from[0] + (to[0] - from[0]) * g), ly = Y(from[1] + (to[1] - from[1]) * g);
  const appear = out(interpolate(f, [0, 12], [0, 1], cl));
  const rr = r * (0.82 + 0.18 * appear) * (1 + 0.04 * io(interpolate(f, [at, dur], [0, 1], cl)));
  const m = mag * (0.9 + 0.1 * io(interpolate(f, [at - 10, at + 30], [0, 1], cl)));
  const dim = 0.25 + 0.75 * (1 - interpolate(f, [0, 18], [0, 1], cl)); // outside: full -> dim
  const img = (kk: number, cx: number, cy: number) => {
    // image scaled by kk*k, positioned so the point under (cx, cy) stays there
    const u = (cx - ox) / (iw * k), v = (cy - oy) / (ih * k);
    return { position: "absolute" as const, width: iw * k * kk, height: ih * k * kk, left: cx - u * iw * k * kk, top: cy - v * ih * k * kk };
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ ...img(1, 960, 540), filter: `brightness(${0.42 + 0.58 * dim}) saturate(${0.55 + 0.45 * dim}) blur(${(1 - dim) * 2.2}px)` }} />
      <div style={{ position: "absolute", left: lx - rr, top: ly - rr, width: rr * 2, height: rr * 2, borderRadius: "50%", overflow: "hidden", opacity: appear,
        boxShadow: "0 0 0 5px rgba(255,255,255,.95), 0 18px 60px rgba(0,0,0,.75)" }}>
        <div style={{ position: "absolute", left: -(lx - rr), top: -(ly - rr), width: 1920, height: 1080 }}>
          <Img src={staticFile(src)} style={{ ...img(m, lx, ly), filter: "contrast(1.05) saturate(1.08)" }} />
        </div>
        {/* glass: soft inner rim shade + one faint highlight */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 40px rgba(0,0,0,.45)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 26%, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 30%)" }} />
      </div>
    </AbsoluteFill>
  );
};
