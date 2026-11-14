// DC07 PilotsEye: the real NAIP aerial of the streets north of Clearwater Air Park (public domain), seen as the pilot would: the
// ground plane low and tilted, the runway out ahead ("he couldn't reach the runway from that height", red label on the field), then
// the camera pitches down over North Keene Road below and a white box closes on the four-lane stretch where he put it down
// ("what looked like an opening on Keene Road"), road name label. Turned so the field lies ahead (south at the top).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { cl, io, out } from "./DC01_kit";

export const PilotsEye: React.FC<{ src: string; iw: number; ih: number; field: [number, number]; box: [number, number, number, number];
  cam: { f: number; x: number; y: number; s: number; pitch: number }[]; boxAt: number; fieldLabelAt: number; roadLabelAt: number }> = ({ src, iw, ih, field, box, cam, boxAt, fieldLabelAt, roadLabelAt }) => {
  const f = useCurrentFrame();
  let c = cam[0];
  for (let i = 1; i < cam.length; i++) if (f >= cam[i - 1].f) {
    const a = cam[i - 1], b = cam[i], u = io(interpolate(f, [a.f, b.f], [0, 1], cl));
    c = { f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, s: a.s + (b.s - a.s) * u, pitch: a.pitch + (b.pitch - a.pitch) * u };
  }
  const W = 2400, k = W / iw, H = ih * k;
  const b = out(interpolate(f, [boxAt, boxAt + 16], [0, 1], cl));
  const bx = box[0] * k, by = box[1] * k, bw = (box[2] - box[0]) * k, bh = (box[3] - box[1]) * k, BP = 2 * (bw + bh);
  return (
    <AbsoluteFill style={{ background: "#0a0c10", overflow: "hidden", perspective: 1100, perspectiveOrigin: "50% 20%" }}>
      <div style={{ position: "absolute", left: 960 - c.x * k, top: 620 - c.y * k, width: W, height: H, transformOrigin: `${c.x * k}px ${c.y * k}px`,
        transform: `rotateX(${c.pitch}deg) scale(${c.s}) rotateZ(180deg)` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "contrast(1.06)" }} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={10} strokeDasharray={BP} strokeDashoffset={BP * (1 - b)} />
          <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={BP} strokeDashoffset={BP * (1 - b)} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(200,210,220,.35) 0%, rgba(200,210,220,0) 22%), radial-gradient(ellipse 80% 75% at 50% 60%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
      <RedLabel text="CLEARWATER AIR PARK" at={fieldLabelAt} hold={roadLabelAt - fieldLabelAt - 10} size={40} y={0.86} />
      <RedLabel text="NORTH KEENE ROAD" at={roadLabelAt} size={40} y={0.86} />
    </AbsoluteFill>
  );
};
