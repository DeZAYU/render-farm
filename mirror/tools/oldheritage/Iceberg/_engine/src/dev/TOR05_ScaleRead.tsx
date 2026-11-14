// TOR05 | ScaleRead: "you judge it by the buildings in front of it". A held frame of the footage, slow push; a white measuring
// bracket is drawn over one building in front of the wedge, then the same bracket is pulled out sideways until it spans the
// base of the wedge, so the building becomes the unit of measure. px = still image pixels (iw x ih), image covers the frame.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const ScaleRead: React.FC<{ src: string; iw: number; ih: number; y: number; unit: [number, number]; span: [number, number]; drawAt: number; stretchAt: number; stretchLen?: number }> = ({ src, iw, ih, y, unit, span, drawAt, stretchAt, stretchLen = 26 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = 1.02 + 0.06 * io(f / durationInFrames);
  const s = Math.max(width / iw, height / ih) * z;
  const ox = width / 2 - (iw / 2) * s, oy = height / 2 - (ih / 2) * s;
  const X = (px: number) => ox + px * s, Y = oy + y * s;
  const d = out(interpolate(f, [drawAt, drawAt + 12], [0, 1], cl));
  const k = io(interpolate(f, [stretchAt, stretchAt + stretchLen], [0, 1], cl));
  const a = X(unit[0] + (span[0] - unit[0]) * k), b = X(unit[1] + (span[1] - unit[1]) * k);
  const mid = (a + b) / 2, half = ((b - a) / 2) * d;
  const tick = 30;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * s, height: ih * s }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.8))" }}>
        {d > 0 && <g stroke="#fff" strokeWidth={5} strokeLinecap="square" opacity={d}>
          <line x1={mid - half} y1={Y} x2={mid + half} y2={Y} />
          <line x1={mid - half} y1={Y - tick} x2={mid - half} y2={Y + tick} />
          <line x1={mid + half} y1={Y - tick} x2={mid + half} y2={Y + tick} />
        </g>}
      </svg>
    </AbsoluteFill>
  );
};
