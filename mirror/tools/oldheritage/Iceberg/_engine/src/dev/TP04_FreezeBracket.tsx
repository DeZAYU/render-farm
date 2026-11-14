// TP04 FreezeBracket — the clip runs, freezes on its word, four white corner brackets close from the frame edges onto a detail (the two
// figures on the rope), and the camera pushes into the bracket while the rest of the frame dims. No text: the VO names what is inside.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** box = [cx, cy, w, h] as fractions of the frame; freezeAt = frames of play before the freeze */
export const FreezeBracket: React.FC<{ src: string; from: number; freezeAt: number; box: [number, number, number, number]; zoom?: number }> = ({ src, from, freezeAt, box, zoom = 2.3 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const [bx, by, bw, bh] = box;
  const b = out(interpolate(f, [freezeAt + 2, freezeAt + 20], [0, 1], cl));
  const z = 1 + (zoom - 1) * io(interpolate(f, [freezeAt + 14, durationInFrames - 4], [0, 1], cl));
  const pre = 1.04 + 0.02 * (f / Math.max(1, freezeAt));
  const s = Math.max(pre, z * 1.04);
  // brackets close from the frame corners onto the box
  const X0 = interpolate(b, [0, 1], [0.04, bx - bw / 2]), X1 = interpolate(b, [0, 1], [0.96, bx + bw / 2]);
  const Y0 = interpolate(b, [0, 1], [0.06, by - bh / 2]), Y1 = interpolate(b, [0, 1], [0.94, by + bh / 2]);
  const L = 46;
  const vid = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  const tf = `scale(${s.toFixed(4)})`;
  const corner = (x: number, y: number, sx: number, sy: number, k: number) =>
    <path key={k} d={`M${x * width + sx * L} ${y * height} L${x * width} ${y * height} L${x * width} ${y * height + sy * L}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="square" />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: tf, transformOrigin: `${bx * 100}% ${by * 100}%` }}>
        {f < freezeAt ? vid : <Freeze frame={freezeAt}>{vid}</Freeze>}
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          <defs><mask id="tp04fb"><rect width={width} height={height} fill="#fff" /><rect x={(bx - bw / 2) * width} y={(by - bh / 2) * height} width={bw * width} height={bh * height} fill="#000" /></mask></defs>
          <rect width={width} height={height} fill={`rgba(0,0,0,${0.45 * b})`} mask="url(#tp04fb)" />
        </svg>
      </AbsoluteFill>
      {f >= freezeAt && (() => {
        // brackets are drawn in screen space (stay crisp) on the zoomed box
        const ox = bx * width, oy = by * height, sx = (x: number) => (ox + (x * width - ox) * s) / width, sy = (y: number) => (oy + (y * height - oy) * s) / height;
        return <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} opacity={b}>
          {corner(sx(X0), sy(Y0), 1, 1, 0)}{corner(sx(X1), sy(Y0), -1, 1, 1)}{corner(sx(X0), sy(Y1), 1, -1, 2)}{corner(sx(X1), sy(Y1), -1, -1, 3)}
        </svg>;
      })()}

    </AbsoluteFill>
  );
};
