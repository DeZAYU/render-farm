// IN21-IN25 helpers (not devices): the typewriter-strike case title (brief's style B: letters struck one by one, place · year
// line under it), a small on-screen footage credit, a still with an eased push, and a soft blurred-copy fill for vertical clips.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useDcFonts, io } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.25, 0.1, 0.25, 1);
const W = "#F2F2F0", GLOW = "0 0 18px rgba(255,255,255,.22), 0 2px 8px rgba(0,0,0,.75)";

/** style B: the title struck letter by letter on the case's own darkened frame, place · year line under it */
export const TypeTitle: React.FC<{ dur: number; title: string; place: string; bg: string; pos?: string; size?: number }> = ({ dur, title, place, bg, pos = "50% 50%", size = 92 }) => {
  useDcFonts();
  const f = useCurrentFrame(), per = 2.0, start = 8;
  const z = 1.06 + 0.07 * io(Math.min(1, f / dur));
  const pa = start + title.length * per + 6, pt = interpolate(f, [pa, pa + 18], [0, 1], { ...cl, easing: E });
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})`, filter: "brightness(0.42) contrast(1.1) saturate(0.6) blur(2px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 466, textAlign: "center", fontFamily: "Elite", fontSize: size, letterSpacing: "0.06em", color: W, textShadow: GLOW, whiteSpace: "nowrap" }}>
        {title.split("").map((c, i) => {
          const a = f - start - i * per; const o = a < 0 ? 0 : 1; const j = a >= 0 && a < 3 ? (3 - a) * 0.6 : 0;
          return <span key={i} style={{ opacity: o, display: "inline-block", transform: `translateY(${-j}px)`, filter: `blur(${j * 0.3}px)`, whiteSpace: "pre" }}>{c}</span>;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 466 + size + 34, textAlign: "center", fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "110%",
        fontSize: 26, letterSpacing: "0.32em", color: "rgba(242,242,240,.78)", opacity: pt, transform: `translateY(${(1 - pt) * 6}px)` }}>{place}</div>
    </AbsoluteFill>
  );
};

/** small footage credit, top-left, fades in and out */
export const Credit: React.FC<{ text: string; at?: number; hold?: number }> = ({ text, at = 10, hold = 120 }) => {
  useDcFonts();
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 12, at + hold, at + hold + 12], [0, 1, 1, 0], cl);
  return <div style={{ position: "absolute", left: 44, top: 36, fontFamily: "ArchivoBlk", fontWeight: 700, fontSize: 22, letterSpacing: "0.18em", color: "rgba(242,242,240,.82)",
    textShadow: "0 1px 6px rgba(0,0,0,.8)", opacity: o }}>FOOTAGE: {text}</div>;
};

/** a still filling the frame with a slow eased push toward fx/fy */
export const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number; filter?: string }> = ({ src, n, s0, s1, fx, fy, filter }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, filter }} /></AbsoluteFill>;
};

/** a raw's spoken words set small at the bottom (only for whispered / hard-to-hear raw audio) */
export const RawSub: React.FC<{ lines: { a: number; b: number; t: string }[] }> = ({ lines }) => {
  useDcFonts();
  const f = useCurrentFrame() / 30;
  const l = lines.find((x) => f >= x.a && f < x.b);
  if (!l) return null;
  const o = Math.min(1, (f - l.a) * 6, (l.b - f) * 6);
  return <div style={{ position: "absolute", left: 0, right: 0, bottom: 92, textAlign: "center", opacity: o }}>
    <span style={{ fontFamily: "Elite", fontSize: 44, color: W, background: "rgba(0,0,0,.55)", padding: "6px 18px", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>{l.t}</span>
  </div>;
};

export { OffthreadVideo };
