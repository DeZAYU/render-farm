// IN21 LampRead: the real Wichita Eagle article (Sept 2023, captured page: masthead, byline/date, the verdict and sentence paragraphs;
// the article's photo is left out) printed as one paper sheet lying on a dark table under a single lamp. The camera looks down at an
// angle and travels down the sheet; a warm pool of light moves with it from the masthead and date to the jury paragraph, then to the
// probation paragraph, everything outside the pool falling into shadow. One thin red rule draws under the verdict phrase.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { OffthreadVideo } from "remotion";
import { io } from "./DC01_kit";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type Stop = { f: number; y: number; z: number };   // sheet y (px) at the lamp's centre, zoom

export const LampRead: React.FC<{ sheet: string; sw: number; sh: number; bg: string; bgFrom: number; stops: Stop[];
  rules: { x0: number; x1: number; y: number; at: number }[] }> = ({ sheet, sw, sh, bg, bgFrom, stops, rules }) => {
  const f = useCurrentFrame();
  let a = stops[0], b = stops[0];
  for (let i = 1; i < stops.length; i++) { if (f >= stops[i - 1].f) { a = stops[i - 1]; b = stops[i]; } }
  const u = f >= b.f ? 1 : io(interpolate(f, [a.f, b.f], [0, 1], cl));
  const y = a.y + (b.y - a.y) * u, z = a.z + (b.z - a.z) * u;
  const rise = io(interpolate(f, [0, 26], [0, 1], cl));
  const scale = (1080 / sh) * 1.05 * z;
  // the sheet centre-x at the screen centre, the lamp's y at 52 % of the screen
  const tx = 960 - (sw / 2) * scale, ty = 560 - y * scale;
  return (
    <AbsoluteFill style={{ background: "#050404", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        filter: "blur(14px) brightness(0.22) saturate(0.5)", transform: "scale(1.1)" }} />
      <div style={{ position: "absolute", inset: 0, perspective: 1500 }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformStyle: "preserve-3d",
          transform: `rotateX(${interpolate(rise, [0, 1], [34, 20])}deg) translateY(${(1 - rise) * 120}px)`, transformOrigin: "50% 55%", opacity: rise }}>
          <div style={{ position: "absolute", left: tx, top: ty, width: sw * scale, height: sh * scale, boxShadow: "0 30px 80px rgba(0,0,0,.8)", background: "#f4f1ea" }}>
            <Img src={staticFile(sheet)} style={{ width: "100%", height: "100%", filter: "sepia(0.12) contrast(1.04)" }} />
            {rules.map((r, i) => {
              const p = io(interpolate(f, [r.at, r.at + 16], [0, 1], cl));
              return <div key={i} style={{ position: "absolute", left: r.x0 * scale, top: r.y * scale, height: Math.max(3, 5 * scale), width: (r.x1 - r.x0) * scale * p, background: RED }} />;
            })}
          </div>
        </div>
      </div>
      {/* the lamp: a warm pool at the screen's reading line, shadow outside it */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 62% 34% at 50% 52%, rgba(255,200,140,0.06) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,.62) 78%, rgba(0,0,0,.86) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 72%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
