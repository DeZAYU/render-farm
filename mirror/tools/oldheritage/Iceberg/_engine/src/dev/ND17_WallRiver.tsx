// ND17 device: the old town of Bad Muenstereifel from straight above (NRW DOP orthophoto, dl-de/zero-2-0), slowly turning while the camera
// sinks toward it: the medieval wall is drawn round the town in white (OSM city walls), then the Erft is drawn in red straight through
// the middle of the walled town — the river runs between the houses, which is the whole story of this flood.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { ERFT, WALLS } from "./ND17_data";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const IW = 3000, IH = 2700;

export const WallRiver: React.FC<{ src: string; wallAt: number; erftAt: number; townLabelAt?: number }> = ({ src, wallAt, erftAt, townLabelAt = 8 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const t = io(f / D);
  const z = 1.0 + 0.12 * t, rot = -4 + 6 * t;
  const focus: [number, number] = [1190 + 30 * t, 1110 + 20 * t];
  const base = Math.max(width / IW, height / IH) * z;
  const left = width / 2 - focus[0] * base, top = height / 2 - focus[1] * base;
  const w = io(interpolate(f, [wallAt, wallAt + 42], [0, 1], cl));
  const e = io(interpolate(f, [erftAt, erftAt + 40], [0, 1], cl));
  const pth = (pts: number[][]) => "M" + pts.map(([x, y]) => `${(left + x * base).toFixed(1)} ${(top + y * base).toFixed(1)}`).join(" L");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${rot}deg) scale(1.17)`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left, top, width: IW * base, height: IH * base, filter: "saturate(.95) contrast(1.04)" }} />
        {/* outside the walls goes slightly darker once the ring is closed */}
        <AbsoluteFill style={{ background: "rgba(0,0,0,.22)", opacity: w }} />
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {WALLS.map((s, i) => <path key={i} d={pth(s)} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${w} 1`} />)}
          {WALLS.map((s, i) => <path key={"w" + i} d={pth(s)} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${w} 1`} />)}
          <path d={pth(ERFT)} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${e} 1`} />
          <path d={pth(ERFT)} fill="none" stroke={RED} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${e} 1`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
      <RedLabel text="BAD MÜNSTEREIFEL" at={townLabelAt} hold={erftAt - townLabelAt - 4} />
      <RedLabel text="THE ERFT" at={erftAt + 24} />
    </AbsoluteFill>
  );
};
