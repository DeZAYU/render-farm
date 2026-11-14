// IN22 LineLift: the real YouTube upload page (captured): the channel row and the first words of the description, set as a small
// white card that rises upright out of the dim, blurred trail footage; the camera eases in, then the description's first line
// ("Be careful people.") lifts off the card toward camera with a soft shadow while the card behind sinks back and dims (no red).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { io } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const LineLift: React.FC<{ sheet: string; sw: number; sh: number; line: [number, number, number, number]; bg: string; bgFrom: number; n: number; liftAt: number; k?: number }> =
  ({ sheet, sw, sh, line, bg, bgFrom, n, liftAt, k = 1.9 }) => {
  const f = useCurrentFrame();
  const rise = io(interpolate(f, [0, 24], [0, 1], cl));
  const push = 1 + 0.08 * io(Math.min(1, f / n));
  const lift = io(interpolate(f, [liftAt, liftAt + 26], [0, 1], cl));
  const W = sw * k, H = sh * k;
  const [lx, ly, lw, lh] = line;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} playbackRate={0.5} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        filter: "blur(16px) brightness(0.3) saturate(0.6)", transform: "scale(1.12)" }} />
      <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
        <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, transformStyle: "preserve-3d",
          transform: `scale(${push}) translateY(${(1 - rise) * 90}px) rotateX(${(1 - rise) * 14}deg)`, opacity: rise }}>
          <div style={{ position: "absolute", inset: 0, boxShadow: "0 30px 70px rgba(0,0,0,.75)", filter: `brightness(${1 - 0.55 * lift})`, transform: `translateZ(${-lift * 60}px)` }}>
            <Img src={staticFile(sheet)} style={{ width: "100%", height: "100%" }} />
          </div>
          <div style={{ position: "absolute", left: lx * k - 14, top: ly * k - 10, width: lw * k + 28, height: lh * k + 20, background: "#fff", overflow: "hidden", opacity: lift,
            transform: `translateZ(${lift * 160}px) scale(${1 + 0.12 * lift})`, boxShadow: `0 ${18 * lift}px ${40 * lift}px rgba(0,0,0,${0.55 * lift})` }}>
            <div style={{ position: "absolute", left: -lx * k + 14, top: -ly * k + 10, width: W, height: H, backgroundImage: `url(${staticFile(sheet)})`, backgroundSize: `${W}px ${H}px` }} />
          </div>
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
