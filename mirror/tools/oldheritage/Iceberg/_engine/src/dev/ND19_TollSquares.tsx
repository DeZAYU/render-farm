// ND19 TollSquares: "far lighter than its neighbours'". The Miyagi coast from Natori to Ishinomaki on Sentinel-2 (2016); each coastal
// city gets a square whose AREA is its tsunami toll (dead + missing, approximate official figures; see NOTES), dropped south to north,
// white outlines for the neighbours; Shiogama's square, the smallest, is red and named last. No numbers on screen.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type Town = { lon: number; lat: number; toll: number; name?: string; me?: boolean };
export const TollSquares: React.FC<{ img: string; bbox: [number, number, number, number]; iw: number; ih: number; towns: Town[]; at: number; every: number; k: number; meAt: number;
  cam0: [number, number, number]; cam1: [number, number, number] }> = ({ img, bbox, iw, ih, towns, at, every, k, meAt, cam0, cam1 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / durationInFrames);
  const lon = cam0[0] + (cam1[0] - cam0[0]) * u, lat = cam0[1] + (cam1[1] - cam0[1]) * u, wd = cam0[2] + (cam1[2] - cam0[2]) * u;
  const [lo0, la0, lo1, la1] = bbox; const ppx = width / wd; const ppy = ppx * (ih / (la1 - la0)) / (iw / (lo1 - lo0));
  const X = (lo: number) => width / 2 + (lo - lon) * ppx, Y = (la: number) => height / 2 - (la - lat) * ppy;
  const others = towns.filter((t) => !t.me), me = towns.find((t) => t.me)!;
  return (
    <AbsoluteFill style={{ background: "#03060c", overflow: "hidden" }}>
      <Img src={staticFile(img)} style={{ position: "absolute", left: X(lo0), top: Y(la1), width: (lo1 - lo0) * ppx, height: (la1 - la0) * ppy, filter: "brightness(1.05) saturate(.85)" }} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,.28)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {others.map((t, i) => {
          const g = out(interpolate(f, [at + i * every, at + i * every + 10], [0, 1], cl)); if (g <= 0) return null;
          const sd = Math.sqrt(t.toll) * k * (0.6 + 0.4 * g);
          return <g key={i} opacity={g}><rect x={X(t.lon) - sd / 2} y={Y(t.lat) - sd / 2} width={sd} height={sd} fill="rgba(255,255,255,.14)" stroke="#fff" strokeWidth={4} /></g>;
        })}
        {(() => { const g = out(interpolate(f, [meAt, meAt + 10], [0, 1], cl)); if (g <= 0) return null; const sd = Math.max(10, Math.sqrt(me.toll) * k) * (1.8 - 0.8 * g);
          return <g opacity={g}><rect x={X(me.lon) - sd / 2} y={Y(me.lat) - sd / 2} width={sd} height={sd} fill={RED} stroke="#fff" strokeWidth={3} /></g>; })()}
      </svg>
      {others.filter((t) => t.name).map((t, i) => <div key={i} style={{ position: "absolute", left: X(t.lon), top: Y(t.lat) + Math.sqrt(t.toll) * k / 2 + 10, transform: "translateX(-50%)", fontFamily: "ArchivoBlk", fontWeight: 800, fontSize: 26, color: "#fff", letterSpacing: "0.04em", textShadow: "0 2px 6px rgba(0,0,0,.9)",
        opacity: interpolate(f, [at + others.indexOf(t) * every + 6, at + others.indexOf(t) * every + 14], [0, 0.9], cl) }}>{t.name!.toUpperCase()}</div>)}
      <RedLabel text={me.name!} at={meAt + 6} x={(X(me.lon) - 150) / width} y={(Y(me.lat) - 40) / height} size={40} />
    </AbsoluteFill>
  );
};
