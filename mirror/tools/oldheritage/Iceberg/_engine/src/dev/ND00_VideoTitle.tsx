// ND00 VideoTitle: the video's own title card (countdown video, no iceberg). Three lines in the channel's distressed serif over a dark,
// slowly pushed frame of the video's footage; the key word set large; lines settle in one after another from a soft blur, then the
// whole card eases to black.
import React from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
let p: Promise<void> | null = null;

export const VideoTitle: React.FC<{ bg: string; lines: { t: string; size: number; at: number }[]; fadeAt: number }> = ({ bg, lines, fadeAt }) => {
  const [h] = React.useState(() => delayRender("elite"));
  React.useEffect(() => {
    if (!p) p = new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load().then((f) => { document.fonts.add(f); });
    p.then(() => continueRender(h));
  }, [h]);
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const z = 1.05 + 0.08 * io(f / durationInFrames);
  const fade = interpolate(f, [fadeAt, durationInFrames], [1, 0], cl);
  const tot = lines.reduce((a, l) => a + l.size * 1.12, 0); let y = 540 - tot / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fade }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "brightness(0.36) contrast(1.1) saturate(0.55) blur(3px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,.75) 100%)" }} />
      {lines.map((l, i) => {
        const t = out(interpolate(f, [l.at, l.at + 20], [0, 1], cl)); const top = y; y += l.size * 1.12;
        return <div key={i} style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: "Elite", fontSize: l.size, lineHeight: 1.1, letterSpacing: "0.05em", color: "#F2F2F0",
          opacity: t, filter: `blur(${(1 - t) * 8}px)`, transform: `translateY(${(1 - t) * 14}px)`, textShadow: "0 0 22px rgba(255,255,255,.22), 0 2px 10px rgba(0,0,0,.8)" }}>{l.t}</div>;
      })}
    </AbsoluteFill>
  );
};
