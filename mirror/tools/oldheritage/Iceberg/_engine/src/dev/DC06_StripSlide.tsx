// DC06 StripSlide: the real WSET/KTUL story (page capture) cut into three straight-edged paper strips over the dim, soft-blurred
// inside camera: the station masthead slides in from the left, the headline + byline strip from the right under it; on the
// neighbour's words the strip with her quote rises from below, larger and nearer, while the first two dim and drift back. Real
// type, nothing re-set, no red; strips lie on a shallow 3-D tilt with soft shadows.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, Cam, cl, ease, out } from "./DC01_kit";

type Strip = { src: string; w: number; h: number; W: number; x: number; y: number; at: number; from: "l" | "r" | "b"; rot: number };
export const StripSlide: React.FC<{ bg: string; bgFrom: number; bgKeys: CK[]; strips: Strip[]; focusAt: number }> = ({ bg, bgFrom, bgKeys, strips, focusAt }) => {
  const f = useCurrentFrame();
  const fo = ease(f, focusAt, focusAt + 26);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Cam src={bg} from={bgFrom} keys={bgKeys} filter="blur(10px) brightness(.34) saturate(.6)" />
      <AbsoluteFill style={{ perspective: 1700, transform: `scale(${1 + 0.05 * fo})` }}>
        {strips.map((s, i) => {
          const a = out(interpolate(f, [s.at, s.at + 18], [0, 1], cl));
          const last = i === strips.length - 1;
          const back = last ? 0 : fo;
          const H = s.W * s.h / s.w;
          const dx = s.from === "l" ? -700 * (1 - a) : s.from === "r" ? 700 * (1 - a) : 0, dy = s.from === "b" ? 420 * (1 - a) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: s.x - s.W / 2, top: s.y - H / 2 + (last ? 0 : -60 * back), width: s.W, height: H, opacity: a * (1 - 0.55 * back),
              transform: `translate(${dx}px, ${dy}px) rotateX(${6 - 2 * a}deg) rotateZ(${s.rot}deg) translateZ(${-140 * back + (last ? 60 * fo : 0)}px)`,
              boxShadow: "0 22px 50px rgba(0,0,0,.6)", filter: back > 0 ? `blur(${2.2 * back}px)` : undefined }}>
              <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
