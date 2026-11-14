// DC16 StampSplit: two frozen frames of the same cruiser camera side by side, each in a white frame over the dim blurred crossing:
// left, Officer Duncan at the van; right, the locomotive hitting it. The right frame then pushes into the camera's own burned-in
// clock in its corner (16:15:43), so the timing the VO gives is read off the camera itself. No added numbers or graphics.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CK, Cam, camAt, cl, ease, out, placeOf } from "./DC01_kit";

const Panel: React.FC<{ src: string; t: number; keys: CK[]; f: number; w: number; h: number }> = ({ src, t, keys, f, w, h }) => {
  const c = camAt(f, keys);
  const p = placeOf(c, w, h);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }} /></Freeze>
    </div>
  );
};

export const StampSplit: React.FC<{ src: string; bgFrom: number; left: { t: number; keys: CK[] }; right: { t: number; keys: CK[] }; rightAt: number }> = ({ src, bgFrom, left, right, rightAt }) => {
  const f = useCurrentFrame();
  const W = 860, H = W * 9 / 16, gap = 50, top = 540 - H / 2 - 10;
  const a = out(interpolate(f, [0, 20], [0, 1], cl)), b = out(interpolate(f, [rightAt, rightAt + 20], [0, 1], cl));
  const drift = ease(f, 0, 240);
  const box = (x: number, k: number, child: React.ReactNode) => (
    <div style={{ position: "absolute", left: x, top: top + 30 * (1 - k), width: W, height: H, opacity: k, border: "5px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.65)", overflow: "hidden", background: "#000" }}>{child}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Cam src={src} from={bgFrom} keys={[{ f: 0, s: 1.1, x: 0.5, y: 0.45 }, { f: 300, s: 1.18, x: 0.5, y: 0.45 }]} filter="blur(16px) brightness(.3) saturate(.6)" />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * drift})` }}>
        {box(960 - W - gap / 2, a, <Panel src={src} t={left.t} keys={left.keys} f={f} w={W - 10} h={H - 10} />)}
        {box(960 + gap / 2, b, <Panel src={src} t={right.t} keys={right.keys} f={f - rightAt} w={W - 10} h={H - 10} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
