// TOR21 (Marshalltown) — "Two percent ... by nightfall twenty-two tornadoes ... number twenty-one is Marshalltown".
// Two real records of the same day, one device:
//   OutlookPage  the SPC Day 1 tornado outlook issued that morning (12:59Z, 2 % over eastern Iowa), a white-framed plate tilted in 3-D
//                over its own blurred copy, the camera easing in on the 2 % area while a white bracket draws round it.
//   DayTracks    NASA MODIS Aqua true colour of that afternoon (GIBS, equirectangular), the day's 22 surveyed tornado tracks
//                (NCEI Storm Events, begin/end lat-lon) dropped on it in time order; the Marshalltown track turns red and the camera
//                settles on it.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** the morning outlook as a lit plate in 3-D; bracket = image px box round the 2 % area */
export const OutlookPage: React.FC<{ src: string; iw: number; ih: number; focus: [number, number]; bracket: [number, number, number, number]; bracketAt: number; label?: string; labelAt?: number;
  /** start on another plate (e.g. the morning outlook) and flip over to this one at flipAt (a card turned in 3-D) */ from?: string; flipAt?: number; zEnd?: number }> = ({ src, iw, ih, focus, bracket, bracketAt, label, labelAt = 0, from, flipAt = 0, zEnd = 1.42 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(f / durationInFrames);
  const W = 1180, H = (W * ih) / iw, k = W / iw;
  // camera: start on the whole plate, ease toward the 2 % area
  const z = 1.0 + (zEnd - 1.0) * t;
  const fx = (focus[0] - iw / 2) * k * 0.55 * t, fy = (focus[1] - ih / 2) * k * 0.55 * t;
  const fl = from ? io(interpolate(f, [flipAt, flipAt + 16], [0, 1], cl)) : 1;
  const ry = -16 + 7 * t + (from ? (fl < 0.5 ? fl * 180 : fl * 180 - 180) : 0), rx = 9 - 3 * t;
  const showFrom = !!from && fl < 0.5;
  const g = out(interpolate(f, [bracketAt, bracketAt + 16], [0, 1], cl));
  const [bx0, by0, bx1, by1] = bracket.map((v) => v * k);
  const P = 2 * (bx1 - bx0 + by1 - by0);
  const enter = out(interpolate(f, [0, 14], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(26px) brightness(.38) saturate(.7)", transform: `scale(${1.05 + 0.05 * t})` }} />
      <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2, width: W, height: H,
          transform: `translate3d(${-fx}px, ${-fy}px, 0) scale(${z * (0.96 + 0.04 * enter)}) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: `${focus[0] * k}px ${focus[1] * k}px`,
          border: "6px solid #fff", boxShadow: "0 30px 80px rgba(0,0,0,.65)", background: "#fff", opacity: enter }}>
          <Img src={staticFile(showFrom ? from! : src)} style={{ width: "100%", height: "100%", display: "block", objectFit: "fill", filter: "contrast(1.04)" }} />
          {/* light pool drifting over the plate */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 55% at ${38 + 20 * t}% ${40 + 6 * t}%, rgba(255,250,240,.10) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,.34) 100%)`, mixBlendMode: "multiply" }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: showFrom ? 0 : 1 }}>
            <rect x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.55))" }} />
          </svg>
        </div>
      </AbsoluteFill>
      {label && <RedLabel text={label} at={labelAt} x={0.5} y={0.9} />}
    </AbsoluteFill>
  );
};

type Trk = [number, number, number, number]; // x0 y0 x1 y1 (image px)
/** the day's tracks on the satellite picture of that afternoon. tracks in time order; hi = index of the case's own track */
export const DayTracks: React.FC<{ src: string; iw: number; ih: number; tracks: Trk[][]; hi: number; at: number; every: number; hiAt: number; label: string; labelAt: number; zA?: number; zB?: number; focusA: [number, number]; states?: { name: string; pts: [number, number][] }[]; home?: string }> = ({ src, iw, ih, tracks, hi, at, every, hiAt, label, labelAt, zA = 1.55, zB = 6.2, focusA, states = [], home = "Iowa" }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const base = Math.max(width / iw, height / ih);
  const hiT = tracks[hi]; const hx = (hiT[0][0] + hiT[hiT.length - 1][2]) / 2, hy = (hiT[0][1] + hiT[hiT.length - 1][3]) / 2;
  // camera: a slow push on the whole cluster, then a long eased move onto the case's track (one curve, no stop)
  const m = io(interpolate(f, [hiAt - 6, durationInFrames], [0, 1], cl));
  const z = (zA + 0.12 * Math.min(1, f / Math.max(1, hiAt))) * Math.pow(zB / zA, m);
  const cx = focusA[0] + (hx - focusA[0]) * m, cy = focusA[1] + (hy - focusA[1]) * m;
  const S = base * z;
  const ox = width / 2 - cx * S, oy = height / 2 - cy * S;
  const enter = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * S, height: ih * S, filter: `brightness(${0.78 + 0.1 * enter}) contrast(1.06)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {states.map((st, i) => {
          const d = "M" + st.pts.map(([x, y]) => `${(ox + x * S).toFixed(1)} ${(oy + y * S).toFixed(1)}`).join(" L") + " Z";
          const isHome = st.name === home;
          return <path key={"s" + i} d={d} fill="none" stroke="#fff" strokeOpacity={(isHome ? 0.85 : 0.35) * enter} strokeWidth={isHome ? 3 : 1.5} strokeLinejoin="round" style={isHome ? { filter: "drop-shadow(0 0 4px rgba(0,0,0,.8))" } : undefined} />;
        })}
        {tracks.map((segs, i) => {
          const g = out(interpolate(f, [at + i * every, at + i * every + 7], [0, 1], cl)); if (g <= 0) return null;
          const isHi = i === hi, h = isHi ? out(interpolate(f, [hiAt, hiAt + 14], [0, 1], cl)) : 0;
          const pts = segs.flatMap((s, j) => (j === 0 ? [[s[0], s[1]], [s[2], s[3]]] : [[s[2], s[3]]])).map(([x, y]) => [ox + x * S, oy + y * S]);
          const d = "M" + pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
          const dimOthers = !isHi ? 1 - 0.45 * out(interpolate(f, [hiAt, hiAt + 20], [0, 1], cl)) : 1;
          const r = (4 + 2 * (1 - g)) * (isHi ? 1 + 0.6 * h : 1);
          return (
            <g key={i} opacity={g * dimOthers}>
              <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={9 + 6 * h} strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} fill="none" stroke={isHi && h > 0 ? RED : "#fff"} strokeWidth={4 + 4 * h} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={pts[0][0]} cy={pts[0][1]} r={r} fill={isHi && h > 0 ? RED : "#fff"} stroke="rgba(0,0,0,.6)" strokeWidth={2} />
              {g < 1 && <circle cx={pts[0][0]} cy={pts[0][1]} r={r + 22 * g} fill="none" stroke="#fff" strokeWidth={2} opacity={1 - g} />}
            </g>
          );
        })}
      </svg>
      <RedLabel text={label} at={labelAt} x={0.5} y={0.86} />
    </AbsoluteFill>
  );
};
