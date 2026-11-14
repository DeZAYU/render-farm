// AM17 SunColumn (Mindbender, "Chayko said his lap bar just let go…"): the real Edmonton Sun story "Mindbender tragedy, 25 years later"
// (14 Jun 2011, Wayback Machine copy, the article column as printed: headline, byline, paragraphs) lies as one paper sheet under a desk
// lamp. The lamp's pool of light starts on the headline and slides DOWN the column, the paper outside the pool in shadow, the camera
// following it, until it rests on Chayko's own words; there the pool narrows to that paragraph and one thin red rule draws under
// "my lap bar was released". The sheet sits at a slight angle in 3-D (rotateY/rotateX) over the dark, soft-blurred ride photo.
// Props: page (crop png) + pw/ph, bg still, keys = camera stops {at, y (page px at screen centre), k (scale)}, para [y0, y1] the quote,
// rule box [x0, y0, x1, y1] and its frame, cx = page x kept at screen centre (the text column).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Key = { at: number; y: number; k: number };
const cam = (f: number, ks: Key[]) => {
  let c = { y: ks[0].y, k: ks[0].k };
  for (let i = 1; i < ks.length; i++) {
    const a = ks[i - 1], b = ks[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u };
  }
  return c;
};

export const SunColumn: React.FC<{ page: string; pw: number; ph: number; bg: string; keys: Key[]; para: [number, number]; rule: { box: [number, number, number, number]; at: number }; narrowAt: number; cx?: number }> = ({ page, pw, ph, bg, keys, para, rule, narrowAt, cx }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = cam(f, keys);
  const rise = out(interpolate(f, [0, 22], [0, 1], cl));
  const nar = io(interpolate(f, [narrowAt, narrowAt + 20], [0, 1], cl));
  // lamp pool: centred on the camera line, narrows to the quote paragraph
  const pc = c.y * (1 - nar) + ((para[0] + para[1]) / 2) * nar, ph2 = 300 * (1 - nar) + ((para[1] - para[0]) / 2 + 30) * nar;
  const lamp = `linear-gradient(180deg, rgba(0,0,0,.72) ${pc - ph2 - 160}px, rgba(0,0,0,0) ${pc - ph2}px, rgba(0,0,0,0) ${pc + ph2}px, rgba(0,0,0,.72) ${pc + ph2 + 160}px)`;
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const left = 960 - (cx ?? pw / 2) * c.k, top = 540 - c.y * c.k + (1 - rise) * 120;
  return (
    <AbsoluteFill style={{ background: "#060606", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.12 + 0.04 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.3) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left, top, width: pw * c.k, height: ph * c.k, opacity: rise, transformOrigin: `50% ${(c.y / ph) * 100}%`,
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 88%, transparent 100%)", maskImage: "linear-gradient(180deg, #000 0%, #000 88%, transparent 100%)",
          transform: `rotateY(${-7 + 2 * (f / dur)}deg) rotateX(${6 - 2 * (f / dur)}deg) rotateZ(-1.2deg)`, boxShadow: "0 40px 90px rgba(0,0,0,.8)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${c.k})`, transformOrigin: "0 0", background: "#fff" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
            {ru > 0 && <div style={{ position: "absolute", left: rule.box[0], top: rule.box[3] + 3, height: 5, width: (rule.box[2] - rule.box[0]) * ru, background: RED }} />}
            {/* paper: warm tone + grain */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(240,228,205,.16)", mixBlendMode: "multiply" }} />
            <svg width={pw} height={ph} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.09 }}>
              <filter id="am17p"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width={pw} height={ph} filter="url(#am17p)" />
            </svg>
            {/* the lamp */}
            <div style={{ position: "absolute", inset: 0, background: lamp }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 55% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.35) 100%)" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
