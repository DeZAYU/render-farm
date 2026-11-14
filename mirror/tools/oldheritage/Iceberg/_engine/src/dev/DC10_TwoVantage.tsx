// DC10 TwoVantage: the same column from two places at once: the trucker's dashcam (16:9, large, left) and a worker's vertical phone
// clip from the scale shack (right), both slowed, each in a thin white frame, over a soft dim copy of the dashcam. No text.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./DC08_kit";

export const TwoVantage: React.FC<{ wide: string; wideFrom: number; tall: string; tallFrom: number; rate: number }> = ({ wide, wideFrom, tall, tallFrom, rate }) => {
  const f = useCurrentFrame();
  const a = io(interpolate(f, [0, 18], [0, 1], cl)), b = io(interpolate(f, [8, 30], [0, 1], cl));
  const z = 1 + 0.04 * io(interpolate(f, [0, 200], [0, 1], cl));
  const fr: React.CSSProperties = { position: "absolute", overflow: "hidden", outline: "5px solid #F2F2F0", boxShadow: "0 24px 60px rgba(0,0,0,.6)", background: "#000" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(wide)} startFrom={Math.round(wideFrom * 30)} playbackRate={rate} muted
        style={{ position: "absolute", inset: -60, width: 2040, height: 1200, objectFit: "cover", filter: "blur(20px) brightness(.4) saturate(.7)" }} />
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <div style={{ ...fr, left: 70, top: 189, width: 1248, height: 702, opacity: a, transform: `translateX(${(1 - a) * -30}px)` }}>
          <OffthreadVideo src={staticFile(wide)} startFrom={Math.round(wideFrom * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ ...fr, left: 1388, top: 189, width: 395, height: 702, opacity: b, transform: `translateX(${(1 - b) * 30}px)` }}>
          <OffthreadVideo src={staticFile(tall)} startFrom={Math.round(tallFrom * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
