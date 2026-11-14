// map / PinDrop3D: a vector country plate (not a satellite still) tilts up out of the flat into 3-D, a red pin DROPS onto the place from above
// (gravity, shadow growing, one ripple on landing), then the D1 map box names it. REF D1 E10 / E4 map box (Dashcam Vol.1 @ 0:05.0: pin, red
// leader, outlined box wiping L->R in 6 f, then the words) + VV §11 world camera (Visual Venture TV @ 3:28.0: quick-start / long-settle).
// Ours (vs DotMap3D / SatelliteMapBox): an extruded outline plate with depth layers, a tilt-up entry, a physical pin drop with shadow + ripple,
// and the D3 place label for the country.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, RC, W, EZ, MapPin, clamp01, lerp } from "../../core";
import { MapBoxCallout, PlaceWords, layerTf, type GeoLayer, type LonLat, type Word, type WorldProj } from "../../core/kits/geo";
import { DEMO_COUNTRY, DEMO_REGION } from "./shared";

export type PinDrop3DProps = {
  cap?: number; subCap?: number; titleCap?: number; // map box / white sub line / D3 title caps (M-024 >= 28)
  country: GeoLayer; // the plate
  region?: GeoLayer; // faint neighbours on the same plate
  centre: LonLat; pxPerDeg: number;
  tilt?: number; riseFrames?: number; rot0?: number; rotPerS?: number; depth?: number;
  pin: LonLat & { dropAt: number };
  box: Word[]; sub?: Word[]; elbow?: { dx: number; dy: number };
  title?: Word[]; // D3 place label (country / state) top-left
  plateColour?: string;
};

const PERSP = 1700;
export const PinDrop3D: React.FC<PinDrop3DProps> = (p) => {
  const f = useCurrentFrame();
  const tiltMax = p.tilt ?? 50;
  const tilt = tiltMax * EZ.quick(f / (p.riseFrames ?? 36));
  const rot = (p.rot0 ?? 10) + (p.rotPerS ?? -2) * (Math.max(0, f) / 30);
  const z = 0.92 + 0.08 * EZ.settle(f / 60) + 0.004 * (Math.max(0, f) / 30);
  const P: WorldProj = { lon0: p.centre.lon, lat0: p.centre.lat, k: Math.cos((p.centre.lat * Math.PI) / 180), u: p.pxPerDeg };
  const toPlane = (lon: number, lat: number) => ({ x: 960 + (lon - P.lon0) * P.k * P.u, y: 540 + (P.lat0 - lat) * P.u });
  const project = (px: number, py: number) => {
    const rx = (px - 960) * z, ry = (py - 540) * z, b = (rot * Math.PI) / 180, a = (tilt * Math.PI) / 180;
    const x1 = rx * Math.cos(b) - ry * Math.sin(b), y1 = rx * Math.sin(b) + ry * Math.cos(b);
    const y2 = y1 * Math.cos(a), z2 = y1 * Math.sin(a), k = PERSP / (PERSP - z2);
    return { x: 960 + x1 * k, y: 540 + y2 * k };
  };
  const layers = p.depth ?? 9;
  const plate = (fill: boolean, i: number) => (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform="translate(960 540)">
        {p.region && fill ? <g transform={layerTf(P, p.region)}>{p.region.paths.map((d, j) => <path key={j} d={d} fill="rgba(160,180,200,.05)" stroke="rgba(220,230,240,.25)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />)}</g> : null}
        <g transform={layerTf(P, p.country)}>
          {p.country.paths.map((d, j) => (
            <path key={j} d={d} fill={fill ? p.plateColour ?? "#1B2A38" : i % 2 ? "#0E151C" : "#121C25"} stroke={fill ? "#EAF2F8" : "rgba(170,195,215,.55)"} strokeWidth={fill ? 3 : 1.4} vectorEffect="non-scaling-stroke" strokeLinejoin="round"
              style={fill ? { filter: "drop-shadow(0 0 4px rgba(220,235,255,.6))" } : undefined} />
          ))}
        </g>
      </g>
    </svg>
  );
  const tp = toPlane(p.pin.lon, p.pin.lat), land = project(tp.x, tp.y);
  const dk = f - p.pin.dropAt;
  const fall = EZ.in2(clamp01(dk / 12));
  const pinY = lerp(land.y - 520, land.y, fall);
  const landed = dk >= 12, rk = dk - 12;
  const sq = landed && rk < 6 ? 1 - 0.18 * (1 - rk / 6) : 1;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 55%, #0B1520 0%, #020407 85%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `perspective(${PERSP}px) rotateX(${tilt.toFixed(3)}deg) rotateZ(${rot.toFixed(3)}deg) scale(${z.toFixed(5)})`, transformOrigin: "960px 540px" }}>
        {Array.from({ length: layers }, (_, i) => (
          <AbsoluteFill key={i} style={{ transform: `translateZ(${(-(layers - i) * 6 * (tilt / tiltMax)).toFixed(2)}px)` }}>{plate(false, i)}</AbsoluteFill>
        ))}
        <AbsoluteFill>{plate(true, 0)}</AbsoluteFill>
      </AbsoluteFill>
      {dk >= 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={land.x} cy={land.y} rx={22 * fall} ry={22 * fall * Math.cos((tilt * Math.PI) / 180)} fill="rgba(0,0,0,.55)" style={{ filter: "blur(3px)" }} />
          {landed && rk < 16 ? <ellipse cx={land.x} cy={land.y} rx={20 + 90 * EZ.out3(rk / 16)} ry={(20 + 90 * EZ.out3(rk / 16)) * Math.cos((tilt * Math.PI) / 180)} fill="none" stroke={RC.lineRed} strokeWidth={4} opacity={1 - rk / 16} /> : null}
        </svg>
      ) : null}
      {dk >= 0 ? <div style={{ position: "absolute", inset: 0, transformOrigin: `${land.x}px ${land.y}px`, transform: `scale(${(1 / sq) ** 0.5}, ${sq})` }}><MapPin k={99} x={land.x} y={pinY} size={1.5} /></div> : null}
      {landed ? <MapBoxCallout f={f} p={{ x: land.x, y: land.y - 40 }} start={p.pin.dropAt + 14} words={p.box} sub={p.sub} elbow={p.elbow ?? { dx: 170, dy: -150 }} pin={false} cap={p.cap ?? 40} subCap={p.subCap ?? 30} /> : null}
      {p.title ? <PlaceWords f={f} words={p.title} cap={p.titleCap ?? 64} x={120} y={150} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const PINDROP_DEMO: PinDrop3DProps = {
  country: DEMO_COUNTRY,
  region: DEMO_REGION,
  centre: { lon: 120.9, lat: 23.9 }, pxPerDeg: 290,
  tilt: 50, riseFrames: 36, rot0: 12, rotPerS: -2, depth: 9,
  pin: { lon: 121.39, lat: 25.13, dropAt: 40 },
  box: [{ t: "Harbour", at: 62 }, { t: "District", at: 70 }], sub: [{ t: "City Name", at: 78 }],
  title: [{ t: "Country", at: 8 }, { t: "Name", at: 14, red: true }],
};
