// WP19 FireType: the TSSA's own words ("a frequent and routine practice") cut out of a dark veil laid over the burning yard, so the
// fire keeps burning INSIDE the letters (knock-out type, multiply blend). Words open one by one on the VO, a thin white edge keeps
// them sharp; the footage plays slowed full frame behind, the frame eases in. Source credited small. Built for WP19 only.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, useWpFonts } from "./WP01_kit";

type Word = { w: string; at: number };
export const FireType: React.FC<{ src: string; from: number; rate?: number; n: number; lines: Word[][]; credit: string; size?: number }> = ({ src, from, rate = 0.8, n, lines, credit, size = 150 }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const s = 1.03 + 0.07 * io(Math.min(1, f / n));
  const veil = interpolate(f, [0, 14], [0, 0.84], cl);
  const fadeOut = interpolate(f, [n - 10, n], [1, 0.9], cl);
  const words = (mode: "cut" | "edge") => (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: size * 0.08 }}>
      {lines.map((ln, i) => (
        <div key={i} style={{ display: "flex", gap: size * 0.32, whiteSpace: "pre" }}>
          {ln.map(({ w, at }, j) => {
            const u = io(interpolate(f, [at, at + 10], [0, 1], cl));
            return (
              <span key={j} style={{
                fontFamily: "Elite", fontSize: size, lineHeight: 1.0, letterSpacing: "0.01em",
                opacity: u, transform: `translateY(${(1 - u) * 18}px) scale(${0.96 + 0.04 * u})`, display: "inline-block",
                filter: `blur(${(1 - u) * 6}px)`,
                color: mode === "cut" ? "#fff" : "transparent",
                WebkitTextStroke: mode === "edge" ? "2px rgba(255,255,255,.75)" : undefined,
              }}>{w}</span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: "50% 55%" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.25) saturate(1.1)" }} />
      </AbsoluteFill>
      {/* the veil: black everywhere, white (= the fire shows through) inside the letters */}
      <AbsoluteFill style={{ mixBlendMode: "multiply", opacity: fadeOut }}>
        <AbsoluteFill style={{ background: `rgba(${Math.round(255 * (1 - veil))},${Math.round(255 * (1 - veil))},${Math.round(255 * (1 - veil))},1)` }} />
        {words("cut")}
      </AbsoluteFill>
      {words("edge")}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: "Elite", fontSize: 30, color: "rgba(255,255,255,.72)",
        opacity: interpolate(f, [18, 30], [0, 1], cl), letterSpacing: "0.04em" }}>{credit}</div>
    </AbsoluteFill>
  );
};
