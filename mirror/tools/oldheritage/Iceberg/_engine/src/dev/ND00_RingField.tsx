// ND00 (intro): RingField — owner 3 Nov: "adjacent intro style 3d but differently" (TOR00 flies forward through a corridor; this one
// turns). The case clips hang on the inside of a huge ring around the camera, like a panorama; the camera sits inside it, turns to face one
// HERO clip per VO beat and dollies in until it fills ~80 % of the frame, then eases back toward the centre as it turns to the next, so the
// neighbours swing past at the sides. The heroes cover most of one full revolution. Upper and lower tiers of case cards counter-rotate
// slowly (a carousel parallax); on "nineteen of the days it didn't" the camera falls back behind the centre, tilts up and the tiers spread.
// Same smooth monotone path as TOR00 (pathAt: x = turn angle, y = eye height, z = dolly radius), depth of field + light falloff by depth.
import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { ClipTex, pathAt, type Key, type Plane } from "./TOR00_ClipField";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const PW = 640, PH = 360, P = 1000, R = 1400; // plane size, perspective, ring radius
const rad = (d: number) => (d * Math.PI) / 180;
const RAIL = Array.from({ length: 60 }, (_, i) => i * 6), CH = 2 * R * Math.sin(rad(3)) + 2; // rail chords every 6 deg

export type RingHero = { id: string; src: string; len: number; q: number; at: number; out: number; label: string };
export type RingPlane = Plane & { a: number; tier: 0 | 1 | -1 }; // a = angle on the ring (deg)

const STEP = 38; // degrees between heroes
export const ringHeroes = (h: RingHero[], gr: string): RingPlane[] =>
  h.map((x, i) => ({ id: x.id, src: gr + x.src, len: x.len, a: i * STEP, x: 0, y: i % 2 ? 26 : -26, z: 0, tier: 0, drift: 0, hero: { at: x.at, q: x.q } }));

export const ringCards = (srcs: { src: string; len?: number; still?: boolean }[]): RingPlane[] =>
  srcs.map((s, i) => ({ id: "c" + i, src: s.src, len: s.len, still: s.still, tier: i % 2 ? 1 : -1, a: (i * 360) / srcs.length + 11,
    x: 0, y: 0, z: 0, s: 0.86 + ((i * 7) % 4) * 0.06 }));

/** camera keys: wide opening, one dolly-in per hero, a pull-back between heroes (deeper when the gap is longer), the fan before `fanAt` */
export const ringPath = (H: RingPlane[], beats: RingHero[], fanAt: number, fanF: number): Key[] => {
  const k: Key[] = [{ f: 0, x: -70, y: -1150, z: -950 }, { f: 40, x: -16, y: -80, z: R - 1050 }];
  beats.forEach((b, i) => {
    if (i > 0) {
      const p = beats[i - 1], gap = b.at - p.out;
      if (i === fanAt) k.push({ f: fanF, x: (H[i - 1].a + H[i].a) / 2, y: -230, z: -320 });
      else if (gap >= 16) k.push({ f: Math.round((p.out + b.at) / 2), x: (H[i - 1].a + 4 + H[i].a) / 2, y: 0, z: R - 470 - Math.min(560, gap * 11) });
    }
    k.push({ f: b.at, x: H[i].a, y: H[i].y, z: R - 470 }, { f: b.out, x: H[i].a + 4, y: H[i].y, z: R - 515 });
  });
  return k;
};

export const RingField: React.FC<{ planes: RingPlane[]; path: Key[]; fan: [number, number, number, number]; focus?: number }> = ({ planes, path, fan, focus = 470 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const e = pathAt(path, f), e0 = pathAt(path, f - 1), e1 = pathAt(path, f + 1);
  const turn = (e1.x - e0.x) / 2; // deg per frame
  const roll = Math.max(-2.2, Math.min(2.2, -turn * 0.9));
  const fanK = interpolate(f, fan, [0, 1, 1, 0.3], { ...cl, easing: ease });
  // opening: high above and behind the centre, looking down on the whole ring of clips, tilting level as the camera sinks into it
  const open = interpolate(f, [0, 44], [-27, 0], { ...cl, easing: ease });
  const pitch = open + fanK * 6 + Math.max(-3, Math.min(3, (e1.y - e0.y) * 0.05));
  const phi = rad(e.x), ex = -e.z * Math.sin(phi), ez = -e.z * Math.cos(phi);
  const vis = planes.map((p) => {
    const a = p.a + (p.tier ? p.tier * (f * 0.07 + fanK * 9) : 0);
    const r = p.tier ? R + 180 : R, y = p.tier ? p.tier * (430 + 120 * fanK) : p.y;
    const wx = -r * Math.sin(rad(a)), wz = -r * Math.cos(rad(a));
    const rx = wx - ex, rz = wz - ez, depth = -(rx * Math.sin(phi) + rz * Math.cos(phi));
    return { p, a, r, y, depth };
  }).filter((q) => q.depth > 140 && q.depth < 4200).sort((a, b) => b.depth - a.depth);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 45%, #10151b 0%, #040507 75%)", overflow: "hidden", perspective: P, perspectiveOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: width / 2, top: height / 2, transformStyle: "preserve-3d",
        transform: `translateZ(${P}px) rotateX(${pitch}deg) rotateZ(${roll}deg) rotateY(${-e.x}deg) translate3d(${-ex}px, ${-e.y}px, ${-ez}px)` }}>
        {RAIL.flatMap((a) => {
          const wx = -R * Math.sin(rad(a)), wz = -R * Math.cos(rad(a)), d = -((wx - ex) * Math.sin(phi) + (wz - ez) * Math.cos(phi));
          if (d < 160 || d > 4200) return [];
          const b = Math.min(9, Math.abs(d - focus) / 210), o = interpolate(d, [160, 300, 3500, 4200], [0, 0.5, 0.5, 0], cl);
          return [-232, 232].map((y) => (
            <div key={a + "_" + y} style={{ position: "absolute", left: -CH / 2, top: -3, width: CH, height: 6, background: "rgba(190,200,212,1)", opacity: o,
              transform: `rotateY(${a}deg) translate3d(0px, ${y}px, ${-R + 6}px)`, filter: `blur(${b.toFixed(2)}px)` }} />
          ));
        })}
        {vis.map(({ p, a, r, y, depth }) => {
          const blur = Math.min(9, Math.abs(depth - focus) / 210);
          const light = 1 - Math.min(0.6, Math.max(0, (depth - 500) / 3800));
          const fog = interpolate(depth, [140, 260, 3500, 4200], [0, 1, 1, 0], cl);
          const s = p.s ?? 1;
          return (
            <div key={p.id} style={{ position: "absolute", left: -PW * s / 2, top: -PH * s / 2, width: PW * s, height: PH * s, transformStyle: "preserve-3d",
              transform: `rotateY(${a}deg) translate3d(0px, ${y}px, ${-r}px) rotateX(${p.tier * -13}deg)`, opacity: fog,
              filter: `blur(${blur.toFixed(2)}px) brightness(${light.toFixed(3)})`, boxShadow: "0 30px 80px rgba(0,0,0,.7)", background: "#000", overflow: "hidden" }}>
              <ClipTex p={p} />
              <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px rgba(255,255,255,.85)" }} />
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
