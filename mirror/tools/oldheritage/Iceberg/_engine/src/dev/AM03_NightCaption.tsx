// AM03 NightCaption: "Whoever posted this on February 22, 2016 wrote that the worm split in two." The clip's own YouTube page (captured
// 13 Nov 2026: the real title line and the uploader's one-line description, cropped from the page, nothing re-typed) is cast onto the frozen
// night frame of the ride like light: the page strips are inverted to white-on-black and screen-blended into the darkened footage, so the
// type glows on the scene. The title arrives first, soft; then the description line racks into focus and grows a little nearer while the
// title falls back out of focus. Slow push on the footage underneath. Credit small. No red.
import React from "react";
import { AbsoluteFill, Easing, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Strip = { src: string; w: number; h: number };

export const NightCaption: React.FC<{ bg: string; at: number; title: Strip; desc: Strip; descAt: number; credit: string }> = ({ bg, at, title, desc, descAt, credit }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const dim = io(interpolate(f, [0, 18], [0, 1], cl));
  const t = out(interpolate(f, [6, 30], [0, 1], cl));
  const d = out(interpolate(f, [descAt, descAt + 22], [0, 1], cl));
  const z = 1.06 + 0.08 * io(f / dur);
  const tk = 1.9, dk = 1.95 + 0.12 * d;               // strip scale (page px -> screen px)
  const strip = (s: Strip, k: number, y: number, o: number, blur: number) => (
    <div style={{ position: "absolute", left: 960 - (s.w * k) / 2, top: y, width: s.w * k, height: s.h * k, opacity: o, filter: `blur(${blur.toFixed(2)}px)`, mixBlendMode: "screen" }}>
      <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%", filter: "grayscale(1) contrast(1.6) brightness(.95)" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <RedLabel text="" at={1e6} />
      <AbsoluteFill style={{ transform: `scale(${z})`, filter: `brightness(${1 - 0.62 * dim}) saturate(${1 - 0.4 * dim})` }}>
        <Freeze frame={Math.round(at * 30)}><OffthreadVideo src={staticFile(bg)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      {strip(title, tk, 330 - 20 * d, t * (1 - 0.55 * d), (1 - t) * 8 + d * 3.5)}
      {strip(desc, dk, 560 - 10 * d, d, (1 - d) * 9)}
      <div style={{ position: "absolute", left: 70, bottom: 54, fontFamily: "Elite", fontSize: 26, color: "rgba(240,240,236,.7)", opacity: t }}>{credit}</div>
    </AbsoluteFill>
  );
};
