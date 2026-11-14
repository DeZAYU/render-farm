// DC07 FlightArc: a real Sentinel-2 image of the Tampa Bay area (EOX s2cloudless 2016) laid as a ground plane tilted away in 3-D.
// The morning's outbound leg is drawn faint from Clearwater Air Park to Zephyrhills (white point + caps name) on "flown out to
// Zephyrhills"; on "the short hop back" a small white dot leaves Zephyrhills and travels the line home with a bright trail while the
// camera eases down and across the bay toward Clearwater; the air park gets the red place label; on the descent the dot slows short
// of the field and the ground keeps sinking toward it. No plane icons, no numbers.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { cl, ease, io, out, useDcFonts } from "./DC01_kit";

export const FlightArc: React.FC<{ src: string; size: number; from: [number, number]; to: [number, number]; outAt: number; backAt: number; backLen: number;
  stopU: number; labelAt: number; cam: { f: number; x: number; y: number; s: number; pitch: number }[] }> = ({ src, size, from, to, outAt, backAt, backLen, stopU, labelAt, cam }) => {
  useDcFonts();
  const f = useCurrentFrame();
  let c = cam[0];
  for (let i = 1; i < cam.length; i++) if (f >= cam[i - 1].f) {
    const a = cam[i - 1], b = cam[i], u = io(interpolate(f, [a.f, b.f], [0, 1], cl));
    c = { f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, s: a.s + (b.s - a.s) * u, pitch: a.pitch + (b.pitch - a.pitch) * u };
  }
  const D = 2700, k = D / size;                                   // ground plane drawn at D px, camera scale c.s
  const P = (p: [number, number]) => [p[0] * k, p[1] * k];
  const [ax, ay] = P(to), [zx, zy] = P(from);                     // to = Clearwater (home), from = Zephyrhills
  const og = ease(f, outAt, outAt + 30);                          // outbound leg (faint) Clearwater -> Zephyrhills
  const bu = stopU * ease(f, backAt, backAt + backLen);           // dot from Zephyrhills back toward Clearwater
  const dx = zx + (ax - zx) * bu, dy = zy + (ay - zy) * bu;
  const zA = out(interpolate(f, [outAt + 20, outAt + 32], [0, 1], cl)), cA = out(interpolate(f, [4, 16], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#05070a", overflow: "hidden", perspective: 1300, perspectiveOrigin: "50% 30%" }}>
      <div style={{ position: "absolute", left: 960 - c.x * k, top: 600 - c.y * k, width: D, height: D, transformOrigin: `${c.x * k}px ${c.y * k}px`,
        transform: `rotateX(${c.pitch}deg) scale(${c.s})`, transformStyle: "preserve-3d" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: D, height: D, filter: "contrast(1.05) brightness(1.15)" }} />
        <svg width={D} height={D} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={ax} y1={ay} x2={ax + (zx - ax) * og} y2={ay + (zy - ay) * og} stroke="#fff" strokeOpacity={0.45} strokeWidth={2.2 / c.s * 1.6} strokeDasharray={`${6 / c.s} ${6 / c.s}`} />
          {bu > 0 && <line x1={zx} y1={zy} x2={dx} y2={dy} stroke="#fff" strokeWidth={3.2 / c.s * 1.6} strokeLinecap="round" />}
          {bu > 0 && <circle cx={dx} cy={dy} r={7 / c.s * 1.6} fill="#fff" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.9))" }} />}
          <circle cx={zx} cy={zy} r={6 / c.s * 1.6} fill="#fff" opacity={zA} />
          <circle cx={ax} cy={ay} r={6 / c.s * 1.6} fill="#fff" opacity={cA} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,7,10,.85) 0%, rgba(5,7,10,0) 30%), radial-gradient(ellipse 80% 70% at 50% 60%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
      <RedLabel text="ZEPHYRHILLS" at={outAt + 24} hold={70} size={38} y={0.86} />
      <RedLabel text="CLEARWATER AIR PARK" at={labelAt} hold={110} size={40} y={0.86} />
    </AbsoluteFill>
  );
};
