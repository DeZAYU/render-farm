// TOR15 PhotoWall: "867 homes and 94 businesses": the real photographs Karen Lee took in Cullman right after the tornado (frames of
// the garlan gudger upload, YmHcSvCxhEY), pinned edge to edge on a wall that runs away from the camera in 3-D. The prints land one
// after another, faster and faster, while the camera trucks along the wall and pulls back until the wall is too long to see the end
// of: the count is felt as a quantity of real damage, not typed as a number. A warm light pool drifts across the prints.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (n: number) => { const x = Math.sin(n * 91.17 + 7.3) * 43758.5453; return x - Math.floor(x); };

export const PhotoWall: React.FC<{ pics: string[]; cols: number; rows: number; first?: number; last?: number }> = ({ pics, cols, rows, first = 4, last }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const n = cols * rows, PW = 380, PH = 214, G = 22;
  const W = cols * (PW + G), H = rows * (PH + G);
  const end = last ?? durationInFrames - 20;
  // landing order: shuffled, accelerating (first prints slow, the rest pile in)
  const order = Array.from({ length: n }, (_, i) => i).sort((p, q) => rnd(p) - rnd(q));
  const landAt = (rank: number) => first + (end - first) * Math.pow(rank / (n - 1), 1.9);
  const t = io(f / durationInFrames);
  const pan = interpolate(t, [0, 1], [W * 0.3, W * 0.62]);
  const z = interpolate(t, [0, 1], [150, -650]);
  const ang = interpolate(t, [0, 1], [-18, -27]);
  const lx = 30 + 40 * t;
  return (
    <AbsoluteFill style={{ background: "#070707", overflow: "hidden", perspective: 1500, perspectiveOrigin: "50% 48%" }}>
      <div style={{ position: "absolute", left: width / 2, top: height / 2, width: W, height: H, transformStyle: "preserve-3d",
        transform: `translateZ(${z}px) rotateY(${ang}deg) translate(${-pan}px, ${-H / 2}px)` }}>
        <div style={{ position: "absolute", left: -600, top: -500, width: W + 1200, height: H + 1000, background: "radial-gradient(ellipse at 50% 50%, #1d1c1a 0%, #0c0c0c 70%)" }} />
        {Array.from({ length: n }, (_, i) => {
          const rank = order.indexOf(i), a = landAt(rank);
          const g = out(interpolate(f, [a, a + 7], [0, 1], cl)); if (g <= 0) return null;
          const c = i % cols, r = Math.floor(i / cols);
          const tilt = (rnd(i + 3) - 0.5) * 1.6;
          return (
            <div key={i} style={{ position: "absolute", left: c * (PW + G), top: r * (PH + G), width: PW, height: PH, border: "5px solid #fff", boxSizing: "border-box",
              boxShadow: "0 14px 30px rgba(0,0,0,.65)", opacity: g, transform: `translateZ(${(1 - g) * 120}px) rotate(${tilt}deg) scale(${0.92 + 0.08 * g})`, overflow: "hidden", background: "#222" }}>
              <Img src={staticFile(pics[i % pics.length])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
      {/* light pool drifting across the wall + soft falloff */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 65% at ${lx}% 45%, rgba(255,236,210,.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)` }} />
    </AbsoluteFill>
  );
};
