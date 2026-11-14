// DC11 PhotoTurn: the last frame of him holding his phone up at the van window, held. A camera shutter (one soft white blink, real
// shutter sound in the case) and the frame becomes a print: it shrinks inside a white border and tips back in 3-D over a dark,
// blurred copy of itself, as if it were his photo of the van driver. Ends the case on "who he planned to show it to". No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

export const PhotoTurn: React.FC<{ src: string; t: number; snapAt: number; dur: number; focus?: [number, number] }> = ({ src, t, snapAt, dur, focus = [0.5, 0.5] }) => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const blink = interpolate(f, [snapAt, snapAt + 1, snapAt + 6], [0, 0.35, 0], cl);
  const k = out(interpolate(f, [snapAt + 2, snapAt + 30], [0, 1], cl));
  const drift = io(interpolate(f, [snapAt + 30, dur], [0, 1], cl));
  const pre = io(interpolate(f, [0, snapAt], [0, 1], cl));
  const s = (1.08 + 0.05 * pre) * (1 - 0.3 * k) - 0.02 * drift;
  const border = 26 * k;
  const pic = (style: React.CSSProperties) => (
    <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={style} /></Freeze>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -60, opacity: k }}>{pic({ width: "100%", height: "100%", objectFit: "cover", filter: "blur(22px) brightness(0.35)" })}</div>
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transform: `rotateX(${7 * k + 2 * drift}deg) rotateZ(${-2.2 * k - 0.8 * drift}deg) scale(${s})`,
          boxShadow: `0 ${30 * k}px ${90 * k}px rgba(0,0,0,${0.7 * k})`, background: "#f4f2ee", padding: border, boxSizing: "border-box" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            {pic({ position: "absolute", width: "100%", height: "100%", objectFit: "cover" })}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: blink }} />
    </AbsoluteFill>
  );
};
