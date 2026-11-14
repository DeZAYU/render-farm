// TOR21 (Marshalltown) — the two real NWS Des Moines bulletins (IEM text archive): the 3:54 PM tornado warning ("SOURCE...Radar
// indicated rotation.") and the 4:37 PM warning that carried the TORNADO EMERGENCY. A bulletin is a long sheet of text, so it is shown
// as a sheet lying in 3-D with the camera travelling DOWN it (one eased curve through all its stops), the proving line lit with a red
// marker that wipes on, the rest of the sheet falling into shade. The 4:37 sheet arrives on top of the 3:54 one (the stack is visible).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);
// monotone smoothstep through key stops (frame -> value): no hold-move-hold jerks
const glide = (f: number, keys: [number, number][]) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [a, va] = keys[i - 1], [b, vb] = keys[i];
    if (f <= b) { const u = (f - a) / (b - a); const s = u * u * (3 - 2 * u); return va + (vb - va) * s; }
  }
  return keys[keys.length - 1][1];
};

type Mark = { box: [number, number, number, number]; at: number }; // page px (2x screenshot), frame
export const BulletinSheet: React.FC<{ src: string; iw: number; ih: number; marks: Mark[]; camY: [number, number][]; under?: string; enterFrom?: "below" | "fade"; tilt?: [number, number] }> = ({ src, iw, ih, marks, camY, under, enterFrom = "fade", tilt = [24, -9] }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const W = 1500, k = W / iw, H = ih * k;
  const y = glide(f, camY) * k; // page-space y that sits at screen centre
  const enter = out(interpolate(f, [0, 16], [0, 1], cl));
  const slide = enterFrom === "below" ? (1 - enter) * 700 : 0;
  const push = 1.18 + 0.08 * (f / durationInFrames);
  const [rx, rz] = tilt;
  const sheet = (img: string, extra: React.CSSProperties, shade: number, children?: React.ReactNode) => (
    <div style={{ position: "absolute", left: (width - W) / 2 + 60, top: height / 2 - y, width: W, height: H, background: "#f7f8f9", boxShadow: "0 40px 90px rgba(0,0,0,.7)", ...extra }}>
      <Img src={staticFile(img)} style={{ width: W, height: H, display: "block" }} />
      {children}
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${shade})` }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, #1b1d20 0%, #050505 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 30%" }}>
        <AbsoluteFill style={{ transform: `scale(${push}) rotateX(${rx}deg) rotateZ(${rz}deg)`, transformOrigin: "50% 50%", transformStyle: "preserve-3d" }}>
          {under && sheet(under, { transform: "translate3d(-46px, 30px, -40px) rotateZ(-2.2deg)" }, 0.5)}
          {sheet(src, { transform: `translate3d(0, ${slide}px, 0)`, opacity: enterFrom === "fade" ? enter : 1 }, 0,
            <>
              {/* shade everything but the lit lines (spot falloff) */}
              {marks.map((m, i) => {
                const g = out(interpolate(f, [m.at, m.at + 14], [0, 1], cl)); if (g <= 0) return null;
                const [x0, y0, x1, y1] = m.box.map((v) => v * k);
                return (
                  <div key={i}>
                    <div style={{ position: "absolute", left: x0 - 10, top: y0 - 4, width: (x1 - x0 + 20) * g, height: y1 - y0 + 8, background: RED, opacity: 0.9, mixBlendMode: "multiply" }} />
                    <div style={{ position: "absolute", left: x0 - 10, top: y1 + 7, width: (x1 - x0 + 20) * g, height: 4, background: RED }} />
                  </div>
                );
              })}
            </>)}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* lens: light pool + vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 45% at 48% 50%, rgba(255,248,236,.06) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
