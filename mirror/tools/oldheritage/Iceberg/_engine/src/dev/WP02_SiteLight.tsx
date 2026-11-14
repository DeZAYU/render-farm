// WP02 device: the side filmer's view straight down on the site and Broadway (portrait, full height over its blurred copy). The picture
// darkens except for one soft pool of light: it sits on the road with the fire engines first (BROADWAY), then glides up onto the open
// building site (THE SITE), where the operator swung the jib. Labels sit on the picture, footage stays big.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { AR, BlurBed, FrameAt, cl, io, useWpFonts } from "./WP01_kit";

type Spot = { x: number; y: number; rx: number; ry: number; label: string }; // panel-relative 0..1
type P = { src: string; t: number; n: number; a: Spot; b: Spot; move: [number, number] };

export const WP02_SiteLight: React.FC<P> = ({ src, t, n, a, b, move }) => {
  useWpFonts();
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const W = height * AR, X0 = (width - W) / 2;
  const u = io(interpolate(f, [move[0], move[1]], [0, 1], cl));
  const L = (p: number, q: number) => p + (q - p) * u;
  const x = L(a.x, b.x), y = L(a.y, b.y), rx = L(a.rx, b.rx), ry = L(a.ry, b.ry);
  const dark = interpolate(f, [0, 14], [0, 0.62], cl);
  const s = 1.0 + 0.06 * io(f / n);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <BlurBed src={src} t={t} dim={0.4} />
      <div style={{ position: "absolute", left: X0, top: 0, width: W, height, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale3d(${s},${s},1)`, transformOrigin: `50% ${y * 100}%` }}>
          <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse ${rx * W}px ${ry * height}px at ${x * W}px ${y * height}px, rgba(0,0,0,0) 55%, rgba(0,0,0,${dark}) 100%)` }} />
          <svg width={W} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
            <ellipse cx={x * W} cy={y * height} rx={rx * W * 0.62} ry={ry * height * 0.62} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="14 12"
              opacity={interpolate(f, [8, 20], [0, 0.9], cl) * (1 - 0.6 * Math.sin(Math.PI * u))} />
          </svg>
        </div>
      </div>
      <RedLabel text={a.label} at={10} hold={move[0] - 6} x={(X0 + a.x * W) / width} y={Math.min(0.93, a.y + a.ry * 0.75)} size={40} />
      <RedLabel text={b.label} at={move[1] - 4} hold={n - move[1]} x={(X0 + b.x * W) / width} y={Math.min(0.93, b.y + b.ry * 0.75)} size={40} />
    </AbsoluteFill>
  );
};
