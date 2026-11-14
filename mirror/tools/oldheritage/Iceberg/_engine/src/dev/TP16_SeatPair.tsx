// TP16 SeatPair: the two stranded seats side by side, real footage in two white frames over a dim copy of the London ride: left the
// open chain-swing seat from Aachen (2022, the previous case, a vertical phone clip), right one of the Starflyer's closed capsules
// (London, 2016). Each frame gets its place/year label. At `closedAt` a white cage outline is drawn round the capsule frame (it is
// closed); at `winsAt` the open seat steps back (dims, shrinks a touch) and the capsule comes forward; at `muchAt` the two even out again
// ("though not by much").
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const SeatPair: React.FC<{ open: string; openFrom: number; openPos?: string; closed: string; closedFrom: number; closedPos?: string; closedZoom?: number; bg: string; bgFrom: number; closedAt: number; winsAt: number; muchAt: number }> =
  ({ open, openFrom, openPos = "50% 40%", closed, closedFrom, closedPos = "50% 50%", closedZoom = 2.2, bg, bgFrom, closedAt, winsAt, muchAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const H = 760, W = 560, gap = 90, top = (height - H) / 2 - 40;
  const inL = out(interpolate(f, [0, 14], [0, 1], cl)), inR = out(interpolate(f, [6, 20], [0, 1], cl));
  const wins = io(interpolate(f, [winsAt, winsAt + 16], [0, 1], cl)) * (1 - 0.6 * io(interpolate(f, [muchAt, muchAt + 18], [0, 1], cl)));
  const cage = out(interpolate(f, [closedAt, closedAt + 18], [0, 1], cl));
  const d = io(f / durationInFrames);
  const frame = (side: -1 | 1, k: number, sc: number, dim: number, child: React.ReactNode) => (
    <div style={{ position: "absolute", left: width / 2 + side * (gap / 2 + W / 2) - W / 2, top, width: W, height: H, border: "6px solid #fff", overflow: "hidden", background: "#000",
      boxShadow: "0 24px 70px rgba(0,0,0,.7)", opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${sc})`, filter: `brightness(${1 - dim})` }}>{child}</div>
  );
  const P = 2 * (W + H) + 40;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(10px) brightness(.45) saturate(.8)" }} />
      {frame(-1, inL, 1 - 0.05 * wins, 0.38 * wins,
        <OffthreadVideo src={staticFile(open)} startFrom={Math.round(openFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: openPos, transform: `scale(${1.08 + 0.06 * d})` }} />)}
      {frame(1, inR, 1 + 0.04 * wins, 0,
        <OffthreadVideo src={staticFile(closed)} startFrom={Math.round(closedFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: closedPos, transform: `scale(${closedZoom + 0.12 * d})`, transformOrigin: closedPos }} />)}
      {/* the closed capsule: a second white outline drawn round its frame, like the cage round the riders */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {cage > 0 && (() => { const s = 1 + 0.04 * wins, x = width / 2 + gap / 2 + W / 2, y = top + H / 2, w = W * s + 36, h = H * s + 36;
          return <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray={`${P * cage} ${P}`} opacity={0.9} />; })()}
      </svg>
      <RedLabel text="AACHEN, 2022" at={10} x={(width / 2 - gap / 2 - W / 2) / width} y={(top + H + 52) / height} size={40} />
      <RedLabel text="LONDON, 2016" at={16} x={(width / 2 + gap / 2 + W / 2) / width} y={(top + H + 52) / height} size={40} />
    </AbsoluteFill>
  );
};
