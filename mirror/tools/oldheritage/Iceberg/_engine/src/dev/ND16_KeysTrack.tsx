// ND16 device: Irma's eye track over a real NAIP mosaic of the Middle/Lower Keys, laid on a 3-D tilted plane (AE-style camera).
// phase "landfall": the camera rides the track north as it is drawn to Cudjoe Key (landfall dot + red labels).
// phase "east": the full track, the camera glides east up the chain to Marathon, a red wash spreads over the storm's east side, white box on Marathon.
// Image: keys.jpg 3600x1547, EPSG:3857 export of bbox -81.62,24.55 .. -80.98,24.80 (USGS NAIP, dark no-data water filled).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const IW = 3600, IH = 1547;
// HURDAT2 best track (12z 24.5N 81.5W, 13z landfall 24.7N 81.5W, 18z 25.6N 81.7W) in image px; 06z 23.7N 81.3W gives the southern entry
const TRACK: [number, number][] = [[900, 2474], [675, 1856], [675, 836], [489, -310]];
const CUDJOE: [number, number] = [675, 836];
const MARATHON: [number, number, number, number] = [2756, 279, 3375, 681];

type Key = { t: number; c: [number, number]; z: number };
// one smooth monotone ease through all keys (no hold -> move -> hold jerks)
const cam = (f: number, keys: Key[]) => {
  if (f <= keys[0].t) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.t) {
      const u = io((f - a.t) / (b.t - a.t));
      return { t: f, c: [a.c[0] + (b.c[0] - a.c[0]) * u, a.c[1] + (b.c[1] - a.c[1]) * u] as [number, number], z: a.z * Math.pow(b.z / a.z, u) };
    }
  }
  return keys[keys.length - 1];
};

