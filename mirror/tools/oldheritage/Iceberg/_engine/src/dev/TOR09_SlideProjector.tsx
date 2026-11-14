// TOR09 SlideProjector: the NWS Norman forecaster's own talk on overpasses after 3 May 1999 (NWA annual meeting, Oct 1999; slides from
// weather.gov/oun/safety-overpass) shown as it was given: real slides thrown by a projector onto a screen in a dark room, a carousel
// change between slides, a slow eased camera into the part of the slide the VO talks about (the three marked overpasses, the bare
// underside of a bridge, the Shields Boulevard span).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { mono } from "./TOR09_util";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Slide = { src: string; at: number; label?: string; labelAt?: number };
// cam keys: t (frame), cx, cy (slide px 0..658 / 0..489), z (1 = whole slide on screen)
export const SlideProjector: React.FC<{ slides: Slide[]; cam: [number, number, number, number][]; iw?: number; ih?: number }> = ({ slides, cam, iw = 658, ih = 489 }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const cx = mono(cam.map((k) => [k[0], k[1]])), cy = mono(cam.map((k) => [k[0], k[2]])), cz = mono(cam.map((k) => [k[0], Math.log(k[3])]));
  const z = Math.exp(cz(f)), X = cx(f), Y = cy(f);
  const SW = 1240, SH = (SW * ih) / iw, s = SW / iw; // projected slide size on the screen at z=1
  const fadeIn = interpolate(f, [0, 10], [0, 1], cl);
  // carousel: index of the current slide, and the 9-frame slide-across between them
  let cur = 0; slides.forEach((sl, i) => { if (f >= sl.at) cur = i; });
  const tr = cur > 0 ? io(interpolate(f, [slides[cur].at, slides[cur].at + 9], [0, 1], cl)) : 1;
  const dust = Array.from({ length: 34 }, (_, i) => {
    const x0 = random("dx" + i) * 1920, y0 = random("dy" + i) * 1080, sp = 6 + random("ds" + i) * 14, r = 1 + random("dr" + i) * 2.2;
    return { x: (x0 + f * sp * 0.08) % 1920, y: (y0 - f * sp * 0.03 + 1080) % 1080, r, o: 0.06 + random("do" + i) * 0.12 };
  });
  const slideImg = (sl: Slide, dx: number) => (
    <Img src={staticFile(sl.src)} style={{ position: "absolute", left: dx, top: 0, width: SW, height: SH, filter: "contrast(1.04) saturate(.92) blur(.35px)" }} />
  );
  return (
    <AbsoluteFill style={{ background: "#060606", overflow: "hidden", opacity: fadeIn }}>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 960, top: 520, width: 0, height: 0, transformStyle: "preserve-3d",
          transform: `rotateY(-7deg) rotateX(3deg) scale(${z}) translate(${-(X * s)}px, ${-(Y * s)}px)` }}>
          {/* the screen: matte white, a little wider than the throw */}
          <div style={{ position: "absolute", left: -40, top: -40, width: SW + 80, height: SH + 80, background: "#bdbdb8", boxShadow: "0 30px 90px rgba(0,0,0,.8)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, overflow: "hidden", background: "#111" }}>
            {cur > 0 && tr < 1 && slideImg(slides[cur - 1], -SW * tr)}
            {slideImg(slides[cur], cur > 0 ? SW * (1 - tr) : 0)}
            {/* lamp hot-spot and falloff of the throw */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 75% at 46% 44%, rgba(255,246,225,.16) 0%, rgba(255,246,225,0) 45%, rgba(0,0,0,.42) 100%)", mixBlendMode: "normal" }} />
          </div>
        </div>
      </AbsoluteFill>
      {/* the room: the beam's haze from the projector behind the camera and dust in it */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 48%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {dust.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o} />)}
      </svg>
      {slides.map((sl, i) => sl.label ? <RedLabel key={i} text={sl.label} at={sl.labelAt ?? sl.at + 14} hold={(slides[i + 1]?.at ?? n) - (sl.labelAt ?? sl.at + 14) - 10} x={0.5} y={0.1} /> : null)}
    </AbsoluteFill>
  );
};
