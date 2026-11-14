// TOR11 JmaSheets: the Japan Meteorological Agency's own documents as paper on a dark desk under one warm light.
//   mode "rating": the 7 May 2012 press release (F2) lies on the desk, its F2 line boxed in white; the 8 June report slides in on top and
//                  its F3 line is boxed (the agency raising its own rating, shown with its own papers).
//   mode "figure": the report's damage map page; its 17 km map lifts off the paper toward the camera (2.5-D), drifting to the
//                  "width about 500 m" bracket the agency drew.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type R = [number, number, number, number];
const PW = 1654, PH = 2339;

const Box: React.FC<{ r: R; g: number }> = ({ r, g }) => {
  const pad = 14, w = r[2] - r[0] + 2 * pad, h = r[3] - r[1] + 2 * pad, per = 2 * (w + h);
  return <svg style={{ position: "absolute", left: r[0] - pad, top: r[1] - pad, overflow: "visible" }} width={w} height={h}>
    <rect x={0} y={0} width={w} height={h} fill={`rgba(255,255,255,${0.0})`} stroke="#111" strokeWidth={7} strokeDasharray={per} strokeDashoffset={per * (1 - g)} opacity={0.35} transform="translate(3,4)" />
    <rect x={0} y={0} width={w} height={h} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray={per} strokeDashoffset={per * (1 - g)} />
  </svg>;
};
const Sheet: React.FC<{ src: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ src, children, style }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, boxShadow: "0 40px 80px rgba(0,0,0,.65), 0 2px 6px rgba(0,0,0,.4)", ...style }}>
    <Img src={staticFile(src)} style={{ width: PW, height: PH, display: "block", filter: "sepia(.12) brightness(.97)" }} />
    {children}
  </div>
);

export const JmaSheets: React.FC<{ mode: "rating" | "figure"; press?: string; report?: string; map?: string;
  f2: R; f3?: R; f2At?: number; slideAt?: number; f3At?: number; fig?: R; liftAt?: number; target?: [number, number] }> = ({ mode, press, report, map, f2, f3, f2At = 20, slideAt = 60, f3At = 80, fig, liftAt = 10, target }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const u = io(f / Math.max(1, n - 1));
  const lamp = <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 60% at 46% 42%, rgba(255,236,200,.10) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.72) 100%)", pointerEvents: "none" }} />;
  const desk = <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 80% at 50% 45%, #2a2622 0%, #0d0c0b 100%)" }} />;
  if (mode === "rating") {
    // camera on the F2 line, then (as the report lands) on its F3 line
    const s = 1.15 + 0.08 * u;
    const sl = out(interpolate(f, [slideAt, slideAt + 18], [0, 1], cl));
    const focus: [number, number] = [((f2[0] + f2[2]) / 2) * (1 - sl) + (((f3 ?? f2)[0] + (f3 ?? f2)[2]) / 2) * sl, ((f2[1] + f2[3]) / 2) * (1 - sl) + (((f3 ?? f2)[1] + (f3 ?? f2)[3]) / 2) * sl];
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {desk}
        <AbsoluteFill style={{ perspective: 2400 }}>
          <div style={{ position: "absolute", left: 960, top: 560, width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(24deg) rotateZ(-4deg) scale(${s}) translate(${-focus[0]}px, ${-focus[1]}px)` }}>
            <Sheet src={press!} style={{ transform: "rotate(-2deg)" }}><Box r={f2} g={out(interpolate(f, [f2At, f2At + 14], [0, 1], cl))} /></Sheet>
            {sl > 0 && <Sheet src={report!} style={{ transform: `translate(${(1 - sl) * 1500 + 40}px, ${(1 - sl) * -200 + 20}px) rotate(${2 - (1 - sl) * 8}deg)` }}>
              {f3 && <Box r={f3} g={out(interpolate(f, [f3At, f3At + 14], [0, 1], cl))} />}
            </Sheet>}
          </div>
        </AbsoluteFill>
        {lamp}
      </AbsoluteFill>
    );
  }
  // figure: the page under the light, the map plate rises off it toward the lens and drifts to the target point
  const lift = io(interpolate(f, [liftAt, liftAt + 40], [0, 1], cl));
  const fr = fig!, fw = fr[2] - fr[0], fh = fr[3] - fr[1];
  const tg = target ?? [(fr[0] + fr[2]) / 2, (fr[1] + fr[3]) / 2];
  const fx = (fr[0] + fr[2]) / 2, fy = (fr[1] + fr[3]) / 2;
  const camX = fx + (tg[0] - fx) * io(interpolate(f, [liftAt + 20, n], [0, 1], cl)) * 0.8, camY = fy + (tg[1] - fy) * io(interpolate(f, [liftAt + 20, n], [0, 1], cl)) * 0.8;
  const s = 0.9 + 0.55 * lift + 0.25 * io(interpolate(f, [liftAt + 30, n], [0, 1], cl));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {desk}
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 0, height: 0, transformStyle: "preserve-3d", transform: `rotateX(${22 * (1 - lift) + 4}deg) scale(${s}) translate(${-camX}px, ${-camY}px)` }}>
          <Sheet src={map!} style={{ filter: `brightness(${1 - 0.45 * lift}) blur(${2.5 * lift}px)` }} />
          <div style={{ position: "absolute", left: fr[0], top: fr[1], width: fw, height: fh, overflow: "hidden", border: "6px solid #fff",
            transform: `translateZ(${lift * 260}px)`, boxShadow: `0 ${30 + 60 * lift}px ${60 + 80 * lift}px rgba(0,0,0,${0.3 + 0.4 * lift})` }}>
            <Img src={staticFile(map!)} style={{ position: "absolute", left: -fr[0], top: -fr[1], width: PW, height: PH, maxWidth: "none" }} />
          </div>
        </div>
      </AbsoluteFill>
      {lamp}
    </AbsoluteFill>
  );
};
