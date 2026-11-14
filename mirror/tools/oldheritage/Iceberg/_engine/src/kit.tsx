// Iceberg kit: footage, stills, source pages, map clips and on-footage marks. Footage first; every shot carries the words under it.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);
export const io = Easing.bezier(0.45, 0, 0.2, 1);
export const out = Easing.bezier(0.16, 1, 0.3, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** real footage; slow push so a held shot is never dead; grade keeps clips from different cameras together */
export const Footage: React.FC<{ src: string; from: number; rate?: number; volume?: number | ((f: number) => number); push?: number; origin?: string; grade?: string; muted?: boolean }> = ({ src, from, rate = 1, volume = 1, push = 0.05, origin = "50% 50%", grade = "contrast(1.06) saturate(0.92)", muted }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const k = 1 + push * interpolate(f, [0, durationInFrames], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={s(from)} playbackRate={rate} muted={muted} volume={volume}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k})`, transformOrigin: origin, filter: grade }} />
    </AbsoluteFill>
  );
};

/** a photograph: drift from one framing to another (x, y in -1..1 of the free space, z = zoom) */
export const Photo: React.FC<{ src: string; a?: [number, number, number]; b?: [number, number, number]; fit?: "cover" | "contain"; grade?: string }> = ({ src, a = [0, 0, 1.04], b = [0, 0, 1.14], fit = "cover", grade = "contrast(1.05) saturate(0.9)" }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const t = io(interpolate(f, [0, durationInFrames], [0, 1], cl));
  const z = a[2] + (b[2] - a[2]) * t, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: fit, filter: grade,
        transform: `translate(${-x * (z - 1) * 50}%, ${-y * (z - 1) * 50}%) scale(${z})` }} />
    </AbsoluteFill>
  );
};

/** a panorama wider than the frame: slide across it */
export const Pan: React.FC<{ src: string; ar: number; from?: number; to?: number; band?: number }> = ({ src, ar, from = 0, to = 1, band = 1 }) => {
  const f = useCurrentFrame(); const { durationInFrames, width, height } = useVideoConfig();
  const h = height * band, w = h * ar, t = io(interpolate(f, [0, durationInFrames], [0, 1], cl));
  const x = -(w - width) * (from + (to - from) * t);
  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      {band < 1 && <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(30px) brightness(0.9) saturate(0.9)" }} />}
      <Img src={staticFile(src)} style={{ position: "absolute", height: h, width: w, left: x, top: (height - h) / 2, filter: "contrast(1.05) saturate(0.9)", boxShadow: "0 30px 90px rgba(0,0,0,.7)" }} />
    </AbsoluteFill>
  );
};

export type HL = { box: number[]; at: number; dur?: number; kind?: "band" | "box" };
/** a real source page (Farrell style): the capture on a tilted sheet in a dark room; the camera travels between the
 *  lines being read; each line gets a select-blue band drawn left to right as it is spoken (light pages). */
export const Page: React.FC<{ src: string; pw: number; ph: number; keys: { at: number; cx: number; cy: number; w: number }[]; hl: HL[]; tilt?: [number, number, number] }> = ({ src, pw, ph, keys, hl, tilt = [10, -14, -2] }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  // camera: interpolate between framing keys (cx, cy = page px at frame centre, w = page px across the frame)
  let i = 0; while (i < keys.length - 1 && f >= keys[i + 1].at) i++;
  const k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)];
  const span = Math.max(1, Math.min(24, k1.at - k0.at));
  const t = k1 === k0 ? 0 : io(interpolate(f, [k1.at - span, k1.at], [0, 1], cl));
  const cx = k0.cx + (k1.cx - k0.cx) * t, cy = k0.cy + (k1.cy - k0.cy) * t, vw = k0.w + (k1.w - k0.w) * t;
  const sc = width / vw;
  const drift = interpolate(f, [0, 300], [0, 1], cl);
  const rx = tilt[0] - 3 * drift, ry = tilt[1] + 5 * drift, rz = tilt[2];
  const enter = out(interpolate(f, [0, 14], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1b1f26 0%, #07080a 75%)", perspective: 1600, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: width / 2, top: height / 2, width: 0, height: 0, transformStyle: "preserve-3d",
        transform: `translateZ(${-120 + 120 * enter}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
        <div style={{ position: "absolute", left: -cx * sc, top: -cy * sc, width: pw * sc, height: ph * sc, boxShadow: "0 40px 120px rgba(0,0,0,.75)" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />
          {hl.map((h, j) => {
            const g = out(interpolate(f, [h.at, h.at + (h.dur ?? 14)], [0, 1], cl));
            if (g <= 0) return null;
            const [x0, y0, x1, y1] = h.box;
            if (h.kind === "box") return <div key={j} style={{ position: "absolute", left: (x0 - 8) * sc, top: (y0 - 8) * sc, width: (x1 - x0 + 16) * sc, height: (y1 - y0 + 16) * sc,
              border: `${Math.max(3, 4 * sc)}px solid #ffffff`, borderRadius: 6 * sc, opacity: g, transform: `scale(${1.15 - 0.15 * g})`, boxShadow: "0 0 24px rgba(255,255,255,.55)" }} />;
            return <div key={j} style={{ position: "absolute", left: (x0 - 6) * sc, top: (y0 + 2) * sc, width: (x1 - x0 + 12) * sc * g, height: (y1 - y0 - 3) * sc,
              background: "#7fa6dc", mixBlendMode: "multiply", borderRadius: 3 * sc }} />;
          })}
          {/* light falls off toward the page edges */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,.35) 100%)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** VV-style mark on footage: a ring drawn on (clockwise) around a point, optional follow track */
export const Ring: React.FC<{ at: number; x: number | ((f: number) => number); y: number | ((f: number) => number); r?: number; hold?: number; color?: string }> = ({ at, x, y, r = 70, hold = 90, color = "#ff3b30" }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  if (f < at || f > at + hold + 12) return null;
  const g = out(interpolate(f, [at, at + 12], [0, 1], cl)), fade = interpolate(f, [at + hold, at + hold + 12], [1, 0], cl);
  const X = (typeof x === "function" ? x(f) : x) * width, Y = (typeof y === "function" ? y(f) : y) * height;
  const C = 2 * Math.PI * r;
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: fade }}>
      <circle cx={X} cy={Y} r={r} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={9} strokeDasharray={C} strokeDashoffset={C * (1 - g)} transform={`rotate(-90 ${X} ${Y})`} />
      <circle cx={X} cy={Y} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={C} strokeDashoffset={C * (1 - g)} strokeLinecap="round" transform={`rotate(-90 ${X} ${Y})`} />
    </svg>
  );
};

