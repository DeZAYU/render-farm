// TP19 BlockBack: the NYS spring-2008 orthophoto of Coney Island lying in 3-D. The camera starts low over the arcade's roof (boxed,
// red wash), then lifts and glides south as a dashed white line runs from the boardwalk up to it, so the block between, and the
// Wonder Wheel standing in it, come into view. Labels stand up off the ground (counter-rotated billboards).
// Coordinates are image px of the 3200x1800 export (0.14 m/px). One eased camera curve, no stops.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const IW = 3200, IH = 1800;

type Key = { fx: number; fy: number; z: number; tilt: number; rot: number };
const mix = (a: Key, b: Key, t: number): Key => ({ fx: a.fx + (b.fx - a.fx) * t, fy: a.fy + (b.fy - a.fy) * t, z: a.z + (b.z - a.z) * t, tilt: a.tilt + (b.tilt - a.tilt) * t, rot: a.rot + (b.rot - a.rot) * t });

export const BlockBack: React.FC<{ src: string; arcade: [number, number, number, number]; walk: [number, number][]; wheel: [number, number, number, number];
  boardwalk: [number, number]; t: { box: number; walk: number; wheel: number; bw: number } }> = ({ src, arcade, walk, wheel, boardwalk, t }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: N } = useVideoConfig();
  const A: Key = { fx: (arcade[0] + arcade[2]) / 2, fy: (arcade[1] + arcade[3]) / 2 + 160, z: 1.15, tilt: 32, rot: -2 };
  const B: Key = { fx: 1470, fy: 1120, z: 0.8, tilt: 42, rot: 2 };
  const k = mix(A, B, io(interpolate(f, [0, N - 4], [0, 1], cl)));
  const plane = `translate(${width / 2}px, ${height * 0.5}px) rotateX(${k.tilt}deg) rotateZ(${k.rot}deg) scale(${k.z}) translate(${-k.fx}px, ${-k.fy}px)`;

  const gBox = out(interpolate(f, [t.box, t.box + 14], [0, 1], cl));
  const gWalk = io(interpolate(f, [t.walk, t.walk + 26], [0, 1], cl));
  const gWheel = out(interpolate(f, [t.wheel, t.wheel + 14], [0, 1], cl));
  const wd = "M" + walk.map((p) => p.join(" ")).join(" L");
  const sw = 1 / k.z; // keep line weights steady while the scale changes
  const stand = (x: number, y: number, text: string, at: number) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: IW, height: IH, transformOrigin: `${x}px ${y}px`, transform: `rotateZ(${-k.rot}deg) rotateX(${-k.tilt}deg) scale(${sw})` }}>
      <RedLabel text={text} at={at} x={x / width} y={(y - 46) / height} size={38} />
    </div>
  );
  const rect = (r: [number, number, number, number], g: number, fill: string) => {
    const w = r[2] - r[0], h = r[3] - r[1], P = 2 * (w + h);
    return <g opacity={Math.min(1, g * 2)}>
      <rect x={r[0]} y={r[1]} width={w} height={h} fill={fill} opacity={g} />
      <rect x={r[0]} y={r[1]} width={w} height={h} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={11 * sw} />
      <rect x={r[0]} y={r[1]} width={w} height={h} fill="none" stroke="#fff" strokeWidth={6 * sw} strokeDasharray={P} strokeDashoffset={P * (1 - g)} />
    </g>;
  };
  return (
    <AbsoluteFill style={{ background: "#0b0d10", overflow: "hidden", perspective: 1500, perspectiveOrigin: "50% 35%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: IW, height: IH, transformOrigin: "0 0", transform: plane, transformStyle: "preserve-3d" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: IW, height: IH, filter: "saturate(.92) contrast(1.06) brightness(.94)" }} />
        <svg width={IW} height={IH} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={wd} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={16 * sw} pathLength={1} strokeDasharray={`${gWalk} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={wd} fill="none" stroke="#fff" strokeWidth={8 * sw} pathLength={1} strokeDasharray={`${gWalk} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {gWalk > 0.02 && <circle cx={walk[0][0]} cy={walk[0][1]} r={11 * sw} fill="#fff" />}
          {rect(arcade, gBox, "rgba(227,20,27,.38)")}
          {gBox > 0 && <rect x={arcade[0]} y={arcade[1]} width={arcade[2] - arcade[0]} height={arcade[3] - arcade[1]} fill="none" stroke={RED} strokeWidth={3 * sw} opacity={gBox} />}
          {rect(wheel, gWheel, "rgba(255,255,255,.12)")}
        </svg>
        {stand(boardwalk[0], boardwalk[1], "BOARDWALK", t.bw)}
        {stand((wheel[0] + wheel[2]) / 2, wheel[1] - 70, "DENO'S WONDER WHEEL", t.wheel + 4)}
      </div>
      {/* depth haze toward the horizon */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,10,12,.85) 0%, rgba(8,10,12,.25) 22%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 80%, rgba(0,0,0,.35) 100%)" }} />
    </AbsoluteFill>
  );
};
