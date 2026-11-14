// TP02 YearPlates: archive photos of the market as white-edged plates hung in 3-D depth; the camera drifts toward the first, then flies
// through it to the second (push-through), each plate lit by a soft moving pool of light.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Plate = { src: string; label?: string; pos?: string };
export const YearPlates: React.FC<{ plates: Plate[]; at: number[]; bg: string }> = ({ plates, at, bg }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const W = 1240, H = 760, GAP = 1300; // plates spaced in depth
  // camera z: each plate i sits at z = -i*GAP; the camera travels to z = -i*GAP + 900 at at[i]
  let camZ = 0;
  for (let i = 0; i < plates.length; i++) camZ = i === 0 ? -0 + 260 * io(f / durationInFrames) : camZ + (GAP) * io(interpolate(f, [at[i] - 14, at[i] + 10], [0, 1], cl));
  const sway = Math.sin(f / 40) * 2.5;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(28px) brightness(.3)" }} />
      <AbsoluteFill style={{ perspective: 1300, perspectiveOrigin: "50% 45%" }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(${camZ}px) rotateY(${sway}deg)` }}>
          {plates.map((p, i) => {
            const z = -i * GAP, rel = camZ + z; // >0 = plate in front of the camera plane
            const o = rel > 1150 ? interpolate(rel, [1150, 1290], [1, 0], cl) : 1;
            const lit = 0.5 + 0.5 * Math.sin((f + i * 30) / 45);
            return (
              <div key={i} style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2 - 10, width: W, height: H, transform: `translateZ(${z}px) rotateY(${i % 2 ? -7 : 7}deg) rotateX(2deg)`,
                border: "6px solid #fff", boxShadow: "0 40px 90px rgba(0,0,0,.7)", overflow: "hidden", opacity: o }}>
                <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "50% 50%" }} />
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 70% at ${30 + 40 * lit}% 40%, rgba(255,240,220,.16), rgba(0,0,0,.32) 80%)` }} />
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
      {plates.map((p, i) => p.label && <RedLabel key={i} text={p.label} at={(i === 0 ? 8 : at[i] + 10)} hold={(i + 1 < plates.length ? at[i + 1] - 14 : durationInFrames) - (i === 0 ? 8 : at[i] + 10)} y={0.9} size={40} />)}
    </AbsoluteFill>
  );
};
