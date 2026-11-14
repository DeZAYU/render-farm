// AM14 StandUpClaims: the real NBC DFW story "Texas Giant Builder Blames Six Flags for Death" (6 Mar 2014, captured with
// _tools/capture_page.py; sidebar, ads and the lead photo left out) lies as one sheet on a dark surface, seen at a low angle. Each claim
// the VO reads stands up out of the page as its own paragraph strip (the same page pixels, hinged on its bottom edge, rising to face the
// camera with a shadow cast on the sheet, a dark slot left where it was), then lies back down when the other side answers. The camera
// drifts along the sheet to the paragraph in play. The last strip ("…specified in writing that there be no seat belts") stands nearer
// and gets the case's one red mark, a thin rule drawn under "no seat belts". Whose fault depends on which filing you read: one claim up
// at a time.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type Strip = { y0: number; y1: number; up: number; down?: number; near?: number };
type Key = { at: number; y: number };

const camY = (f: number, keys: Key[]) => {
  let y = keys[0].y;
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (f <= a.at) break; y = a.y + (b.y - a.y) * io(interpolate(f, [a.at, b.at], [0, 1], cl)); }
  return y;
};

export const StandUpClaims: React.FC<{ page: string; pw: number; ph: number; bg: string; strips: Strip[]; keys: Key[];
  rule: { x0: number; x1: number; y: number; strip: number; at: number } }> = ({ page, pw, ph, bg, strips, keys, rule }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const TILT = 46, K = 1.08;
  const rise = out(interpolate(f, [0, 24], [0, 1], cl));
  const cy = camY(f, keys);
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const stand = (s: Strip) => io(interpolate(f, [s.up, s.up + 16], [0, 1], cl)) * (s.down === undefined ? 1 : 1 - io(interpolate(f, [s.down, s.down + 14], [0, 1], cl)));
  return (
    <AbsoluteFill style={{ background: "#040506", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.2 + 0.04 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.28) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 18%" }}>
        {/* the sheet: a plane laid back on the surface; page row `cy` sits a little below screen centre */}
        <div style={{ position: "absolute", left: 960 - (pw * K) / 2, top: 600 - cy * K + (1 - rise) * 200, width: pw * K, height: ph * K,
          transformStyle: "preserve-3d", transformOrigin: `50% ${(cy / ph) * 100}%`, transform: `rotateX(${TILT + (1 - rise) * 10}deg) rotateZ(-1.2deg)`, opacity: rise }}>
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", boxShadow: "0 50px 120px rgba(0,0,0,.8)" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw * K, height: ph * K, filter: "brightness(.86)" }} />
            {/* paper falloff */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.45) 100%)" }} />
            {strips.map((s, i) => {
              const u = stand(s); if (u <= 0.001) return null;
              const h = (s.y1 - s.y0) * K, top = s.y0 * K, near = s.near ?? 0;
              return (
                <React.Fragment key={i}>
                  {/* the slot it left + its shadow on the sheet */}
                  <div style={{ position: "absolute", left: 0, top, width: pw * K, height: h, background: `rgba(10,10,12,${0.55 * u})` }} />
                  <div style={{ position: "absolute", left: 30, top: top - h * 0.9 * u, width: pw * K - 60, height: h * 0.9 * u + 6, filter: "blur(18px)", background: `rgba(0,0,0,${0.45 * u})` }} />
                  <div style={{ position: "absolute", left: 50 * K, top, width: (pw - 150) * K, height: h, overflow: "hidden", transformOrigin: "50% 100%",
                    transform: `translateZ(${(14 + near * 50) * u}px) rotateX(${-TILT * u}deg) scale(${1 + near * 0.03 * u})`,
                    boxShadow: `0 ${20 * u}px ${50 * u}px rgba(0,0,0,${0.6 * u})`, background: "#fff" }}>
                    <Img src={staticFile(page)} style={{ position: "absolute", left: -50 * K, top: -top, width: pw * K, height: ph * K }} />
                    {i === rule.strip && ru > 0 && <div style={{ position: "absolute", left: (rule.x0 - 50) * K, top: (rule.y - s.y0) * K, height: 6, width: (rule.x1 - rule.x0) * K * ru, background: RED }} />}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
