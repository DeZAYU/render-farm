// TP14 LadderReach: a Blender model of the stalled tower swing (seats ~42 m up) and an aerial ladder platform lifting its basket
// to them; over it a height ruler tracked to the 3-D scene (marks exported per Blender frame, TP14_ruler.ts), the 40-50 m band the
// reports gave is lit red. `from` / `rate` pick which part of the render plays.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { RULER } from "./TP14_ruler";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

export const LadderReach: React.FC<{ src: string; from: number; rate: number; rulerAt?: number; bandAt?: number; bandLabel?: string; dx?: number }> = ({ src, from, rate, rulerAt = -1, bandAt = -1, bandLabel = "40-50 M", dx = -0.075 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const bf = Math.min(RULER.length - 1, Math.max(0, Math.round(from * 30 + f * rate)));
  const m = RULER[bf].map(([x, y]) => [(x + dx) * width, y * height]);
  const g = rulerAt >= 0 ? out(interpolate(f, [rulerAt, rulerAt + 18], [0, 1], cl)) : 0;
  const gb = bandAt >= 0 ? out(interpolate(f, [bandAt, bandAt + 12], [0, 1], cl)) : 0;
  const [x0, y0] = m[0], [x5, y5] = m[5];
  const yTop = y0 + (y5 - y0) * g, xTop = x0 + (x5 - x0) * g;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {g > 0 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
          {gb > 0 && <polygon points={`${m[4][0] - 34},${m[4][1]} ${m[4][0] + 34},${m[4][1]} ${m[5][0] + 34},${m[5][1]} ${m[5][0] - 34},${m[5][1]}`} fill="rgba(227,20,27,.35)" stroke={RED} strokeWidth={4} opacity={gb} />}
          <line x1={x0} y1={y0} x2={xTop} y2={yTop} stroke="rgba(0,0,0,.45)" strokeWidth={10} />
          <line x1={x0} y1={y0} x2={xTop} y2={yTop} stroke="#fff" strokeWidth={5} />
          {m.slice(0, 6).map(([x, y], i) => (y0 - y) <= (y0 - yTop) + 1 && (
            <g key={i}>
              <line x1={x - 22} y1={y} x2={x + 22} y2={y} stroke="#fff" strokeWidth={5} />
              {i > 0 && <text x={x - 34} y={y + 11} fill="#fff" fontFamily="ArchivoBlk" fontWeight={900} fontSize={32} textAnchor="end" style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.55)", strokeWidth: 6 }}>{i * 10} M</text>}
            </g>
          ))}
        </svg>
      )}
      {bandAt >= 0 && <RedLabel text={bandLabel} at={bandAt + 6} x={(m[4][0] - 190) / width} y={((m[4][1] + m[5][1]) / 2) / height} size={40} />}
    </AbsoluteFill>
  );
};
