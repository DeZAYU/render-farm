// WP01 LoadTrace: how the tank sits, drawn ON the filmer's frozen frame (full height, slow push down onto the frame): white brackets on the
// tank, white lines laid over the real support posts and the steel box under it, a bracket on the pickup parked in the drive-through bay,
// a dashed load path from the hopper down into the bay; on "all the weight" the tank washes red and the posts and box light red with
// chevrons running down them. Coordinates are the clip's own pixels (608x1080) at source 30 s.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { RED } from "../brand";
import { OnTall, cl, ease, out } from "./WP01_kit";

type T = { tank: number; legs: number; truck: number; load: number; weight: number; steel: number };
const POSTS = [196, 226, 256, 287, 317, 341];
const TANK = "172,500 280,442 362,498 362,662 300,684 196,690 172,642";

export const LoadTrace: React.FC<{ src: string; t: number; at: T }> = ({ src, t, at }) => {
  const f = useCurrentFrame();
  const s = 1.0 + 0.16 * ease(f, 0, 225);
  const d = (a: number, l = 14) => ease(f, a, a + l);
  const red = ease(f, at.steel - 4, at.steel + 10);
  const col = red > 0.5 ? RED : "#fff";
  const br = (x0: number, y0: number, x1: number, y1: number, a: number, fade: number) => {
    const b = ease(f, a, a + 16, out), o = b * (1 - ease(f, fade, fade + 12)), g = 1 + 0.4 * (1 - b), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    if (o <= 0) return null;
    return ([[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]] as const).map(([x, y, sx, sy], i) => {
      const X = mx + (x - mx) * g, Y = my + (y - my) * g;
      return <polyline key={a + "_" + i} points={`${X},${Y + sy * 22} ${X},${Y} ${X + sx * 22},${Y}`} fill="none" stroke="#fff" strokeWidth={4} opacity={o} />;
    });
  };
  const chev = (x: number, y0: number, y1: number) => Array.from({ length: 3 }, (_, i) => {
    const y = y0 + (((f - at.steel) * 2.2 + i * (y1 - y0) / 3) % (y1 - y0));
    return <polyline key={x + "c" + i} points={`${x - 9},${y - 7} ${x},${y + 3} ${x + 9},${y - 7}`} fill="none" stroke="#fff" strokeWidth={3.5} opacity={red} />;
  });
  return (
    <OnTall src={src} t={t} s={s} fx={0.45} fy={0.78} spot={[0.42, 0.7, 0.5, 0.35]} dim={0.6 * d(0, 20)}>
      {br(132, 425, 380, 700, at.tank, at.weight - 6)}
      <polygon points={TANK} fill={RED} opacity={0.42 * ease(f, at.weight - 4, at.weight + 22)} style={{ mixBlendMode: "multiply" }} />
      {POSTS.map((x, i) => <line key={x} x1={x} y1={672} x2={x} y2={672 + 100 * d(at.legs + i * 3, 10)} stroke={col} strokeWidth={4 + 2 * red} strokeLinecap="round" />)}
      <polyline points="116,778 300,768 412,770" fill="none" stroke={col} strokeWidth={4 + 2 * red} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(at.legs + 10, 16)} />
      {[118, 412].map((x, i) => <line key={x} x1={x} y1={776} x2={x} y2={776 + 248 * d(at.legs + 16 + i * 4, 14)} stroke={col} strokeWidth={4 + 2 * red} />)}
      {br(166, 912, 266, 1012, at.truck, at.weight + 30)}
      <line x1={262} y1={772} x2={262 - 46 * d(at.load, 20)} y2={772 + 150 * d(at.load, 20)} stroke="#fff" strokeWidth={4} strokeDasharray="12 9" opacity={1 - ease(f, at.weight + 20, at.weight + 34)} />
      {f > at.load + 6 && f < at.weight + 30 && Array.from({ length: 5 }, (_, i) => {
        const u = ((f - at.load) * 0.03 + i / 5) % 1;
        return <circle key={i} cx={262 - 46 * u} cy={772 + 150 * u} r={4} fill="#fff" opacity={interpolate(f, [at.weight + 16, at.weight + 30], [1, 0], cl)} />;
      })}
      {POSTS.filter((_, i) => i % 2 === 0).map((x) => chev(x, 676, 772))}
      {chev(118, 790, 1020)}{chev(412, 790, 1020)}
    </OnTall>
  );
};
