// TOR24 | TrackGlide: the NWS damage track laid on a real aerial (USGS NAIP) that is tilted back in 3-D like a table top; the camera glides
// over it. Pins stand UP off the ground as billboards (white stem + red label), so the map reads as a place, not a flat chart.
//   mode "touchdown": the camera settles on the touchdown point (pin + time), then a dashed measure runs to the end of the track in town
//                     with the survey's distance.
//   mode "cross":     the solid track draws from touchdown into the town while the camera follows its head; the head's time label
//                     runs 3:20 -> 3:23 PM (the survey's start / end times), i.e. the three minutes spoken.
// px are image pixels of the aerial. Camera = image px centre + image px visible across the screen width.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];
type Cam = { at: number; c: P; span: number; tilt: number };

const camAt = (f: number, keys: Cam[]) => {
  if (f <= keys[0].at) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (f <= b.at) { const u = io((f - a.at) / (b.at - a.at)); const L = (x: number, y: number) => x + (y - x) * u;
      return { at: f, c: [L(a.c[0], b.c[0]), L(a.c[1], b.c[1])] as P, span: Math.exp(L(Math.log(a.span), Math.log(b.span))), tilt: L(a.tilt, b.tilt) }; }
  }
  return keys[keys.length - 1];
};

const Label: React.FC<{ text: string; g: number; size?: number }> = ({ text, g, size = 40 }) => (
  <div style={{ background: RED, padding: `${size * 0.14}px ${size * 0.32}px`, clipPath: `inset(0 ${(1 - g) * 100}% 0 0)`, boxShadow: "0 6px 18px rgba(0,0,0,.45)", whiteSpace: "pre" }}>
    <div style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: size, lineHeight: 1, color: "#0B0B0B", textTransform: "uppercase" }}>{text}</div>
  </div>
);

export const TrackGlide: React.FC<{
  src: string; iw: number; ih: number; a: P; b: P; cams: Cam[];
  mode: "touchdown" | "cross";
  pinA?: { text: string; at: number }; pinB?: { text: string; at: number };
  measure?: { at: number; len: number; text: string };
  draw?: { at: number; len: number; t0: number; t1: number }; // cross: clock minutes past 3 PM at start / end
}> = ({ src, iw, ih, a, b, cams, mode, pinA, pinB, measure, draw }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const cam = camAt(f, cams);
  const s = width / cam.span; // screen px per image px (before perspective)
  const W = iw * s, H = ih * s;
  const left = width / 2 - cam.c[0] * s, top = height * 0.56 - cam.c[1] * s;
  const X = (p: P) => p[0] * s, Y = (p: P) => p[1] * s;
  const fade = interpolate(f, [0, 8], [0, 1], cl);
  // track progress (cross) / measure progress (touchdown)
  const k = draw ? io(interpolate(f, [draw.at, draw.at + draw.len], [0, 1], cl)) : 0;
  const head: P = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const m = measure ? out(interpolate(f, [measure.at, measure.at + measure.len], [0, 1], cl)) : 0;
  const clock = draw ? Math.min(draw.t1, Math.floor(draw.t0 + (draw.t1 - draw.t0) * k + 0.0001)) : 0;
  const pin = (p: P, text: string, at: number, key: string, size = 40) => {
    const g = out(interpolate(f, [at, at + 12], [0, 1], cl)); if (g <= 0) return null;
    const stem = 190 * g;
    return (
      <div key={key} style={{ position: "absolute", left: X(p), top: Y(p), width: 0, height: 0, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: -13, top: -13, width: 26, height: 26, background: "rgba(227,20,27,.45)", border: `4px solid ${RED}`, outline: "2px solid rgba(255,255,255,.8)", boxSizing: "border-box", opacity: g }} />
        {/* billboard: stands up off the ground (counter-rotated against the plane's tilt) */}
        <div style={{ position: "absolute", left: 0, bottom: 0, transformOrigin: "0 100%", transform: `rotateX(${-cam.tilt}deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", left: -2, bottom: 0, width: 4, height: stem, background: "#fff", boxShadow: "0 0 8px rgba(0,0,0,.6)" }} />
          <div style={{ position: "absolute", left: -12, bottom: stem, }}><Label text={text} g={g} size={size} /></div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: "#0a0c0e", overflow: "hidden", opacity: fade }}>
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left, top, width: W, height: H, transformOrigin: `${cam.c[0] * s}px ${cam.c[1] * s}px`, transform: `rotateX(${cam.tilt}deg)`, transformStyle: "preserve-3d" }}>
          <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "contrast(1.12) saturate(1.15) brightness(1.04)" }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {mode === "touchdown" && m > 0 && (() => {
              const xb = X(a) + (X(b) - X(a)) * m, yb = Y(a) + (Y(b) - Y(a)) * m;
              return <g>
                <line x1={X(a)} y1={Y(a)} x2={xb} y2={yb} stroke="rgba(0,0,0,.5)" strokeWidth={14} strokeLinecap="round" />
                <line x1={X(a)} y1={Y(a)} x2={xb} y2={yb} stroke="#fff" strokeWidth={6} strokeDasharray={`${22} ${16}`} />
              </g>;
            })()}
            {mode === "cross" && k > 0 && <g>
              <line x1={X(a)} y1={Y(a)} x2={X(head)} y2={Y(head)} stroke="rgba(0,0,0,.5)" strokeWidth={30} strokeLinecap="round" />
              <line x1={X(a)} y1={Y(a)} x2={X(head)} y2={Y(head)} stroke="#fff" strokeWidth={16} strokeLinecap="round" />
            </g>}
          </svg>
          {pinA && pin(a, pinA.text, pinA.at, "a")}
          {pinB && pin(b, pinB.text, pinB.at, "b")}
          {mode === "touchdown" && measure && m > 0.98 && pin([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], measure.text, measure.at + measure.len - 10, "m", 36)}
          {mode === "cross" && draw && f >= draw.at && pin(head, `3:${String(clock).padStart(2, "0")} PM`, draw.at, "h", 40)}
        </div>
      </AbsoluteFill>
      <RedLabel text="" at={99999} />{/* loads the channel fonts */}
      {/* haze toward the horizon hides the plane's far edge */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,12,14,1) 0%, rgba(10,12,14,.85) 14%, rgba(10,12,14,0) 42%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 60%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
