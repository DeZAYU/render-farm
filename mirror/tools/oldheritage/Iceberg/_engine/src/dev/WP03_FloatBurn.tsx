// WP03 device: the burning tank under the cannon's arc, frozen and pushed in; the face of the tank opens as a dark glass cutaway drawn
// in white. Inside: the fuel (amber) with its burning surface (red, flickering) right under the real flames; water from the arc falls
// in as white streaks, sinks THROUGH the fuel and collects at the bottom, while the surface keeps burning. Then a foam blanket slides
// across the surface from one side and the red glow dies under it. Labels FUEL / WATER / FOAM sit inside the cutaway.
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { FrameAt, ARCH, cl, io, out, useWpFonts } from "./WP01_kit";

type P = {
  src: string; t: number; n: number;
  rim: [number, number, number, number]; // x0, x1, rim y at the sides, rim y at the centre (1920x1080 px of the source frame)
  surf: number; bottom: number; // fuel surface y, cutaway bottom y
  focus: [number, number]; zoom?: number;
  at: { open: number; drops: number; foam: number };
};

export const WP03_FloatBurn: React.FC<P> = ({ src, t, n, rim, surf, bottom, focus, zoom = 1.4, at }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const [x0, x1, ys, yc] = rim, W = x1 - x0, cx = (x0 + x1) / 2;
  const s = 1 + (zoom - 1) * io(interpolate(f, [0, n], [0, 1], cl));
  const open = out(interpolate(f, [at.open, at.open + 18], [0, 1], cl));
  const water = io(interpolate(f, [at.drops + 20, at.foam + 10], [0, 1], cl)); // water layer height 0..1
  const wTop = bottom - water * (bottom - surf) * 0.42;
  const foam = io(interpolate(f, [at.foam, at.foam + 40], [0, 1], cl));
  const fl = 0.7 + 0.3 * Math.sin(f * 0.8) * Math.sin(f * 0.31 + 2);
  const glow = (1 - 0.85 * foam) * fl;
  const shape = `M${x0},${ys} Q${cx},${2 * yc - ys} ${x1},${ys} L${x1},${bottom} L${x0},${bottom} Z`;
  const drops = Array.from({ length: 26 }, (_, i) => {
    const born = at.drops + i * 4 + random(`d${i}`) * 6, life = 26 + random(`l${i}`) * 10;
    const u = (f - born) / life; if (u < 0 || u > 1 || f > at.foam + 30) return null;
    const x = x0 + W * (0.12 + 0.76 * random(`x${i}`)), y = surf - 30 + (wTop - surf + 30) * (u * u);
    return <line key={i} x1={x} y1={y - 16} x2={x} y2={y} stroke="#EAF4FF" strokeWidth={3} strokeLinecap="round" opacity={0.9 * Math.min(1, (1 - u) * 4)} />;
  });
  const lab = (txt: string, x: number, y: number, o: number) => (
    <text x={x} y={y} fill="#fff" opacity={o} style={{ ...ARCH, fontSize: 22, letterSpacing: "0.08em" } as React.CSSProperties}>{txt}</text>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${focus[0]}px ${focus[1]}px`, willChange: "transform" }}>
        <FrameAt src={src} t={t} style={{ width: 1920, height: 1080, objectFit: "cover" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <clipPath id="fb_clip"><path d={shape} /></clipPath>
            <linearGradient id="fb_fuel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B8661A" stopOpacity={0.75} /><stop offset="1" stopColor="#5A2E0A" stopOpacity={0.8} /></linearGradient>
            <filter id="fb_glow" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="7" /></filter>
          </defs>
          <g clipPath="url(#fb_clip)" opacity={open}>
            <rect x={x0} y={ys - 60} width={W} height={bottom - ys + 60} fill="rgba(8,8,10,.78)" />
            <rect x={x0} y={surf} width={W} height={bottom - surf} fill="url(#fb_fuel)" />
            <rect x={x0} y={wTop} width={W} height={bottom - wTop + 2} fill="#9FB8C8" opacity={0.85} />
            <line x1={x0} x2={x1} y1={wTop} y2={wTop} stroke="#fff" strokeWidth={2} opacity={water > 0.02 ? 0.8 : 0} />
            <rect x={x0} y={surf - 7} width={W} height={14} fill="#FF3B1F" opacity={0.8 * glow} filter="url(#fb_glow)" />
            <line x1={x0} x2={x1} y1={surf} y2={surf} stroke="#E3141B" strokeWidth={5} opacity={0.4 + 0.6 * glow} />
            {drops}
            {/* foam blanket: bubbly white band sliding across the surface from the left */}
            <g opacity={foam > 0 ? 1 : 0}>
              <rect x={x0} y={surf - 16} width={W * foam} height={22} fill="#F4F4F0" />
              {Array.from({ length: 40 }, (_, i) => {
                const bx = x0 + (i / 40) * W; if (bx > x0 + W * foam) return null;
                return <circle key={i} cx={bx + 8} cy={surf - 16 + 3 * random(`b${i}`)} r={7 + 6 * random(`r${i}`)} fill="#FAFAF6" />;
              })}
            </g>
            {lab("FUEL", x0 + 26, surf + 44, interpolate(f, [at.open + 10, at.open + 22], [0, 1], cl))}
            {lab("WATER", x0 + 26, bottom - 14, interpolate(water, [0.35, 0.6], [0, 1], cl))}
            {lab("FOAM", x0 + W * 0.5 - 30, surf - 30, interpolate(foam, [0.5, 0.8], [0, 1], cl))}
          </g>
          <path d={shape} fill="none" stroke="#fff" strokeWidth={4} opacity={open} strokeLinejoin="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
