// TOR06 | FreezeLift: the moment of "look at it flying", stopped. The raw's frame freezes, four white corner brackets close
// on the debris cloud at the funnel, then that bracketed patch lifts off the frame as a white-framed plane toward the camera
// (the frozen frame behind sinks back and darkens) and starts moving again inside the frame in slow motion (0.5x file).
// box = [x0, y0, x1, y1] as fractions of the frame. `still` is the frozen frame exported as an image (stillAt is documentation).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const FreezeLift: React.FC<{ still: string; stillAt: number; slow: string; slowFrom?: number; box: [number, number, number, number]; bracketAt?: number; liftAt?: number }> = ({ still, stillAt, slow, slowFrom = 0, box, bracketAt = 4, liftAt = 26 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const b = out(interpolate(f, [bracketAt, bracketAt + 12], [0, 1], cl));
  const L = io(interpolate(f, [liftAt, liftAt + 22], [0, 1], cl));
  const [x0, y0, x1, y1] = [box[0] * width, box[1] * height, box[2] * width, box[3] * height];
  const bw = x1 - x0, bh = y1 - y0;
  // lifted plane: from the box to a large centred frame (keeps the box's aspect), tilting slightly as it comes forward
  const tw = width * 0.58, th = tw * bh / bw;
  const cx = x0 + bw / 2 + (width / 2 - (x0 + bw / 2)) * L, cy = y0 + bh / 2 + (height / 2 - 10 - (y0 + bh / 2)) * L;
  const pw = bw + (tw - bw) * L, ph = bh + (th - bh) * L;
  const drift = io(f / durationInFrames);
  const bgScale = 1.04 - 0.04 * L + 0.02 * drift;
  // brackets: start 40 px outside the box and close in
  const pad = 40 * (1 - b), cl2 = 46;
  const br = (x: number, y: number, sx: number, sy: number) => <path d={`M${x + sx * cl2} ${y} L${x} ${y} L${x} ${y + sy * cl2}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="square" />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${bgScale})`, filter: `brightness(${1 - 0.55 * L}) blur(${6 * L}px)` }}>
        <Img src={staticFile(still)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {L <= 0.01 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: b, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
          {br(x0 - pad, y0 - pad, 1, 1)}{br(x1 + pad, y0 - pad, -1, 1)}{br(x0 - pad, y1 + pad, 1, -1)}{br(x1 + pad, y1 + pad, -1, -1)}
        </svg>
      )}
      {L > 0.01 && (
        <div style={{ position: "absolute", left: cx - pw / 2, top: cy - ph / 2, width: pw, height: ph, border: "6px solid #fff", overflow: "hidden",
          boxShadow: `0 ${30 * L}px ${70 * L}px rgba(0,0,0,.7)`, transform: `perspective(1600px) rotateY(${-6 * L + 3 * drift}deg)` }}>
          {/* the slow file, positioned so its picture lines up with the frozen box at the start of the lift */}
          <div style={{ position: "absolute", left: -x0 * (pw / bw), top: -y0 * (ph / bh), width: width * (pw / bw), height: height * (ph / bh) }}>
            <Sequence from={liftAt} layout="none"><OffthreadVideo src={staticFile(slow)} startFrom={Math.round(slowFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
