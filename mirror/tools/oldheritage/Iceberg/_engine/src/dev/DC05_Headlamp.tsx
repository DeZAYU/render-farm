// DC05 Headlamp: the real Higgypop story (page capture: masthead, headline, date, the article text) lies as one sheet in the dark,
// tilted slightly away. Nothing on it can be read until a soft headlight beam sweeps in from the left across the headline and
// settles on the paragraph being spoken (the driver's claim); on the next line the beam slides up to the paragraph with the other
// theory. Outside the beam the page stays at a low night glow. Real type, nothing re-set, no red: the night drive's own light.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, ease, io, out } from "./DC01_kit";

type Stop = { at: number; len: number; x: number; y: number; rx: number; ry: number; s: number }; // beam centre/size in sheet px, camera scale
export const Headlamp: React.FC<{ sheet: string; sw: number; sh: number; stops: Stop[] }> = ({ sheet, sw, sh, stops }) => {
  const f = useCurrentFrame();
  const W = 1500, k = W / sw, H = sh * k;
  // interpolate the beam/camera through the stops
  let c = stops[0];
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1], b = stops[i];
    if (f >= b.at) { c = b; continue; }
    if (f >= b.at - b.len) {
      const u = io(interpolate(f, [b.at - b.len, b.at], [0, 1], cl));
      c = { at: 0, len: 0, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, rx: a.rx + (b.rx - a.rx) * u, ry: a.ry + (b.ry - a.ry) * u, s: a.s + (b.s - a.s) * u };
    }
    break;
  }
  const on = out(interpolate(f, [4, 26], [0, 1], cl));
  const drift = ease(f, 0, 400);
  const bx = c.x * k, by = c.y * k, rx = c.rx * k * (0.6 + 0.4 * on), ry = c.ry * k * (0.6 + 0.4 * on);
  const mask = `radial-gradient(ellipse ${rx}px ${ry}px at ${bx}px ${by}px, rgba(0,0,0,${on}) 0%, rgba(0,0,0,${on}) 55%, rgba(0,0,0,0) 100%)`;
  const camX = 960 - bx, camY = 540 - by;
  return (
    <AbsoluteFill style={{ background: "#020203", overflow: "hidden", perspective: 1800 }}>
      <div style={{ position: "absolute", left: camX, top: camY, width: W, height: H, transformOrigin: `${bx}px ${by}px`,
        transform: `scale(${c.s}) rotateX(${9 - 3 * drift}deg) rotateY(${-6 + 3 * drift}deg) rotateZ(-1.2deg)` }}>
        <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "brightness(.11) saturate(.5)", boxShadow: "0 40px 90px rgba(0,0,0,.8)" }} />
        <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "brightness(1.02) sepia(.12) saturate(.9)" }} />
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};
