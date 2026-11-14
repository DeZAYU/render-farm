// IN14 WireSheet: the real AP story (Yahoo News capture, 1 Apr 2017: masthead, headline, byline, the injury paragraphs, the "lucky to be
// alive" paragraph) as one paper sheet. It lies back on a 3-D plane over the dim, blurred surf footage and stands up toward the camera as
// the camera rides down it; on the key words the last paragraph lifts off the sheet toward camera (sharp, its own soft shadow) while the
// sheet behind darkens. No red, no re-typed text: the page's own pixels.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./DC01_kit";

export const WireSheet: React.FC<{
  bg: string; bgFrom: number; sheet: string; sw: number; sh: number; n: number;
  para: [number, number, number, number]; liftAt: number; y0: number; y1: number;
}> = ({ bg, bgFrom, sheet, sw, sh, n, para, liftAt, y0, y1 }) => {
  const f = useCurrentFrame();
  const rise = out(interpolate(f, [0, 34], [0, 1], cl));
  const ride = io(interpolate(f, [10, n - 10], [0, 1], cl));
  const lift = out(interpolate(f, [liftAt, liftAt + 26], [0, 1], cl));
  const W = 1180, s = W / sw, H = sh * s;
  const rx = 38 - 30 * rise - 4 * ride, rz = -3 + 2 * ride;
  const cy = y0 + (y1 - y0) * ride; // the sheet row (px) held at frame centre
  const [px0, py0, px1, py1] = para;
  const op = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -50, width: 2020, height: 1180, objectFit: "cover", filter: "blur(16px) brightness(.38) saturate(.7)" }} />
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - cy * s + (1 - rise) * 260, width: W, height: H, opacity: op,
          transform: `rotateX(${rx}deg) rotateZ(${rz}deg) scale(${1 + 0.1 * ride})`, transformOrigin: `50% ${cy * s}px`, transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, background: "#fefefe", boxShadow: "0 30px 80px rgba(0,0,0,.75)" }} />
          <Img src={staticFile(sheet)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: `brightness(${1 - 0.5 * lift})` }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,.22))" }} />
          {lift > 0 && <div style={{ position: "absolute", left: px0 * s - 20, top: py0 * s - 14, width: (px1 - px0) * s + 40, height: (py1 - py0) * s + 28, overflow: "hidden",
            background: "#fefefe", transform: `translateZ(${110 * lift}px) scale(${1 + 0.06 * lift})`, boxShadow: `0 ${24 * lift}px ${50 * lift}px rgba(0,0,0,${0.6 * lift})`, opacity: Math.min(1, lift * 3) }}>
            <Img src={staticFile(sheet)} style={{ position: "absolute", left: -(px0 * s - 20), top: -(py0 * s - 14), width: W, height: H }} />
          </div>}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
