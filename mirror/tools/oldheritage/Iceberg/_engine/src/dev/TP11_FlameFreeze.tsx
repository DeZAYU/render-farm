// TP11 | FlameFreeze: a freeze of the bystander's frame, pulled back into a white-framed print over its blurred copy; a white rule measures
// the flames from the tent's roof line to their tip (the witness's "four or five metres", checked against the stall's own ~3 m height on
// the same frame), then the camera slides to the balconies above and a white box draws round the flats. Image px coordinates.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const FlameFreeze: React.FC<{
  src: string; iw: number; ih: number; rule: { x: number; y0: number; y1: number; at: number; label: string }; roof: [number, number];
  box: [number, number, number, number]; boxAt: number;
}> = ({ src, iw, ih, rule, roof, box, boxAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // print pull-back: full frame -> 0.86 framed print in the first 14 f
  const p = out(interpolate(f, [0, 14], [0, 1], cl));
  const pr = 1 - 0.14 * p;
  // camera inside the print: centre on the flame, then slide toward the flats on boxAt
  const k = io(interpolate(f, [boxAt - 12, boxAt + 18], [0, 1], cl));
  const z = 1.0 + 0.1 * io(f / durationInFrames) + 0.12 * k;
  const fx = (rule.x + 180) * (1 - k) + ((box[0] + box[2]) / 2) * k, fy = ih / 2 * (1 - k) + ((box[1] + box[3]) / 2 + 120) * k;
  const W = width * pr, H = height * pr, base = (W / iw) * z;
  const ox = Math.min(0, Math.max(W - iw * base, W / 2 - fx * base)), oy = Math.min(0, Math.max(H - ih * base, H / 2 - fy * base));
  const X = (x: number) => ox + x * base, Y = (y: number) => oy + y * base;
  const r = io(interpolate(f, [rule.at, rule.at + 18], [0, 1], cl));
  const roofO = interpolate(f, [rule.at - 6, rule.at], [0, 1], cl) * interpolate(f, [boxAt - 10, boxAt], [1, 0.0], cl);
  const ruleO = interpolate(f, [boxAt - 10, boxAt], [1, 0.25], cl);
  const g = out(interpolate(f, [boxAt, boxAt + 16], [0, 1], cl));
  const bx = X(box[0]), by = Y(box[1]), bw = (box[2] - box[0]) * base, bh = (box[3] - box[1]) * base, P = 2 * (bw + bh);
  const yTop = Y(rule.y1) + (Y(rule.y0) - Y(rule.y1)) * (1 - r);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -50, width: width + 100, height: height + 100, objectFit: "cover", filter: "blur(16px) brightness(.5)" }} />
      <div style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2 - 10 * p, width: W, height: H, overflow: "hidden", border: `${6 * p}px solid #fff`, boxShadow: "0 18px 50px rgba(0,0,0,.6)" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, maxWidth: "none" }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={X(roof[0]) - 40} y1={Y(rule.y0)} x2={X(roof[1]) + 40} y2={Y(rule.y0)} stroke="#fff" strokeWidth={3} strokeDasharray="14 10" opacity={roofO * 0.9} />
          <g opacity={ruleO} style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.8))" }}>
            {r > 0 && <line x1={X(rule.x)} y1={Y(rule.y0)} x2={X(rule.x)} y2={yTop} stroke="#fff" strokeWidth={6} />}
            {r > 0 && <line x1={X(rule.x) - 22} y1={Y(rule.y0)} x2={X(rule.x) + 22} y2={Y(rule.y0)} stroke="#fff" strokeWidth={6} />}
            {r > 0.98 && <line x1={X(rule.x) - 22} y1={Y(rule.y1)} x2={X(rule.x) + 22} y2={Y(rule.y1)} stroke="#fff" strokeWidth={6} />}
          </g>
          {g > 0 && <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="#fff" strokeWidth={6} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} />}
        </svg>
        <RedLabel text={rule.label} at={rule.at + 16} hold={boxAt - rule.at - 22} x={Math.max(0.1, (X(rule.x) - 130) / width)} y={Math.max(0.1, Y((rule.y0 + rule.y1) / 2) / height)} size={44} />
      </div>
    </AbsoluteFill>
  );
};
