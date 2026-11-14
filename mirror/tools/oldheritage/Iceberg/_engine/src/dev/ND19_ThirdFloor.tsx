// ND19 ThirdFloor: where the camera was. TSUNE's own vertical phone clip in a white frame on the right (over its blurred copy); on the left a
// plain white elevation of a three-storey house, his window marked red on the top floor, a dashed sightline down to the street, and the
// water rising round the ground floor as the clip plays. One place label under the clip.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const ThirdFloor: React.FC<{ src: string; from: number; label: string; labelAt: number; waterAt: [number, number] }> = ({ src, from, label, labelAt, waterAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const d = io(f / durationInFrames);
  const k = out(interpolate(f, [0, 14], [0, 1], cl));
  // clip frame (3:4 portrait)
  const H = 800, W = H * 0.75, X0 = 1080, Y0 = (height - H) / 2 - 20;
  // the house elevation
  const gx = 250, gy = 900, fw = 430, fh = 190; // ground y, floor height
  const draw = (t0: number) => io(interpolate(f, [t0, t0 + 14], [0, 1], cl));
  const wl = interpolate(f, waterAt, [0, 120], { ...cl, easing: Easing.bezier(0.3, 0, 0.3, 1) });
  const win = out(interpolate(f, [26, 38], [0, 1], cl));
  const sl = io(interpolate(f, [40, 62], [0, 1], cl));
  const wy = gy - 2 * fh - fh * 0.55; // the window centre on floor 3
  const tx = 900, ty = gy - 10; // the street below, toward the clip
  const P = (fw + 3 * fh) * 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.38) saturate(.8)", transform: `scale(${1.05 + 0.04 * d})` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {/* water on the street */}
        <rect x={0} y={gy - wl} width={X0 - 20} height={wl + 4} fill="rgba(120,175,210,.30)" />
        <line x1={0} y1={gy - wl} x2={X0 - 20} y2={gy - wl} stroke="#fff" strokeWidth={3} opacity={wl > 2 ? 0.85 : 0} />
        <line x1={60} y1={gy} x2={X0 - 20} y2={gy} stroke="#fff" strokeWidth={5} opacity={draw(0)} />
        {/* three storeys */}
        <rect x={gx} y={gy - 3 * fh} width={fw} height={3 * fh} fill="rgba(0,0,0,.35)" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - draw(2))} />
        {[1, 2].map((i) => <line key={i} x1={gx} y1={gy - i * fh} x2={gx + fw * draw(8 + i * 3)} y2={gy - i * fh} stroke="#fff" strokeWidth={3} opacity={0.8} />)}
        <polyline points={`${gx - 20},${gy - 3 * fh} ${gx + fw / 2},${gy - 3 * fh - 120} ${gx + fw + 20},${gy - 3 * fh}`} fill="none" stroke="#fff" strokeWidth={5} opacity={draw(12)} />
        {/* windows: two per floor, his marked red on the top floor */}
        {[0, 1, 2].map((fl) => [0, 1].map((c) => {
          const x = gx + 70 + c * 200, y = gy - fl * fh - fh * 0.75, mine = fl === 2 && c === 1;
          return <rect key={fl + "_" + c} x={x} y={y} width={90} height={80} fill={mine ? RED : "none"} fillOpacity={mine ? win : 0} stroke="#fff" strokeWidth={3} opacity={draw(14 + fl * 2)} />;
        }))}
        {/* sightline from his window down to the street */}
        {sl > 0 && <line x1={gx + 315} y1={wy} x2={gx + 315 + (tx - gx - 315) * sl} y2={wy + (ty - wy) * sl} stroke="#fff" strokeWidth={4} strokeDasharray="14 12" />}
      </svg>
      <div style={{ position: "absolute", left: X0, top: Y0, width: W, height: H, border: "6px solid #fff", boxShadow: "0 18px 50px rgba(0,0,0,.6)", overflow: "hidden", transform: `scale(${0.94 + 0.06 * k})`, opacity: k }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.05 * d})` }} />
      </div>
      <RedLabel text={label} at={labelAt} x={(X0 + W / 2) / width} y={(Y0 + H + 44) / height} />
    </AbsoluteFill>
  );
};
