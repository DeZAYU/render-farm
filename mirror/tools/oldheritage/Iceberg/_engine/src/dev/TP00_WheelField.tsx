// TP00 (intro): WheelField — owner 3 Nov: "adjacent intro style 3d but differently" (TOR00 flies through a corridor, ND00 turns inside a
// ring; this one is a ride). The case clips hang as gondolas on a giant ferris wheel seen in 3-D: steel rim, spokes, hub. The wheel turns
// one gondola down to the camera per VO beat; the camera pushes in until it fills ~80 % of the frame, eases back and rises toward the hub
// between beats so the turning structure shows, and the gondolas swing a little as the wheel speeds up and slows (they always hang
// plumb). Behind it a second, larger wheel of case cards turns the other way. On "twenty-five times" the camera pulls back to show the wheel.
// Same smooth monotone path as TOR00 (pathAt: x = wheel angle, y = eye height, z = distance), depth of field + light falloff by depth.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ClipTex, pathAt, type Key, type Plane } from "./TOR00_ClipField";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PW = 640, PH = 360, P = 1000;
const RW = 1500, HANG = 210;           // wheel radius; gondola centre below its rim pivot
const RB = 2700, ZB = -1700;           // back wheel of cards
const STEP = 36;                       // degrees between gondolas
const rad = (d: number) => (d * Math.PI) / 180;

export type WheelHero = { id: string; src: string; len: number; q: number; at: number; out: number; label: string; push?: number };
export type WheelPlane = Plane & { a: number; back?: boolean };

export const wheelHeroes = (h: WheelHero[], gr: string): WheelPlane[] =>
  h.map((x, i) => ({ id: x.id, src: gr + x.src, len: x.len, a: -i * STEP, x: 0, y: 0, z: 0, drift: 0, hero: { at: x.at, q: x.q } }));
export const wheelCards = (srcs: { src: string; len?: number; still?: boolean }[]): WheelPlane[] =>
  srcs.map((s, i) => ({ id: "c" + i, src: s.src, len: s.len, still: s.still, back: true, a: (i * 360) / srcs.length + 7, x: 0, y: 0, z: 0,
    s: 1.1 + ((i * 7) % 4) * 0.08 }));

const EYE = RW + HANG; // eye height that centres a gondola at the bottom
/** camera keys: x = wheel angle (hero i is at the bottom when x = 90 + 36 i), y = eye height, z = distance from the wheel */
export const wheelPath = (beats: WheelHero[], fanAt: number, fanF: number): Key[] => {
  const k: Key[] = [{ f: 0, x: 36, y: 260, z: 3300 }, { f: 18, x: 62, y: 900, z: 2000 }];
  beats.forEach((b, i) => {
    const w = 90 + STEP * i;
    if (i > 0) {
      const p = beats[i - 1], gap = b.at - p.out;
      if (i === fanAt) k.push({ f: fanF, x: w - STEP / 2, y: EYE - 1000, z: 2300 });
      else if (gap >= 16) { const d = 470 + Math.min(820, gap * 13); k.push({ f: Math.round((p.out + b.at) / 2), x: w - STEP / 2 + 2, y: EYE - (d - 470) * 0.45, z: d }); }
    }
    k.push({ f: b.at, x: w, y: EYE, z: 470 }, { f: b.out, x: w + (b.push ? 6 : 3), y: EYE, z: 470 - (b.push ?? 40) });
  });
  return k;
};

