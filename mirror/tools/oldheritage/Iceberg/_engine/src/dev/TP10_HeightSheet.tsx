// TP10 | HeightSheet: true-scale height comparison from two REAL sources standing on one ground line, in a slow 2.5-D camera.
// Left: a photo of the ride (The Wheel, CC0) in a white-framed print; right: the National Park Service's HAER measured elevation of the
// Statue of Liberty (public domain) on its paper, scaled to the same feet-per-pixel. A white rule climbs the ride to its height (red label),
// the statue print rises on its word, a dashed white line runs from the torch across to the ride on "torch".
// Geometry is in image pixels: ground / top rows of each source; everything else is derived (k = screen px per foot).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Src = { src: string; iw: number; ih: number; top: number; ground: number; cx: number; feet: number };
export const HeightSheet: React.FC<{
  ride: Src; ref2: Src; rideLabel: string; refLabel: string;
  rideAt?: number; refAt: number; lineAt: number; rideLabelAt?: number; ground?: number; kFt?: number;
}> = ({ ride, ref2, rideLabel, refLabel, rideAt = 4, refAt, lineAt, rideLabelAt, ground = 958, kFt = 2.05 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const G = ground;
  // ride print
  const sR = (ride.feet * kFt) / (ride.ground - ride.top);
  const rp = { x: 140, y: 64, w: 910, b: G + 56 };
  const rImgL = rp.w / 2 - ride.cx * sR, rImgT = G - ride.ground * sR - rp.y;
  const topY = G - ride.feet * kFt;
  // reference print (paper)
  const sF = (ref2.feet * kFt) / (ref2.ground - ref2.top);
  const fw = ref2.iw * sF, fh = ref2.ih * sF;
  const fp = { x: 1100, w: Math.max(fw, 660) + 20, y: G - ref2.ground * sF - 34, b: G + 56 };
  const flameY = G - ref2.feet * kFt;
  // camera: settle from a turned, slightly far plane to near-frontal, then keep creeping in
  const t = f / durationInFrames;
  const ry = interpolate(io(Math.min(1, f / 40)), [0, 1], [-16, -5]) + 3 * io(t);
  const z = 0.9 + 0.08 * io(t) + 0.04 * out(Math.min(1, f / 40));
  const rideIn = out(interpolate(f, [0, 14], [0, 1], cl));
  const refIn = out(interpolate(f, [refAt, refAt + 16], [0, 1], cl));
  const rule = io(interpolate(f, [rideAt, rideAt + 26], [0, 1], cl));
  const dash = io(interpolate(f, [lineAt, lineAt + 18], [0, 1], cl));
  const ruleX = rp.x - 46;
  return (
    <AbsoluteFill style={{ background: "#07080a", overflow: "hidden" }}>
      <Img src={staticFile(ride.src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(22px) brightness(.32) saturate(.7)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,.65) 100%)" }} />
      <AbsoluteFill style={{ perspective: 1700 }}>
        <AbsoluteFill style={{ transform: `rotateY(${ry}deg) scale(${z})`, transformOrigin: "50% 60%", transformStyle: "preserve-3d" }}>
          {/* ride print */}
          <div style={{ position: "absolute", left: rp.x, top: rp.y, width: rp.w, height: rp.b - rp.y, overflow: "hidden", border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.7)", opacity: rideIn, transform: `translateY(${(1 - rideIn) * 30}px)` }}>
            <Img src={staticFile(ride.src)} style={{ position: "absolute", left: rImgL, top: rImgT, width: ride.iw * sR, height: ride.ih * sR }} />
          </div>
          {/* reference print rising on its word */}
          <div style={{ position: "absolute", left: fp.x, top: fp.y, width: fp.w, height: fp.b - fp.y, overflow: "hidden", background: "#efede6", border: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.7)",
            opacity: refIn, transform: `translateY(${(1 - refIn) * 70}px)` }}>
            <Img src={staticFile(ref2.src)} style={{ position: "absolute", left: (fp.w - 12) / 2 - ref2.cx * sF, top: G - ref2.ground * sF - fp.y - 6, width: fw, height: fh }} />
          </div>
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {/* ground line through both prints */}
            <line x1={rp.x - 70} y1={G} x2={fp.x + fp.w + 30} y2={G} stroke="rgba(255,255,255,.55)" strokeWidth={2} opacity={rideIn} />
            {/* height rule on the ride, ticks every 100 ft */}
            <line x1={ruleX} y1={G} x2={ruleX} y2={G - (G - topY) * rule} stroke="#fff" strokeWidth={5} style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.7))" }} />
            {[0, 100, 200, 300, 400].map((ft) => {
              const y = G - ft * kFt; const o = interpolate(G - (G - topY) * rule, [y - 2, y + 6], [1, 0], cl);
              return <line key={ft} x1={ruleX - (ft % 200 === 0 ? 20 : 12)} y1={y} x2={ruleX + (ft === 400 ? 900 : 0)} y2={y} stroke="#fff" strokeWidth={ft === 400 ? 2.5 : 3} strokeDasharray={ft === 400 ? "2 0" : undefined} opacity={o * (ft === 400 ? 0.85 : 1)} />;
            })}
            {/* torch level, dashed, from the statue print across to the rule */}
            {dash > 0 && <line x1={fp.x + fp.w / 2 + 20} y1={flameY} x2={fp.x + fp.w / 2 + 20 - (fp.x + fp.w / 2 + 20 - ruleX) * dash} y2={flameY} stroke="#fff" strokeWidth={4} strokeDasharray="16 12" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.8))" }} />}
          </svg>
          <RedLabel text={rideLabel} at={rideLabelAt ?? rideAt + 22} x={(ruleX + 150) / width} y={(topY + 50) / height} size={42} />
          <RedLabel text={refLabel} at={refAt + 12} x={(fp.x + fp.w / 2) / width} y={(fp.y - 40) / height} size={38} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
