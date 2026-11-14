// TP18 AshToDeck: the burnt deck (Nov 2010, Commons) is re-boarded plank by plank into the rebuilt deck (Sept 2016, Commons). Each
// plank is a strip of the 2016 photo that slides in from the side and settles, front of the deck first, then rows further out
// (strips get thinner towards the horizon, like boards seen in perspective). Year labels on each state.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const AshToDeck: React.FC<{ before: string; after: string; beforePos?: string; afterPos?: string; at: number; every: number; planks: number; horizon?: number; beforeLabel: string; afterLabel: string }> =
  ({ before, after, beforePos = "50% 50%", afterPos = "50% 50%", at, every, planks, horizon = 0.3, beforeLabel, afterLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = 1.04 + 0.05 * io(f / durationInFrames);
  const st = (pos: string): React.CSSProperties => ({ position: "absolute", inset: 0, width, height, objectFit: "cover", objectPosition: pos, transform: `scale(${z})`, transformOrigin: "50% 60%" });
  // plank edges: from the bottom of the frame up to the horizon, spacing shrinking geometrically (perspective)
  const ys: number[] = []; let y = height, h = (height * (1 - horizon)) * 0.16;
  for (let i = 0; i < planks; i++) { ys.push(y); y -= h; h *= 0.86; }
  ys.push(0); // the last "plank" takes the sky / pavilion
  const lastAt = at + planks * every;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(before)} style={{ ...st(beforePos), filter: "saturate(.85)" }} />
      {ys.slice(0, -1).map((yb, i) => {
        const yt = ys[i + 1]; const s = at + i * every; const g = out(interpolate(f, [s, s + 10], [0, 1], cl)); if (g <= 0) return null;
        const dir = i % 2 ? 1 : -1, dx = (1 - g) * width * 0.35 * dir;
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: yt, width, height: yb - yt + 1, overflow: "hidden", transform: `translateX(${dx}px)`, opacity: Math.min(1, g * 1.6) }}>
            <Img src={staticFile(after)} style={{ ...st(afterPos), top: -yt }} />
            {g < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "rgba(255,255,255,.85)", opacity: 1 - g }} />}
          </div>
        );
      })}
      <RedLabel text={beforeLabel} at={4} hold={at - 2} y={0.9} />
      <RedLabel text={afterLabel} at={lastAt + 6} y={0.9} />
    </AbsoluteFill>
  );
};
