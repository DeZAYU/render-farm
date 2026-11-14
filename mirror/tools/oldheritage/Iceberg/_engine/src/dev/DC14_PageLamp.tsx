// DC14 PageLamp: the real FOX 5 article (page capture, cut down to its masthead, headline + byline and the police paragraph) lying
// on a dark surface like a sheet under a single lamp. It starts steep and far (a page on a table), the camera rises and the sheet
// turns up toward it while a warm pool of light slides from the headline ("national news") down to the police paragraph (the white
// Infiniti G37, the charge, "a random act"); everything outside the pool stays in shadow. Real type only, no highlight, no red.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, Cam, cl, ease, out } from "./DC01_kit";

export const PageLamp: React.FC<{ bg: string; bgFrom: number; bgKeys: CK[]; sheet: string; sw: number; sh: number;
  head: [number, number, number, number]; para: [number, number, number, number]; moveAt: number; moveLen: number }> = ({ bg, bgFrom, bgKeys, sheet, sw, sh, head, para, moveAt, moveLen }) => {
  const f = useCurrentFrame();
  const W = 1500, k = W / sw, H = sh * k;
  const enter = out(interpolate(f, [0, 30], [0, 1], cl));
  const mv = ease(f, moveAt, moveAt + moveLen);
  const rise = ease(f, 0, moveAt + moveLen);                       // camera rises over the whole shot
  const tilt = 50 - 32 * rise;                                       // page turns up toward the camera
  // focus point (sheet px): headline centre -> paragraph centre
  const fx = interpolate(mv, [0, 1], [(head[0] + head[2]) / 2, ((para[0] + para[2]) / 2 + sw / 2) / 2]);
  const fy = interpolate(mv, [0, 1], [(head[1] + head[3]) / 2, (para[1] + para[3]) / 2]);
  const lx = fx * k, ly = fy * k;
  const pr = interpolate(mv, [0, 1], [(head[2] - head[0]) * k * 0.62, (para[2] - para[0]) * k * 0.62]);
  const px = interpolate(mv, [0, 1], [lx, ((para[0] + para[2]) / 2) * k]);
  const zoom = 0.86 + 0.1 * rise;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Cam src={bg} from={bgFrom} keys={bgKeys} filter="blur(14px) brightness(.22) saturate(.6)" />
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 960 - lx, top: 520 - ly, width: W, height: H, transformStyle: "preserve-3d",
          transformOrigin: `${lx}px ${ly}px`, opacity: enter,
          transform: `translateZ(${-260 * (1 - enter)}px) scale(${zoom}) rotateX(${tilt}deg) rotateZ(${-2.5 + 1.5 * rise}deg)` }}>
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }} />
          {/* lamp: shadow everywhere but a soft warm pool on the focus */}
          <div style={{ position: "absolute", inset: -2, background: `radial-gradient(ellipse ${pr}px ${pr * 0.55}px at ${px}px ${ly}px, rgba(255,214,160,.10) 0%, rgba(8,6,4,0) 45%, rgba(8,6,4,.62) 78%, rgba(4,3,2,.86) 100%)` }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
