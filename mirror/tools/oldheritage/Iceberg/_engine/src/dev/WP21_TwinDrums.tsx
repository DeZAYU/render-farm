// WP21 device: TwinDrums — the CSB's own frame of the plant floor frozen full screen with a slow push. Two blue drums from two
// different pallets are picked out: the hall sinks into shadow except a soft pool round each, white corner brackets draw round
// them and each gets its product name typed sharp in Elite as it is spoken (ANDISIL XL 10 / POTASSIUM HYDROXIDE SOLUTION). On
// "looked identical" the two names fade back so only the two same blue drums remain; on "react" a red seam draws from one drum to
// the other and both take a red edge glow.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FrameAt, cl, io, out, useWpFonts } from "./WP01_kit";

type Box = [number, number, number, number]; // x0 y0 x1 y1 in 1920x1080 frame coords
export const TwinDrums: React.FC<{
  src: string; t: number; n: number; a: Box; b: Box; nameA: string; nameB: string;
  atA: number; atB: number; same: number; react: number; credit?: string;
}> = ({ src, t, n, a, b, nameA, nameB, atA, atB, same, react, credit }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const s = 1.0 + 0.07 * io(Math.min(1, f / n));
  const cx = ((a[0] + a[2]) / 2 + (b[0] + b[2]) / 2) / 2 / 1920, cy = ((a[1] + a[3]) / 2 + (b[1] + b[3]) / 2) / 2 / 1080;
  const dim = 0.62 * io(interpolate(f, [atA - 10, atA + 18], [0, 1], cl));
  const fadeNames = interpolate(f, [same, same + 16], [1, 0.22], cl);
  const red = out(interpolate(f, [react, react + 16], [0, 1], cl));
  const bracket = (bx: Box, at: number, key: string) => {
    const u = out(interpolate(f, [at, at + 12], [0, 1], cl));
    if (u <= 0) return null;
    const pad = 18, [x0, y0, x1, y1] = [bx[0] - pad, bx[1] - pad, bx[2] + pad, bx[3] + pad];
    const L = Math.min(x1 - x0, y1 - y0) * 0.22 * u;
    const sw = 5;
    const col = `rgba(255,255,255,${0.95})`;
    const path = `M${x0},${y0 + L}V${y0}H${x0 + L} M${x1 - L},${y0}H${x1}V${y0 + L} M${x1},${y1 - L}V${y1}H${x1 - L} M${x0 + L},${y1}H${x0}V${y1 - L}`;
    return (
      <g key={key}>
        {red > 0 && <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="none" stroke="#E3141B" strokeWidth={3} opacity={0.75 * red} filter="url(#rg)" />}
        <path d={path} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="square" />
      </g>
    );
  };
  const tag = (bx: Box, at: number, text: string, side: "r" | "l") => {
    const k = Math.floor(interpolate(f, [at, at + text.length * 1.6], [0, text.length], cl));
    if (k <= 0) return null;
    const x = side === "r" ? bx[2] + 46 : bx[0] - 46, y = (bx[1] + bx[3]) / 2;
    return (
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(${side === "r" ? "0" : "-100%"}, -50%)`, opacity: fadeNames,
        fontFamily: "Elite", fontSize: 50, color: "#fff", letterSpacing: 1, whiteSpace: "nowrap", textShadow: "0 2px 14px rgba(0,0,0,.9), 0 0 3px rgba(0,0,0,.8)" }}>
        {text.slice(0, k)}<span style={{ opacity: k < text.length && f % 10 < 5 ? 1 : 0 }}>▌</span>
      </div>
    );
  };
  const ac = [(a[0] + a[2]) / 2, (a[1] + a[3]) / 2], bc = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
  const ex = (r: Box) => ({ cx: (r[0] + r[2]) / 2, cy: (r[1] + r[3]) / 2, rx: (r[2] - r[0]) * 0.85, ry: (r[3] - r[1]) * 0.75 });
  const ea = ex(a), eb = ex(b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${cx * 100}% ${cy * 100}%`, willChange: "transform" }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <filter id="sf" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480"><feGaussianBlur stdDeviation="60" /></filter>
            <filter id="rg" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480"><feGaussianBlur stdDeviation="6" /></filter>
            <mask id="m"><rect width="1920" height="1080" fill="#fff" />
              <ellipse {...ea} fill="#000" filter="url(#sf)" /><ellipse {...eb} fill="#000" filter="url(#sf)" /></mask>
          </defs>
          <rect width="1920" height="1080" fill="#000" opacity={dim} mask="url(#m)" />
          {bracket(a, atA - 6, "a")}{bracket(b, atB - 6, "b")}
          {red > 0 && (() => {
            const len = Math.hypot(ac[0] - bc[0], ac[1] - bc[1]);
            return <g>
              <line x1={bc[0]} y1={bc[1]} x2={ac[0]} y2={ac[1]} stroke="#E3141B" strokeWidth={14} opacity={0.35 * red} filter="url(#rg)" strokeDasharray={len} strokeDashoffset={len * (1 - red)} />
              <line x1={bc[0]} y1={bc[1]} x2={ac[0]} y2={ac[1]} stroke="#E3141B" strokeWidth={5} strokeDasharray={len} strokeDashoffset={len * (1 - red)} />
            </g>;
          })()}
        </svg>
        {tag(a, atA, nameA, "r")}{tag(b, atB, nameB, "r")}
      </AbsoluteFill>
      {credit && <div style={{ position: "absolute", left: 60, bottom: 44, fontFamily: "Elite", fontSize: 24, color: "rgba(255,255,255,.75)", textShadow: "0 1px 6px #000",
        opacity: interpolate(f, [10, 24], [0, 1], cl) }}>{credit}</div>}
    </AbsoluteFill>
  );
};
