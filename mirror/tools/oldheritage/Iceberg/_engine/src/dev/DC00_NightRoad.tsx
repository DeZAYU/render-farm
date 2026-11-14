// DC00 (intro): NightRoad — owner 3 Nov: every intro is a 3-D move through the video's own case clips, but each video gets its OWN rig
// (TOR00 corridor, ND00 ring, TP00 ferris wheel, WP00 port yard). For dashcams the camera IS a car: a winding two-lane highway at night
// (asphalt with white edge lines and a dashed centre line, sodium streetlights with light pools, reflector posts, a faint town glow on
// the horizon) seen from dashcam height. The hero clips hang as screens on overhead sign gantries spanning the road; the camera drives
// toward each one, eases off the throttle and lifts/tilts a little until the screen fills ~70 % of the frame, holds while it drifts in,
// then levels and drives on UNDER it (the screen slides up and over the top of the frame, like a real overhead sign) and round the next
// bend to the next gantry. Other case clips play on roadside billboards. The yaw follows the road's heading (bends), with a slight lean.
// Path: one monotone cubic Hermite track per axis (x, y, z, yaw, pitch; Fritsch-Carlson, no overshoot), so speed and turn change gently.
// DOF on the screens (blur by distance from the focus), light falloff with distance; motion blur + grain are added by the case file.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ClipTex, type Plane } from "./TOR00_ClipField";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const P = 1000, PW = 640, PH = 360;
export const GY = 260;          // ground level (CSS y down; the cruising eye sits at y ≈ 30, ~230 above the asphalt)
const RW = 400, SH = 470;       // road half-width (edge lines), gantry post offset
export const SY = -215;         // gantry screen centre height
const SEG = 150;                // road segment length
const deg = (r: number) => (r * 180) / Math.PI, rad = (d: number) => (d * Math.PI) / 180;

/** road centre line x(z) (gentle S-bends) and heading (deg, = CSS yaw that looks along the road toward -z) */
export const roadX = (z: number) => 420 * Math.sin(-z / 2600 + 0.35) - 420 * Math.sin(0.35) + 160 * Math.sin(-z / 1150);
export const roadH = (z: number) => deg(Math.atan(roadX(z - 1) - roadX(z)));

export type CamKey = { f: number; x: number; y: number; z: number; yaw: number; pitch: number };
type Ax = "x" | "y" | "z" | "yaw" | "pitch";
/** time-parameterised monotone cubic Hermite per axis (same maths as TOR00 pathAt, extended to yaw + pitch) */
export const camAt = (k: CamKey[], f: number): CamKey => {
  const n = k.length; if (f <= k[0].f) return k[0]; if (f >= k[n - 1].f) return k[n - 1];
  let i = 0; while (k[i + 1].f < f) i++;
  const a = k[i], b = k[i + 1], h = b.f - a.f, t = (f - a.f) / h;
  const sec = (j: number, q: Ax) => (k[j + 1][q] - k[j][q]) / (k[j + 1].f - k[j].f);
  const tan = (j: number, q: Ax) => {
    if (j === 0 || j === n - 1) return 0;
    const d0 = sec(j - 1, q), d1 = sec(j, q); if (d0 * d1 <= 0) return 0;
    const h0 = k[j].f - k[j - 1].f, h1 = k[j + 1].f - k[j].f;
    return (3 * (h0 + h1)) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1);
  };
  const h00 = 2 * t ** 3 - 3 * t ** 2 + 1, h10 = t ** 3 - 2 * t ** 2 + t, h01 = -2 * t ** 3 + 3 * t ** 2, h11 = t ** 3 - t ** 2;
  const v = (q: Ax) => h00 * a[q] + h10 * h * tan(i, q) + h01 * b[q] + h11 * h * tan(i + 1, q);
  return { f, x: v("x"), y: v("y"), z: v("z"), yaw: v("yaw"), pitch: v("pitch") };
};

export type RoadHero = { id: string; src: string; len: number; q: number; at: number; out: number; label: string; push?: number; crop?: string };
export type Board = { id: string; src: string; len?: number; still?: boolean; z: number; side: 1 | -1; s?: number };

