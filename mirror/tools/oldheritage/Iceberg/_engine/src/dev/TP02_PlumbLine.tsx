// TP02 PlumbLine: two frozen cabins in white frames on a tilted board. Left: a plumb line drops from the cabin's hanger and the bob swings
// and settles straight through it (the cabin hangs level). Right (slides in on its word): a tipped cabin, the plumb line where it should
// hang (dashed) against the line the cabin now lies along, the gap between them swept as an arc. px = source pixels of each frame.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Pt = [number, number];
export const PlumbLine: React.FC<{ iw: number; ih: number; left: { src: string; hang: Pt; len: number }; right: { src: string; c: Pt; axis: Pt; r: number; z?: number }; rightAt: number; bg: string }> = ({ iw, ih, left, right, rightAt, bg }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const PH = 900, PW = PH * iw / ih, k = PH / ih;
  const slide = io(interpolate(f, [rightAt - 6, rightAt + 16], [0, 1], cl));
  const gap = 90, both = 2 * PW + gap;
  const xL = width / 2 - PW / 2 - (both / 2 - PW / 2) * slide, xR = xL + PW + gap, y0 = (height - PH) / 2;
  const ry = 5 - 10 * (f / durationInFrames);
  // left plumb: drops, swings (damped) and settles
  const dropT = interpolate(f, [8, 26], [0, 1], cl), sw = f < 26 ? 0 : 12 * Math.exp(-(f - 26) / 18) * Math.sin((f - 26) / 4.2);
  const L = left.len * k * out(dropT), hx = left.hang[0] * k, hy = left.hang[1] * k;
  const bx = hx + Math.sin(sw * Math.PI / 180) * L, by = hy + Math.cos(sw * Math.PI / 180) * L;
  // right: dashed plumb, solid axis, arc
  const g1 = io(interpolate(f, [rightAt + 12, rightAt + 30], [0, 1], cl)), g2 = io(interpolate(f, [rightAt + 30, rightAt + 50], [0, 1], cl));
  const zr = right.z ?? 1, ox = Math.min(0, Math.max(PW - PW * zr, PW / 2 - right.c[0] * k * zr)), oy = Math.min(0, Math.max(PH - PH * zr, PH / 2 - right.c[1] * k * zr));
  const cx = ox + right.c[0] * k * zr, cy = oy + right.c[1] * k * zr, r = right.r * k * zr;
  const a0 = -Math.PI / 2, a1 = Math.atan2(right.axis[1] - right.c[1], right.axis[0] - right.c[0]);
  const aa = a0 + (a1 - a0) * g2;
  const arcR = r * 0.55;
  const arc = `M ${cx + arcR * Math.cos(a0)} ${cy + arcR * Math.sin(a0)} A ${arcR} ${arcR} 0 0 ${a1 < a0 ? 0 : 1} ${cx + arcR * Math.cos(aa)} ${cy + arcR * Math.sin(aa)}`;
  const frame = (x: number, src: string, child: React.ReactNode, o = 1, z = 1, zx = 0, zy = 0) => (
    <div style={{ position: "absolute", left: x, top: y0, width: PW, height: PH, border: "6px solid #fff", marginLeft: -6, marginTop: -6, boxShadow: "0 30px 70px rgba(0,0,0,.7)", overflow: "hidden", opacity: o }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: zx, top: zy, width: PW * z, height: PH * z, objectFit: "cover" }} />
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 5px rgba(0,0,0,.8))" }}>{child}</svg>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(28px) brightness(.35)" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <AbsoluteFill style={{ transform: `rotateY(${ry}deg)`, transformStyle: "preserve-3d" }}>
          {frame(xL, left.src, <>
            {dropT > 0 && <><line x1={hx} y1={hy} x2={bx} y2={by} stroke="#fff" strokeWidth={4} /><circle cx={hx} cy={hy} r={7} fill="#fff" />
              <path d={`M ${bx} ${by + 22} L ${bx - 11} ${by} L ${bx + 11} ${by} Z`} fill="#fff" /></>}
          </>)}
          {slide > 0 && frame(xR, right.src, <>
            <line x1={cx} y1={cy - r} x2={cx} y2={cy - r + 2 * r * g1} stroke="#fff" strokeWidth={4} strokeDasharray="14 10" opacity={g1 > 0 ? 1 : 0} />
            {g2 > 0 && <><line x1={cx} y1={cy} x2={cx + r * Math.cos(aa)} y2={cy + r * Math.sin(aa)} stroke="#fff" strokeWidth={6} />
              <path d={arc} fill="none" stroke="#fff" strokeWidth={3} /><circle cx={cx} cy={cy} r={7} fill="#fff" /></>}
          </>, slide, zr, ox, oy)}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
