// AM07 FoldOpen: the real FOX19 story "State Releases Son Of Beast Report" (14 Dec 2006, captured live with _tools/capture_page.py;
// the site's ad grid below the article cut away) printed and folded in half like a page taken out of a file. Over the darkened
// lattice of the ride, the folded sheet shows only its top half (masthead, headline, date); the lower half then swings down on the
// fold in 3-D (its back face dark, a shadow running ahead of it) and flattens, the camera easing down onto the report's finding.
// The finding's sentence stays bright while the other paragraphs fall back to grey. No red, no re-typed text.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const FoldOpen: React.FC<{ page: string; pw: number; ph: number; fold: number; bg: string; openAt: number; camAt: number; focus: number; keep: [number, number]; dimAt: number; k0?: number; k1?: number }> = ({ page, pw, ph, fold, bg, openAt, camAt, focus, keep, dimAt, k0 = 0.62, k1 = 0.86 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const inn = out(interpolate(f, [0, 20], [0, 1], cl));
  const op = io(interpolate(f, [openAt, openAt + 30], [0, 1], cl));            // 0 = folded back, 1 = flat
  const cam = io(interpolate(f, [camAt, camAt + 40], [0, 1], cl));
  const dim = io(interpolate(f, [dimAt, dimAt + 18], [0, 1], cl)) * 0.6;
  const k = k0 + (k1 - k0) * cam + 0.03 * (f / dur);
  const cy = (fold * 0.55) * (1 - cam) + focus * cam;                           // page y at screen centre
  const ang = -178 * (1 - op);                                                    // lower half rotation about the fold (rotateX)
  const half = (y0: number, y1: number) => (
    <div style={{ position: "absolute", left: 0, top: -y0, width: pw, height: ph }}>
      <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
      {dim > 0 && <>
        <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: keep[0], background: `rgba(244,242,236,${dim})` }} />
        <div style={{ position: "absolute", left: 0, top: keep[1], width: pw, height: ph - keep[1], background: `rgba(244,242,236,${dim})` }} />
      </>}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#040404", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.1 + 0.05 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(.28) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2000, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left: 960 - (pw / 2) * k, top: 540 - cy * k + (1 - inn) * 160, width: pw * k, height: ph * k, opacity: inn,
          transformStyle: "preserve-3d", transform: `rotateX(${8 - 4 * cam}deg) rotateZ(${-1.2 + 0.8 * cam}deg)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${k})`, transformOrigin: "0 0", transformStyle: "preserve-3d" }}>
            {/* top half */}
            <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: fold, overflow: "hidden", background: "#F4F2EC", boxShadow: "0 30px 60px rgba(0,0,0,.7)" }}>
              {half(0, fold)}
              {/* shadow of the swinging half */}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fold, background: `linear-gradient(0deg, rgba(0,0,0,${0.35 * Math.sin(op * Math.PI)}) 0%, rgba(0,0,0,0) 60%)` }} />
            </div>
            {/* lower half, hinged on the fold */}
            <div style={{ position: "absolute", left: 0, top: fold, width: pw, height: ph - fold, transformOrigin: "50% 0%", transform: `rotateX(${ang}deg)`, transformStyle: "preserve-3d" }}>
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#F4F2EC", backfaceVisibility: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.7)" }}>
                {half(fold, ph)}
                <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.45 * (1 - op)})` }} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: "#cfcac0", transform: "rotateX(180deg)", backfaceVisibility: "hidden",
                backgroundImage: "linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.05))" }} />
            </div>
            {/* fold crease */}
            <div style={{ position: "absolute", left: 0, top: fold - 2, width: pw, height: 4, background: `rgba(0,0,0,${0.18 * op})` }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
