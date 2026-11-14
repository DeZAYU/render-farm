// IN10 DescStrips: the filmer's real YouTube page (capture_page.py) cut into paper strips: the video's title + channel line, her one-line
// UPDATE, and the park statement she quoted. The strips hang in 3-D over the dark, defocused footage; the title strip settles small at the
// top, the UPDATE strip slides in and holds centre-front; on cue it tips back and the statement strip comes forward, one thin red rule
// drawn under the single phrase that matters. Nothing re-typed.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";
import { RED } from "../brand";

type Strip = { src: string; w: number; h: number };
export const DescStrips: React.FC<{ bg: string; bgFrom: number; head: Strip; a: Strip; b: Strip; swapAt: number; rule: [number, number, number]; n: number }> =
  ({ bg, bgFrom, head, a, b, swapAt, rule, n }) => {
  const f = useCurrentFrame();
  const inn = out(interpolate(f, [0, 14], [0, 1], cl));
  const ia = out(interpolate(f, [8, 26], [0, 1], cl));
  const sw = io(interpolate(f, [swapAt, swapAt + 18], [0, 1], cl));
  const rl = out(interpolate(f, [swapAt + 26, swapAt + 44], [0, 1], cl));
  const drift = interpolate(f, [0, n], [0, 1], cl);
  const card = (s: Strip, scale: number, style: React.CSSProperties, extra?: React.ReactNode) => (
    <div style={{ position: "absolute", left: 960 - (s.w * scale) / 2, width: s.w * scale, height: s.h * scale, background: "#f2f2f2",
      boxShadow: "0 30px 70px rgba(0,0,0,.65)", ...style }}>
      <Img src={staticFile(s.src)} style={{ width: "100%", height: "100%" }} />{extra}
    </div>
  );
  const sa = 1.45, sb = 1.0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.1 + 0.04 * drift})`, filter: `blur(${8 + 8 * inn}px) brightness(${0.6 - 0.25 * inn}) saturate(0.7)` }} />
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 40%" }}>
        {card(head, 0.95, { top: 150, opacity: inn * (1 - 0.75 * sw), transform: `translateY(${(1 - inn) * -30}px) rotateX(${8}deg)` })}
        {card(a, sa, { top: 470, opacity: ia * (1 - 0.8 * sw), transform: `translateX(${(1 - ia) * 160}px) translateY(${-150 * sw}px) translateZ(${-260 * sw}px) rotateX(${4 + 14 * sw}deg) rotateZ(${-0.8 + 0.8 * drift}deg)` })}
        {card(b, sb, { top: 560, opacity: sw, transform: `translateY(${(1 - sw) * 120}px) translateZ(${120 * sw}px) rotateX(${(1 - sw) * 20}deg) rotateZ(${0.6 - 0.6 * drift}deg)` },
          <div style={{ position: "absolute", left: rule[0], top: rule[2], width: (rule[1] - rule[0]) * rl, height: 4, background: RED }} />)}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.5) 100%)" }} />
    </AbsoluteFill>
  );
};
