// DC08 HeadCheck: the tape frozen on the moment the man faces the cruiser. The frame drains to dim grey except a soft pool of colour
// round him (optionally four white corner brackets close in on the head), and the camera pushes in slowly: the goatee and short hair the
// description had to be checked against. No text.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CK, CamA, camAt, cl, io, placeAr } from "./DC08_kit";

export const HeadCheck: React.FC<{ src: string; t: number; keys: CK[]; head: [number, number, number]; at: number; brackets?: boolean }> = ({ src, t, keys, head, at, brackets = true }) => {
  const f = useCurrentFrame();
  const k = io(interpolate(f, [at, at + 22], [0, 1], cl));
  const p = placeAr(camAt(f, keys), 4 / 3);
  const [hx, hy, hr] = head;                       // head centre and radius as fractions of picture width/height
  const cx = p.left + hx * p.w, cy = p.top + hy * p.h, r = hr * p.w;
  const g = (1 - k) * 1.0 + k * 0.42;              // bracket gap factor: from wide to snug
  const R = r * (1.2 + 2.2 * (1 - k)), L = Math.max(16, r * 0.45);
  const corner = (sx: number, sy: number) => (
    <div key={`${sx}${sy}`} style={{ position: "absolute", left: cx + sx * R - (sx > 0 ? L : 0), top: cy + sy * R - (sy > 0 ? L : 0), width: L, height: L,
      borderLeft: sx < 0 ? "4px solid #F2F2F0" : undefined, borderRight: sx > 0 ? "4px solid #F2F2F0" : undefined,
      borderTop: sy < 0 ? "4px solid #F2F2F0" : undefined, borderBottom: sy > 0 ? "4px solid #F2F2F0" : undefined, opacity: k, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
  );
  void g;
  return (
    <AbsoluteFill>
      <CamA src={src} t={t} ar={4 / 3} keys={keys} filter={`saturate(${1 - 0.85 * k}) brightness(${1 - 0.45 * k})`} />
      <AbsoluteFill style={{ opacity: k, WebkitMaskImage: `radial-gradient(circle ${r * 2.1}px at ${cx}px ${cy}px, #000 45%, transparent 100%)`,
        maskImage: `radial-gradient(circle ${r * 2.1}px at ${cx}px ${cy}px, #000 45%, transparent 100%)` }}>
        <CamA src={src} t={t} ar={4 / 3} keys={keys} />
      </AbsoluteFill>
      {brackets && [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => corner(sx, sy))}
    </AbsoluteFill>
  );
};
