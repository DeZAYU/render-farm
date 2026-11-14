// AM13 LampRead: the real Batavian story on the sheriff's FOIL report (25 Aug 2011; captured with _tools/capture_page.py, the page's
// own masthead, headline/byline and paragraphs cut out of the capture and laid on one clean sheet, nothing re-typed) lies on a dark desk,
// seen from above at a slight tilt. The room is dark: a single warm lamp pool lights the paper and glides from passage to passage on the
// VO (exams -> the two-legs rule -> "still no explanation"), the camera following it; everything outside the pool sinks into shadow.
// One thin red rule draws under the two-legs line (the phrase that matters). No text of ours.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
/** a stop: from frame `at` the lamp sits on page box [x0,y0,x1,y1]; k = zoom (screen px per page px) */
export type LampKey = { at: number; box: [number, number, number, number]; k: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const camAt = (f: number, keys: LampKey[], move = 26) => {
  let c = { x: (keys[0].box[0] + keys[0].box[2]) / 2, y: (keys[0].box[1] + keys[0].box[3]) / 2, w: keys[0].box[2] - keys[0].box[0], h: keys[0].box[3] - keys[0].box[1], k: keys[0].k };
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i]; if (f < b.at - move) break;
    const u = io(interpolate(f, [b.at - move, b.at], [0, 1], cl));
    const t = { x: (b.box[0] + b.box[2]) / 2, y: (b.box[1] + b.box[3]) / 2, w: b.box[2] - b.box[0], h: b.box[3] - b.box[1], k: b.k };
    c = { x: lerp(c.x, t.x, u), y: lerp(c.y, t.y, u), w: lerp(c.w, t.w, u), h: lerp(c.h, t.h, u), k: lerp(c.k, t.k, u) };
  }
  return c;
};

export const LampRead: React.FC<{ page: string; pw: number; ph: number; bg: string; bgFrom?: number; keys: LampKey[]; rule: { box: [number, number, number, number]; at: number } }> = ({ page, pw, ph, bg, bgFrom = 0, keys, rule }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = camAt(f, keys);
  const on = out(interpolate(f, [0, 22], [0, 1], cl));          // the lamp warms up
  const drift = io(f / dur);
  const rot = -3.5 + 1.6 * drift;                                 // the sheet lies a little askew, the camera slowly squares up
  const k = c.k * (1 + 0.03 * drift);
  // pool: an ellipse a bit wider than the passage, soft edge (page px)
  const rx = c.w * 0.62 + 140, ry = c.h * 0.5 + 170;
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const shade = 0.86 * on + (1 - on) * 0.97;
  return (
    <AbsoluteFill style={{ background: "#040404", overflow: "hidden" }}>
      {/* the desk: the ride's footage far behind, blurred into the dark */}
      <AbsoluteFill style={{ transform: `scale(${1.2 + 0.04 * drift})` }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(22px) brightness(.16) saturate(.5)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 20%" }}>
        <div style={{ position: "absolute", left: 960 - c.x * k, top: 540 - c.y * k, width: pw * k, height: ph * k, transformOrigin: `${(c.x / pw) * 100}% ${(c.y / ph) * 100}%`,
          transform: `rotateX(${14 - 6 * drift}deg) rotateZ(${rot}deg)`, boxShadow: "0 50px 110px rgba(0,0,0,.85)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${k})`, transformOrigin: "0 0", background: "#F4F1EA" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, mixBlendMode: "multiply" }} />
            {ru > 0 && <div style={{ position: "absolute", left: rule.box[0], top: rule.box[3] + 4, height: 6, width: (rule.box[2] - rule.box[0]) * ru, background: RED }} />}
            {/* paper tooth */}
            <svg width={pw} height={ph} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.12 }}>
              <filter id="am13Paper"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={13} /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width={pw} height={ph} filter="url(#am13Paper)" />
            </svg>
            {/* the lamp: warm pool on the passage, the rest of the sheet in shadow */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse ${rx}px ${ry}px at ${c.x}px ${c.y}px, rgba(255,214,150,0) 0%, rgba(10,8,6,${shade * 0.25}) 55%, rgba(6,5,4,${shade}) 100%)` }} />
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "soft-light", background: `radial-gradient(ellipse ${rx}px ${ry}px at ${c.x}px ${c.y}px, rgba(255,200,130,${0.55 * on}) 0%, rgba(255,200,130,0) 70%)` }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};
