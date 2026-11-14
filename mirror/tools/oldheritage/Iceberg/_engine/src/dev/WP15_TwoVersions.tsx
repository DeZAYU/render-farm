// WP15 device: TwoVersions. The telephoto frame of the burning yard is frozen; a white seam draws down the middle and the picture
// parts into two halves, each pushing in on its own part of the same frame: the left on the fire's base in the filling yard, the right
// on the dark box beside it. Each version takes its turn: its half lights up while the other dims, a red source tag and the version
// typed sharp in Elite. Neither half wins: at the end both settle at the same dim level.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ARCH, FrameAt, cl, io, out, useWpFonts } from "./WP01_kit";

type Side = { focus: [number, number]; zoom: number; tag: string; line: string; at: number };

const Half: React.FC<{ src: string; t: number; side: Side; left: boolean; open: number; lit: number; f: number }> = ({ src, t, side, left, open, lit, f }) => {
  const W = 960, gap = 14 * open;
  const z = 1 + (side.zoom - 1) * io(open) + 0.04 * io(interpolate(f, [0, 360], [0, 1], cl));
  // the half shows the full frame (1920 wide) scaled by z about the focus; the focus slides toward the half's centre as it opens
  const fxPx = side.focus[0] * 1920, fyPx = side.focus[1] * 1080;
  const cxTarget = W / 2, cxStart = left ? fxPx : fxPx - 960;
  const cx = cxStart + (cxTarget - cxStart) * io(open);
  const tx = cx - fxPx * z, ty = (540 - fyPx * z) * io(open);
  const typed = Math.max(0, Math.floor(interpolate(f, [side.at + 14, side.at + 14 + side.line.length * 1.4], [0, side.line.length], cl)));
  const tagK = out(interpolate(f, [side.at, side.at + 9], [0, 1], cl));
  return (
    <div style={{ position: "absolute", top: 0, left: left ? -gap : 960 + gap, width: W, height: 1080, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: tx, top: ty, width: 1920 * z, height: 1080 * z, transformOrigin: "0 0" }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.62 - 0.5 * lit})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,0) 42%)", opacity: tagK }} />
      <div style={{ position: "absolute", left: 60, bottom: 196, opacity: tagK, transform: `translateY(${(1 - tagK) * 16}px)` }}>
        <span style={{ ...ARCH, background: "#E3141B", color: "#0A0A0A", fontSize: 30, padding: "8px 14px 6px", letterSpacing: 1 }}>{side.tag}</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 74, fontFamily: "Elite", fontSize: 50, lineHeight: 1.15, color: "#F2F2F0", textShadow: "0 2px 10px rgba(0,0,0,.9)", opacity: 0.35 + 0.65 * lit }}>
        {side.line.slice(0, typed)}
      </div>
    </div>
  );
};

export const TwoVersions: React.FC<{ src: string; t: number; n: number; a: Side; b: Side; split: number; turnA: number; turnB: number; settle: number }> = ({ src, t, n, a, b, split, turnA, turnB, settle }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const seam = io(interpolate(f, [split, split + 22], [0, 1], cl));
  const open = interpolate(f, [split + 16, split + 46], [0, 1], cl);
  const litA = interpolate(f, [turnA, turnA + 12, turnB, turnB + 12, settle, settle + 20], [0.6, 1, 1, 0.25, 0.25, 0.45], cl);
  const litB = interpolate(f, [turnA, turnA + 12, turnB, turnB + 12, settle, settle + 20], [0.6, 0.25, 0.25, 1, 1, 0.45], cl);
  const s = 1 + 0.05 * io(interpolate(f, [0, split + 20], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {open <= 0 ? (
        <AbsoluteFill style={{ transform: `scale(${s})` }}>
          <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <AbsoluteFill style={{ background: "rgba(0,0,0,.12)" }} />
        </AbsoluteFill>
      ) : (
        <>
          <Half src={src} t={t} side={a} left open={open} lit={litA} f={f} />
          <Half src={src} t={t} side={b} left={false} open={open} lit={litB} f={f} />
        </>
      )}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <line x1={960} y1={0} x2={960} y2={1080 * seam} stroke="#F2F2F0" strokeWidth={6} opacity={interpolate(f, [n - 12, n], [1, 0.6], cl)} />
      </svg>
    </AbsoluteFill>
  );
};
