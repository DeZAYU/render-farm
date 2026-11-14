// DC10 ReportLeaf: the real CSB Incident Reports Vol. 3 (2025) pages 5-6 on Pixelle, as an open two-page spread lying back in 3-D,
// read like a macro lens: a shallow band of sharp focus with the rest of the paper soft and darker. The camera starts on the
// report's own case heading ("1. Pixelle · April 15, 2020 · Jay, Maine"), crosses to page 6 and settles line by line on what the VO
// says: the crack through ~70 % of the wall, the last inspection (September 2019), the probable cause. Real type, no red.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./DC08_kit";

export type Stop = { f: number; x: number; y: number; z: number; h: number };   // frame, focus point in sheet px, zoom, sharp band height (px)

export const ReportLeaf: React.FC<{ sheet: string; sw: number; sh: number; stops: Stop[]; bg: string }> = ({ sheet, sw, sh, stops, bg }) => {
  const f = useCurrentFrame();
  let a = stops[0], b = stops[0], u = 0;
  for (let i = 1; i < stops.length; i++) { if (f >= stops[i - 1].f) { a = stops[i - 1]; b = stops[i]; u = io(interpolate(f, [a.f, b.f], [0, 1], cl)); } }
  if (f >= stops[stops.length - 1].f) { a = b = stops[stops.length - 1]; u = 0; }
  const x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u, z = a.z + (b.z - a.z) * u, h = a.h + (b.h - a.h) * u;
  const k = z * 1920 / sw * 2.2;                     // sheet px -> screen px
  const W = sw * k, H = sh * k;
  const left = 960 - x * k, top = 560 - y * k;
  const fy = y * k, band = h * k;
  const enter = io(interpolate(f, [0, 20], [0, 1], cl));
  const mask = `linear-gradient(180deg, transparent ${fy - band * 1.6}px, #000 ${fy - band * 0.6}px, #000 ${fy + band * 0.6}px, transparent ${fy + band * 1.6}px)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(12px) brightness(.28) saturate(.6)" }} />
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 52%", opacity: enter }}>
        <div style={{ position: "absolute", left, top, width: W, height: H, transform: `rotateX(${16 + 6 * (1 - enter)}deg)`, transformOrigin: `${x * k}px ${fy}px`, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "blur(5px) brightness(.55)" }} />
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
            <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 52%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
