// WP01 LegPunch: on "could see the steel underneath it buckling" the filmer's clip (full height, big) plays a beat, freezes, and punches in
// x2 onto the sagging hopper and the steel frame under it; the rest of the frame darkens to a spotlight and four white corner brackets close
// on the bent steel. Works on the footage only (owner 4 Nov: niche devices, no widgets).
import React from "react";
import { useCurrentFrame } from "remotion";
import { OnTall, ease, out } from "./WP01_kit";

export const LegPunch: React.FC<{ src: string; from: number; freeze: number; box: [number, number, number, number]; zoom: number }> = ({ src, from, freeze, box, zoom }) => {
  const f = useCurrentFrame();
  const t = from + Math.min(f, freeze) / 30;
  const p = ease(f, freeze, freeze + 60);
  const s = 1.02 + (zoom - 1.02) * p;
  const [x0, y0, x1, y1] = box.map((v, i) => v * (i % 2 ? 1080 : 608));
  const cx = (x0 + x1) / 2 / 608, cy = (y0 + y1) / 2 / 1080;
  const b = ease(f, freeze + 18, freeze + 40, out), g = 1 + 0.5 * (1 - b), L = 26 / s, w = 5 / s;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const C = [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]] as const;
  return (
    <OnTall src={src} t={t} s={s} fx={cx} fy={cy} spot={[cx, cy, 0.34, 0.16]} dim={p}>
      {b > 0 && C.map(([x, y, sx, sy], i) => {
        const X = mx + (x - mx) * g, Y = my + (y - my) * g;
        return <polyline key={i} points={`${X},${Y + sy * L} ${X},${Y} ${X + sx * L},${Y}`} fill="none" stroke="#fff" strokeWidth={w} opacity={b} />;
      })}
    </OnTall>
  );
};
