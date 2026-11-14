// TP20 RailView: the 192x144 railing clip kept at a size it can hold, in a white-framed 4:3 panel that swings square in 3-D as if the
// camera walks along the promenade; soft dark railing bars pass across the foreground on the lead-in line ("And through the seafront
// railings"), then clear before the clip's own sound. A dark sea-night ground (not a blurred copy), the place as a RedLabel under the panel.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const F_HOLD = 96;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const RailView: React.FC<{ src: string; from?: number; caption: string; captionAt?: number; ph?: number }> = ({ src, from = 0, caption, captionAt = 30, ph = 840 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const d = io(f / durationInFrames);
  const k = out(interpolate(f, [0, 46], [0, 1], cl));
  const PW = ph * 4 / 3, top = (height - ph) / 2 - 26;
  // foreground railing bars: start off the right edge, slide left (parallax, defocused), all gone by ~frame 62
  const bars = [0, 1, 2, 3, 4].map((i) => ({ x: width + 120 + i * 330 - f * (34 + i * 2), w: 58 + (i % 2) * 18 }));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, #1a222b 0%, #0c1015 60%, #050608 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1700 }}>
        <div style={{ position: "absolute", left: (width - PW) / 2, top, width: PW, height: ph, border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.7)", overflow: "hidden",
          transform: `translateX(${(1 - k) * 160}px) rotateY(${(1 - k) * -18}deg)`, opacity: interpolate(f, [0, 8], [0, 1], cl) }}>
          <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.0 + 0.05 * d})` }} />
        </div>
      </div>
      <RedLabel text={caption} at={captionAt} hold={F_HOLD} y={(top + ph + 46) / height} size={38} />
      {bars.map((b, i) => b.x > -b.w - 40 && b.x < width + 40 ? (
        <div key={i} style={{ position: "absolute", left: b.x, top: -40, width: b.w, height: height + 80, background: "linear-gradient(90deg, #06080a, #161b20 45%, #06080a)", filter: "blur(9px)", opacity: 0.92 }} />
      ) : null)}
    </AbsoluteFill>
  );
};
