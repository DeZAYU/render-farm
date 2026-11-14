// TP18 PierBurn: Hastings Pier on a real elevated aerial (Commons, "Hasting Pier Aug 2026", CC BY 4.0), shown dim and grey as a plan of
// the deck. The deck outline is traced in white from the land end out to the pier head, then the deck is cut into sections across its
// length and each section washes red in turn, from the pier head back towards the shore, until only the land-end strip by the
// promenade is left untouched (the fire service's "about ninety-five per cent"). Coordinates are image px; axis = land -> head.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const PierBurn: React.FC<{
  src: string; iw: number; ih: number; focus: [number, number]; z0?: number; z1?: number;
  deck: [number, number][]; axis: [[number, number], [number, number]]; keep: number; sections: number;
  traceAt: number; traceLen: number; burnAt: number; every: number; label?: string; labelAt?: number;
}> = ({ src, iw, ih, focus, z0 = 1.0, z1 = 1.08, deck, axis, keep, sections, traceAt, traceLen, burnAt, every, label, labelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  const P = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base] as const;
  const d = "M" + deck.map((p) => P(p).join(" ")).join(" L") + " Z";
  // axis frame: u = along the pier (0 land edge, 1 head end), v = across it
  const [A, B] = [P(axis[0]), P(axis[1])];
  const ux = B[0] - A[0], uy = B[1] - A[1], L = Math.hypot(ux, uy), ang = Math.atan2(uy, ux) * 180 / Math.PI;
  const tr = io(interpolate(f, [traceAt, traceAt + traceLen], [0, 1], cl));
  const dimIn = interpolate(f, [0, 10], [0, 1], cl);
  const span = (1 - keep) / sections;
  const bands = Array.from({ length: sections }, (_, k) => {
    const t1 = k === 0 ? 1.25 : 1 - k * span, t0 = Math.max(keep, 1 - (k + 1) * span); // from the head back to the land end
    const g = out(interpolate(f, [burnAt + k * every, burnAt + k * every + 9], [0, 1], cl));
    return { t0, t1, g };
  });
  const lastIn = burnAt + (sections - 1) * every + 9;
  const keepG = out(interpolate(f, [lastIn + 4, lastIn + 18], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: `grayscale(${0.75 * dimIn}) brightness(${1 - 0.48 * dimIn}) contrast(1.08)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="tp18deck"><path d={d} /></clipPath>
          <filter id="tp18glow"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        {/* the sections, washed red one by one (clipped to the deck); a hot edge on the newest one */}
        <g clipPath="url(#tp18deck)">
          <g transform={`translate(${A[0]} ${A[1]}) rotate(${ang})`}>
            {bands.map((b, k) => b.g > 0 && (
              <g key={k}>
                <rect x={b.t0 * L} y={-L} width={(b.t1 - b.t0) * L} height={2 * L} fill={RED} opacity={0.46 * b.g} />
                <rect x={b.t0 * L - 3} y={-L} width={6} height={2 * L} fill="#FFB35A" opacity={0.85 * b.g * (1 - out(interpolate(f, [burnAt + k * every + 9, burnAt + k * every + 22], [0, 1], cl)))} filter="url(#tp18glow)" />
              </g>
            ))}
            {/* section seams across the deck */}
            {bands.map((b, k) => b.g > 0 && <line key={"s" + k} x1={b.t0 * L} y1={-L} x2={b.t0 * L} y2={L} stroke="rgba(0,0,0,.35)" strokeWidth={2} />)}
          </g>
        </g>
        {/* the deck outline, traced from the land end */}
        <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={11} pathLength={1} strokeDasharray={`${tr} 1`} strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${tr} 1`} strokeLinejoin="round" />
        {/* the strip that came through: white line across the deck at the boundary */}
        {keepG > 0 && (() => {
          const cx = A[0] + ux * keep, cy = A[1] + uy * keep, nx = -uy / L, ny = ux / L, h = 0.62 * L * keepG;
          return <g><line x1={cx - nx * h} y1={cy - ny * h} x2={cx + nx * h} y2={cy + ny * h} stroke="rgba(0,0,0,.5)" strokeWidth={10} clipPath="url(#tp18deck)" />
            <line x1={cx - nx * h} y1={cy - ny * h} x2={cx + nx * h} y2={cy + ny * h} stroke="#fff" strokeWidth={5} clipPath="url(#tp18deck)" /></g>;
        })()}
      </svg>
      {label && <RedLabel text={label} at={labelAt ?? 0} y={0.1} size={40} />}
    </AbsoluteFill>
  );
};
