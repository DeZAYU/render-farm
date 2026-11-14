// TOR07 | SiteHop: two named sites on one real aerial (USGS NAIP), visited in the order the survey lists them. The camera holds
// on the first site while its white box is drawn and named, then glides across the ground between them (the distance is felt, the
// ground in between stays visible) and boxes the second. A tilt-shift falloff keeps the eye on the boxes. px = image pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Site = { box: [number, number, number, number]; label: string; at: number };
export const SiteHop: React.FC<{ src: string; iw: number; ih: number; a: Site; b: Site; hop: [number, number]; z0?: number; z1?: number }> = ({ src, iw, ih, a, b, hop, z0 = 1.9, z1 = 1.75 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(interpolate(f, hop, [0, 1], cl));
  const c = (s: Site) => [(s.box[0] + s.box[2]) / 2, (s.box[1] + s.box[3]) / 2];
  const [ax, ay] = c(a), [bx, by] = c(b);
  // a slight lift in the middle of the hop (zoom out, then back in)
  const z = (z0 + (z1 - z0) * (f / durationInFrames)) * (1 - 0.18 * Math.sin(Math.PI * t));
  const cx = ax + (bx - ax) * t, cy = ay + (by - ay) * t;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - cx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - cy * base));
  const box = (s: Site) => {
    const g = out(interpolate(f, [s.at, s.at + 14], [0, 1], cl)); if (g <= 0) return null;
    const x = ox + s.box[0] * base, y = oy + s.box[1] * base, w = (s.box[2] - s.box[0]) * base, h = (s.box[3] - s.box[1]) * base, P = 2 * (w + h);
    return <rect x={x} y={y} width={w} height={h} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />;
  };
  const lab = (s: Site, hold?: number) => {
    const x = ox + ((s.box[0] + s.box[2]) / 2) * base, y = oy + s.box[3] * base + 44;
    return <RedLabel text={s.label} at={s.at + 8} hold={hold} x={Math.min(0.85, Math.max(0.15, x / width))} y={Math.min(0.92, y / height)} size={40} />;
  };
  const k = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: k }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }} />
      <AbsoluteFill style={{ backdropFilter: "blur(5px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, #000 100%)", maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 72%, #000 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>{box(a)}{box(b)}</svg>
      {lab(a, hop[0] - a.at - 4)}{lab(b)}
    </AbsoluteFill>
  );
};
