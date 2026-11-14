// footage / Letterbox: a SCOPE-BAND crop of a clip over its own blurred, darkened copy: the horizontal cousin of PhonePanel. REF Abyssal I8 phone
// panel over a blurred copy of itself (@33:28-34:56: hard-edged panel, sides = the same clip blurred ~40 px at 10-35 % of the panel's luma) + Dashcam
// Vol.3 I14 vertical-clip fill (gblur sigma 30, -35 %), turned 90 deg: the band shows a full-width slice of the source (`src` rect, e.g. y 0-620 to
// hide a burned-in news caption band) and the same clip fills the frame behind it. Never black bars (DD/Abyssal rule).
// OUR VERSION (premium, DD look): a soft dark shadow falls off the band edges onto the blurred plate, a faint top-edge light catch, the band
// content takes the Dashcam linear push INSIDE its mask while the plate drifts slower (depth by parallax, not by a frame); the grade vignette sits
// over both. Optional tracked feather blurs (faces / trapped people) in SOURCE px, carried through crop + push. Use for news clips with burned-in
// captions/chyrons and for scope-ratio phone/drone clips (c12 SCMP: y 0-620 hides the caption band y ~645-865).
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { EBlur, H, Media, Vignette, W, linPush } from "../../core";
import { trackAt } from "../labels/kit";
import type { BlurTrack } from "./DashHold";

export type LetterboxProps = {
  media: string; mediaStart?: number;
  src?: { x: number; y: number; w: number; h: number }; // source rect shown in the band (px of the 1920x1080 media)
  cy?: number; // band centre on screen (px)
  bandH?: number; // band height on screen (px); width follows the source aspect, capped at the frame width
  push?: number; // band content push (/s, linear)
  bgPush?: number; // plate push (/s, linear, slower = parallax)
  blur?: number; dim?: number; // plate defocus (px) and brightness
  shadow?: number; // band-edge shadow strength 0..1
  blurs?: BlurTrack[];
};
export const Letterbox: React.FC<LetterboxProps> = ({
  media, mediaStart = 0, src = { x: 0, y: 0, w: 1920, h: 620 }, cy = H / 2, bandH, push = 0.04, bgPush = 0.015, blur = 40, dim = 0.45, shadow = 0.8, blurs = [],
}) => {
  const f = useCurrentFrame();
  const aspect = src.w / src.h;
  const bh = Math.min(bandH ?? W / aspect, W / aspect);
  const bw = bh * aspect;
  const bx = (W - bw) / 2, by = cy - bh / 2;
  const k = bw / src.w; // screen px per source px
  const s = linPush(f, push);
  const bgs = linPush(f, bgPush);
  // the full source frame laid out so that `src` fills the band; scaled by s about the band centre
  const fullW = 1920 * k, fullH = 1080 * k;
  const left0 = -src.x * k, top0 = -src.y * k;
  const bcx = bw / 2, bcy = bh / 2;
  const toBand = (p: { x: number; y: number }) => ({ x: bcx + ((p.x - src.x) * k - bcx) * s, y: bcy + ((p.y - src.y) * k - bcy) * s });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* plate: the same clip, covered, defocused, darkened, slower push */}
      <AbsoluteFill style={{ transform: `scale(${(1.1 * bgs).toFixed(5)})`, filter: `blur(${blur}px) brightness(${dim}) saturate(.8)` }}>
        <Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence>
      </AbsoluteFill>
      {/* soft shadow falling off the band onto the plate (depth) */}
      {shadow > 0 ? (
        <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, boxShadow: `0 0 ${Math.round(70 * shadow)}px ${Math.round(18 * shadow)}px rgba(0,0,0,${(0.72 * shadow).toFixed(2)}), 0 ${Math.round(26 * shadow)}px ${Math.round(60 * shadow)}px rgba(0,0,0,${(0.5 * shadow).toFixed(2)})` }} />
      ) : null}
      {/* the band */}
      <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, overflow: "hidden", background: "#000" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: bw, height: bh, transformOrigin: "50% 50%", transform: `scale(${s.toFixed(5)})` }}>
          <div style={{ position: "absolute", left: left0, top: top0, width: fullW, height: fullH }}>
            <Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence>
          </div>
        </div>
        {blurs.filter((b) => (b.from ?? -1e9) <= f && f < (b.to ?? 1e9)).map((b, i) => {
          const p = toBand(trackAt(b.keys, f));
          return <EBlur key={i} cx={p.x} cy={p.y} rx={b.rx * k * s} ry={b.ry * k * s} px={b.px ?? 18} />;
        })}
        {/* inner edge falloff + a faint light catch on the top edge (the band reads as a pane, not a cut) */}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 14px 22px -14px rgba(0,0,0,.65), inset 0 -14px 22px -14px rgba(0,0,0,.75)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.14) 50%, rgba(255,255,255,0))" }} />
      </div>
      <Vignette />
    </AbsoluteFill>
  );
};
