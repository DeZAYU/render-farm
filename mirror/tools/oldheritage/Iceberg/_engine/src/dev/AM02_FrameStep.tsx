// AM02 FrameStep: "A piece of guide rail there is out of place. They just got quite a jolt, and the family only spotted the rail when they
// watched this back. It's easy to miss in all that spray." The family's clip is watched back the way they would have: it scrubs back
// from the end of the clip (a short soft smear), then advances frame by frame in small taps toward the bend; on "out of place" it stops,
// two white corner brackets close round the stretch of wall where the spray sheets over (the broken rail's spot), and the picture pushes
// in on it and runs on at one-third speed (motion-interpolated) so the water keeps pouring over that wall. Footage only, no text.
// Brackets are drawn in picture coordinates (0..1 of the clip frame) so they ride the push.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const FrameStep: React.FC<{
  src: string; slow: string; slowT0: number; slowX: number; // full-speed file; slow file = src from slowT0 at 1/slowX speed
  revFrom: number; revTo: number; revLen: number; // scrub back (source s) over revLen frames
  stepTo: number; stepEvery: number; stopAt: number; // frame-step forward from revTo to stepTo (source s), a tap every stepEvery frames, stop by frame stopAt
  box: [number, number, number, number]; zoom: number; runMax?: number; // runMax: frames of slow motion before it holds
}> = ({ src, slow, slowT0, slowX, revFrom, revTo, revLen, stepTo, stepEvery, stopAt, box, zoom, runMax = 9999 }) => {
  const f = useCurrentFrame();
  const stepStart = revLen + 4;
  const nSteps = Math.max(1, Math.floor((stopAt - stepStart) / stepEvery));
  let srcT: number; let smear = 0;
  if (f < revLen) { const u = io(f / revLen); srcT = revFrom + (revTo - revFrom) * u; smear = Math.sin(Math.PI * (f / revLen)) * 14; }
  else if (f < stepStart) srcT = revTo;
  else if (f < stopAt) { const i = Math.min(nSteps, Math.floor((f - stepStart) / stepEvery) + 1); srcT = revTo + (stepTo - revTo) * (i / nSteps); }
  else srcT = stepTo;
  const running = f >= stopAt + 18; // after the brackets close the picture runs on in slow motion
  const z = 1 + (zoom - 1) * io(interpolate(f, [stopAt, stopAt + 60], [0, 1], cl)) + 0.04 * interpolate(f, [stopAt + 60, stopAt + 400], [0, 1], cl);
  const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
  const b = out(interpolate(f, [stopAt, stopAt + 14], [0, 1], cl));
  const g = 1 + 0.5 * (1 - b);
  const bw = (box[2] - box[0]) * 1920 * g, bh = (box[3] - box[1]) * 1080 * g, bx = cx * 1920 - bw / 2, by = cy * 1080 - bh / 2, L = Math.min(bw, bh) * 0.28;
  const vidStyle = { width: "100%", height: "100%", objectFit: "cover" as const };
  const pic = running
    ? <Freeze frame={Math.round((stepTo - slowT0) * slowX * 30) + Math.min(f - stopAt - 18, runMax)}><OffthreadVideo src={staticFile(slow)} muted style={vidStyle} /></Freeze>
    : <Freeze frame={Math.round(srcT * 30)}><OffthreadVideo src={staticFile(src)} muted style={vidStyle} /></Freeze>;
  const corner = (x: number, y: number, sx: number, sy: number, k: string) =>
    <path key={k} d={`M${x + sx * L},${y} L${x},${y} L${x},${y + sy * L}`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="square" />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${cx * 100}% ${cy * 100}%`, filter: smear > 0.5 ? `blur(${(smear * 0.25).toFixed(2)}px)` : undefined }}>
        {pic}
        {b > 0 && (
          <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: b, filter: "drop-shadow(0 0 4px rgba(0,0,0,.8))" }}>
            {corner(bx, by, 1, 1, "a")}{corner(bx + bw, by, -1, 1, "b")}{corner(bx, by + bh, 1, -1, "c")}{corner(bx + bw, by + bh, -1, -1, "d")}
          </svg>
        )}
      </AbsoluteFill>
      {smear > 0.5 && <AbsoluteFill style={{ opacity: smear / 30, background: "repeating-linear-gradient(0deg, rgba(255,255,255,.08) 0 2px, rgba(0,0,0,0) 2px 5px)" }} />}
    </AbsoluteFill>
  );
};

