// ND10 TrenchVoyage: the Chikyu's 2012 trip from Hachinohe to the fault, on a NASA Blue Marble relief + bathymetry plate (GIBS, public
// domain) where the Japan Trench shows as the dark seam offshore. Tilted plate, the camera follows the ship's white track out of port to
// JFAST site C0019 (37.94N 143.91E, IODP Expedition 343, April-May 2012), past the 2011 epicentre (38.30N 142.37E, USGS). At the site the
// plate tilts further toward the trench and the site's real depths appear (6,890 m of water, ~850 m into the rock: IODP Exp. 343 report).
// Plate px: x = (lon - 140) * 500, y = (41.5 - lat) * 500 (3000 x 2500, bbox 36.5-41.5N, 140-146E).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const P = (lat: number, lon: number): [number, number] => [(lon - 140) * 500, (41.5 - lat) * 500];
const PORT = P(40.53, 141.53), EPI = P(38.297, 142.373), SITE = P(37.94, 143.91);
// the ship's track: out of port, east off the shelf, then south-east to the site (smooth quadratic)
const C1 = P(40.2, 143.6);
const track = (u: number): [number, number] => {
  const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
  return [a * PORT[0] + b * C1[0] + c * SITE[0], a * PORT[1] + b * C1[1] + c * SITE[1]];
};
const N = 60, PTS = Array.from({ length: N + 1 }, (_, i) => track(i / N));

const Tag: React.FC<{ x: number; y: number; text: string; o: number; sc: number; dx?: number }> = ({ x, y, text, o, sc, dx = 28 }) => (
  <text x={x + dx / sc} y={y + 12 / sc} opacity={o} fill="#fff" fontFamily="ArchivoBlk" fontWeight={800} fontSize={34 / sc} letterSpacing={1 / sc}
    style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.65)", strokeWidth: 8 / sc }}>{text}</text>
);

export const ND10_TrenchVoyage: React.FC<{ src: string; iw?: number; ih?: number; trackAt?: number; trackLen?: number; epiAt?: number; siteAt?: number; depthAt?: number; label: string }> = ({ src, iw = 3000, ih = 2500, trackAt = 10, trackLen = 120, epiAt = 70, siteAt = 132, depthAt = 150, label }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(interpolate(f, [trackAt, trackAt + trackLen], [0, 1], cl));
  // camera follows the ship's head, pulled back mid-trip
  const head = track(u);
  const sc = interpolate(f, [0, trackAt + trackLen * 0.5, durationInFrames - 1], [1.05, 0.62, 0.92], { ...cl, easing: io });
  const tilt = interpolate(f, [0, siteAt, durationInFrames - 1], [34, 40, 56], { ...cl, easing: io });
  const rz = interpolate(f, [0, durationInFrames - 1], [-4, -16], { ...cl, easing: io });
  const lead = Math.min(1, u + 0.06), look = track(lead);
  const cx = head[0] * 0.7 + look[0] * 0.3, cy = head[1] * 0.7 + look[1] * 0.3;
  const n = Math.max(1, Math.round(u * N));
  const d = "M" + PTS.slice(0, n + 1).map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const epi = out(interpolate(f, [epiAt, epiAt + 14], [0, 1], cl));
  const site = out(interpolate(f, [siteAt, siteAt + 12], [0, 1], cl));
  const dep = out(interpolate(f, [depthAt, depthAt + 14], [0, 1], cl));
  const pulse = (f % 40) / 40;
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#03060a", overflow: "hidden", perspective: 1400, perspectiveOrigin: "50% 34%", opacity: o }}>
      <div style={{ position: "absolute", left: width / 2, top: height * 0.58, width: iw, height: ih, transformOrigin: "0 0",
        transform: `rotateX(${tilt.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) scale(${sc.toFixed(4)}) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: iw, height: ih, filter: "brightness(1.38) contrast(1.06) saturate(1.05)" }} />
        <svg width={iw} height={ih} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={14 / sc} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={6 / sc} strokeDasharray={`${22 / sc} ${12 / sc}`} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={PORT[0]} cy={PORT[1]} r={11 / sc} fill="#fff" />
          <Tag x={PORT[0]} y={PORT[1]} text="HACHINOHE" o={interpolate(f, [4, 14], [0, 1], cl)} sc={sc} dx={-250} />
          {epi > 0 && <g opacity={epi}>
            <circle cx={EPI[0]} cy={EPI[1]} r={(30 + 60 * pulse) / sc} fill="none" stroke={RED} strokeWidth={4 / sc} opacity={1 - pulse} />
            <circle cx={EPI[0]} cy={EPI[1]} r={13 / sc} fill={RED} stroke="#fff" strokeWidth={3 / sc} />
            <Tag x={EPI[0]} y={EPI[1]} text="EPICENTRE, 11 MARCH 2011" o={epi} sc={sc} />
          </g>}
          {u > 0.02 && u < 0.999 && <circle cx={head[0]} cy={head[1]} r={12 / sc} fill="#fff" stroke="rgba(0,0,0,.6)" strokeWidth={4 / sc} />}
          {site > 0 && <g opacity={site}>
            <rect x={SITE[0] - 22 / sc} y={SITE[1] - 22 / sc} width={44 / sc} height={44 / sc} fill="none" stroke="#fff" strokeWidth={5 / sc} transform={`rotate(45 ${SITE[0]} ${SITE[1]})`} />
            <circle cx={SITE[0]} cy={SITE[1]} r={8 / sc} fill={RED} />
          </g>}
          {dep > 0 && <g opacity={dep}>
            <Tag x={SITE[0]} y={SITE[1] + 70 / sc} text="6,890 M OF WATER" o={dep} sc={sc} dx={-150} />
            <Tag x={SITE[0]} y={SITE[1] + 120 / sc} text="850 M INTO THE ROCK" o={out(interpolate(f, [depthAt + 10, depthAt + 24], [0, 1], cl))} sc={sc} dx={-150} />
          </g>}
        </svg>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,6,10,1) 0%, rgba(3,6,10,.92) 18%, rgba(3,6,10,.25) 32%, rgba(3,6,10,0) 46%, rgba(0,0,0,0) 82%, rgba(0,0,0,.45) 100%)" }} />
      <RedLabel text={label} at={siteAt + 4} x={0.5} y={0.36} />
    </AbsoluteFill>
  );
};
