// WP10 device: WallShave. The surveillance camera's frame of the burning unit, frozen full frame and pushed into the base of the fire;
// the CSB's own words typed sharp in Elite over the darkened frame, then a slice of the pipe wall drawn to scale (as built 0.719 in,
// shaved down to 0.039 in at the rupture): the steel band thins in place until only a red hairline is left. Source credited small.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FrameAt, useWpFonts, ARCH, cl, io, out } from "./WP01_kit";

const RED = "#E3141B";
export const WallShave: React.FC<{ src: string; t: number; n: number; fx?: number; fy?: number; line: string; hi: string; credit: string }> = ({ src, t, n, fx = 0.5, fy = 0.5, line, hi: key, credit }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const s = 1.04 + 0.16 * io(Math.min(1, f / n));
  const dim = interpolate(f, [4, 22], [0, 0.62], cl);
  // typed line
  const full = line; const ki = full.indexOf(key);
  const nType = Math.round(interpolate(f, [10, 10 + full.length * 0.9], [0, full.length], cl));
  const shown = full.slice(0, nType);
  // slice: 0.719 in -> 0.039 in, K px per inch
  const K = 190, h0 = 0.719 * K, h1 = 0.039 * K;
  const u = io(interpolate(f, [n * 0.42, n * 0.78], [0, 1], cl));
  const h = h0 + (h1 - h0) * u;
  const sIn = out(interpolate(f, [n * 0.3, n * 0.3 + 14], [0, 1], cl));
  const BW = 1180, bx = (1920 - BW) / 2, by = 700;
  const lab = (txt: string, o: number, x: number, y: number, c = "#F2F2F0") => (
    <div style={{ position: "absolute", left: x, top: y, ...ARCH, fontSize: 30, color: c, opacity: o, letterSpacing: "0.02em", textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 250, fontFamily: "Elite", fontSize: 58, lineHeight: 1.25, color: "#F2F2F0", textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>
        {ki >= 0 && nType > ki ? <>{shown.slice(0, ki)}<span style={{ background: RED, color: "#0B0B0B", padding: "0 10px" }}>{shown.slice(ki, Math.min(nType, ki + key.length))}</span>{shown.slice(ki + key.length)}</> : shown}
      </div>
      <div style={{ position: "absolute", left: 200, top: 520, fontFamily: "Elite", fontSize: 24, color: "rgba(242,242,240,.72)", opacity: interpolate(f, [30, 44], [0, 1], cl) }}>{credit}</div>
      {/* the slice of wall, to scale */}
      <div style={{ position: "absolute", left: bx, top: by, width: BW, height: h0, opacity: sIn }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h0, border: "3px dashed rgba(242,242,240,.55)", boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: u > 0.85 ? RED : `linear-gradient(180deg,#9a9c9f,#5d5f62)`, border: `4px solid ${u > 0.85 ? RED : "#F2F2F0"}`, boxSizing: "border-box", boxShadow: "0 8px 24px rgba(0,0,0,.6)" }} />
      </div>
      {lab("AS BUILT · 0.719 IN", sIn * (1 - u * 0.5), bx, by - 46)}
      {lab("AT THE RUPTURE · 0.039 IN", interpolate(u, [0.8, 1], [0, 1], cl), bx, by + h0 + 18, RED)}
    </AbsoluteFill>
  );
};
