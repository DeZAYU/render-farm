// IN13 CaptionHold: the boat camera's own burned-in caption ("...a 4.5 meter Great White Shark was sighted in these waters a week ago..")
// held on its frame. Frozen full frame, slow eased push toward the caption; the deck and the sea sink into a soft shadow while a band round
// the two caption lines stays lit, then one thin red rule draws under the phrase that matters (the shark). The uploader's pixels, no re-typed text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RED } from "../brand";
import { camAt, cl, out, placeOf, type CK } from "./DC01_kit";

export const CaptionHold: React.FC<{ src: string; t: number; keys: CK[]; band: [number, number]; rule: [number, number, number]; shadeAt: number; ruleAt: number }> =
({ src, t, keys, band, rule, shadeAt, ruleAt }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const sh = out(interpolate(f, [shadeAt, shadeAt + 24], [0, 1], cl));
  const r = out(interpolate(f, [ruleAt, ruleAt + 18], [0, 1], cl));
  const Y = (v: number) => p.top + v * p.h, X = (u: number) => p.left + u * p.w;
  const [b0, b1] = band, [rx0, rx1, ry] = rule;
  const mask = `linear-gradient(180deg, black ${Y(b0) - 60}px, transparent ${Y(b0)}px, transparent ${Y(b1)}px, black ${Y(b1) + 60}px)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }} /></Freeze>
      <AbsoluteFill style={{ background: "rgba(0,0,0,.62)", opacity: sh, WebkitMaskImage: mask, maskImage: mask }} />
      {r > 0 && <div style={{ position: "absolute", left: X(rx0), top: Y(ry), width: (X(rx1) - X(rx0)) * r, height: 5, background: RED, boxShadow: "0 0 8px rgba(0,0,0,.6)" }} />}
    </AbsoluteFill>
  );
};
