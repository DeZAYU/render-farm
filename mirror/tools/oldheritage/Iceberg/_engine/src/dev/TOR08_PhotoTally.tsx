// TOR08 | PhotoTally: three villages on one track, counted. A white-framed photograph from each village (taken in the weeks after)
// stands in a row in 3-D; as the VO reaches a village its card swings forward, the camera drifts onto it, and beneath it the houses
// that were DESTROYED there are counted out as small white squares, one per house (17, 31, 62), so the three totals can be compared
// by eye. The village name is the red label. Nothing else is written.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type V = { src: string; name: string; count: number; at: number };
export const PhotoTally: React.FC<{ v: V[]; bg?: string }> = ({ v, bg }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const W = 560, H = W * 2 / 3, gap = 50, rowW = v.length * W + (v.length - 1) * gap;
  // camera x: eased onto the latest village announced
  let cx = 0;
  v.forEach((c, i) => { const k = io(interpolate(f, [c.at - 6, c.at + 16], [0, 1], cl)); const x = i * (W + gap) - (rowW - W) / 2; cx = cx + (x - cx) * k; });
  const sq = 14, sgap = 5, perRow = Math.floor(W / (sq + sgap));
  return (
    <AbsoluteFill style={{ background: "#070707", overflow: "hidden" }}>
      {bg && <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(24px) brightness(.3)" }} />}
      <AbsoluteFill style={{ perspective: 1600, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: width / 2, top: height / 2 - 190, transformStyle: "preserve-3d", transform: `translate3d(${-cx * 0.06}px, 0, 0) rotateX(6deg)` }}>
          {v.map((c, i) => {
            const k = out(interpolate(f, [c.at, c.at + 16], [0, 1], cl));
            const x = i * (W + gap) - (rowW - W) / 2 - W / 2;
            const active = 1 - Math.min(1, Math.abs(x + W / 2 - cx) / (W + gap));
            const n = Math.round(c.count * io(interpolate(f, [c.at + 10, c.at + 10 + Math.min(48, 10 + c.count), ], [0, 1], cl)));
            return (
              <div key={i} style={{ position: "absolute", left: x, top: 0, width: W, transformStyle: "preserve-3d", opacity: k,
                transform: `translateZ(${-120 + 120 * k + 50 * active}px) rotateY(${(1 - k) * 25}deg)` }}>
                <div style={{ width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,.7)", overflow: "hidden", background: "#000" }}>
                  <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.55 + 0.45 * active})` }} />
                </div>
                <svg width={W} height={200} style={{ display: "block", marginTop: 26 }}>
                  {Array.from({ length: n }, (_, j) => <rect key={j} x={(j % perRow) * (sq + sgap)} y={Math.floor(j / perRow) * (sq + sgap)} width={sq} height={sq} fill="#fff" opacity={0.6 + 0.4 * active} />)}
                </svg>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {v.map((c, i) => { const x = i * (W + gap) - (rowW - W) / 2; return <RedLabel key={i} text={c.name} at={c.at + 6} x={(width / 2 + (x - cx * 0.06)) / width} y={0.15} size={38} />; })}
    </AbsoluteFill>
  );
};
