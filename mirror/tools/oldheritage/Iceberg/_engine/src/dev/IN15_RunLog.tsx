// IN15 RunLog: Bruce Allan's own run-tracker screenshot of that morning (2014-06-05, 4.38 km, his note "Black bear!", published by Global
// News "Courtesy: Bruce Allan") held as a phone screen in a thin white frame over the dim, blurred trail footage, turned a little in 3-D.
// The camera glides on the VO: the date bar, then the route, then down to his note, which a soft light picks out. Its own pixels only.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, cl, out, type CK } from "./DC01_kit";

/** keys: s = zoom, x/y = the point of the screenshot (0..1) held at frame centre */
export const RunLog: React.FC<{ bg: string; bgFrom: number; shot: string; iw: number; ih: number; keys: CK[]; noteAt: number; note: [number, number, number, number]; credit: string }> =
({ bg, bgFrom, shot, iw, ih, keys, noteAt, note, credit }) => {
  const f = useCurrentFrame();
  const c = camAt(f, keys);
  const H = 900 * c.s, W = H * iw / ih;
  const left = 960 - c.x * W, top = 540 - c.y * H;
  const k = out(interpolate(f, [0, 22], [0, 1], cl));
  const ry = -9 + 7 * interpolate(f, [0, 200], [0, 1], cl);
  const nk = out(interpolate(f, [noteAt, noteAt + 18], [0, 1], cl));
  const [nx0, ny0, nx1, ny1] = note;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: -50, width: 2020, height: 1180, objectFit: "cover", filter: "blur(18px) brightness(.35) saturate(.7)" }} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: "absolute", left, top, width: W, height: H, transform: `rotateY(${ry}deg) translateY(${(1 - k) * 60}px)`, opacity: k,
          outline: "6px solid #fff", boxShadow: "0 30px 80px rgba(0,0,0,.7)", overflow: "hidden" }}>
          <Img src={staticFile(shot)} style={{ width: "100%", height: "100%" }} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse ${(nx1 - nx0) * 70}% ${(ny1 - ny0) * 160}% at ${(nx0 + nx1) * 50}% ${(ny0 + ny1) * 50}%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)`, opacity: nk }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 46, bottom: 34, fontFamily: "Elite", fontSize: 24, color: "rgba(255,255,255,.75)", letterSpacing: "0.06em", opacity: k }}>{credit}</div>
    </AbsoluteFill>
  );
};
