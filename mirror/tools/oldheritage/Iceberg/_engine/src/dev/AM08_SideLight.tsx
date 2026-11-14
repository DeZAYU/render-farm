// AM08 SideLight: the bystander's opening frame held still (both platforms parked near the top of the red tower, before anything
// moves), shown whole over its bright blurred copy exactly as the raw will play. On "The left platform drops first" the frame sinks
// into a soft shadow except a pool of light on the LEFT platform; on "Now watch the right-hand one" the light glides across the
// tower to the RIGHT platform (the one with the FREE FALL board); in the last frames the shadow lifts so the freeze hands over
// seamlessly to the raw, which starts on this same frame at the same framing. Wide only (riders are tiny, children among them):
// no zoom, no text. Props: `still` = the frame (graded jpg of the 4:3 clip), `spots` = light keys (image 0..1 coords, r = share of width).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);
type Spot = { at: number; x: number; y: number; r: number };

export const SideLight: React.FC<{ still: string; iw: number; ih: number; spots: Spot[]; inAt?: number; liftAt?: number }> = ({ still, iw, ih, spots, inAt = 0, liftAt }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const lift = liftAt ?? dur - 16;
  const k = Math.min(1920 / iw, 1080 / ih), w = iw * k, h = ih * k, ox = (1920 - w) / 2, oy = (1080 - h) / 2;
  let s = spots[0];
  for (let i = 1; i < spots.length; i++) {
    const a = spots[i - 1], b = spots[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    s = { at: f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, r: a.r + (b.r - a.r) * u };
  }
  const shade = io(interpolate(f, [inAt, inAt + 18], [0, 1], cl)) * (1 - io(interpolate(f, [lift, dur - 1], [0, 1], cl)));
  const sx = ox + s.x * w, sy = oy + s.y * h, rr = s.r * w;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(0.86) saturate(0.92)", transform: "scale(1.25)" }}>
        <Img src={staticFile(still)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Img src={staticFile(still)} style={{ position: "absolute", left: ox, top: oy, width: w, height: h, filter: "drop-shadow(0 0 36px rgba(0,0,0,.55))" }} />
      <AbsoluteFill style={{ opacity: shade, background: `radial-gradient(circle ${rr.toFixed(1)}px at ${sx.toFixed(1)}px ${sy.toFixed(1)}px, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)` }} />
    </AbsoluteFill>
  );
};
