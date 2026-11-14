// IN12 ChainCast: the real 2016 chain and its 2026 bronze side by side. Left: the filmer's frame of the second chain, frozen, in a white
// portrait frame. Right: the Times of Central Asia photo of the sculpture "Unity" slides in level with it, the outlet's own masthead, date
// and headline set small above. On the VO the left frame slides out and the camera pushes into the bronze, ending on the last figure's
// hand reaching past the railing. Real pictures only.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

export const ChainCast: React.FC<{
  clip: string; t: number; ciw: number; cih: number; crop: [number, number, number, number]; photo: string; piw: number; pih: number; head: string; hw: number; hh: number;
  inAt: number; soloAt: number; handAt: number; hand: [number, number]; n: number;
}> = ({ clip, t, ciw, cih, crop, photo, piw, pih, head, hw, hh, inAt, soloAt, handAt, hand, n }) => {
  const f = useCurrentFrame();
  const a = out(interpolate(f, [0, 18], [0, 1], cl));
  const b = out(interpolate(f, [inAt, inAt + 22], [0, 1], cl));
  const solo = io(interpolate(f, [soloAt, soloAt + 30], [0, 1], cl));
  const hz = io(interpolate(f, [handAt, Math.max(handAt + 40, n - 6)], [0, 1], cl));
  // left: crop (x0,y0,x1,y1 of the clip, px) shown 560 px tall
  const [x0, y0, x1, y1] = crop, LH = 620, ls = LH / (y1 - y0), LW = (x1 - x0) * ls;
  // right: the photo, 620 px tall side by side -> fills the frame on solo, then pushes to the hand
  const RH0 = 620, RW0 = RH0 * piw / pih;
  const gap = 60, totalW = LW + gap + RW0, lx = 960 - totalW / 2;
  const RH = RH0 + (1080 * 1.0 - RH0) * solo, RW = RH * piw / pih;
  const rx0 = lx + LW + gap, ry0 = 540 - RH0 / 2 + 40;
  let rx = rx0 + ((960 - RW / 2) - rx0) * solo, ry = ry0 + ((540 - RH / 2) - ry0) * solo;
  const zs = 1 + 1.3 * hz;
  const hx = rx + hand[0] * RW, hy = ry + hand[1] * RH;
  return (
    <AbsoluteFill style={{ background: "#0b0b0b", overflow: "hidden" }}>
      <Img src={staticFile(photo)} style={{ position: "absolute", inset: -60, width: 2040, height: 1200, objectFit: "cover", filter: "blur(30px) brightness(.3) saturate(.6)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${(960 - hx) * hz * 0.55}px, ${(470 - hy) * hz * 0.55}px) scale(${zs})`, transformOrigin: `${hx}px ${hy}px` }}>
        <div style={{ position: "absolute", left: lx - (1 - a) * 80 - solo * 900, top: 540 - LH / 2 + 40, width: LW, height: LH, overflow: "hidden", outline: "6px solid #fff",
          boxShadow: "0 24px 70px rgba(0,0,0,.7)", opacity: a * (1 - solo) }}>
          <Freeze frame={0}><OffthreadVideo src={staticFile(clip)} startFrom={Math.round(t * 30)} muted
            style={{ position: "absolute", left: -x0 * ls, top: -y0 * ls, width: ciw * ls, height: cih * ls }} /></Freeze>
        </div>
        <div style={{ position: "absolute", left: rx + (1 - b) * 120, top: ry, width: RW, height: RH, overflow: "hidden", outline: `${6 * (1 - solo)}px solid #fff`,
          boxShadow: "0 24px 70px rgba(0,0,0,.7)", opacity: b }}>
          <Img src={staticFile(photo)} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 960 - hw * 0.42 / 2, top: 46 - solo * 40, width: hw * 0.42, height: hh * 0.42, opacity: b * (1 - solo),
        boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
        <Img src={staticFile(head)} style={{ width: "100%", height: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};
