// TP05 RescueBar — the evening as a measured bar over the darkened footage: a clock-time axis 4:30 PM -> 8:30 PM, a white fill grows from
// the stop to 7 PM ("most were down by seven"), a red tick lands at 8:15 ("the last"); under it the 21 people on the platform as 21
// white blocks, 11 of which turn red on "eleven of the twenty-one were children". Only the reported facts: no invented per-person times.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const RescueBar: React.FC<{ bg: string; bgFrom: number; tMost: number; tLast: number; tCount: number; tKids: number }> = ({ bg, bgFrom, tMost, tLast, tCount, tKids }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const h0 = 16.5, h1 = 20.5, L = 260, R = width - 260, Y = 430;
  const X = (h: number) => L + (R - L) * (h - h0) / (h1 - h0);
  const o = interpolate(f, [0, 8], [0, 1], cl), z = 1 + 0.035 * io(f / durationInFrames);
  const fill = io(interpolate(f, [tMost - 10, tMost + 26], [0, 1], cl));
  const last = out(interpolate(f, [tLast, tLast + 12], [0, 1], cl));
  const hrs = [16.5, 17, 18, 19, 20, 20.5];
  const lab = (h: number) => { const hh = Math.floor(h), mm = Math.round((h - hh) * 60); return `${hh - 12}:${String(mm).padStart(2, "0")} PM`; };
  const bw = 58, bg2 = 14, bx0 = width / 2 - (21 * bw + 20 * bg2) / 2, by = 690;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(10px) brightness(.32) saturate(.7)" }} />
      <AbsoluteFill style={{ opacity: o, transform: `scale(${z})` }}>
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 8px rgba(0,0,0,.8))" }}>
          <rect x={X(16.5)} y={Y - 22} width={X(20.5) - X(16.5)} height={44} fill="none" stroke="#fff" strokeWidth={4} />
          <rect x={X(16.5)} y={Y - 22} width={(X(19) - X(16.5)) * fill} height={44} fill="rgba(255,255,255,.88)" />
          {hrs.map((h) => <g key={h}><line x1={X(h)} y1={Y + 26} x2={X(h)} y2={Y + 44} stroke="#fff" strokeWidth={3} />
            <text x={X(h)} y={Y + 82} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk, Archivo" fontWeight={900} fontSize={28} textAnchor="middle">{lab(h)}</text></g>)}
          {last > 0 && <g opacity={last}><line x1={X(20.25)} y1={Y - 60 * last} x2={X(20.25)} y2={Y + 22} stroke={RED} strokeWidth={8} />
            <circle cx={X(20.25)} cy={Y - 60 * last} r={10} fill={RED} stroke="#fff" strokeWidth={3} /></g>}
          {Array.from({ length: 21 }, (_, i) => {
            const k = out(interpolate(f, [tCount + i * 1.5, tCount + i * 1.5 + 8], [0, 1], cl)); if (k <= 0) return null;
            const kid = i < 11 ? out(interpolate(f, [tKids + i * 2, tKids + i * 2 + 8], [0, 1], cl)) : 0;
            return <rect key={i} x={bx0 + i * (bw + bg2)} y={by + (1 - k) * 20} width={bw} height={bw * 1.5} opacity={k}
              fill={kid > 0.5 ? RED : "rgba(255,255,255,.12)"} stroke={kid > 0.5 ? "#fff" : "#fff"} strokeWidth={4} />;
          })}
        </svg>
        <RedLabel text="7:00 PM" at={tMost + 22} hold={tLast - tMost - 16} x={X(19) / width} y={(Y - 80) / height} size={38} />
        <RedLabel text="8:15 PM" at={tLast + 8} x={Math.min(0.84, X(20.25) / width)} y={(Y - 120) / height} size={38} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
