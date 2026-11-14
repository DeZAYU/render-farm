// evidence / DeskSpread: evidence dealt onto a dark desk. Prints (pages / photos) slide in from outside the frame one by one on their nouns
// (quick start, long settle, landing shadow shrinks as they touch down), while the camera slowly pulls back with a small roll (Farrell CC
// "2018" -1.5 %/s, +0.19 deg/s). On `focus` the desk dims and defocuses, the key print LIFTS (straightens, rises, its shadow grows: Farrell
// B4 UI lift-out) and the camera punch-in bursts onto it (Farrell B2: fast ease-in, long deceleration).
// REF Farrell evidence A7 objects on a lit surface (GR 8:33 wallet / 9:06 cork, CC 9:40 "2018") + B4 lift-out (OF 4:29.5) + B2 push burst (SL 8:34).
// Our version: the "fan-in" of several sources (DD corkboard idea without pins), on a warm-lit desk instead of cork.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { EZ, MBlur, clamp01, lerp, lerpLog } from "../../core";
import { ItemFace, itemSize, type EvItem } from "./shared";

export type DeskSpreadProps = {
  items: EvItem[]; // world px around (0,0); `at` = frame it lands
  cam0?: { x: number; y: number; z: number };
  pull?: number; // pull-back per second while dealing (default 0.015)
  focus?: { i: number; at: number; z: number; d?: number }; // lift + punch-in onto item i
  dealFrames?: number; // slide duration (default 18)
};
const PUNCH = Easing.bezier(0.55, 0, 0.2, 1);
const Inner: React.FC<DeskSpreadProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const c0 = p.cam0 ?? { x: 0, y: 0, z: 0.9 };
  const fo = p.focus;
  const fu = fo ? PUNCH(clamp01((f - fo.at) / (fo.d ?? 40))) : 0;
  const fk = fo ? clamp01((f - fo.at) / 14) : 0; // lift / dim progress
  const tf = fo ? Math.min(t, fo.at / 30) : t;
  const zPull = c0.z * (1 - (p.pull ?? 0.015) * tf);
  const target = fo ? p.items[fo.i] : undefined;
  const cx = lerp(c0.x, target?.x ?? c0.x, fu), cy = lerp(c0.y, target?.y ?? c0.y, fu);
  const z = lerpLog(zPull, fo?.z ?? zPull, fu) * (1 + 0.006 * Math.max(0, t - (fo ? fo.at / 30 : t)));
  const rot = 0.19 * tf * (1 - fu);
  const D = p.dealFrames ?? 18;
  return (
    <AbsoluteFill style={{ background: "#0b0806" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(960px, 540px) rotate(${rot}deg) scale(${z}) translate(${-cx}px, ${-cy}px)` }}>
        {/* the desk: dark warm wood-ish grain under a pool of light */}
        <div style={{ position: "absolute", left: -2600, top: -1700, width: 5200, height: 3400, background: "#1d140d", filter: fk > 0 ? `brightness(${1 - 0.45 * EZ.out2(fk)})` : undefined }}>
          <svg width={5200} height={3400} style={{ position: "absolute", inset: 0, opacity: 0.55, mixBlendMode: "overlay" }}>
            <filter id="dsGrain"><feTurbulence type="fractalNoise" baseFrequency="0.0016 0.045" numOctaves={3} seed={4} /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width={5200} height={3400} filter="url(#dsGrain)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 30% 34% at 50% 50%, rgba(255,214,160,.28) 0%, rgba(255,190,120,.10) 45%, rgba(0,0,0,0) 100%)" }} />
        </div>
        {p.items.map((it, i) => {
          const q = f - it.at;
          if (it.at >= 0 && q < 0) return null;
          const u = it.at < 0 ? 1 : EZ.quick(q / D);
          const len = Math.hypot(it.x, it.y) || 1;
          const ox = (it.x / len) * 1500 + (i % 2 ? 300 : -300), oy = (it.y / len) * 1100 + 500;
          const isF = fo?.i === i;
          const lift = isF ? EZ.out3(fk) : 0;
          const x = lerp(it.x + ox, it.x, u), y = lerp(it.y + oy, it.y, u);
          const r = lerp((it.rot ?? 0) + (i % 2 ? 16 : -14), it.rot ?? 0, u) * (1 - 0.85 * lift);
          const air = 1 - u + 0.9 * lift; // height above the desk
          const sc = 1 + 0.06 * (1 - u) + 0.05 * lift;
          const { w, h } = itemSize(it);
          const dim = !isF && fk > 0 ? EZ.out2(fk) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, zIndex: isF ? 10 : i, transform: `rotate(${r}deg) scale(${sc})`,
              boxShadow: `${(8 + 40 * air).toFixed(1)}px ${(14 + 60 * air).toFixed(1)}px ${(18 + 50 * air).toFixed(1)}px rgba(0,0,0,${(0.55 - 0.1 * air).toFixed(2)})`,
              filter: dim > 0 ? `brightness(${1 - 0.5 * dim}) blur(${(3 * dim).toFixed(2)}px)` : undefined }}>
              <ItemFace it={it} />
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 66% at 50% 48%, rgba(0,0,0,0) 40%, rgba(4,2,0,.78) 100%)" }} />
    </AbsoluteFill>
  );
};
export const DeskSpread: React.FC<DeskSpreadProps> = (p) => {
  const f = useCurrentFrame();
  const D = p.dealFrames ?? 18;
  const dealing = p.items.some((it) => it.at >= 0 && f - it.at > 0 && f - it.at < D * 0.5);
  const fo = p.focus;
  const punching = !!fo && f - fo.at > (fo.d ?? 40) * 0.2 && f - fo.at < (fo.d ?? 40) * 0.7;
  return <MBlur on={dealing || punching}><Inner {...p} /></MBlur>;
};
