// TP05 HeliTriptych — three helicopter moments from the filmer's own clip, cut into three tall white-framed panels that slide in one by
// one on the three names (police / army / air rescue) over a blurred, darkened copy; each panel plays at half speed (rotor detail).
// No labels on the panels: the clip does not let us say which aircraft is which.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const HeliTriptych: React.FC<{ src: string; panels: { from: number; at: number; pos: string; rate?: number }[]; bgFrom: number }> = ({ src, panels, bgFrom }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const W = 520, H = 800, gap = 44, x0 = (width - (3 * W + 2 * gap)) / 2, y0 = (height - H) / 2;
  const cam = 1.0 + 0.04 * io(f / durationInFrames);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.5) saturate(.85)" }} />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {panels.map((p, i) => {
          const k = out(interpolate(f, [p.at, p.at + 16], [0, 1], cl)); if (k <= 0) return null;
          // the panel's own clock starts when it arrives (Sequence-free: startFrom shifted back by its arrival, played at `rate`)
          const rate = p.rate ?? 0.5;
          return (
            <div key={i} style={{ position: "absolute", left: x0 + i * (W + gap), top: y0 + (1 - k) * 90, width: W, height: H, opacity: k, border: "6px solid #fff",
              boxShadow: "0 22px 60px rgba(0,0,0,.6)", overflow: "hidden", background: "#000" }}>
              <PanelVid src={src} from={p.from} at={p.at} rate={rate} pos={p.pos} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PanelVid: React.FC<{ src: string; from: number; at: number; rate: number; pos: string }> = ({ src, from, at, rate, pos }) => (
  <Sequence from={at} layout="none">
    <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: "scale(1.15)" }} />
  </Sequence>
);
