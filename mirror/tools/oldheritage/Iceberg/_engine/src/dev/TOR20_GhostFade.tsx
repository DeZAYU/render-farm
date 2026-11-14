// TOR20 GhostFade: Manchester from above in 1991 (USGS, public domain): a white bracket closes on each building one after another; then
// the 2004 USGS photo of the same ground (registered on the street grid) dissolves in under them, and the brackets are left framing
// empty lots. Red labels give each photo's year.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const GhostFade: React.FC<{ then: string; now: string; iw: number; ih: number; focus: [number, number]; z: [number, number]; marks: [number, number][];
  markAt: number; every: number; fadeAt: number; fadeLen: number; thenLabel: string; nowLabel: string; size?: number }> = ({ then, now, iw, ih, focus, z, marks, markAt, every, fadeAt, fadeLen, thenLabel, nowLabel, size = 70 }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames } = useVideoConfig();
  const zz = z[0] + (z[1] - z[0]) * io(f / durationInFrames);
  const b = Math.max(W / iw, H / ih) * zz;
  const ox = Math.min(0, Math.max(W - iw * b, W / 2 - focus[0] * b)), oy = Math.min(0, Math.max(H - ih * b, H / 2 - focus[1] * b));
  const st: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: iw * b, height: ih * b };
  const fade = io(interpolate(f, [fadeAt, fadeAt + fadeLen], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(then)} style={{ ...st, filter: "contrast(1.05)" }} />
      <Img src={staticFile(now)} style={{ ...st, opacity: fade, filter: "saturate(.85)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {marks.map(([x, y], i) => {
          const g = out(interpolate(f, [markAt + i * every, markAt + i * every + 10], [0, 1], cl)); if (g <= 0) return null;
          const X = ox + x * b, Y = oy + y * b, s = size * zz * 0.55 * (1.5 - 0.5 * g), a = s * 0.32;
          const c = (sx: number, sy: number) => `M ${X + sx * s / 2 - sx * a} ${Y + sy * s / 2} L ${X + sx * s / 2} ${Y + sy * s / 2} L ${X + sx * s / 2} ${Y + sy * s / 2 - sy * a}`;
          return <g key={i} opacity={g} style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,.8))" }}>
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], k) => <path key={k} d={c(sx, sy)} fill="none" stroke="#fff" strokeWidth={4} />)}
          </g>;
        })}
      </svg>
      <RedLabel text={thenLabel} at={4} hold={fadeAt + fadeLen / 2 - 4} x={0.5} y={0.9} />
      <RedLabel text={nowLabel} at={fadeAt + fadeLen / 2 + 2} x={0.5} y={0.9} />
    </AbsoluteFill>
  );
};
