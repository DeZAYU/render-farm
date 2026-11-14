// AM02 TiltLine: "It rode up and stopped, tipped at what one witness put at about 45 degrees, but stayed upright." The crash itself is not
// on camera, so the family's clip is frozen on the same kind of boat at the same bend (the boat ahead, seen from behind) and pushed in on it
// while the rest of the frame falls into shade. A white level line is laid along the boat's floor; on "tipped" a second white line lifts
// from the same pivot to the witness's 45 degrees, a thin arc drawn between them; on "stayed upright" the boat's level line flashes softly
// once. Lines in picture coordinates so they ride the push. No text.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const TiltLine: React.FC<{ src: string; at: number; pivot: [number, number]; len: number; levelAt: number; tiltAt: number; holdAt: number; zoom: number }> = ({ src, at, pivot, len, levelAt, tiltAt, holdAt, zoom }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const z = 1 + (zoom - 1) * io(interpolate(f, [0, 50], [0, 1], cl)) + 0.05 * (f / dur);
  const shade = io(interpolate(f, [10, 40], [0, 1], cl));
  const lv = out(interpolate(f, [levelAt, levelAt + 16], [0, 1], cl));
  const tl = io(interpolate(f, [tiltAt, tiltAt + 26], [0, 1], cl));
  const ang = 45 * tl * Math.PI / 180;
  const flash = interpolate(f, [holdAt, holdAt + 6, holdAt + 22], [0, 1, 0], cl);
  const px = pivot[0] * 1920, py = pivot[1] * 1080;
  const ex = px + len * Math.cos(ang), ey = py - len * Math.sin(ang);
  const r = len * 0.45;
  const arc = tl > 0.02 ? `M${px + r},${py} A${r},${r} 0 0 0 ${px + r * Math.cos(ang)},${py - r * Math.sin(ang)}` : "";
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${pivot[0] * 100}% ${pivot[1] * 100}%` }}>
        <Freeze frame={Math.round(at * 30)}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Freeze>
        <AbsoluteFill style={{ opacity: shade, background: `radial-gradient(ellipse 420px 300px at ${px + len * 0.35}px ${py - len * 0.2}px, rgba(0,0,0,0) 35%, rgba(4,8,14,.62) 100%)` }} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 3px rgba(0,0,0,.85))" }}>
          {lv > 0 && <line x1={px} y1={py} x2={px + len * lv} y2={py} stroke="#fff" strokeWidth={4 + 3 * flash} strokeLinecap="round" opacity={0.85 + 0.15 * flash} />}
          {tl > 0 && <line x1={px} y1={py} x2={ex} y2={ey} stroke="#fff" strokeWidth={4} strokeLinecap="round" />}
          {arc && <path d={arc} fill="none" stroke="#fff" strokeWidth={2.5} opacity={0.9} />}
          {lv > 0 && <circle cx={px} cy={py} r={6} fill="#fff" opacity={lv} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
