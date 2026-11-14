// ND10 ShipMeasure: the Chikyu's length measured on a real side-on photo of the ship (Wikimedia Commons "Chikyu 2.jpg", CC BY-SA 3.0):
// a slow push along the hull while a white dimension line runs bow -> stern with end ticks, then the red label gives the length.
// px = photo pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const ND10_ShipMeasure: React.FC<{ src: string; iw: number; ih: number; bow: [number, number]; stern: [number, number]; at: number; len: number; label: string; z0?: number; z1?: number; focus: [number, number] }> = ({ src, iw, ih, bow, stern, at, len, label, z0 = 1.0, z1 = 1.08, focus }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  const X = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const [x0, y0] = X(bow), [x1, y1] = X(stern);
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const xe = x0 + (x1 - x0) * g, ye = y0 + (y1 - y0) * g;
  const tk = (x: number, y: number, o: number) => <line x1={x} y1={y - 26} x2={x} y2={y + 26} stroke="#fff" strokeWidth={5} opacity={o} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }}>
        {g > 0 && <>
          <line x1={x0 - 30} y1={y0} x2={x1 + 30} y2={y1} stroke="rgba(0,0,0,.42)" strokeWidth={64} opacity={Math.min(1, g * 3)} />
          <line x1={x0} y1={y0} x2={xe} y2={ye} stroke="#fff" strokeWidth={5} />
          {tk(x0, y0, 1)}
          {tk(x1, y1, g > 0.98 ? 1 : 0)}
        </>}
      </svg>
      <RedLabel text={label} at={at + len - 4} x={(x0 + x1) / 2 / width} y={((y0 + y1) / 2 - 86) / height} />
    </AbsoluteFill>
  );
};