export const KeysTrack: React.FC<{ src: string; phase: "landfall" | "east"; dateAt?: number; cudjoeAt?: number; boxAt?: number; washAt?: number }> = ({ src, phase, dateAt = 125, cudjoeAt = 62, boxAt = 30, washAt = 78 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: D } = useVideoConfig();
  const tilt = phase === "landfall" ? interpolate(f, [0, D], [30, 22], cl) : interpolate(f, [0, D], [22, 16], cl);
  const P = 1700, th = (tilt * Math.PI) / 180;
  const keys: Key[] = phase === "landfall"
    ? [{ t: 0, c: [1080, 1000], z: 2.0 }, { t: 70, c: [1000, 880], z: 2.4 }, { t: D, c: [1020, 800], z: 2.6 }]
    : [{ t: 0, c: [1020, 800], z: 2.45 }, { t: D * 0.62, c: [2600, 600], z: 2.1 }, { t: D, c: [2840, 540], z: 2.35 }];
  const k = cam(f, keys);
  const base = (width / IW) * k.z;
  const toPlane = (p: [number, number]) => [(p[0] - k.c[0]) * base, (p[1] - k.c[1]) * base] as [number, number];
  const project = (p: [number, number]) => { const [X, Y] = toPlane(p); const s = P / (P - Y * Math.sin(th)); return [width / 2 + X * s, height / 2 + Y * Math.cos(th) * s] as [number, number]; };
  // the plane is far bigger than the frame so the tilted top never shows its edge
  const PW = width * 3.2, PH = height * 3.2;
  const imgLeft = PW / 2 - k.c[0] * base, imgTop = PH / 2 - k.c[1] * base;
  const pl = (p: [number, number]) => [imgLeft + p[0] * base, imgTop + p[1] * base];
  const draw = phase === "landfall" ? io(interpolate(f, [8, cudjoeAt], [0, 0.62], cl)) + 0.38 * io(interpolate(f, [cudjoeAt + 20, D - 10], [0, 1], cl)) : 1;
  const d = "M" + TRACK.map((p) => pl(p).join(" ")).join(" L");
  // the eye: rides the drawn tip
  const segs = TRACK.slice(1).map((p, i) => Math.hypot(p[0] - TRACK[i][0], p[1] - TRACK[i][1])); const L = segs.reduce((a, b) => a + b, 0);
  let rem = draw * L, tip: [number, number] = TRACK[0];
  for (let i = 0; i < segs.length; i++) { if (rem <= segs[i]) { const u = rem / segs[i]; tip = [TRACK[i][0] + (TRACK[i + 1][0] - TRACK[i][0]) * u, TRACK[i][1] + (TRACK[i + 1][1] - TRACK[i][1]) * u]; break; } rem -= segs[i]; tip = TRACK[i + 1]; }
  const land = out(interpolate(f, [cudjoeAt - 4, cudjoeAt + 10], [0, 1], cl));
  const wash = phase === "east" ? io(interpolate(f, [washAt, washAt + 40], [0, 1], cl)) : 0;
  const box = phase === "east" ? out(interpolate(f, [boxAt, boxAt + 16], [0, 1], cl)) : 0;
  const [mx0, my0] = pl([MARATHON[0], MARATHON[1]]), [mx1, my1] = pl([MARATHON[2], MARATHON[3]]);
  const per = 2 * (mx1 - mx0 + my1 - my0);
  const washPts = [[...TRACK].reverse().map((p) => pl(p).join(",")).join(" "), `${pl([IW * 1.3, 2600])[0]},${pl([0, 2600])[1]}`, `${pl([IW * 1.3, -400])[0]},${pl([0, -400])[1]}`].join(" ");
  const [cx, cy] = project(CUDJOE), [mcx] = project([(MARATHON[0] + MARATHON[2]) / 2, 0]), [, mby] = project([0, MARATHON[3]]);
  const eyeR = 16 + 3 * Math.sin(f / 5);
  const tipP = pl(tip);
  return (
    <AbsoluteFill style={{ background: "#0d2a2c", overflow: "hidden", perspective: P }}>
      <div style={{ position: "absolute", left: (width - PW) / 2, top: (height - PH) / 2, width: PW, height: PH, transform: `rotateX(${tilt}deg)`, transformOrigin: "50% 50%", background: "#3f8f86" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: imgLeft, top: imgTop, width: IW * base, height: IH * base }} />
        {/* the image's own edges fade into its sea colour */}
        <div style={{ position: "absolute", left: imgLeft, top: imgTop, width: IW * base, height: IH * base, boxShadow: `0 0 ${120 * base}px ${80 * base}px #3f8f86 inset` }} />
        <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
          <defs><linearGradient id="nd16wash" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={RED} stopOpacity={0.34} /><stop offset="0.55" stopColor={RED} stopOpacity={0.16} /><stop offset="1" stopColor={RED} stopOpacity={0} /></linearGradient>
            <clipPath id="nd16clip"><rect x={pl([489, 0])[0]} y={0} width={(pl([IW, 0])[0] - pl([489, 0])[0] + 900) * wash} height={PH} /></clipPath></defs>
          {wash > 0 && <polygon points={washPts} fill="url(#nd16wash)" clipPath="url(#nd16clip)" />}
          <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={13} pathLength={1} strokeDasharray={`${draw} 1`} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${draw} 1`} strokeLinecap="round" strokeLinejoin="round" />
          {phase === "landfall" && draw < 0.999 && <g><circle cx={tipP[0]} cy={tipP[1]} r={eyeR} fill="none" stroke="#fff" strokeWidth={5} /><circle cx={tipP[0]} cy={tipP[1]} r={eyeR + 14} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={3} /></g>}
          {land > 0 && (() => { const [x, y] = pl(CUDJOE); return <g opacity={phase === "east" ? 1 : land}><circle cx={x} cy={y} r={13 * (phase === "east" ? 1 : land)} fill={RED} stroke="#fff" strokeWidth={4} /></g>; })()}
          {box > 0 && <rect x={mx0} y={my0} width={mx1 - mx0} height={my1 - my0} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={per} strokeDashoffset={per * (1 - box)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />}
        </svg>
      </div>
      {/* tilt-shift: soft focus bands top and bottom (also hides the NAIP strip seams far from the subject) */}
      <AbsoluteFill style={{ backdropFilter: "blur(7px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 72%, #000 100%)", maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 72%, #000 100%)" }} />
      {/* depth haze toward the horizon */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,20,22,.55) 0%, rgba(8,20,22,0) 34%, rgba(0,0,0,0) 80%, rgba(0,0,0,.35) 100%)" }} />
      {phase === "landfall" && <RedLabel text="CUDJOE KEY" at={cudjoeAt + 4} x={cx / width} y={Math.min(0.9, (cy + 70) / height)} size={40} />}
      {phase === "landfall" && <RedLabel text="SEPTEMBER 10, 2017" at={dateAt} x={0.5} y={0.12} size={40} />}
      {phase === "east" && <RedLabel text="MARATHON" at={boxAt + 10} x={mcx / width} y={Math.min(0.9, (mby + 60) / height)} size={40} />}
    </AbsoluteFill>
  );
};