/** a photo pinned over a map (VV): drops in with a white border and a shadow */
export const Card: React.FC<{ src: string; at: number; hold: number; x: number; y: number; w: number; ar: number }> = ({ src, at, hold, x, y, w, ar }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  if (f < at || f > at + hold + 10) return null;
  const g = out(interpolate(f, [at, at + 14], [0, 1], cl)), fade = interpolate(f, [at + hold, at + hold + 10], [1, 0], cl);
  const W = w * width, H = W / ar;
  return (
    <div style={{ position: "absolute", left: x * width - W / 2, top: y * height - H / 2, width: W, height: H, opacity: fade,
      transform: `translateY(${(1 - g) * 40}px) scale(${0.92 + 0.08 * g}) rotate(-1.5deg)`, border: "8px solid #f2f2ee", boxShadow: "0 30px 80px rgba(0,0,0,.7)", background: "#000" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

/** film finish over everything: vignette + fine grain */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.5) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='" + (f % 12) + "'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>\")" }} />
    </AbsoluteFill>
  );
};

export const Fade: React.FC<{ inF?: number; outF?: number; children: React.ReactNode }> = ({ inF = 0, outF = 0, children }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const o = Math.min(inF ? interpolate(f, [0, inF], [0, 1], cl) : 1, outF ? interpolate(f, [durationInFrames - outF, durationInFrames], [1, 0], cl) : 1);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