/** gantry i stands at z = Z0 - i*G on the road */
export const gantryZ = (i: number, Z0 = -1400, G = 1050) => Z0 - i * G;

// gantry screens hang tilted toward the approaching driver (like real overhead signs), square to the camera at the hero stop
const LIFT = -95, TILT = deg(Math.atan((LIFT - SY) / 470));
const D = 470; // eye distance at a hero (~70 % of the frame)
/** hero eye: in front of the gantry screen along the road, lifted toward it and tilted up the rest of the way */
const heroEye = (z: number, f: number, back: number): CamKey => {
  const h = rad(roadH(z)), lift = SY + (back * (LIFT - SY)) / 470; // keeps the screen square to the camera while it drifts in
  return { f, x: roadX(z) - back * Math.sin(h), y: lift, z: z + back * Math.cos(h), yaw: roadH(z), pitch: deg(Math.atan((lift - SY) / back)) };
};
const cruise = (z: number, f: number, y = 30, pitch = -2): CamKey => ({ f, x: roadX(z), y, z, yaw: roadH(z), pitch });

/** camera keys: opening drive-in, then per hero: settle, drift in, drive under the gantry, on to the next */
export const roadPath = (H: RoadHero[], Z0 = -1400, G = 1050): CamKey[] => {
  const k: CamKey[] = [cruise(Z0 + 1750, 0, -150, -8)];
  H.forEach((h, i) => {
    const z = gantryZ(i, Z0, G);
    if (i > 0) {
      const p = H[i - 1], zp = gantryZ(i - 1, Z0, G), from = D - (p.push ?? 40), gap = h.at - p.out;
      // pass under the previous gantry at the distance-proportional moment (even speed), then cruise round the bend
      const fc = p.out + Math.round(gap * (from / (from + G - D)));
      k.push(cruise(zp - 10, fc, 45, -1));
    }
    k.push(heroEye(z, h.at, D), heroEye(z, h.out, D - (h.push ?? 40)));
  });
  return k;
};

type Look = { blur: number; light: number };

