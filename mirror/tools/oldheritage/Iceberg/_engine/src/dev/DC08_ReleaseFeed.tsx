// DC08 ReleaseFeed: the real US Marshals news release of 25 Oct 2007 (archived page capture, the mugshot left out) comes up out of a
// slot at the bottom of the frame like a printout, top first, in one smooth eased feed, tilted back in 3-D over the dim, soft photo of the
// town. It stops when the paragraph about the traffic stop in Campbellton and the foot pursuit reaches eye level; the rest of the
// sheet dims and the camera eases in on that paragraph. Real type, nothing re-set, no red.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC08_kit";

export const ReleaseFeed: React.FC<{ bg: string; sheet: string; sw: number; sh: number; para: [number, number]; stopAt: number; dimAt: number }> = ({ bg, sheet, sw, sh, para, stopAt, dimAt }) => {
  const f = useCurrentFrame();
  const W = 1100, k = W / sw, H = sh * k, SLOT = 1010;
  const [p0, p1] = para.map((v) => v * k);
  // feed: the sheet's top goes from the slot up until the paragraph sits at y ~ 470 (smooth: stepped feeds read as jump cuts)
  const u = interpolate(f, [4, stopAt], [0, 1], cl);
  const su = io(u);
  const top = SLOT - su * (SLOT - (470 - p0));
  const dim = io(interpolate(f, [dimAt, dimAt + 26], [0, 1], cl));
  const push = io(interpolate(f, [stopAt - 10, stopAt + 140], [0, 1], cl));
  const bgIn = out(interpolate(f, [0, 16], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) brightness(.34) saturate(.6)", transform: `scale(${1.08 + 0.04 * push})`, opacity: bgIn }} />
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 40%", transform: `scale(${1 + 0.16 * push})`, transformOrigin: `50% ${(470 + (p1 - p0) / 2) / 10.8}%` }}>
        {/* everything below the slot is hidden: the paper appears out of it */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: SLOT, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 960 - W / 2, top, width: W, height: H, transform: "rotateX(14deg)", transformOrigin: `50% ${SLOT - top}px` }}>
            <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "drop-shadow(0 24px 40px rgba(0,0,0,.65))" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: p0 - 6, background: `rgba(10,10,10,${0.55 * dim})` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: p1 + 6, bottom: 0, background: `rgba(10,10,10,${0.55 * dim})` }} />
          </div>
        </div>
        {/* the slot's lip: a soft dark edge the paper comes out of */}
        <div style={{ position: "absolute", left: 0, right: 0, top: SLOT - 30, height: 70, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.85) 45%, #000)" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
