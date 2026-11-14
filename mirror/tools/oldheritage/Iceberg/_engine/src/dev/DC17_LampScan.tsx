// DC17 LampScan: the real GMA News page (17 Oct 2025, captured) cut down to its headline block and the injured-count paragraph,
// laid as one paper sheet, square to camera, over a dark soft copy of the quake damage. The room is dark; one warm lamp pool lies
// on the headline ("settled at 79"), then slides down the sheet to the NDRRMC paragraph ("more than 550 injured") as the camera
// eases after it. Source credited small under the sheet. No red.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ease, io, useDcFonts } from "./DC01_kit";

export const LampScan: React.FC<{ bg: string; sheet: string; sw: number; sh: number; spots: { f: number; y: number; h: number }[]; credit: string }> = ({ bg, sheet, sw, sh, spots, credit }) => {
  useDcFonts();
  const f = useCurrentFrame();
  let s = spots[0];
  for (let i = 1; i < spots.length; i++) { const a = spots[i - 1], b = spots[i]; if (f > a.f) { const u = io(Math.min(1, (f - a.f) / Math.max(1, b.f - a.f))); s = { f, y: a.y + (b.y - a.y) * u, h: a.h + (b.h - a.h) * u }; } }
  const W = 1280, H = (W / sw) * sh, sc = W / sw;
  const zoom = 1.0 + 0.12 * io(Math.min(1, f / 200));
  const camY = (s.y - sh / 2) * sc * 0.55;
  const rise = ease(f, 0, 18);
  const m = `radial-gradient(ellipse 70% ${((s.h * sc) / H) * 85}% at 50% ${(s.y / sh) * 100}%, rgba(0,0,0,0) 45%, #000 100%)`;
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -40, width: "calc(100% + 80px)", height: "calc(100% + 80px)", objectFit: "cover", filter: "blur(14px) brightness(.32) saturate(.6)" }} />
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2 + (1 - rise) * 40, width: W, height: H, opacity: rise,
        transform: `scale(${zoom}) translateY(${-camY}px) rotate(-1.2deg)`, transformOrigin: "50% 50%", boxShadow: "0 30px 80px rgba(0,0,0,.75)" }}>
        <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,6,4,.72)", WebkitMaskImage: m, maskImage: m } as React.CSSProperties} />
        <div style={{ position: "absolute", left: 0, right: 0, top: H + 18, textAlign: "right", fontFamily: "Elite", fontSize: 24, color: "rgba(240,238,232,.7)" }}>{credit}</div>
      </div>
    </AbsoluteFill>
  );
};
