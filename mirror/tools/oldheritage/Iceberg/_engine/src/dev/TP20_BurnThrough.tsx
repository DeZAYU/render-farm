// TP20 BurnThrough: a real photo of the rebuilt (1933) pavilion, slow push, its labels; on the spoken line the photo itself burns
// through from the pavilion outward (ragged hole, glowing rim, charred edge) and the 2008 footage of the same pavilion, from the
// same beach, burning, is underneath. One picture becoming the other = the same building burning a second time.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const BurnThrough: React.FC<{
  photo: string; iw: number; ih: number; focus: [number, number]; z0?: number; z1?: number;
  under: string; underFrom?: number; burnAt: number; burnLen?: number; origin: [number, number]; children?: React.ReactNode;
}> = ({ photo, iw, ih, focus, z0 = 1.05, z1 = 1.18, under, underFrom = 0, burnAt, burnLen = 54, origin, children }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  const [cx, cy] = [ox + origin[0] * base, oy + origin[1] * base];
  const g = interpolate(f, [burnAt, burnAt + burnLen], [0, 1], cl);
  const R = Math.pow(g, 1.35) * Math.hypot(width, height) * 1.05; // grows slowly, then runs
  const seed = 7;
  const flick = 0.8 + 0.2 * Math.sin(f / 1.9) * Math.cos(f / 3.1);
  const burning = f >= burnAt;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Sequence from={burnAt} layout="none"><OffthreadVideo src={staticFile(under)} startFrom={Math.round(underFrom * 30)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        transform: `scale(${1.12 - 0.06 * io(g)})` }} /></Sequence>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="tp20rough" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={seed} />
            <feDisplacementMap in="SourceGraphic" scale={90} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="tp20glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>
          <mask id="tp20hole" maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill="#fff" />
            {burning && <circle cx={cx} cy={cy} r={R} fill="#000" filter="url(#tp20rough)" />}
          </mask>
          <mask id="tp20char" maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            <rect x={0} y={0} width={width} height={height} fill="#000" />
            {burning && <circle cx={cx} cy={cy} r={R + 70} fill="#fff" filter="url(#tp20rough)" />}
          </mask>
        </defs>
        <g mask="url(#tp20hole)">
          <image href={staticFile(photo)} x={ox} y={oy} width={iw * base} height={ih * base} preserveAspectRatio="none" />
          {/* charred band just outside the hole: browned, darkened paper */}
          {burning && <rect x={0} y={0} width={width} height={height} fill="#1a0b03" opacity={0.78} mask="url(#tp20char)" />}
        </g>
        {/* glowing rim on the hole's edge */}
        {burning && g < 1 && <g opacity={flick * (1 - Math.pow(g, 4))}>
          <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#ff7a1a" strokeWidth={22} filter="url(#tp20rough)" style={{ mixBlendMode: "screen" }} />
          <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke="#ffd27a" strokeWidth={6} filter="url(#tp20rough)" />
          <circle cx={cx} cy={cy} r={R + 10} fill="none" stroke="#ff5a00" strokeWidth={40} filter="url(#tp20glow)" opacity={0.6} />
        </g>}
      </svg>
      {children}
    </AbsoluteFill>
  );
};
