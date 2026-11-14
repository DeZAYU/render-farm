// DC02 SpeedStamp: the dashcam's own 4:3 picture (stamp included) held on its first frame at full height over a blurred copy of itself;
// the camera eases in onto the burned-in speed readout ("V:36KMH") and a thin white rule draws under the figure. No added text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

export const SpeedStamp: React.FC<{
  src: string; t: number; ar: number;            // clip, held time (s), aspect of the 4:3 picture
  focus: [number, number]; zoom: number;           // where to push (fractions of the picture) and how far
  rule: [number, number, number];                  // underline x0, x1, y (fractions of the picture)
  pushAt: number; pushLen: number; ruleAt: number; // frames
}> = ({ src, t, ar, focus, zoom, rule, pushAt, pushLen, ruleAt }) => {
  const f = useCurrentFrame();
  const H = 1080, W = H * ar;
  const k = io(interpolate(f, [pushAt, pushAt + pushLen], [0, 1], cl));
  const s = 1 + (zoom - 1) * k;
  // keep the focus point moving to the centre as we push
  const fx = (focus[0] - 0.5) * W * s * k, fy = (focus[1] - 0.5) * H * s * k;
  const r = out(interpolate(f, [ruleAt, ruleAt + 14], [0, 1], cl));
  const vid = (style: React.CSSProperties) => (
    <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={style} /></Freeze>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {vid({ position: "absolute", inset: -60, width: 1920 + 120, height: 1080 + 120, objectFit: "cover", filter: "blur(22px) brightness(.45)" })}
      <div style={{ position: "absolute", left: 960 - W / 2, top: 0, width: W, height: H, transform: `translate(${-fx}px, ${-fy}px) scale(${s})`, transformOrigin: "50% 50%",
        boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
        {vid({ width: W, height: H })}
        <div style={{ position: "absolute", left: rule[0] * W, top: rule[2] * H, width: (rule[1] - rule[0]) * W * r, height: 3 / Math.max(1, s * 0.6),
          background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,.6)" }} />
      </div>
    </AbsoluteFill>
  );
};
