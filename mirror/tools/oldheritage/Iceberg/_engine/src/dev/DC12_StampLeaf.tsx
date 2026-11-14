// DC12 StampLeaf: the dashcam frame held still. On "the camera's clock" the picture sinks into shadow and the camera's own burned-in
// date/time strip lifts off the glass toward the viewer (real pixels, thin white edge, soft shadow); on "but the trees are in full
// leaf" the strip sinks back and fades while the camera travels to the canopy and a soft pool of light opens on the fresh leaves.
// No added text: the contradiction is shown with the frame's own pixels.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { io, cl, out } from "./DC01_kit";

type Box = [number, number, number, number]; // x0 y0 x1 y1 as fractions of the source picture
export const StampLeaf: React.FC<{
  still: string; stamp: Box; leaf: [number, number]; liftAt: number; leafAt: number; dur: number; leafScale?: number;
}> = ({ still, stamp, leaf, liftAt, leafAt, dur, leafScale = 1.65 }) => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  // camera on the held frame: slow drift, then travel to the leaves
  const tr = io(interpolate(f, [leafAt - 4, leafAt + 46], [0, 1], cl));
  const s = 1.06 + 0.04 * (f / dur) + (leafScale - 1.06) * tr;
  const fx = 0.5 + (leaf[0] - 0.5) * tr, fy = 0.5 + (leaf[1] - 0.5) * tr;
  const w = W * s, h = H * s;
  const left = Math.min(0, Math.max(W - w, W / 2 - fx * w)), top = Math.min(0, Math.max(H - h, H / 2 - fy * h));
  // shadow over the frame while the stamp is up; then a pool of light on the leaves
  const up = out(interpolate(f, [liftAt, liftAt + 22], [0, 1], cl)) * (1 - io(interpolate(f, [leafAt, leafAt + 26], [0, 1], cl)));
  const pool = io(interpolate(f, [leafAt + 10, leafAt + 44], [0, 1], cl));
  // where the stamp sits on screen now (it rides with the camera)
  const sx0 = left + stamp[0] * w, sy0 = top + stamp[1] * h, sw0 = (stamp[2] - stamp[0]) * w, sh0 = (stamp[3] - stamp[1]) * h;
  const lift = 1.45; // plate scale relative to its place on the frame
  const tx = interpolate(up, [0, 1], [sx0 + sw0 / 2, W * 0.5]), ty = interpolate(up, [0, 1], [sy0 + sh0 / 2, H * 0.32]);
  const ps = 1 + (lift - 1) * up;
  const pad = 0.12; // a little picture around the digits
  const cw = sw0 * (1 + pad), ch = sh0 * (1 + pad * 9);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(still)} style={{ position: "absolute", left, top, width: w, height: h }} />
      <AbsoluteFill style={{ background: "#000", opacity: 0.62 * up }} />
      <AbsoluteFill style={{ opacity: pool, background: `radial-gradient(ellipse 36% 46% at ${((left + leaf[0] * w) / W) * 100}% ${((top + leaf[1] * h) / H) * 100}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)` }} />
      {up > 0.003 && (
        <div style={{ position: "absolute", left: tx - (cw * ps) / 2, top: ty - (ch * ps) / 2, width: cw * ps, height: ch * ps, overflow: "hidden",
          outline: `${3 * up}px solid rgba(255,255,255,${0.9 * up})`, boxShadow: `0 ${18 * up}px ${50 * up}px rgba(0,0,0,${0.7 * up})`, opacity: Math.min(1, up * 1.6) }}>
          <Img src={staticFile(still)} style={{ position: "absolute", width: w * ps, height: h * ps,
            left: -(stamp[0] * w - (cw - sw0) / 2) * ps, top: -(stamp[1] * h - (ch - sh0) / 2) * ps, filter: "contrast(1.12)" }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
