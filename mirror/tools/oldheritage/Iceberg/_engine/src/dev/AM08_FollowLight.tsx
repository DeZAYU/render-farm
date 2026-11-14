// AM08 FollowLight: the deliberate replay. The last seconds of the bystander's clip at 0.4x (motion-interpolated), kept WIDE and
// whole over its bright blurred copy (no zoom: riders are tiny and children were among them). A soft pool of light rides down WITH the
// right-hand platform as it is lowered toward the base, the rest of the frame sinking into shadow, so the eye stays on the platform
// when it drops the last few feet behind the bushes ("The cables had snapped"); then the light holds on the spot where it landed.
// Props: `src` (graded slow file), `from` (s in that file), `track` = light keys (frame, image 0..1 x/y, r = share of width).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);
type Key = { at: number; x: number; y: number; r: number };

export const FollowLight: React.FC<{ src: string; from: number; iw: number; ih: number; track: Key[]; inAt?: number }> = ({ src, from, iw, ih, track, inAt = 6 }) => {
  const f = useCurrentFrame();
  const k = Math.min(1920 / iw, 1080 / ih), w = iw * k, h = ih * k, ox = (1920 - w) / 2, oy = (1080 - h) / 2;
  let s = track[0];
  for (let i = 1; i < track.length; i++) {
    const a = track[i - 1], b = track[i]; if (f <= a.at) break;
    const u = interpolate(f, [a.at, b.at], [0, 1], cl);
    s = { at: f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, r: a.r + (b.r - a.r) * u };
  }
  const shade = io(interpolate(f, [inAt, inAt + 20], [0, 1], cl));
  const sx = ox + s.x * w, sy = oy + s.y * h, rr = s.r * w;
  const v = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(0.86) saturate(0.92)", transform: "scale(1.25)" }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      <div style={{ position: "absolute", left: ox, top: oy, width: w, height: h, filter: "drop-shadow(0 0 36px rgba(0,0,0,.55))" }}>{v({ width: "100%", height: "100%" })}</div>
      <AbsoluteFill style={{ opacity: shade, background: `radial-gradient(circle ${rr.toFixed(1)}px at ${sx.toFixed(1)}px ${sy.toFixed(1)}px, rgba(0,0,0,0) 55%, rgba(0,0,0,.5) 100%)` }} />
    </AbsoluteFill>
  );
};
