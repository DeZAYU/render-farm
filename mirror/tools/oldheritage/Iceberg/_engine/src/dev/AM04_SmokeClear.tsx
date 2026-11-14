// AM04 SmokeClear: "The fire was out within minutes, and they'd cleared the station by about 10:20." The clip's last smoke-filled frame of the
// station (queue railings in the haze) is held and the smoke is cleared off it: the frame lightens and loses contrast like thinning smoke while
// a photo of the same ride running normally (a year earlier, Commons) resolves out of the haze behind it, its own picture sharpening as the smoke
// layer lifts upward and dissolves. Time label on "10:20". No other text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const SmokeClear: React.FC<{ smoke: string; smokeAt: number; x0: number; x1: number; after: string; clearAt: number; clearLen: number; labelAt: number; label: string }> = ({ smoke, smokeAt, x0, x1, after, clearAt, clearLen, labelAt, label }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = io(interpolate(f, [clearAt, clearAt + clearLen], [0, 1], cl));
  const vw = 1332 * (1040 / 1080), pw = (x1 - x0) * vw;   // the file at panel height; the sharp strip's width (same framing as QueueView)
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.04 + 0.06 * (f / dur)})`, filter: `blur(${(1 - c) * 8}px) brightness(${0.6 + 0.4 * c})` }}>
        <Img src={staticFile(after)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - c, transform: `translateY(${-c * 60}px)`, filter: `blur(${c * 12}px) brightness(${1 + 0.4 * c}) contrast(${1 - 0.3 * c})` }}>
        <AbsoluteFill style={{ transform: "scale(1.35)", filter: "blur(34px) brightness(.42)" }}>
          <Freeze frame={Math.round(smokeAt * 30)}><OffthreadVideo src={staticFile(smoke)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 960 - pw / 2, top: 20, width: pw, height: 1040, overflow: "hidden", border: "5px solid #fff", boxShadow: "0 24px 70px rgba(0,0,0,.7)" }}>
          <div style={{ position: "absolute", left: -x0 * vw, top: 0, width: vw, height: 1040 }}>
            <Freeze frame={Math.round(smokeAt * 30)}><OffthreadVideo src={staticFile(smoke)} muted style={{ width: "100%", height: "100%" }} /></Freeze>
          </div>
        </div>
      </AbsoluteFill>
      <RedLabel text={label} at={labelAt} hold={dur - labelAt - 10} />
    </AbsoluteFill>
  );
};
