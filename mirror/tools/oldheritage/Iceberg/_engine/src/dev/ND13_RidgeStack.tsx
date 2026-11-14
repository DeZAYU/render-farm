// ND13 RidgeStack: real photos of the fire's mountain hung as planes in 3-D depth (Farrell / VV fly-through). The camera dollies
// forward through them one by one, each plane swinging flat as it arrives; a red label can name the place on a plane.
// Built for Gatlinburg (NPS: the Chimney Tops 2 fire on the mountainside; the twin peaks; the small smoke column of the early days).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
export type Plane = { src: string; ar: number; at: number; pos?: string; label?: string; side?: 1 | -1 };

/** planes[i].at = frame the camera arrives at plane i (it sits flat, full-ish frame). Camera z is one smooth curve through all keys. */
export const RidgeStack: React.FC<{ planes: Plane[]; gap?: number }> = ({ planes, gap = 1500 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const P = 1600;
  // camera z (distance travelled): eased between arrival keys, never stopping dead (a slow creep is added)
  const keys = planes.map((p, i) => ({ at: p.at, z: i * gap }));
  let z = 0;
  if (f <= keys[0].at) z = -260 * (1 - f / Math.max(1, keys[0].at));
  else {
    z = keys[keys.length - 1].z;
    for (let i = 0; i < keys.length - 1; i++) if (f < keys[i + 1].at) { const a = keys[i], b = keys[i + 1]; z = a.z + (b.z - a.z) * io((f - a.at) / (b.at - a.at)); break; }
  }
  { const last = [...keys].reverse().find((k) => f >= k.at); if (last) z += Math.min(220, (f - last.at) * 1.6); } // slow creep after each arrival, never past the plane
  const cur = planes.reduce((k, p, i) => (f >= p.at - 10 ? i : k), 0);
  const W = width * 0.74;
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      {planes.map((p, i) => { const o = i === 0 ? 1 : interpolate(f, [p.at - 26, p.at + 4], [0, 1], cl); if (o <= 0 || i < cur - 1) return null;
        return <Img key={"bg" + i} src={staticFile(p.src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.38) saturate(.8)", opacity: o }} />; })}
      <AbsoluteFill style={{ perspective: P, perspectiveOrigin: "50% 48%" }}>
        {planes.map((p, i) => ({ p, i })).reverse().map(({ p, i }) => {
          const dz = i * gap - z; // distance in front of the camera's arrival plane
          if (dz < -700 || dz > gap * 2.2) return null;
          const H = W / p.ar;
          const swing = interpolate(dz, [0, gap], [0, 24 * (p.side ?? (i % 2 ? -1 : 1))], cl);
          const o = interpolate(dz, [-700, -320, gap * 1.6, gap * 2.2], [0, 1, 1, 0], cl);
          return (
            <div key={i} style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2 - 20, width: W, height: H,
              transform: `translateZ(${-dz}px) rotateY(${swing}deg)`, opacity: o, border: "6px solid #fff", boxShadow: "0 30px 80px rgba(0,0,0,.7)", overflow: "hidden", background: "#111" }}>
              <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "50% 50%" }} />
              {/* light pool drifting across the print */}
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 70% at ${30 + 40 * ((f / 300) % 1)}% 35%, rgba(255,240,220,.10), rgba(0,0,0,.28) 85%)` }} />
            </div>
          );
        })}
      </AbsoluteFill>
      {planes.map((p, i) => p.label ? <RedLabel key={i} text={p.label} at={p.at + 4} hold={(planes[i + 1]?.at ?? 99999) - p.at - 18} x={0.5} y={0.9} /> : null)}
    </AbsoluteFill>
  );
};
