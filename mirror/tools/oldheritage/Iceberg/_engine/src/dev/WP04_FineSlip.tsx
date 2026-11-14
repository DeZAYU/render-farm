// WP04 device FineSlip: the OSHA citation (U.S. Dept. of Labor release, 30 Mar 2012, as quoted by NBC DFW) prints line by line on a
// paper slip that feeds up the right side of the frozen, darkened crossing shot (the plant burning behind the rail signals) in VO time:
// the proposed fine, the seven serious violations, then the release's own words on ventilation and the sprinkler system. On "Forty five
// thousand dollars" the fine line is torn off the slip, the slip drops away, and the strip is held big in the middle ("remember that number").
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RED } from "../brand";
import { ARCH, useWpFonts } from "./WP01_kit";
import { Still, cl, io } from "./WP45_kit";

const ink = "#161514";
type Ln = { at: number; h: number; node: React.ReactNode };

export const FineSlip: React.FC<{ src: string; t: number; n: number; at: { fine: number; viol: number; vent: number; spr: number; tear: number; hold: number } }> = ({ src, t, n, at }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const W = 560, X = 1260;
  const el: React.CSSProperties = { fontFamily: "Elite", color: ink };
  const lines: Ln[] = [
    { at: 2, h: 44, node: <div style={{ ...ARCH, fontSize: 26, color: ink, letterSpacing: "0.04em" }}>U.S. DEPARTMENT OF LABOR</div> },
    { at: 8, h: 40, node: <div style={{ ...el, fontSize: 25 }}>OSHA · NEWS RELEASE · MARCH 30, 2012</div> },
    { at: 14, h: 58, node: <div style={{ ...el, fontSize: 28, borderBottom: `2px dashed ${ink}`, paddingBottom: 12 }}>MAGNABLEND INC. · WAXAHACHIE, TX</div> },
    { at: at.fine, h: 122, node: null }, // the fine strip is drawn separately (it tears off)
    { at: at.viol, h: 66, node: <div style={{ ...ARCH, fontSize: 38, color: ink }}>7 SERIOUS VIOLATIONS</div> },
    { at: at.vent, h: 118, node: <div style={{ ...el, fontSize: 28, lineHeight: 1.3 }}>"employees were exposed to fire hazards due to inadequate ventilation"</div> },
    { at: at.spr, h: 92, node: <div style={{ ...el, fontSize: 28, lineHeight: 1.3 }}>"failed to ensure that the fire sprinkler system was adequate"</div> },
  ];
  // the slip feeds up: each printed line pushes the paper up by its height (eased over 8 frames)
  const fed = (i: number) => lines.slice(0, i + 1).reduce((a, l) => a + l.h * io(interpolate(f, [l.at, l.at + 8], [0, 1], cl)), 0);
  const total = fed(lines.length - 1);
  const rise = io(interpolate(f, [0, 18], [0, 1], cl));
  const fall = io(interpolate(f, [at.tear + 6, at.tear + 34], [0, 1], cl));
  const bottom = 1080 - 40 * rise;              // paper's print edge (bottom)
  const top0 = bottom - total - 36;             // paper top
  const yOf = (i: number) => bottom - total + lines.slice(0, i).reduce((a, l) => a + l.h * io(interpolate(f, [l.at, l.at + 8], [0, 1], cl)), 0);
  const vis = (l: Ln) => interpolate(f, [l.at, l.at + 6], [0, 1], cl);
  // fine strip: on the slip until the tear, then lifted to centre
  const fy = yOf(3), lift = io(interpolate(f, [at.tear, at.tear + 26], [0, 1], cl));
  const sx = X + (960 - W / 2 - X) * lift, sy = fy + (470 - fy) * lift, sc = 1 + 0.55 * lift;
  const under = io(interpolate(f, [at.hold, at.hold + 14], [0, 1], cl));
  const tooth = (n2: number, top: boolean) => Array.from({ length: n2 + 1 }, (_, k) => `${(k / n2) * 100}% ${top ? (k % 2 ? 6 : 0) : (k % 2 ? 94 : 100)}%`);
  const dim = 0.55 - 0.2 * lift;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Still src={src} t={t} n={n} s0={1.02} s1={1.14} fx={0.35} fy={0.8} filter={`brightness(${dim}) saturate(.9)`} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.45) 100%)", opacity: 1 - lift }} />
      {/* the slip */}
      <div style={{ position: "absolute", left: X, top: top0, width: W, height: total + 36 + 80, background: "#ECE6D8",
        transform: `translateY(${fall * 1200}px) rotate(${-1.5 + fall * 6}deg)`, transformOrigin: "50% 0%",
        boxShadow: "0 20px 50px rgba(0,0,0,.6)", clipPath: `polygon(${tooth(28, true).join(",")}, 100% 100%, 0% 100%)` }}>
        {lines.map((l, i) => l.node && (
          <div key={i} style={{ position: "absolute", left: 32, right: 32, top: yOf(i) - top0, opacity: vis(l), clipPath: `inset(0 ${(1 - vis(l)) * 100}% 0 0)` }}>{l.node}</div>
        ))}
        {/* the gap the fine strip leaves after the tear */}
        <div style={{ position: "absolute", left: 0, right: 0, top: fy - top0 - 6, height: 116, background: "#0b0b0b", opacity: lift > 0 ? 1 : 0 }} />
      </div>
      {/* fine strip */}
      {f >= lines[3].at && (
        <div style={{ position: "absolute", left: sx, top: sy, width: W, height: 116, transform: `translateY(${-6 * lift}px) rotate(${(-1.5 + 0) * (1 - lift) - 2.5 * lift}deg) scale(${sc})`,
          transformOrigin: "50% 50%", background: "#ECE6D8", boxShadow: lift > 0 ? `0 ${20 * lift}px ${50 * lift}px rgba(0,0,0,.65)` : "none",
          clipPath: lift > 0 ? `polygon(${tooth(30, true).join(",")}, ${tooth(30, false).reverse().join(",")})` : "none", opacity: vis(lines[3]) }}>
          <div style={{ position: "absolute", left: 32, top: 14, ...el, fontSize: 24 }}>PROPOSED FINES · TOTAL</div>
          <div style={{ position: "absolute", left: 32, top: 46, ...ARCH, fontSize: 56, color: under > 0 ? RED : ink }}>$45,000</div>
          <div style={{ position: "absolute", left: 32, top: 100, height: 5, width: 228 * under, background: RED }} />
        </div>
      )}
      <div style={{ position: "absolute", right: 40, bottom: 26, fontFamily: "Elite", fontSize: 20, color: "rgba(255,255,255,.75)", opacity: lift }}>
        SOURCE: U.S. DEPT. OF LABOR (OSHA), 30 MAR 2012, VIA NBC DFW
      </div>
    </AbsoluteFill>
  );
};
