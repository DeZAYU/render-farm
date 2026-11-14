// Shared helpers for the 3-D clip-field intros (TOR00 approved 3 Nov 2026; ND00 and TP00 built the same way).
import type { Key, Plane } from "./TOR00_ClipField";

export type Hero = { id: string; src: string; len: number; q: number; at: number; out: number; label: string; push?: number };

/** heroes along the corridor: z from z0 every dz, alternating sides (centre for the last) */
export const placeHeroes = (h: Hero[], gr: string, z0 = -1200, dz = 520, side = 200) =>
  h.map((x, i) => ({ ...x, x: i === h.length - 1 ? 0 : (i % 2 ? side : -side), y: i % 2 ? 45 : -45, z: z0 - i * dz, src: gr + x.src }));

/** filler planes (clips or stills) scattered around the corridor between z1 and z2, alternating quadrants */
export const fillers = (srcs: { src: string; len?: number; still?: boolean }[], z1: number, z2: number): Plane[] =>
  srcs.map((s, i) => {
    const q = i % 4, sx = q === 0 || q === 3 ? 1 : -1, sy = q < 2 ? -1 : 1;
    return { id: "f" + i, src: s.src, len: s.len, still: s.still, x: sx * (1000 + ((i * 37) % 200)), y: sy * (400 + ((i * 53) % 80)),
      z: z1 + ((z2 - z1) * i) / Math.max(1, srcs.length - 1), s: 0.9 + ((i * 7) % 4) * 0.08, ry: sx * -24, drift: 1 };
  });

/** camera: opening glide, one eased stop per hero (arrive, drift), optional pull-back into the field before hero `fanAt` */
export const buildPath = (H: (Hero & { x: number; y: number; z: number })[], D: number, open: Key[], fanAt = -1, fanKeys: (prev: Key, next: Key) => Key[] = () => []) => {
  const eye = (i: number, f: number, dz = 0, dx = 0): Key => ({ f, x: H[i].x + dx, y: H[i].y, z: H[i].z + D + dz });
  const out: Key[] = [...open];
  H.forEach((h, i) => {
    if (i === fanAt) out.push(...fanKeys(out[out.length - 1], eye(i, h.at)));
    out.push(eye(i, h.at), eye(i, h.out, -(h.push ?? 40), i % 2 ? -8 : 8));
  });
  return out;
};
