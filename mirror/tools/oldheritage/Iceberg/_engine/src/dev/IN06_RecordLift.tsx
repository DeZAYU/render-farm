// IN06 RecordLift: the real American Whitewater accident-database record (capture_page.py, sharp 2x capture) as a white sheet lying in 3-D
// over the darkened, defocused footage. The camera eases from the record's heading down to its field grid; the one field that matters
// (here the injury cell) lifts off the sheet toward camera on its own card while the rest of the record dims; one thin red rule draws
// under the value. Works for any captured record/grid page: pass the sheet size and the cell rectangle.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";
import { RED } from "../brand";

export const RecordLift: React.FC<{ bg: string; bgFrom: number; sheet: string; sw: number; sh: number; cell: [number, number, number, number]; rule: [number, number, number];
  n: number; liftAt: number; start: [number, number]; end: [number, number]; z0?: number; z1?: number }> =
  ({ bg, bgFrom, sheet, sw, sh, cell, rule, n, liftAt, start, end, z0 = 0.62, z1 = 0.95 }) => {
  const f = useCurrentFrame();
  const inn = out(interpolate(f, [0, 16], [0, 1], cl));
  const u = io(interpolate(f, [0, n - 6], [0, 1], cl));
  const lift = out(interpolate(f, [liftAt, liftAt + 20], [0, 1], cl));
  const rl = out(interpolate(f, [liftAt + 14, liftAt + 30], [0, 1], cl));
  const s = z0 + (z1 - z0) * u;
  const fx = start[0] + (end[0] - start[0]) * u, fy = start[1] + (end[1] - start[1]) * u;
  const [cx0, cy0, cx1, cy1] = cell;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.12)", filter: `blur(${10 + 6 * inn}px) brightness(${0.55 - 0.2 * inn}) saturate(0.7)` }} />
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 960 - sw / 2, top: 540 - sh / 2, width: sw, height: sh, transformStyle: "preserve-3d",
          transform: `translateY(${(1 - inn) * 120}px) rotateX(${16 - 4 * u}deg) rotateZ(${-1.6 + 0.8 * u}deg) scale(${s}) translate(${sw / 2 - fx}px, ${sh / 2 - fy}px)`,
          opacity: inn }}>
          <div style={{ position: "absolute", inset: 0, background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }} />
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: sw, height: sh, filter: `brightness(${1 - 0.5 * lift})` }} />
          <div style={{ position: "absolute", left: cx0, top: cy0, width: cx1 - cx0, height: cy1 - cy0, overflow: "hidden", background: "#fff",
            transform: `translateZ(${lift * 160}px) scale(${1 + 0.18 * lift})`, boxShadow: `0 ${24 * lift}px ${60 * lift}px rgba(0,0,0,${0.55 * lift})`, opacity: lift > 0 ? 1 : 0 }}>
            <Img src={staticFile(sheet)} style={{ position: "absolute", left: -cx0, top: -cy0, width: sw, height: sh }} />
            <div style={{ position: "absolute", left: rule[0] - cx0, top: rule[2] - cy0, width: (rule[1] - rule[0]) * rl, height: 5, background: RED }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
