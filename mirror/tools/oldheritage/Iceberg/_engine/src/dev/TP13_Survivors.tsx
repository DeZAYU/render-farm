// TP13 Survivors: the morning-after drone plays, freezes, and everything but the rides that came through is dimmed; each survivor
// gets white corner brackets drawn on and its name on the red label. Boxes are in 1920x1080 frame px of the (cover-fitted) clip.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type SurvBox = { box: [number, number, number, number]; label: string; at: number; ly?: number };
export const Survivors: React.FC<{ src: string; from: number; freezeAt: number; boxes: SurvBox[]; focus?: [number, number] }> = ({ src, from, freezeAt, boxes, focus = [960, 540] }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = 1.0 + 0.03 * io(f / durationInFrames);
  const dim = io(interpolate(f, [freezeAt, freezeAt + 12], [0, 1], cl));
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  const T = (x: number, y: number) => [focus[0] + (x - focus[0]) * z, focus[1] + (y - focus[1]) * z];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${focus[0]}px ${focus[1]}px` }}>
        <Sequence durationInFrames={freezeAt} layout="none"><OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} /></Sequence>
        <Sequence from={freezeAt} layout="none"><Freeze frame={Math.round(from * 30) + freezeAt}><OffthreadVideo src={staticFile(src)} muted style={st} /></Freeze></Sequence>
      </AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <mask id="tp13surv">
            <rect width={width} height={height} fill="#fff" />
            {boxes.map((b, i) => { const g = out(interpolate(f, [b.at, b.at + 12], [0, 1], cl)); const [x0, y0] = T(b.box[0], b.box[1]), [x1, y1] = T(b.box[2], b.box[3]);
              return <rect key={i} x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#000" opacity={g} />; })}
          </mask>
        </defs>
        <rect width={width} height={height} fill="rgba(4,6,8,.62)" opacity={dim} mask="url(#tp13surv)" />
        {boxes.map((b, i) => {
          const g = out(interpolate(f, [b.at, b.at + 14], [0, 1], cl)); if (g <= 0) return null;
          const [x0, y0] = T(b.box[0], b.box[1]), [x1, y1] = T(b.box[2], b.box[3]); const L = Math.min(x1 - x0, y1 - y0) * 0.22 * g, p = (1 - g) * 18;
          const c = (x: number, y: number, dx: number, dy: number) => `M ${x + dx * L} ${y} L ${x} ${y} L ${x} ${y + dy * L}`;
          const d = [c(x0 - p, y0 - p, 1, 1), c(x1 + p, y0 - p, -1, 1), c(x0 - p, y1 + p, 1, -1), c(x1 + p, y1 + p, -1, -1)].join(" ");
          return <g key={i}><path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={11} /><path d={d} fill="none" stroke="#fff" strokeWidth={6} /></g>;
        })}
      </svg>
      {boxes.map((b, i) => { const [x0, , x1, y1] = [...T(b.box[0], b.box[1]), ...T(b.box[2], b.box[3])];
        return <RedLabel key={i} text={b.label} at={b.at + 8} x={(x0 + x1) / 2 / width} y={b.ly ?? Math.min(0.93, (y1 + 44) / height)} size={38} />; })}
    </AbsoluteFill>
  );
};
