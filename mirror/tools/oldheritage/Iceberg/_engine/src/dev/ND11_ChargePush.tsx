// ND11 ChargePush: avalanche control, from the patroller to the blast. Photo 1 (a patroller on a ridge paying out a charge on a rope,
// Commons "Déclenchement d'avalanche", CC BY-SA 3.0): slow push, a white bracket closes on the charge. On the cue the camera pushes
// through the bracket into photo 2 (a control blast on an open slope, Commons "Avalanche Blasting.jpg", public domain), which settles.
// px = photo pixels. Built for "Ski patrols look after those slopes, often using explosives to bring down unstable snow before anyone skis it."
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Ph = { src: string; iw: number; ih: number };
const place = (p: Ph, w: number, h: number, z: number, fx: number, fy: number) => {
  const base = Math.max(w / p.iw, h / p.ih) * z;
  const ox = Math.min(0, Math.max(w - p.iw * base, w / 2 - fx * base)), oy = Math.min(0, Math.max(h - p.ih * base, h / 2 - fy * base));
  return { base, ox, oy };
};

export const ND11_ChargePush: React.FC<{ a: Ph; b: Ph; box: [number, number, number, number]; bFocus: [number, number]; boxAt: number; pushAt: number }> = ({ a, b, box, bFocus, boxAt, pushAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const push = io(interpolate(f, [pushAt, pushAt + 16], [0, 1], cl));
  const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
  const za = 1.0 + 0.12 * io(interpolate(f, [0, pushAt], [0, 1], cl)) + 5 * push * push;
  const A = place(a, width, height, za, cx, cy);
  const bx = A.ox + box[0] * A.base, by = A.oy + box[1] * A.base, bw = (box[2] - box[0]) * A.base, bh = (box[3] - box[1]) * A.base;
  const g = out(interpolate(f, [boxAt, boxAt + 12], [0, 1], cl));
  const zb = 1.25 - 0.17 * out(interpolate(f, [pushAt + 6, durationInFrames], [0, 1], cl));
  const B = place(b, width, height, zb, bFocus[0], bFocus[1]);
  const ob = interpolate(f, [pushAt + 6, pushAt + 14], [0, 1], cl);
  const blur = 10 * Math.sin(Math.PI * interpolate(f, [pushAt, pushAt + 16], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: `blur(${blur.toFixed(2)}px)` }}>
        <Img src={staticFile(a.src)} style={{ position: "absolute", left: A.ox, top: A.oy, width: a.iw * A.base, height: a.ih * A.base }} />
        {g > 0 && push < 0.6 && (
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }}>
            {[[bx, by, 1, 1], [bx + bw, by, -1, 1], [bx, by + bh, 1, -1], [bx + bw, by + bh, -1, -1]].map(([x, y, sx, sy], i) => {
              const s = 34 * g, off = (1 - g) * 40;
              const X = x - sx * off, Y = y - sy * off;
              return <path key={i} d={`M${X} ${Y + sy * s} L${X} ${Y} L${X + sx * s} ${Y}`} fill="none" stroke="#fff" strokeWidth={6} opacity={g} />;
            })}
          </svg>
        )}
        {ob > 0 && <Img src={staticFile(b.src)} style={{ position: "absolute", left: B.ox, top: B.oy, width: b.iw * B.base, height: b.ih * B.base, opacity: ob }} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
