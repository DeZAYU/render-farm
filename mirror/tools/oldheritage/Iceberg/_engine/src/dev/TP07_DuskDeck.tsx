// TP07 (Joker's Jinx): the four rescue hours as a deck of five white-framed photo cards of the SAME view from the fire department's
// camera, dealt one per hour (5:30 -> 9:30 PM) in a cascade that steps toward the camera; each card is a little darker (dusk frame ->
// full-dark frame), its hour typed on a white tab; the last card lands with a red frame and the red label. Spoken times only.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const DuskDeck: React.FC<{ dusk: string; night: string; hours: string[]; at?: number; every?: number; last: string }> = ({ dusk, night, hours, at = 4, every = 15, last }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const n = hours.length, d = io(f / durationInFrames);
  const CW = 640, CH = 360;
  const endAt = at + (n - 1) * every + 12;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(night)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(18px) brightness(.35)" }} />
      <AbsoluteFill style={{ perspective: 2000 }}>
        <AbsoluteFill style={{ transform: `scale(${1.0 + 0.05 * d}) translateX(${-30 * d}px)` }}>
          {hours.map((h, i) => {
            const t0 = at + i * every;
            const k = out(interpolate(f, [t0, t0 + 13], [0, 1], cl));
            if (f < t0) return null;
            const u = i / (n - 1);
            const x = 150 + i * 255, y = 150 + i * 92;
            const isLast = i === n - 1;
            const red = isLast ? interpolate(f, [endAt, endAt + 8], [0, 1], cl) : 0;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, opacity: k,
                transform: `translate(${(1 - k) * 160}px, ${(1 - k) * -40}px) rotateY(${-16 + 6 * k}deg) rotateZ(${(1 - k) * 4 - 1.5 + i * 0.6}deg)`,
                border: `7px solid ${red > 0.5 ? RED : "#fff"}`, background: "#000", boxShadow: "0 24px 60px rgba(0,0,0,.75)" }}>
                <Img src={staticFile(u < 0.5 ? dusk : night)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - 0.45 * u}) saturate(${1 - 0.3 * u})` }} />
                <div style={{ position: "absolute", inset: 0, background: `rgba(6,10,28,${0.08 + 0.32 * u})` }} />
                <div style={{ position: "absolute", left: -7, top: -54, background: "#fff", padding: "8px 16px 6px", fontFamily: "Archivo", fontWeight: 900,
                  fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 34, lineHeight: 1, color: "#0B0B0B" }}>{h}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      <RedLabel text={last} at={endAt + 4} x={0.73} y={0.93} size={44} />
    </AbsoluteFill>
  );
};
