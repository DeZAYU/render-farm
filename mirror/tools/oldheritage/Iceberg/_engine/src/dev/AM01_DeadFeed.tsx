// AM01 DeadFeed: "The ride's own camera wasn't working, which is why she was filming at all." The ride's own on-board camera (a Cobra
// slingshot on-ride video, night, 2016) plays full frame; on "wasn't working" it stalls (the picture freezes, loses its colour, two
// frames of line tear), then the feed shuts off like an old monitor: the image squeezes into a thin bright line over 10 frames, the line
// shrinks to a point and goes out. After a beat of black, on "which is why she was filming", Krissy Hurst's own phone footage of that night
// rises out of the black with a slow push. Works on the footage only; no UI.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const DeadFeed: React.FC<{ feed: string; feedFrom: number; phone: string; phoneFrom: number; dieAt: number; phoneAt: number; label: string }> = ({ feed, feedFrom, phone, phoneFrom, dieAt, phoneAt, label }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const stall = interpolate(f, [dieAt, dieAt + 8], [0, 1], cl);           // freeze + drain colour
  const sq = io(interpolate(f, [dieAt + 8, dieAt + 18], [0, 1], cl));       // squeeze to a line
  const pt = io(interpolate(f, [dieAt + 18, dieAt + 26], [0, 1], cl));      // line to a point, out
  const tear = f >= dieAt + 2 && f < dieAt + 8 ? Math.sin((f - dieAt) * 1.7) * 14 : 0;
  const vid = (
    <OffthreadVideo src={staticFile(feed)} startFrom={Math.round(feedFrom * 30)} muted
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * (Math.min(f, dieAt) / Math.max(1, dieAt))})` }} />
  );
  const k = io(interpolate(f, [phoneAt, phoneAt + 16], [0, 1], cl));
  const ps = 1.12 - 0.06 * k + 0.05 * io(interpolate(f, [phoneAt, dur], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {f < dieAt + 26 && (
        <AbsoluteFill style={{ transform: `scale(${1 - 0.985 * pt}, ${Math.max(0.004, 1 - 0.996 * sq)})`, transformOrigin: "50% 50%",
          filter: `saturate(${1 - 0.8 * stall}) brightness(${1 + 0.5 * sq - 0.3 * pt}) contrast(${1 + 0.4 * sq})`, opacity: 1 - pt * 0.6 }}>
          <AbsoluteFill style={{ transform: `translateX(${tear}px)` }}>{f < dieAt ? vid : <Freeze frame={dieAt}>{vid}</Freeze>}</AbsoluteFill>
        </AbsoluteFill>
      )}
      {f >= phoneAt && (
        <AbsoluteFill style={{ opacity: k }}>
          <OffthreadVideo src={staticFile(phone)} startFrom={Math.round(phoneFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${ps})`, transformOrigin: "45% 45%" }} />
        </AbsoluteFill>
      )}
      <RedLabel text={label} at={8} hold={dieAt - 14} size={40} />
    </AbsoluteFill>
  );
};
