// TOR13 DepthStill: a 2.5-D move through one real photograph (NOAA, Ethan Schisler: the Pilger twins side by side). The photo is cut into
// depth bands (sky / the two funnels / the field and road) by soft masks; each band travels at its own speed so the camera seems to
// slide sideways between them, the funnels hanging in the middle distance. White corner brackets settle on the pair.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const DepthStill: React.FC<{ src: string; iw: number; ih: number; bands: { top: number; bot: number; move: number; scale: number }[]; pair?: [number, number, number, number]; pairAt?: number }> = ({ src, iw, ih, bands, pair, pairAt = 20 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / Math.max(1, durationInFrames - 1));
  const k = Math.max(width / iw, height / ih) * 1.12;
  const W = iw * k, H = ih * k, x0 = (width - W) / 2, y0 = (height - H) / 2;
  const g = out(interpolate(f, [pairAt, pairAt + 14], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {bands.map((b, i) => {
        const m = `linear-gradient(180deg, rgba(0,0,0,0) ${b.top * 100 - 6}%, #000 ${b.top * 100 + 4}%, #000 ${b.bot * 100 - 4}%, rgba(0,0,0,0) ${b.bot * 100 + 6}%)`;
        const tx = (u - 0.5) * b.move, s = b.scale + (b.scale - 1) * 0.6 * u;
        return <Img key={i} src={staticFile(src)} style={{ position: "absolute", left: x0, top: y0, width: W, height: H, transform: `translate3d(${tx.toFixed(2)}px,0,0) scale(${s.toFixed(4)})`, transformOrigin: "50% 60%",
          WebkitMaskImage: i === 0 ? undefined : m, maskImage: i === 0 ? undefined : m }} />;
      })}
      {pair && g > 0 && (() => {
        const [a, b, c, d] = pair; const mv = (u - 0.5) * bands[Math.min(1, bands.length - 1)].move;
        const X0 = x0 + a * k + mv, Y0 = y0 + b * k, X1 = x0 + c * k + mv, Y1 = y0 + d * k, L = 46 * g;
        const s = { stroke: "#fff", strokeWidth: 5, fill: "none" };
        return <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} opacity={g}>
          <path d={`M${X0} ${Y0 + L} V${Y0} H${X0 + L}`} {...s} /><path d={`M${X1 - L} ${Y0} H${X1} V${Y0 + L}`} {...s} />
          <path d={`M${X0} ${Y1 - L} V${Y1} H${X0 + L}`} {...s} /><path d={`M${X1 - L} ${Y1} H${X1} V${Y1 - L}`} {...s} />
        </svg>;
      })()}
    </AbsoluteFill>
  );
};
