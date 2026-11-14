// AM11 LineTaut: a real photo of the Columbia at her Frontierland landing (bow, figurehead, the dock with its MARK TWAIN | COLUMBIA sign and
// the boarding queue behind the rail). The camera eases in to the bow; a white line is drawn from the dock's mooring post round the bow
// cleat (a small white box marks the cleat), hanging slack; the camera drifts along the hull (the ship still moving), the line straightens and
// trembles under load; on the tear the box rips off the bow along the line toward the dock, the line whips slack, a short jolt, and the
// picture dims. Mechanism only, nothing graphic, no text.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type LtCam = { at: number; cx: number; cy: number; w: number };
const camAt = (f: number, keys: LtCam[]) => {
  let c = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { at: f, cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, w: a.w + (b.w - a.w) * u };
  }
  return c;
};

export const LineTaut: React.FC<{ src: string; iw: number; ih: number; post: [number, number]; cleat: [number, number]; cam: LtCam[];
  drawAt: number; boxAt: number; creep: [number, number]; tautAt: [number, number]; snapAt: number; dimAt: number }> = ({ src, iw, ih, post, cleat, cam, drawAt, boxAt, creep, tautAt, snapAt, dimAt }) => {
  const f = useCurrentFrame();
  const c = camAt(f, cam);
  const k = 1920 / c.w;
  // "still moving": the camera drifts along the hull (image px)
  const cr = io(interpolate(f, creep, [0, 1], cl)) * 30;
  const sh = f >= snapAt && f < snapAt + 14 ? Math.pow(1 - (f - snapAt) / 14, 2) : 0;
  const ox = Math.sin(f * 3.3) * 14 * sh, oy = Math.cos(f * 2.6) * 9 * sh;
  const draw = out(interpolate(f, [drawAt, drawAt + 22], [0, 1], cl));
  const taut = io(interpolate(f, tautAt, [0, 1], cl));
  const pst: [number, number] = [post[0], post[1]];
  const cl0: [number, number] = [cleat[0], cleat[1]];
  const dir = [pst[0] - cl0[0], pst[1] - cl0[1]]; const L = Math.hypot(dir[0], dir[1]); const ud = [dir[0] / L, dir[1] / L];
  const s = Math.max(0, f - snapAt);
  const fly = s * 26 + s * s * 4;
  const end: [number, number] = [cl0[0] + ud[0] * fly, cl0[1] + ud[1] * fly - (s > 0 ? Math.min(60, s * 5) : 0)];
  const trem = f > tautAt[1] && f < snapAt ? Math.sin(f * 2.1) * 2.2 + Math.sin(f * 5.3) * 1.2 : 0;
  const whip = s > 0 ? Math.sin(Math.min(1, s / 10) * Math.PI) * 90 * Math.exp(-s / 14) + Math.min(1, s / 18) * 150 : 0;
  const sag = 120 * (1 - taut) + trem + whip;
  const mx = (pst[0] + end[0]) / 2, my = (pst[1] + end[1]) / 2 + sag;
  const ropeO = s > 0 ? interpolate(s, [10, 26], [1, 0], cl) : 1;
  const boxO = interpolate(f, [boxAt, boxAt + 8], [0, 1], cl) * (s > 0 ? interpolate(s, [4, 12], [1, 0], cl) : 1);
  const bs = 46 * (1.5 - 0.5 * out(interpolate(f, [boxAt, boxAt + 12], [0, 1], cl)));
  const dim = interpolate(f, [dimAt, dimAt + 30], [1, 0.42], { ...cl, easing: io });
  const P = `M ${pst[0]} ${pst[1]} Q ${mx} ${my} ${end[0]} ${end[1]}`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - (c.cx + cr) * k + ox, top: 540 - c.cy * k + oy, width: iw * k, height: ih * k, filter: `brightness(${dim}) saturate(${0.75 + 0.25 * dim})` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }} />
        <svg viewBox={`0 0 ${iw} ${ih}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          <path d={P} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={13 / k} pathLength={1} strokeDasharray={`${draw} 1`} opacity={ropeO} strokeLinecap="round" />
          <path d={P} fill="none" stroke="#F4F4F2" strokeWidth={5.5 / k} pathLength={1} strokeDasharray={`${draw} 1`} opacity={ropeO} strokeLinecap="round" />
          {boxO > 0 && <rect x={end[0] - bs / 2} y={end[1] - bs / 2} width={bs} height={bs} fill="none" stroke="#F4F4F2" strokeWidth={5 / k} opacity={boxO}
            transform={`rotate(${s * 24} ${end[0]} ${end[1]})`} />}
          <circle cx={pst[0]} cy={pst[1]} r={11 / k} fill="#F4F4F2" opacity={draw} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
