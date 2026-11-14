// AM17 InfoRow (Mindbender, "It blamed design and manufacturing faults by the West German builder."): the ride's real Wikipedia infobox
// (captured page, Galaxyland / General statistics block) as a tall printed card standing in 3-D over the dark loops photo. The camera
// rises along the card from the opening/closing dates to the builder's rows; the "Manufacturer  Anton Schwarzkopf / Designer  Werner
// Stengel" rows slide forward out of the card (a lifted strip with its own shadow) while the rest of the card sinks back into shade.
// No red (the case's one red mark is elsewhere). Props: page + pw/ph, bg still, rows [y0, y1] page px of the lifted strip, liftAt.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const InfoRow: React.FC<{ page: string; pw: number; ph: number; bg: string; rows: [number, number]; y0: number; liftAt: number; k?: number }> = ({ page, pw, ph, bg, rows, y0, liftAt, k = 1.35 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const rise = out(interpolate(f, [0, 20], [0, 1], cl));
  const lift = io(interpolate(f, [liftAt, liftAt + 22], [0, 1], cl));
  const mid = (rows[0] + rows[1]) / 2;
  const cy = y0 + (mid - y0) * io(interpolate(f, [4, liftAt + 10], [0, 1], cl));   // page y at screen centre
  const kk = k * (1 + 0.06 * (f / dur));
  const W = pw * kk, H = ph * kk, left = 960 - W / 2, top = 540 - cy * kk + (1 - rise) * 140;
  const strip = (
    <div style={{ position: "absolute", left: 0, top: rows[0], width: pw, height: rows[1] - rows[0], overflow: "hidden", background: "#fff" }}>
      <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: -rows[0], width: pw, height: ph }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.1 + 0.05 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(.32) saturate(.7)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left, top, width: W, height: H, opacity: rise, transformStyle: "preserve-3d", transformOrigin: `50% ${(cy / ph) * 100}%`,
          transform: `rotateY(${12 - 4 * (f / dur)}deg) rotateX(4deg)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${kk})`, transformOrigin: "0 0", transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: 0, background: "#fff", boxShadow: "0 30px 80px rgba(0,0,0,.8)" }}>
              <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
              <div style={{ position: "absolute", inset: 0, background: `rgba(10,10,12,${0.62 * lift})` }} />
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `translateZ(${70 * lift}px) translateX(${-14 * lift}px)`,
              filter: `drop-shadow(0 ${16 * lift}px ${26 * lift}px rgba(0,0,0,${0.7 * lift}))` }}>{strip}</div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
