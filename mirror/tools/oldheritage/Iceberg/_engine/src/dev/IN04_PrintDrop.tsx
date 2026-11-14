// IN04 PrintDrop: the instant the rocks come through, held as a still; the held frame gains a white print border, tilts back in 3-D
// and sinks away into the dark like a photo dropped on a table, uncovering the live camera behind it (the climber still pressed flat in
// the couloir), which eases in. No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { type CK, camAt, placeOf, cl, io } from "./DC01_kit";

export const PrintDrop: React.FC<{ print: string; t: number; bg: string; bgFrom: number; bgKeys: CK[]; at?: number; len?: number }> = ({ print, t, bg, bgFrom, bgKeys, at = 20, len = 46 }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, bgKeys));
  const u = io(interpolate(f, [at, at + len], [0, 1], cl));
  const b = io(interpolate(f, [at - 12, at + 8], [0, 1], cl));       // border grows first
  const s = 1 - 0.18 * b - 0.32 * u;
  const rx = 52 * u, rz = -7 * u, ty = 260 * u;
  const op = 1 - io(interpolate(f, [at + len * 0.55, at + len], [0, 1], cl));
  const reveal = io(interpolate(f, [at, at + len * 0.8], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, opacity: 0.25 + 0.75 * reveal, filter: `brightness(${0.55 + 0.45 * reveal})` }} />
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "50% 100%", opacity: op,
          transform: `translateY(${ty}px) scale(${s}) rotateX(${rx}deg) rotateZ(${rz}deg)`, boxShadow: `0 ${20 + 40 * u}px ${40 + 60 * u}px rgba(0,0,0,${0.35 + 0.4 * b})`,
          background: "#f4f2ee", padding: `${26 * b}px ${26 * b}px ${70 * b}px`, boxSizing: "border-box" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <Freeze frame={0}><OffthreadVideo src={staticFile(print)} startFrom={Math.round(t * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: `contrast(${1 + 0.08 * b}) saturate(${1 - 0.15 * b})` }} /></Freeze>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
