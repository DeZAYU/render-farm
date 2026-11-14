// ND18 Drawdown: what the schoolgirl saw on Mai Khao beach, as the textbook section she learned it from. White line section over a dark
// copy of real Andaman Sea footage: the waterline runs off the beach (the drawdown, seabed exposed), froth flickers along the retreating
// edge, then the hump of the wave rises offshore. No numbers, one place label.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const Drawdown: React.FC<{ bg: string; label: string; labelAt: number; pull: [number, number]; hump: [number, number] }> = ({ bg, label, labelAt, pull, hump }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  // seabed: deep on the left, shelving up to the beach and the land on the right
  const bed = (x: number) => { const u = x / width; return 880 - 310 * Math.pow(Math.max(0, (u - 0.1) / 0.8), 1.15) - (u > 0.9 ? (u - 0.9) * 1400 : 0); };
  const sea0 = 640, drop = 125 * io(interpolate(f, [pull[0], pull[1]], [0, 1], cl));
  const hu = io(interpolate(f, [hump[0], hump[1]], [0, 1], cl));
  const hx = interpolate(hu, [0, 1], [-0.05, 0.42]) * width, hh = 95 * hu;
  const surf = (x: number) => sea0 + drop - hh * Math.exp(-Math.pow((x - hx) / 170, 2)) + 3 * Math.sin(x / 47 + f / 9);
  // waterline: first x where the surface meets the seabed
  let wl = width; for (let x = 0; x < width; x += 2) { if (surf(x) >= bed(x)) { wl = x; break; } }
  const N = 96, xs = Array.from({ length: N + 1 }, (_, i) => (i / N) * wl);
  const water = `M0 ${surf(0)} ` + xs.map((x) => `L${x} ${surf(x)}`).join(" ") + ` L${wl} ${bed(wl)} ` + Array.from({ length: N + 1 }, (_, i) => wl - (i / N) * wl).map((x) => `L${x} ${bed(x)}`).join(" ") + " Z";
  const bedPath = "M0 " + bed(0) + " " + Array.from({ length: 121 }, (_, i) => (i / 120) * width).map((x) => `L${x} ${bed(x)}`).join(" ") + ` L${width} ${height} L0 ${height} Z`;
  const shore0 = (() => { for (let x = 0; x < width; x += 2) if (sea0 + 3 >= bed(x)) return x; return width; })();
  const exposed = drop > 4;
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(10px) brightness(.42) saturate(.7)", transform: `scale(${1.04 + 0.04 * f / 180})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={water} fill="rgba(120,185,225,.30)" />
        <path d={bedPath} fill="rgba(70,60,45,.55)" stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
        <path d={"M0 " + surf(0) + " " + xs.map((x) => `L${x} ${surf(x)}`).join(" ")} fill="none" stroke="#fff" strokeWidth={4} opacity={0.95} />
        {/* the old waterline, dashed, once the sea has gone out */}
        {exposed && <line x1={wl} y1={sea0} x2={shore0} y2={sea0} stroke="#fff" strokeWidth={2.5} strokeDasharray="10 10" opacity={Math.min(0.75, drop / 40)} />}
        {exposed && <line x1={shore0} y1={sea0 - 26} x2={shore0} y2={sea0 + 26} stroke="#fff" strokeWidth={3} opacity={Math.min(0.75, drop / 40)} />}
        {/* froth on the retreating edge */}
        {exposed && Array.from({ length: 22 }, (_, i) => {
          const r = random(`fr${i}`), r2 = random(`fy${i}${Math.floor(f / 3)}`);
          const x = wl - 10 - r * 150, y = surf(x) - 4 - r2 * 10;
          return <ellipse key={i} cx={x} cy={y} rx={4 + r * 9} ry={2.5 + r2 * 2} fill="#fff" opacity={0.35 + 0.5 * r2} />;
        })}
      </svg>
      <RedLabel text={label} at={labelAt} x={0.76} y={0.3} size={42} />
    </AbsoluteFill>
  );
};
