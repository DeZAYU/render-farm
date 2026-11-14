// TOR22 (Elbert County deputy) — the Front Range edge: USGS NAIP multiplied by the 3DEP hillshade (mountains west, Denver, the open
// plains east) lying in 3-D, the camera gliding over it on one eased curve. Overlays sit IN the plane: Census county outlines drawn on,
// place dots with small ArchivoBlk names, and the NWS damage-survey tracks of 18 May 2025 (DAT) drawn in time order (EF2 red, EF1 white).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);
type Pt = [number, number];
// one monotone smoothstep curve through camera keys (frame, x, y, zoom)
const cam = (f: number, k: [number, number, number, number][]) => {
  if (f <= k[0][0]) return k[0].slice(1) as [number, number, number];
  for (let i = 1; i < k.length; i++) if (f <= k[i][0]) {
    const u = (f - k[i - 1][0]) / (k[i][0] - k[i - 1][0]), s = io(u);
    return [0, 1, 2].map((j) => k[i - 1][j + 1] + (k[i][j + 1] - k[i - 1][j + 1]) * s) as [number, number, number];
  }
  return k[k.length - 1].slice(1) as [number, number, number];
};

export const PlainsRelief: React.FC<{
  src: string; iw: number; ih: number; keys: [number, number, number, number][];
  counties?: { name: string; pts: Pt[] }[]; hiCounty?: string; countyAt?: number;
  places?: { name: string; p: Pt; at: number }[];
  tracks?: { ef: string; pts: Pt[] }[]; trackAt?: number; trackEvery?: number;
  label?: string; labelAt?: number; tilt?: number;
}> = ({ src, iw, ih, keys, counties = [], hiCounty, countyAt = 0, places = [], tracks = [], trackAt = 0, trackEvery = 10, label, labelAt = 0, tilt = 38 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const [cx, cy, z] = cam(f, keys);
  const S = 0.75; const W = iw * S, H = ih * S;
  const rx = tilt - 4 * (f / durationInFrames);
  const enter = interpolate(f, [0, 10], [0, 1], cl);
  const d = (pts: Pt[], close = false) => "M" + pts.map((p) => `${(p[0] * S).toFixed(1)} ${(p[1] * S).toFixed(1)}`).join(" L") + (close ? " Z" : "");
  const cg = out(interpolate(f, [countyAt, countyAt + 22], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #9aa3a6 0%, #c7ccc9 30%, #3a3a33 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1200, perspectiveOrigin: "50% 12%" }}>
        <div style={{ position: "absolute", left: width / 2 - cx * S, top: height * 0.56 - cy * S, width: W, height: H,
          transformOrigin: `${cx * S}px ${cy * S}px`, transform: `scale(${z}) rotateX(${rx}deg)`, opacity: enter }}>
          <Img src={staticFile(src)} style={{ width: W, height: H, display: "block" }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {counties.map((c, i) => {
              const hi = c.name === hiCounty;
              return <path key={i} d={d(c.pts, true)} fill={hi ? `rgba(255,255,255,${0.12 * cg})` : "none"} stroke="#fff" strokeOpacity={(hi ? 0.95 : 0.4) * cg} strokeWidth={(hi ? 4 : 2) / z}
                pathLength={1} strokeDasharray={`${cg} 1`} strokeLinejoin="round" />;
            })}
            {tracks.map((t, i) => {
              const g = io(interpolate(f, [trackAt + i * trackEvery, trackAt + i * trackEvery + 14], [0, 1], cl)); if (g <= 0) return null;
              const col = t.ef === "EF2" ? RED : "#fff";
              return <g key={i}>
                <path d={d(t.pts)} fill="none" stroke="rgba(0,0,0,.6)" strokeWidth={11 / z} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
                <path d={d(t.pts)} fill="none" stroke={col} strokeWidth={6 / z} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" />
                <circle cx={t.pts[0][0] * S} cy={t.pts[0][1] * S} r={(7 + 14 * (1 - g)) / z} fill="none" stroke="#fff" strokeWidth={2.5 / z} opacity={1 - 0.6 * g} />
              </g>;
            })}
            {places.map((p, i) => {
              const g = out(interpolate(f, [p.at, p.at + 12], [0, 1], cl)); if (g <= 0) return null;
              return <g key={i} opacity={g}>
                <circle cx={p.p[0] * S} cy={p.p[1] * S} r={7 / z} fill="#fff" stroke="#000" strokeWidth={2 / z} />
                <text x={p.p[0] * S + 14 / z} y={p.p[1] * S - 10 / z} fill="#fff" fontFamily="ArchivoBlk" fontWeight={900} fontSize={30 / z} style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.75)", strokeWidth: 5 / z }}>{p.name}</text>
              </g>;
            })}
          </svg>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(196,202,200,.9) 0%, rgba(196,202,200,.2) 20%, rgba(0,0,0,0) 36%, rgba(0,0,0,0) 72%, rgba(0,0,0,.5) 100%)" }} />
      {label ? <RedLabel text={label} at={labelAt} x={0.5} y={0.88} /> : <RedLabel text="" at={1e6} />}
    </AbsoluteFill>
  );
};
