// AM01 BurstReplay: the deliberate replay of the moment, under "Then the left cord bursts. Neither man was hurt. One of them said later he
// was in total shock, his hands still stuck up in the air, with no idea what had just happened." Krissy Hurst's clip at half speed
// (motion-interpolated, graded/burst_slow.mp4): the camera starts tight on the left cord as it explodes into fibres, glides with it down
// to the cage as the cage jolts, keeps rolling while the riders sit there, then freezes on the frame where both men still have their hands
// up and pushes slowly into them while the rest of the frame falls into a soft spotlight. One eased camera path, no overshoot; footage only.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);
type Key = { at: number; x: number; y: number; s: number };

/** keys: camera (x, y = point of the picture at the frame centre, 0..1; s = zoom), eased between consecutive keys */
const cam = (f: number, keys: Key[]) => {
  let k = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    k = { at: f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * u) };
  }
  return k;
};

export const BurstReplay: React.FC<{ src: string; from: number; freeze: number; keys: Key[]; spot: [number, number] }> = ({ src, from, freeze, keys, spot }) => {
  const f = useCurrentFrame();
  const c = cam(f, keys);
  const W = 1920 * c.s, H = 1080 * c.s;
  const left = Math.min(0, Math.max(1920 - W, 960 - c.x * W)), top = Math.min(0, Math.max(1080 - H, 540 - c.y * H));
  const sp = io(interpolate(f, [freeze, freeze + 20], [0, 1], cl));
  const vid = <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%" }} />;
  // spotlight centre in screen space
  const sx = left + spot[0] * W, sy = top + spot[1] * H;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top, width: W, height: H, willChange: "transform" }}>
        {f < freeze ? vid : <Freeze frame={freeze}>{vid}</Freeze>}
      </div>
      <AbsoluteFill style={{ opacity: sp, background: `radial-gradient(ellipse 520px 380px at ${sx}px ${sy}px, rgba(0,0,0,0) 40%, rgba(0,0,0,.62) 100%)` }} />
    </AbsoluteFill>
  );
};
