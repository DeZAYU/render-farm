// WP20 FlashMatch: "the same kind of flash as the grain dust under the tank on level one". The level-one clip (Switz City grain tank,
// portrait, full height over its blurred copy) runs slowed into its dust flash; at the flash the fire's own light opens as a soft
// round iris from the flash's spot and reveals the Lakeland mill burning (full frame, slow push), matched on the flame. Built for WP20 only.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BlurBed, cl, io } from "./WP01_kit";
import { RedLabel } from "../brand";

export const FlashMatch: React.FC<{ a: string; aFrom: number; aRate: number; aAR: number; flashAt: number; spot: [number, number];
  b: string; bFrom: number; n: number; label: string }> = ({ a, aFrom, aRate, aAR, flashAt, spot, b, bFrom, n, label }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const W = height * aAR;
  const sa = 1.0 + 0.08 * io(Math.min(1, f / flashAt));
  const sb = 1.04 + 0.06 * io(interpolate(f, [flashAt, n], [0, 1], cl));
  const r = io(interpolate(f, [flashAt - 2, flashAt + 16], [0, 1], cl)) * Math.hypot(width, height) * 1.05;
  const cx = width / 2 + (spot[0] - 0.5) * W * sa, cy = spot[1] * height;
  const bloom = interpolate(f, [flashAt - 4, flashAt + 1, flashAt + 12], [0, 0.55, 0], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {f < flashAt + 18 && <AbsoluteFill>
        <BlurBed src={a} from={aFrom} rate={aRate} dim={0.45} />
        <div style={{ position: "absolute", left: (width - W) / 2, top: 0, width: W, height, transform: `scale(${sa})`, transformOrigin: `${spot[0] * 100}% ${spot[1] * 100}%` }}>
          <OffthreadVideo src={staticFile(a)} startFrom={Math.round(aFrom * 30)} playbackRate={aRate} muted style={{ width: "100%", height: "100%" }} />
        </div>
        <RedLabel text={label} at={6} hold={Math.max(10, flashAt - 18)} size={40} y={0.1} />
      </AbsoluteFill>}
      <AbsoluteFill style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
        <AbsoluteFill style={{ transform: `scale(${sb})`, transformOrigin: "50% 60%" }}>
          <OffthreadVideo src={staticFile(b)} startFrom={Math.round(bFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${cx}px ${cy}px, rgba(255,214,150,${bloom}) 0%, rgba(255,140,40,${bloom * 0.5}) 30%, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
