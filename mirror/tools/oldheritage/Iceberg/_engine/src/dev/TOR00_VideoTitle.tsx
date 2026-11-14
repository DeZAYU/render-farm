// TOR00 | VideoTitle: the video's title card at the end of the intro, in the channel's distressed serif (Elite) over the video's own
// footage (the Chapman wedge, darkened, slow push). The number sits large on its own line; the lines resolve one after another out of
// a soft blur (no glitch, no flash), a thin white rule draws between title and subtitle. Countdown video: no iceberg.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const VideoTitle: React.FC<{ bg: string; bgFrom: number; lines: { text: string; size: number; at: number }[]; ruleAt: number; ruleAfter: number }> = ({ bg, bgFrom, lines, ruleAt, ruleAfter }) => {
  const f = useCurrentFrame(); const { width, durationInFrames } = useVideoConfig();
  const z = 1.08 + 0.08 * io(f / durationInFrames);
  const bgIn = interpolate(f, [0, 12], [0, 1], cl);
  const end = interpolate(f, [durationInFrames - 14, durationInFrames - 1], [1, 0], cl);
  const r = out(interpolate(f, [ruleAt, ruleAt + 18], [0, 1], cl));
  let y = 0; const tops = lines.map((l, i) => { const t = y; y += l.size * 1.12 + (i === ruleAfter ? 46 : 0); return t; });
  const total = y, top0 = 540 - total / 2;
  return (
    <AbsoluteFill style={{ background: "#040404", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: bgIn * end }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "brightness(.36) contrast(1.12) saturate(.55) blur(1.5px)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,.75) 100%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: end }}>
        {lines.map((l, i) => {
          const t = out(interpolate(f, [l.at, l.at + 20], [0, 1], cl));
          return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: top0 + tops[i], textAlign: "center", fontFamily: "Elite", fontSize: l.size, lineHeight: 1.12, letterSpacing: "0.04em", color: "#F2F2F0",
            opacity: t, filter: `blur(${(1 - t) * 7}px)`, transform: `translateY(${(1 - t) * 12}px)`, textShadow: "0 0 18px rgba(255,255,255,.22), 0 2px 10px rgba(0,0,0,.8)" }}>{l.text}</div>;
        })}
        <div style={{ position: "absolute", left: width / 2 - 360 * r, width: 720 * r, top: top0 + tops[ruleAfter] + lines[ruleAfter].size * 1.12 + 18, height: 4, background: "#fff", opacity: 0.9, boxShadow: "0 0 10px rgba(0,0,0,.6)" }} />
      </AbsoluteFill>
      <RedLabel text="" at={99999} />{/* loads the channel fonts */}
    </AbsoluteFill>
  );
};
