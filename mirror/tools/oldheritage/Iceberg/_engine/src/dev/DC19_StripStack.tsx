// DC19 StripStack: two lines from the real WSLS story (17 May 2017, captured) as paper strips over the dim, soft last frame of the
// clip. The damage line slides in from the right and settles ("a broken wiper and a busted corner of the grille"); on the quote the
// first strip rises and goes soft behind, and Wiley's own words slide in under it, sharp, with a thin white rule drawing under
// "God was definitely watching over me." Source credited small. No red.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { ease, io, useDcFonts } from "./DC01_kit";

type Strip = { src: string; w: number; h: number; at: number; rule?: [number, number, number] };
export const StripStack: React.FC<{ bg: string; bgT: number; a: Strip; b: Strip; credit: string }> = ({ bg, bgT, a, b, credit }) => {
  useDcFonts();
  const f = useCurrentFrame();
  const W = 1560;
  const ia = io(Math.min(1, Math.max(0, (f - a.at) / 22))), ib = io(Math.min(1, Math.max(0, (f - b.at) / 22)));
  const ha = (a.h * W) / a.w, hb = (b.h * W) / b.w;
  const ya = 540 - ha / 2 - ib * (hb / 2 + 70), yb = 540 - hb / 2 + 50;
  const rule = b.rule ? ease(f, b.at + 30, b.at + 60) : 0;
  const pz = 1 + 0.05 * io(Math.min(1, f / 300));
  const strip = (s: Strip, h: number, y: number, x: number, o: number, blur: number, dim: number) => (
    <div style={{ position: "absolute", left: 960 - W / 2 + x, top: y, width: W, height: h, opacity: o, filter: `blur(${blur}px) brightness(${dim})`, boxShadow: "0 18px 50px rgba(0,0,0,.7)", transform: "rotate(-0.6deg)" }}>
      <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgT * 30)} muted style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", filter: "blur(12px) brightness(.35) saturate(.6)" }} /></Freeze>
      <AbsoluteFill style={{ transform: `scale(${pz})` }}>
        {strip(a, ha, ya, (1 - ia) * 900, ia, ib * 3, 1 - 0.45 * ib)}
        {f >= b.at && strip(b, hb, yb, (1 - ib) * 900, ib, 0, 1)}
        {b.rule && <div style={{ position: "absolute", left: 960 - W / 2 + (b.rule[0] / b.w) * W, top: yb + (b.rule[2] / b.h) * hb, width: ((b.rule[1] - b.rule[0]) / b.w) * W * rule, height: 3, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.6)" }} />}
        <div style={{ position: "absolute", right: 960 - W / 2, top: yb + hb + 18, fontFamily: "Elite", fontSize: 24, color: "rgba(240,238,232,.65)", opacity: ib }}>{credit}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