export const WheelField: React.FC<{ planes: WheelPlane[]; path: Key[]; focus?: number }> = ({ planes, path, focus = 470 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const e = pathAt(path, f), e0 = pathAt(path, f - 1), e1 = pathAt(path, f + 1);
  const W = e.x, om = (a: number) => pathAt(path, a + 1).x - pathAt(path, a - 1).x;
  const swing = Math.max(-5, Math.min(5, -(om(f) - om(f - 10)) * 4)) + Math.sin(f / 37) * 0.8;
  const pitch = Math.max(-4, Math.min(4, (e1.y - e0.y) * 0.04));
  const depthOf = (z: number) => e.z - z;
  const look = (d: number) => ({ blur: Math.min(9, Math.abs(d - focus) / 210), light: 1 - Math.min(0.62, Math.max(0, (d - 500) / 4200)) });
  const vis = planes.map((p) => {
    const ang = rad(p.back ? p.a - W * 0.55 : p.a + W), r = p.back ? RB : RW, z = p.back ? ZB : 0;
    return { p, x: r * Math.cos(ang), y: r * Math.sin(ang) + (p.back ? 0 : HANG), z, d: depthOf(p.back ? ZB : 0) };
  }).filter((q) => q.d > 110 && Math.abs(q.x - 0) < 4200);
  const front = depthOf(0), back = depthOf(ZB), lf = look(front), lb = look(back);
  const steel = "rgba(196,204,214,.55)";
  const Wheel: React.FC<{ r: number; z: number; rot: number; spokes: number; lk: { blur: number; light: number }; w: number }> = ({ r, z, rot, spokes, lk, w }) => (
    <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `translate3d(0px, 0px, ${z - 30}px) rotateZ(${rot}deg)`,
      filter: `blur(${lk.blur.toFixed(2)}px) brightness(${lk.light.toFixed(3)})` }}>
      <div style={{ position: "absolute", left: -r, top: -r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${w * 2.2}px solid ${steel}`, boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: -r * 0.92, top: -r * 0.92, width: 1.84 * r, height: 1.84 * r, borderRadius: "50%", border: `${w}px solid ${steel}`, boxSizing: "border-box" }} />
      {Array.from({ length: spokes }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: -w / 2, width: r, height: w, background: steel, transformOrigin: "0 50%", transform: `rotateZ(${(i * 360) / spokes}deg)` }} />
      ))}
      <div style={{ position: "absolute", left: -70, top: -70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, #9aa3ad 0%, #3b4048 70%)" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 30%, #1a1714 0%, #060505 75%)", overflow: "hidden", perspective: P, perspectiveOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: width / 2, top: height / 2, transformStyle: "preserve-3d",
        transform: `translateZ(${P}px) rotateX(${pitch}deg) translate3d(${-0}px, ${-e.y}px, ${-e.z}px)` }}>
        {back > 110 ? <Wheel r={RB} z={ZB} rot={-W * 0.55} spokes={18} lk={lb} w={6} /> : null}
        {vis.filter((q) => q.p.back).map((q) => <Gondola key={q.p.id} q={q} swing={0} lk={look(q.d)} />)}
        {front > 110 ? <Wheel r={RW} z={0} rot={W} spokes={10} lk={lf} w={7} /> : null}
        {vis.filter((q) => !q.p.back).map((q) => <Gondola key={q.p.id} q={q} swing={swing} lk={look(q.d)} />)}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Gondola: React.FC<{ q: { p: WheelPlane; x: number; y: number; z: number; d: number }; swing: number; lk: { blur: number; light: number } }> = ({ q, swing, lk }) => {
  const { p, x, y, z, d } = q, s = p.s ?? 1, w = PW * s, h = PH * s;
  const fog = interpolate(d, [110, 240], [0, 1], cl);
  // pivot on the rim (HANG above the plane centre): the gondola swings about it
  return (
    <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `translate3d(${x}px, ${y - (p.back ? 0 : HANG)}px, ${z}px) rotateZ(${swing}deg)`, opacity: fog }}>
      {!p.back ? <>
        <div style={{ position: "absolute", left: -w * 0.32, top: 0, width: 4, height: HANG - h / 2, background: "rgba(196,204,214,.6)", transformOrigin: "50% 0", transform: "rotateZ(-13deg)", filter: `blur(${lk.blur.toFixed(2)}px)` }} />
        <div style={{ position: "absolute", left: w * 0.32, top: 0, width: 4, height: HANG - h / 2, background: "rgba(196,204,214,.6)", transformOrigin: "50% 0", transform: "rotateZ(13deg)", filter: `blur(${lk.blur.toFixed(2)}px)` }} />
        <div style={{ position: "absolute", left: -14, top: -14, width: 28, height: 28, borderRadius: "50%", background: "#8b939c", filter: `blur(${lk.blur.toFixed(2)}px)` }} />
      </> : null}
      <div style={{ position: "absolute", left: -w / 2, top: (p.back ? 0 : HANG) - h / 2, width: w, height: h, overflow: "hidden", background: "#000",
        filter: `blur(${lk.blur.toFixed(2)}px) brightness(${lk.light.toFixed(3)})`, boxShadow: "0 30px 80px rgba(0,0,0,.7)" }}>
        <ClipTex p={p} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.85)" }} />
      </div>
    </div>
  );
};
