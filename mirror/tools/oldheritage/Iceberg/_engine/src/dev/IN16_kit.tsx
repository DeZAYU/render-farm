// IN16-IN20 helpers (not devices): the owner's title style B (typewriter strike, from dev/TitleStyles.tsx) as a component, a still with an
// eased push, and a vertical phone clip shown full height over its own blurred, darkened copy (no dark side bars).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, placeOf, type CK, useDcFonts } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.25, 0.1, 0.25, 1), io = Easing.bezier(0.45, 0, 0.2, 1);
const W = "#F2F2F0", GLOW = "0 0 18px rgba(255,255,255,.22), 0 2px 8px rgba(0,0,0,.75)";

/** style B: the title struck letter by letter on the case's own darkened frame, place · year line under it */
export const TitleStrike: React.FC<{ dur: number; title: string; place: string; bg: string; pos?: string; size?: number }> = ({ dur, title, place, bg, pos = "50% 50%", size = 96 }) => {
  useDcFonts();
  const f = useCurrentFrame(), per = 2.2, start = 10, z = 1.06 + 0.07 * (f / dur);
  const pa = start + title.length * per + 6, t = E(interpolate(f, [pa, pa + 18], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})`, filter: "brightness(0.42) contrast(1.1) saturate(0.6) blur(2px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 540 - size * 0.8, textAlign: "center", fontFamily: "Elite", fontSize: size, letterSpacing: "0.06em", color: W, textShadow: GLOW }}>
        {title.split("").map((c, i) => { const a = f - start - i * per; const j = a >= 0 && a < 3 ? (3 - a) * 0.6 : 0;
          return <span key={i} style={{ opacity: a < 0 ? 0 : 1, display: "inline-block", transform: `translateY(${-j}px)`, filter: `blur(${j * 0.3}px)`, whiteSpace: "pre" }}>{c}</span>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 540 + size * 0.55, textAlign: "center", fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "110%", fontSize: 26,
        letterSpacing: "0.32em", color: "rgba(242,242,240,.78)", opacity: t, transform: `translateY(${(1 - t) * 6}px)` }}>{place}</div>
    </AbsoluteFill>
  );
};

/** a still filling the frame with an eased push toward fx/fy */
export const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

/** vertical clip (iw x ih source pixels) at full frame height through a camera (keys in the clip's own 0..1 box), over a blurred copy */
export const Tall: React.FC<{ src: string; keys: CK[]; from?: number; rate?: number; ar: number; layers?: React.ReactNode }> = ({ src, keys, from = 0, rate = 1, ar, layers }) => {
  const f = useCurrentFrame(), c = camAt(f, keys);
  const h = 1080 * c.s, w = h * ar;
  const top = Math.min(0, Math.max(1080 - h, 540 - c.y * h));
  const L = w > 1920 ? Math.min(0, Math.max(1920 - w, 960 - c.x * w)) : 960 - w / 2;
  const st: React.CSSProperties = { position: "absolute", left: L, top, width: w, height: h };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(38px) brightness(0.45) saturate(0.8)", transform: "scale(1.15)" }} />
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ ...st, boxShadow: "0 0 60px rgba(0,0,0,.6)" }} />
      {layers && <div style={{ position: "absolute", left: L, top, width: w, height: h }}>{layers}</div>}
    </AbsoluteFill>
  );
};
export { placeOf };

/** small source credit, bottom-left, white caps (the uploader's name where the outline asks for an on-screen credit) */
export const Credit: React.FC<{ text: string; at?: number; hold?: number; top?: boolean }> = ({ text, at = 0, hold = 120, top }) => {
  useDcFonts();
  const f = useCurrentFrame(), o = interpolate(f, [at, at + 12, at + hold, at + hold + 12], [0, 1, 1, 0], cl);
  return <div style={{ position: "absolute", left: 48, ...(top ? { top: 40 } : { bottom: 40 }), fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "105%", fontSize: 22, letterSpacing: "0.18em",
    color: "rgba(242,242,240,.82)", textShadow: "0 1px 6px rgba(0,0,0,.8)", opacity: o }}>{text}</div>;
};

/** soft privacy blur over a region of the picture (x0,y0,x1,y1 as fractions of the clip box), for Tall/Cam `layers`; fades in/out by frame */
export const Blur: React.FC<{ box: [number, number, number, number]; from?: number; to?: number; px?: number }> = ({ box, from = -1, to = 1e9, px = 22 }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const [x0, y0, x1, y1] = box;
  return <div style={{ position: "absolute", left: `${x0 * 100}%`, top: `${y0 * 100}%`, width: `${(x1 - x0) * 100}%`, height: `${(y1 - y0) * 100}%`,
    backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`, borderRadius: "30%", WebkitMaskImage: "radial-gradient(closest-side, #000 70%, transparent 100%)", maskImage: "radial-gradient(closest-side, #000 70%, transparent 100%)" }} />;
};
