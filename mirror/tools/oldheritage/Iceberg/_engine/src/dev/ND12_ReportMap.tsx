// ND12 ReportMap: the storm's own hail reports on the ground it hit. USGS NAIP aerial of Wheat Ridge -> Lakewood (public domain); each
// NWS / SPC storm report of 8 May 2017 inside the frame (spc.noaa.gov/climo/reports/170508_rpts_hail.csv) drops in time order as a white
// ring sized by the stone's reported diameter, its size in inches beside it. Then I-70 is traced and the Colorado Mills mall is boxed.
// Image px: x = (lon + 105.19) / 0.14 * 3000, y = (39.795 - lat) / 0.08 * 1714.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const P = (lat: number, lon: number): [number, number] => [(lon + 105.19) / 0.14 * 3000, (39.795 - lat) / 0.08 * 1714];
// [UTC hhmm, size (in), lat, lon] from the SPC log, inside the frame
const REP: [number, number, number, number][] = [
  [2045, 1.75, 39.77, -105.12], [2048, 1.25, 39.72, -105.12], [2052, 2.0, 39.76, -105.15], [2053, 1.75, 39.75, -105.15],
  [2103, 1.75, 39.77, -105.1], [2104, 2.5, 39.772, -105.098], [2105, 2.75, 39.768, -105.102], [2105, 1.75, 39.77, -105.06],
];
// I-70 through the frame (image px, traced on the NAIP mosaic): Wheat Ridge (NE) -> the bend -> past Colorado Mills (SW)
const I70: [number, number][] = [[2950, 75], [2550, 170], [2250, 200], [1725, 232], [1275, 248], [1050, 345], [1005, 450], [1005, 705], [960, 840], [840, 1050], [705, 1200], [525, 1350], [300, 1530], [0, 1710]];
const MALL: [number, number, number, number] = [570, 1270, 800, 1440];

export const ND12_ReportMap: React.FC<{ src: string; iw?: number; ih?: number; dropAt: number; every: number; roadAt: number; mallAt: number; mallLabel: string }> = ({ src, iw = 3000, ih = 1714, dropAt, every, roadAt, mallAt, mallLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // camera: whole swath first, then glides south-west toward the mall
  const t = io(interpolate(f, [roadAt - 10, durationInFrames], [0, 1], cl));
  const fx = 1500 + (685 - 1500) * t, fy = 700 + (1300 - 700) * t, z = 1.02 + 0.5 * t + 0.04 * (f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const S = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const road = io(interpolate(f, [roadAt, roadAt + 30], [0, 1], cl));
  const mall = out(interpolate(f, [mallAt, mallAt + 14], [0, 1], cl));
  const [mx0, my0] = S([MALL[0], MALL[1]]), [mx1, my1] = S([MALL[2], MALL[3]]);
  const per = 2 * ((mx1 - mx0) + (my1 - my0));
  const d = "M" + I70.map((p) => S(p).map((v) => v.toFixed(1)).join(" ")).join(" L");
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "brightness(.78) saturate(.85)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 5px rgba(0,0,0,.7))" }}>
        <path d={d} fill="none" stroke="#fff" strokeWidth={7} pathLength={1} strokeDasharray={`${road} 1`} strokeLinecap="round" strokeLinejoin="round" opacity={road > 0 ? 1 : 0} />
        {REP.map(([, size, lat, lon], i) => {
          const g = out(interpolate(f, [dropAt + i * every, dropAt + i * every + 10], [0, 1], cl)); if (g <= 0) return null;
          const [x, y] = S(P(lat, lon)); const r = size * 15 * Math.sqrt(z) * (1.5 - 0.5 * g);
          const big = size >= 2.5;
          return <g key={i} opacity={g}>
            <circle cx={x} cy={y} r={r} fill={big ? "rgba(227,20,27,.4)" : "rgba(255,255,255,.22)"} stroke={big ? RED : "#fff"} strokeWidth={4} />
            {(size >= 2 || i === 0) && <text x={x + r + 10} y={y + 10} fill="#fff" fontFamily="ArchivoBlk" fontWeight={800} fontSize={30} style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.7)", strokeWidth: 6 }}>{size.toFixed(2)} IN</text>}
          </g>;
        })}
        {mall > 0 && <rect x={mx0} y={my0} width={mx1 - mx0} height={my1 - my0} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={per} strokeDashoffset={per * (1 - mall)} />}
      </svg>
      <RedLabel text={mallLabel} at={mallAt + 8} x={(mx0 + mx1) / 2 / width} y={Math.min(0.92, (my1 + 44) / height)} />
    </AbsoluteFill>
  );
};
