// TOR00 (intro): ClipField — a cinematic 3-D field of real case clips (owner 3 Nov: "3-D motion with different clips moving"). Playing,
// silent clips sit on planes at different depths along a corridor; the camera flies through them on a C1-smooth Catmull-Rom path (time-
// parameterised, so speed changes gradually; no linear moves, no keyframe kinks), easing in close to one HERO clip per VO beat (~80 % of
// the frame) and drifting past it so it slides away with parallax. Filler clips/stills around the corridor drift, rotate in and fan out
// on "twenty-five times". Depth of field (blur grows with distance from the focus plane), soft light falloff with distance, camera yaw
// follows the lateral velocity, CameraMotionBlur for subtle motion blur (outside: FilmLook grain in the case file).
import React from "react";
import { AbsoluteFill, Img, Loop, OffthreadVideo, Sequence, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const PW = 640, PH = 360, P = 1000; // plane size (16:9) and CSS perspective; a plane at distance d spans PW * P / d px

export type Plane = { id: string; src: string; still?: boolean; len?: number; x: number; y: number; z: number; ry?: number; rx?: number;
  hero?: { at: number; q: number }; // hero: at = frame it settles; q = source second that should be playing at that frame
  s?: number; drift?: number };
export type Key = { f: number; x: number; y: number; z: number }; // eye position (camera looks down -z)

// time-parameterised monotone cubic Hermite (Fritsch-Carlson tangents, per axis): C1-smooth, never overshoots a key, so the camera
// eases into each hero without swinging past it and back
export const pathAt = (keys: Key[], f: number) => {
  const n = keys.length; if (f <= keys[0].f) return keys[0]; if (f >= keys[n - 1].f) return keys[n - 1];
  let i = 0; while (keys[i + 1].f < f) i++;
  const a = keys[i], b = keys[i + 1], h = b.f - a.f, t = (f - a.f) / h;
  const sec = (j: number, k: "x" | "y" | "z") => (keys[j + 1][k] - keys[j][k]) / (keys[j + 1].f - keys[j].f);
  const tan = (j: number, k: "x" | "y" | "z") => {
    if (j === 0 || j === n - 1) return 0;
    const d0 = sec(j - 1, k), d1 = sec(j, k); if (d0 * d1 <= 0) return 0;
    const h0 = keys[j].f - keys[j - 1].f, h1 = keys[j + 1].f - keys[j].f;
    return (3 * (h0 + h1)) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1);
  };
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
  const v = (k: "x" | "y" | "z") => h00 * a[k] + h10 * h * tan(i, k) + h01 * b[k] + h11 * h * tan(i + 1, k);
  return { f, x: v("x"), y: v("y"), z: v("z") };
};

export const ClipTex: React.FC<{ p: Plane }> = ({ p }) => {
  const style: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
  if (p.still) return <Img src={staticFile(p.src)} style={style} />;
  const L = Math.max(30, Math.round((p.len ?? 3) * 30) - 2);
  // phase the loop so the hero's chosen source moment plays when it settles
  const want = p.hero ? Math.round(p.hero.q * 30) : 0, at = p.hero ? p.hero.at : 0;
  const k = (((want - at) % L) + L) % L;
  return (
    <Sequence from={-k} layout="none">
      <Loop durationInFrames={L} layout="none"><OffthreadVideo src={staticFile(p.src)} muted style={style} /></Loop>
    </Sequence>
  );
};

export const ClipField: React.FC<{ planes: Plane[]; path: Key[]; fan?: [number, number, number, number]; focus?: number; near?: [number, number] }> = ({ planes, path, fan = [0, 0, 0, 0], focus = 470, near = [90, 220] }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const e = pathAt(path, f), e0 = pathAt(path, f - 1), e1 = pathAt(path, f + 1);
  const vx = (e1.x - e0.x) / 2, vy = (e1.y - e0.y) / 2;
  const yaw = Math.max(-7, Math.min(7, -vx * 0.09)), pitch = Math.max(-4, Math.min(4, vy * 0.06)), roll = Math.max(-2.5, Math.min(2.5, vx * 0.025));
  const fanK = interpolate(f, [fan[0], fan[1], fan[2], fan[3]], [0, 1, 1, 0.35], { ...cl, easing: ease });
  const vis = planes.map((p) => {
    const sp = 1 + (p.hero ? 0 : 0.22 * fanK), ry = (p.ry ?? 0) + (p.hero ? 0 : Math.sign(p.x || 1) * -14 * fanK);
    const dr = p.drift ?? 1, ph = p.id.length * 1.7;
    const x = p.x * sp + Math.sin(f / 70 + ph) * 18 * dr, y = p.y * sp + Math.cos(f / 83 + ph) * 12 * dr, z = p.z;
    const dist = e.z - z;
    return { p, x, y, z, ry: ry + Math.sin(f / 90 + ph) * 2.2 * dr, dist };
  }).filter((q) => q.dist > near[0] && q.dist < 9000).sort((a, b) => a.z - b.z);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, #121418 0%, #050506 75%)", overflow: "hidden", perspective: P, perspectiveOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: width / 2, top: height / 2, transformStyle: "preserve-3d",
        transform: `rotateZ(${roll}deg) rotateX(${pitch}deg) rotateY(${yaw}deg) translate3d(${-e.x}px, ${-e.y}px, ${-(e.z - P)}px)` }}>
        {vis.map(({ p, x, y, z, ry, dist }) => {
          const blur = Math.min(9, Math.abs(dist - focus) / 210);
          const light = 1 - Math.min(0.62, Math.max(0, (dist - 500) / 5200));
          const fog = interpolate(dist, [6000, 9000], [1, 0], cl) * interpolate(dist, near, [0, 1], cl);
          const s = p.s ?? 1;
          return (
            <div key={p.id} style={{ position: "absolute", left: -PW * s / 2, top: -PH * s / 2, width: PW * s, height: PH * s, transformStyle: "preserve-3d",
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateX(${p.rx ?? 0}deg)`, opacity: fog,
              filter: `blur(${blur.toFixed(2)}px) brightness(${light.toFixed(3)})`, boxShadow: "0 30px 80px rgba(0,0,0,.7)", background: "#000", overflow: "hidden" }}>
              <ClipTex p={p} />
              <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.85)" }} />
            </div>
          );
        })}
      </div>
      {/* soft light falloff toward the frame edges */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
