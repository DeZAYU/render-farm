// TP09 (Berlin Stargate): the 45 minutes upside down, one block per minute, over the crowd footage (darkened). Part 1 fills the first 20
// in white as "before the emergency services even arrived" is spoken; part 2 (later in the case) shows those 20 already filled and adds the
// next 25 in red for "another twenty-five minutes to restart it and lower them". Labels are the spoken figures.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);

export const MinuteBlocks: React.FC<{ part: 1 | 2; bg: string; bgFrom: number; at?: number; per?: number; label: string }> = ({ part, bg, bgFrom, at = 6, per = 2, label }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 10], [0, 1], cl));
  const cols = 15, size = 64, gap = 14, rows = 3;
  const W = cols * size + (cols - 1) * gap, H = rows * size + (rows - 1) * gap;
  const x0 = (width - W) / 2, y0 = (height - H) / 2 - 20;
  const z = 1.0 + 0.03 * io(f / durationInFrames);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(9px) brightness(.32) saturate(.6)", transform: `scale(${1.05 + 0.03 * z})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: k, transform: `scale(${z})`, transformOrigin: "50% 50%", filter: "drop-shadow(0 3px 8px rgba(0,0,0,.6))" }}>
        {Array.from({ length: 45 }, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const x = x0 + c * (size + gap), y = y0 + r * (size + gap);
          const first = i < 20;
          // part 1: blocks 0-19 fill one by one; part 2: 0-19 already full, 20-44 fill red one by one
          const t = part === 1 ? (first ? out(interpolate(f, [at + i * per, at + i * per + 8], [0, 1], cl)) : 0)
                               : (first ? 1 : out(interpolate(f, [at + (i - 20) * per, at + (i - 20) * per + 8], [0, 1], cl)));
          const fill = first ? "#fff" : RED;
          return (
            <g key={i}>
              <rect x={x} y={y} width={size} height={size} fill="none" stroke="rgba(255,255,255,.55)" strokeWidth={3} />
              {t > 0 && <rect x={x + (size / 2) * (1 - t)} y={y + (size / 2) * (1 - t)} width={size * t} height={size * t} fill={fill} opacity={part === 2 && first ? 0.55 : 0.95} />}
            </g>
          );
        })}
      </svg>
      <RedLabel text={label} at={part === 1 ? at + 20 * per : at + 25 * per} x={0.5} y={(y0 + H + 90) / height} size={44} />
    </AbsoluteFill>
  );
};
