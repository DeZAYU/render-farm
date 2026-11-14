// ND08 PeakFall — a real night photo of Everest Base Camp's tents with Pumori above them (Wikimedia Commons, Iamthanes, CC BY-SA 4.0),
// split into two depth layers (the lit tents in front, the peak behind) and pushed with parallax (2.5-D). Pumori is named; a white fall
// line runs from the face down its flank toward the camp (where the ice broke loose -> where it went), then the camp is named. Built for
// "The shaking broke a huge mass of snow and ice off Pumori, the peak above Base Camp. 359 climbers were at Base Camp."
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const PeakFall: React.FC<{ src: string; iw: number; ih: number; split: number; path: [number, number][]; at: number; len: number; peakLabel: string; peakAt: [number, number]; campLabel: string; campAt: number }> = ({ src, iw, ih, split, path, at, len, peakLabel, peakAt, campLabel, campAt }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const t = io(interpolate(f, [0, D], [0, 1], cl));
  const fit = Math.max(W / iw, H / ih);
  const sb = 1.04 + 0.07 * t, sf = 1.06 + 0.16 * t; // back / front layer scale (parallax)
  const lay = (s: number, oy: number): React.CSSProperties => ({ position: "absolute", left: (W - iw * fit * s) / 2, top: (H - ih * fit * s) / 2 + oy, width: iw * fit * s, height: ih * fit * s });
  const bOy = -18 * t, fOy = 10 * t;
  const b = lay(sb, bOy);
  const X = (p: [number, number]) => [(b.left as number) + p[0] * fit * sb, (b.top as number) + p[1] * fit * sb];
  const d = "M" + path.map((p) => X(p).join(" ")).join(" L");
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const [px, py] = X(peakAt);
  const maskStop = (split * 100).toFixed(1);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ ...b, filter: "brightness(1.45) contrast(1.05)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* front layer: the tents, masked to the lower part of the picture, moving faster */}
      <Img src={staticFile(src)} style={{ ...lay(sf, fOy), filter: "brightness(1.45) contrast(1.05)",
        WebkitMaskImage: `linear-gradient(180deg, rgba(0,0,0,0) ${maskStop}%, #000 ${(split * 100 + 6).toFixed(1)}%)`, maskImage: `linear-gradient(180deg, rgba(0,0,0,0) ${maskStop}%, #000 ${(split * 100 + 6).toFixed(1)}%)` }} />
      <RedLabel text={peakLabel} at={8} hold={campAt - 12} x={px / W} y={Math.max(0.08, (py - 60) / H)} size={42} />
      <RedLabel text={campLabel} at={campAt} y={0.88} />
    </AbsoluteFill>
  );
};
