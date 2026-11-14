// ND07 AlertDots — the grand jury's alert finding as a field of people-marks over a dark, slow copy of the drive through the burning
// town: 52 rings (one per thousand people who evacuated) settle in on a loose 13 x 4 grid, then only 7 of them light white (reached by
// an alert) while the other 45 turn red-edged and fall back. No numbers on screen (the VO says them); the source is named.
// Built for "only about 7,000 of the 52,000 people who evacuated received an alert".
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

export const AlertDots: React.FC<{ bg: string; bgFrom: number; total?: number; lit?: number; litAt: number; label: string }> = ({ bg, bgFrom, total = 52, lit = 7, litAt, label }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const cols = 13, rows = Math.ceil(total / cols), gap = 104, r = 30;
  const x0 = W / 2 - ((cols - 1) * gap) / 2, y0 = H * 0.44 - ((rows - 1) * gap) / 2;
  // the lit ones are spread through the field, not a block
  const litSet = new Set([3, 11, 17, 24, 30, 38, 47].slice(0, lit));
  const fade = interpolate(f, [0, 10], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fade }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted playbackRate={0.5}
        style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(9px) brightness(.32) saturate(.7)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: total }, (_, i) => {
          const c = i % cols, rw = Math.floor(i / cols);
          const at = 4 + c * 1.2 + rw * 2.5; const a = out(interpolate(f, [at, at + 12], [0, 1], cl));
          const isLit = litSet.has(i);
          const L = out(interpolate(f, [litAt + (isLit ? [...litSet].indexOf(i) * 2 : 8), litAt + 14 + (isLit ? [...litSet].indexOf(i) * 2 : 8)], [0, 1], cl));
          const x = x0 + c * gap, y = y0 + rw * gap + (1 - a) * 24;
          return <g key={i} opacity={a * (isLit ? 1 : 1 - 0.45 * L)}>
            <circle cx={x} cy={y} r={r} fill={isLit ? `rgba(255,255,255,${0.95 * L})` : "none"} stroke={isLit ? "#fff" : L > 0.5 ? RED : "rgba(255,255,255,.85)"} strokeWidth={isLit ? 5 : 4} />
            {isLit && L > 0 && <circle cx={x} cy={y} r={r + 16 * L} fill="none" stroke="rgba(255,255,255,.5)" strokeWidth={2} opacity={1 - L * 0.6} />}
          </g>;
        })}
      </svg>
      <RedLabel text={label} at={12} y={0.86} size={42} />
    </AbsoluteFill>
  );
};
