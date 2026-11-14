// IN17 TwoNotes: the Spanish ministry's real press note (25 Feb 2014, PDF pages rendered sharp) as two loose A4 sheets on a dark table
// over the dim, blurred promenade footage. Page 1 lies at an angle, the camera settles on the credit paragraph (43,9 millones, storms of
// 1 and 2 February) which a soft light pool picks out while the rest of the page sinks; then page 3 is dealt in over it from the right,
// the camera follows to the San Lorenzo, Gijón entry, the light moves to it, one thin red rule draws under "Presupuesto 265.000".
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number];
const PW = 1785, PH = 2526;

const Sheet: React.FC<{ src: string; light: Box; lit: number; rule?: Box; ruleT?: number }> = ({ src, light, lit, rule, ruleT = 0 }) => {
  const [x0, y0, x1, y1] = light, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rw = (x1 - x0) * 0.8 + 260, rh = (y1 - y0) * 0.9 + 260;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH, background: "#f7f5ef", boxShadow: "0 30px 80px rgba(0,0,0,.7), 0 2px 6px rgba(0,0,0,.4)" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: PW, height: PH, mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, rgba(255,248,230,.08), rgba(0,0,0,0) 45%, rgba(0,0,0,.18))" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(${rw}px ${rh}px at ${cx}px ${cy}px, rgba(0,0,0,0) 30%, rgba(4,4,6,${0.3 * lit}) 60%, rgba(4,4,6,${0.62 * lit}) 100%)` }} />
      {rule && <div style={{ position: "absolute", left: rule[0], top: rule[3] + 6, height: 5, width: (rule[2] - rule[0]) * ruleT, background: "#E3141B" }} />}
    </div>
  );
};

export const TwoNotes: React.FC<{
  bg: string; bgFrom: number; p1: string; p3: string; light1: Box; light3: Box; rule: Box; lit1At: number; swapAt: number; ruleAt: number;
}> = ({ bg, bgFrom, p1, p3, light1, light3, rule, lit1At, swapAt, ruleAt }) => {
  const f = useCurrentFrame();
  const inA = out(interpolate(f, [0, 18], [0, 1], cl));
  const sw = io(interpolate(f, [swapAt, swapAt + 26], [0, 1], cl));
  const lit1 = io(interpolate(f, [lit1At, lit1At + 16], [0, 1], cl)) * (1 - sw);
  const lit3 = io(interpolate(f, [swapAt + 18, swapAt + 34], [0, 1], cl));
  const ruleT = out(interpolate(f, [ruleAt, ruleAt + 14], [0, 1], cl));
  // camera: page-1 focus -> paragraph, then page-3 paragraph (page 3 lies offset right/down on the table)
  const P3X = 420, P3Y = -60, ROT3 = 3.2;
  const c1 = io(interpolate(f, [0, lit1At + 10], [0, 1], cl));
  const p1f: [number, number] = [900 + ((light1[0] + light1[2]) / 2 - 900) * c1, 700 + ((light1[1] + light1[3]) / 2 - 700) * c1];
  const p3f: [number, number] = [P3X + (light3[0] + light3[2]) / 2, P3Y + (light3[1] + light3[3]) / 2];
  const fx = p1f[0] + (p3f[0] - p1f[0]) * sw, fy = p1f[1] + (p3f[1] - p1f[1]) * sw;
  const z = (0.52 + 0.2 * c1) * (1 - sw) + 0.78 * sw + 0.0005 * f;
  const slideX = (1 - sw) * 2200, slideR = ROT3 + (1 - sw) * 9;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 + 0.0006 * f})`, filter: "blur(18px) brightness(0.3) saturate(0.7)" }} />
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 35%" }}>
        <div style={{ position: "absolute", left: 960, top: 560, transformStyle: "preserve-3d", opacity: inA,
          transform: `rotateX(${16 - 6 * sw}deg) scale(${z}) translate(${-fx}px, ${-fy}px) translateY(${(1 - inA) * 80}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, transform: "rotateZ(-2deg)", transformOrigin: "50% 50%" }}>
            <Sheet src={p1} light={light1} lit={lit1} />
            <div style={{ position: "absolute", inset: 0, width: PW, height: PH, background: `rgba(0,0,0,${0.45 * sw})` }} />
          </div>
          {sw > 0 && <div style={{ position: "absolute", left: P3X + slideX, top: P3Y, transform: `rotateZ(${slideR}deg)`, transformOrigin: `${(light3[0] + light3[2]) / 2}px ${(light3[1] + light3[3]) / 2}px` }}>
            <Sheet src={p3} light={light3} lit={lit3} rule={rule} ruleT={ruleT} />
          </div>}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
    </AbsoluteFill>
  );
};