export const NightRoad: React.FC<{ heroes: (RoadHero & { src: string })[]; boards: Board[]; path: CamKey[]; Z0?: number; G?: number; focus?: number }> = ({ heroes, boards, path, Z0 = -1400, G = 1050, focus = D }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const e = camAt(path, f), e0 = camAt(path, f - 1), e1 = camAt(path, f + 1);
  const turn = (e1.yaw - e0.yaw) / 2;
  const roll = Math.max(-2, Math.min(2, -turn * 1.6));
  const vy = (e1.y - e0.y) / 2;
  const pitch = e.pitch + Math.max(-1.5, Math.min(1.5, vy * 0.02));
  const ch = rad(e.yaw);
  // depth along the view direction (for culling) and straight distance (for focus / falloff)
  const depth = (x: number, z: number) => (x - e.x) * Math.sin(ch) - (z - e.z) * Math.cos(ch);
  const dist = (x: number, y: number, z: number) => Math.hypot(x - e.x, y - e.y, z - e.z);
  const look = (d: number): Look => ({ blur: Math.min(8, Math.abs(d - focus) / 230), light: 1 - Math.min(0.72, Math.max(0, (d - 600) / 5200)) });
  const fog = (d: number) => interpolate(d, [6200, 8200], [1, 0], cl);
  const zNear = e.z + 400, zFar = e.z - 8400;

  // road segments
  const segs: React.ReactNode[] = [];
  const s0 = Math.floor(zNear / SEG) * SEG;
  for (let z = s0; z > zFar; z -= SEG) {
    const zc = z - SEG / 2, x = roadX(zc), d = depth(x, zc);
    if (d < 60) continue;
    const L = 1 - Math.min(0.85, Math.max(0, (d - 300) / 6000)), idx = Math.round(-z / SEG);
    segs.push(
      <div key={"r" + idx} style={{ position: "absolute", left: -RW - 60, top: -SEG / 2 - 1, width: 2 * RW + 120, height: SEG + 2,
        transform: `translate3d(${x}px, ${GY}px, ${zc}px) rotateY(${-roadH(zc)}deg) rotateX(90deg)`, opacity: fog(d),
        background: `linear-gradient(90deg, #0b0c0c 0px, #1d1f21 60px, #1d1f21 ${2 * RW + 60}px, #0b0c0c ${2 * RW + 120}px)`, filter: `brightness(${L.toFixed(3)})` }}>
        <div style={{ position: "absolute", left: 60 + 14, top: 0, width: 9, height: "100%", background: "#d9d9d2" }} />
        <div style={{ position: "absolute", right: 60 + 14, top: 0, width: 9, height: "100%", background: "#d9d9d2" }} />
        {idx % 2 ? <div style={{ position: "absolute", left: RW + 60 - 4, top: 25, width: 8, height: SEG - 50, background: "#e8e3cf" }} /> : null}
      </div>,
    );
  }
  // streetlights (alternating sides) with light pools, reflector posts
  const lamps: React.ReactNode[] = [];
  for (let z = Math.floor(zNear / 700) * 700; z > zFar; z -= 700) {
    const side = Math.round(-z / 700) % 2 ? 1 : -1, x0 = roadX(z), hh = roadH(z), xs = x0 + side * (RW + 90) * Math.cos(rad(hh));
    const d = depth(xs, z); if (d < 40) continue;
    const L = 1 - Math.min(0.8, Math.max(0, (d - 400) / 5600)), o = fog(d);
    lamps.push(
      <div key={"lp" + z} style={{ position: "absolute", left: -330, top: -330, width: 660, height: 660, borderRadius: "50%", opacity: o * 0.55,
        transform: `translate3d(${x0 + side * (RW - 120)}px, ${GY - 1}px, ${z}px) rotateX(90deg)`,
        background: "radial-gradient(circle, rgba(255,170,90,.42) 0%, rgba(255,150,70,.14) 45%, rgba(255,140,60,0) 70%)" }} />,
      <div key={"lq" + z} style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", opacity: o, filter: `brightness(${L.toFixed(3)})`,
        transform: `translate3d(${xs}px, 0px, ${z}px) rotateY(${-hh}deg)` }}>
        <div style={{ position: "absolute", left: -5, top: -430, width: 10, height: GY + 430, background: "linear-gradient(90deg, #2a2c30, #4a4d52 50%, #222428)" }} />
        <div style={{ position: "absolute", left: side > 0 ? -210 : 0, top: -432, width: 210, height: 8, background: "#3d4045" }} />
        <div style={{ position: "absolute", left: side * -205 - 90, top: -470, width: 180, height: 90, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,214,150,1) 0%, rgba(255,170,80,.55) 25%, rgba(255,150,60,0) 70%)" }} />
      </div>,
    );
  }
  for (let z = Math.floor(zNear / 350) * 350; z > Math.max(zFar, e.z - 4000); z -= 350) {
    const x0 = roadX(z), hh = rad(roadH(z));
    [-1, 1].forEach((sd) => {
      const xs = x0 + sd * (RW + 40) * Math.cos(hh), d = depth(xs, z); if (d < 40) return;
      const L = 1 - Math.min(0.85, Math.max(0, (d - 300) / 3000));
      lamps.push(<div key={"rf" + z + sd} style={{ position: "absolute", left: -4, top: -40, width: 8, height: 40, transform: `translate3d(${xs}px, ${GY}px, ${z}px) rotateY(${-roadH(z)}deg)`,
        background: "linear-gradient(#ececec 0 22%, #c42 22% 34%, #ececec 34%)", opacity: L * 0.9 }} />);
    });
  }

  // screens: heroes on gantries, other clips on roadside billboards
  type Scr = { id: string; p: Plane; x: number; y: number; z: number; yaw: number; s: number; gantry: boolean; d: number; dep: number };
  const scr: Scr[] = [];
  heroes.forEach((h, i) => {
    const z = gantryZ(i, Z0, G), x = roadX(z);
    scr.push({ id: h.id, p: { id: h.id, src: h.src, len: h.len, x: 0, y: 0, z: 0, hero: { at: h.at, q: h.q } }, x, y: SY, z, yaw: roadH(z), s: 1, gantry: true,
      d: dist(x, SY, z), dep: depth(x, z) });
  });
  boards.forEach((b) => {
    const hh = roadH(b.z), x = roadX(b.z) + b.side * (RW + 380) * Math.cos(rad(hh)), y = -150;
    scr.push({ id: b.id, p: { id: b.id, src: b.src, len: b.len, still: b.still, x: 0, y: 0, z: 0 }, x, y, z: b.z, yaw: hh + b.side * 24, s: b.s ?? 1, gantry: false,
      d: dist(x, y, b.z), dep: depth(x, b.z) });
  });
  const vis = scr.filter((q) => q.dep > 20 && q.dep < 8600);

  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden", perspective: P, perspectiveOrigin: "50% 50%" }}>
      {/* night sky with a faint town glow on the horizon (moves with the camera's tilt) */}
      <AbsoluteFill style={{ top: P * Math.tan(rad(pitch)) - 300, height: height + 600,
        background: "linear-gradient(180deg, #06080c 0%, #0b0f15 38%, #241a14 49%, #120f0d 51.5%, #070707 60%, #050505 100%)" }} />
      <div style={{ position: "absolute", left: width / 2, top: height / 2, transformStyle: "preserve-3d",
        transform: `translateZ(${P}px) rotateZ(${roll}deg) rotateX(${pitch}deg) rotateY(${e.yaw}deg) translate3d(${-e.x}px, ${-e.y}px, ${-e.z}px)` }}>
        {segs}
        {lamps}
        {vis.map((q) => {
          const lk = look(q.d), w = PW * q.s, hgt = PH * q.s;
          const near = interpolate(q.dep, [20, 60], [0, 1], cl);
          return (
            <div key={q.id} style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", opacity: fog(q.d) * near,
              transform: `translate3d(${q.x}px, 0px, ${q.z}px) rotateY(${-q.yaw}deg)` }}>
              {q.gantry ? <>
                {/* gantry: two posts and a truss beam across the road */}
                {[-1, 1].map((sd) => <div key={sd} style={{ position: "absolute", left: sd * SH - 9, top: SY - hgt / 2 - 46, width: 18, height: GY - SY + hgt / 2 + 46,
                  background: "linear-gradient(90deg, #26282c, #5a5e64 50%, #232529)", filter: `brightness(${lk.light.toFixed(3)})` }} />)}
                <div style={{ position: "absolute", left: -SH - 20, top: SY - hgt / 2 - 52, width: 2 * SH + 40, height: 26, filter: `brightness(${lk.light.toFixed(3)})`,
                  background: "repeating-linear-gradient(60deg, #4b4f55 0 4px, rgba(0,0,0,0) 4px 26px), repeating-linear-gradient(-60deg, #4b4f55 0 4px, rgba(0,0,0,0) 4px 26px)",
                  borderTop: "5px solid #50545a", borderBottom: "5px solid #50545a", boxSizing: "border-box" }} />
              </> : <div style={{ position: "absolute", left: -8, top: q.y, width: 16, height: GY - q.y, background: "linear-gradient(90deg, #232529, #4c5056 50%, #202226)", filter: `brightness(${lk.light.toFixed(3)})` }} />}
              <div style={{ position: "absolute", left: -w / 2, top: q.y - hgt / 2, width: w, height: hgt, overflow: "hidden", background: "#000",
                transform: q.gantry ? `rotateX(${-TILT}deg)` : undefined, transformOrigin: "50% 50%",
                filter: `blur(${lk.blur.toFixed(2)}px) brightness(${lk.light.toFixed(3)})`, boxShadow: "0 0 60px rgba(160,180,210,.10)" }}>
                <ClipTex p={q.p} />
                <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.85)" }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* headlight spill on the road ahead + edge falloff */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 46% 26% at 50% ${92 - Math.tan(rad(pitch)) * 60}%, rgba(255,246,225,.07) 0%, rgba(255,246,225,0) 100%)`, pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.62) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
