// ND08 QuakeReach — NASA Blue Marble shaded relief of Nepal (GIBS, public domain), seen from high above. It opens on Everest (pinned,
// "this avalanche didn't start on Everest"), the camera swings ~220 km west to the Gorkha epicentre (USGS: 28.231 N, 84.731 E) as the
// quake is named; the epicentre pulses and true-scale shaking fronts (ellipses: equirectangular plate, km -> px per axis) roll east across
// the Himalaya until one reaches Everest and its pin flares. Built for "This avalanche didn't start on Everest. Just before noon on
// Saturday the 25th of April 2015, a magnitude 7.8 earthquake hit Nepal." Plate px: x = (lon - 82.5) * 500, y = (29.6 - lat) * 500.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const P = (lon: number, lat: number): [number, number] => [(lon - 82.5) * 500, (29.6 - lat) * 500];
const KX = 500 / (111.32 * Math.cos((28.1 * Math.PI) / 180)), KY = 500 / 110.6; // px per km

export const QuakeReach: React.FC<{ src: string; swingAt: number; swingLen: number; pulseAt: number; kmPerFrame: number; dateLabel: string; epiLabel: string; peakLabel: string }> = ({ src, swingAt, swingLen, pulseAt, kmPerFrame, dateLabel, epiLabel, peakLabel }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const ev = P(86.925, 27.988), ep = P(84.731, 28.231);
  const iw = 3200, ih = 1800;
  // camera: on Everest -> swing to the epicentre -> pull back so both sit in frame while the fronts travel
  const s = io(interpolate(f, [swingAt, swingAt + swingLen], [0, 1], cl));
  const sp = Math.abs(io(interpolate(f + 1, [swingAt, swingAt + swingLen], [0, 1], cl)) - s); // swing speed (fraction per frame)
  const mb = Math.min(5, sp * 160); // motion blur while the camera travels
  const back = io(interpolate(f, [pulseAt + 10, D], [0, 1], cl));
  const mid: [number, number] = [(ev[0] + ep[0]) / 2, (ev[1] + ep[1]) / 2];
  const fx0 = ev[0] + (ep[0] - ev[0]) * s, fy0 = ev[1] + (ep[1] - ev[1]) * s;
  const fx = fx0 + (mid[0] - fx0) * back, fy = fy0 + (mid[1] - fy0) * back;
  const z = (1.95 - 0.1 * s) - 0.75 * back + 0.05 * io(f / D);
  const base = Math.max(W / iw, H / ih) * z;
  const ox = W / 2 - fx * base, oy = H / 2 - fy * base;
  const S = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const [Ex, Ey] = S(ev), [Px, Py] = S(ep);
  const distKm = 222; // epicentre -> Everest
  const pin = out(interpolate(f, [4, 16], [0, 1], cl));
  const epi = out(interpolate(f, [swingAt + swingLen - 6, swingAt + swingLen + 8], [0, 1], cl));
  const fronts = [0, 14, 28];
  const reachF = pulseAt + distKm / kmPerFrame;
  const flare = out(interpolate(f, [reachF, reachF + 10], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: `brightness(.86) contrast(1.05) blur(${mb.toFixed(2)}px)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {fronts.map((d, i) => {
          const km = (f - pulseAt - d) * kmPerFrame; if (km <= 0) return null;
          const op = interpolate(km, [0, 30, 300, 380], [0, 0.95, 0.5, 0], cl);
          return <ellipse key={i} cx={Px} cy={Py} rx={km * KX * base} ry={km * KY * base} fill="none" stroke="#fff" strokeWidth={4} opacity={op} />;
        })}
        {epi > 0 && <g opacity={epi}><circle cx={Px} cy={Py} r={10 + 14 * epi} fill="none" stroke="#fff" strokeWidth={4} /><circle cx={Px} cy={Py} r={9} fill={RED} stroke="#fff" strokeWidth={3} /></g>}
        <g opacity={pin}>
          <circle cx={Ex} cy={Ey} r={9 + 22 * flare} fill="none" stroke={flare > 0 ? RED : "#fff"} strokeWidth={4} opacity={1 - 0.4 * flare} />
          <polygon points={`${Ex},${Ey - 6} ${Ex - 11},${Ey + 12} ${Ex + 11},${Ey + 12}`} fill="#fff" stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
        </g>
      </svg>
      <RedLabel text={peakLabel} at={10} hold={swingAt - 6} x={Math.min(0.85, Ex / W)} y={Math.max(0.1, (Ey - 70) / H)} size={40} />
      <RedLabel text={dateLabel} at={swingAt + 4} hold={pulseAt - swingAt + 10} y={0.9} />
      <RedLabel text={epiLabel} at={swingAt + swingLen} x={Math.max(0.15, Math.min(0.85, Px / W))} y={Math.max(0.1, (Py - 80) / H)} size={40} />
      <RedLabel text={peakLabel} at={Math.round(reachF)} x={Math.min(0.85, Ex / W)} y={Math.max(0.1, (Ey - 70) / H)} size={40} />
    </AbsoluteFill>
  );
};
