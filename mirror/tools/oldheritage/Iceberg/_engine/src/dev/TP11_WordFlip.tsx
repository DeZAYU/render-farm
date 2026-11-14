// TP11 WordFlip — Omroep Brabant's two key Dutch sentences, set sharp in type on a white card that tilts up out of the dark footage.
// Each sentence lands in Dutch with a small English gloss under it; on the VO's word, the key Dutch phrase flips over like a card
// onto its English (red): "niet gecontroleerd" -> NOT INSPECTED, "nalatig" -> NEGLIGENT. Source credited small. Built 3 Nov 2026
// for the audit (replaces ChipLift_N2P on the blurry page scan).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
let p: Promise<void> | null = null;

type Line = { pre: string; nl: string; en: string; post: string; gloss: string; at: number; flipAt: number };

export const WordFlip: React.FC<{ bg: string; bgFrom: number; lines: Line[]; credit: string }> = ({ bg, bgFrom, lines, credit }) => {
  const [h] = React.useState(() => delayRender("elite"));
  React.useEffect(() => {
    if (!p) p = new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load().then((ff) => { document.fonts.add(ff); });
    p.then(() => continueRender(h));
  }, [h]);
  const f = useCurrentFrame(); const { durationInFrames: N } = useVideoConfig();
  const kIn = out(interpolate(f, [0, 22], [0, 1], cl));
  const rx = interpolate(kIn, [0, 1], [38, 8]) - 4 * io(f / N);      // card tilts up, keeps settling
  const ry = -6 + 5 * io(f / N);
  const sc = 0.97 + 0.04 * io(f / N);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "blur(14px) brightness(0.32) saturate(0.7)", transform: "scale(1.12)" }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1900, alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1500, padding: "64px 84px 50px", background: "#F4F2EC", opacity: kIn, boxShadow: "0 40px 90px rgba(0,0,0,.75)",
          transform: `translateY(${(1 - kIn) * 140}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(4)})`, transformStyle: "preserve-3d" }}>
          <div style={{ display: "inline-block", background: RED, color: "#fff", fontFamily: "ArchivoBlk, Archivo", fontWeight: 900, fontSize: 30, padding: "6px 16px 2px", letterSpacing: "0.04em" }}>
            THE REPORT, IN DUTCH</div>
          {lines.map((l, i) => {
            const k = out(interpolate(f, [l.at, l.at + 16], [0, 1], cl));
            const fl = interpolate(f, [l.flipAt - 6, l.flipAt + 6], [0, 1], cl);   // 0..0.5 Dutch turns away, 0.5..1 English turns in
            const nlA = interpolate(fl, [0, 0.5], [0, 90], cl), enA = interpolate(fl, [0.5, 1], [-90, 0], cl);
            const mark = io(interpolate(f, [l.flipAt + 4, l.flipAt + 16], [0, 1], cl));
            const dimOld = i < lines.length - 1 ? interpolate(f, [lines[i + 1].at - 4, lines[i + 1].at + 10], [1, 0.45], cl) : 1;
            return (
              <div key={i} style={{ marginTop: i === 0 ? 40 : 46, opacity: k * dimOld, transform: `translateY(${(1 - k) * 30}px)` }}>
                <div style={{ fontFamily: "Elite", fontSize: 54, lineHeight: 1.25, color: "#151515" }}>
                  {l.pre}
                  <span style={{ display: "inline-grid", verticalAlign: "bottom", perspective: 600 }}>
                    <span style={{ gridArea: "1/1", transform: `rotateX(${nlA}deg)`, opacity: fl < 0.5 ? 1 : 0, transformOrigin: "50% 60%" }}>{l.nl}</span>
                    <span style={{ gridArea: "1/1", transform: `rotateX(${enA}deg)`, opacity: fl >= 0.5 ? 1 : 0, transformOrigin: "50% 60%", position: "relative",
                      fontFamily: "ArchivoBlk, Archivo", fontWeight: 900, fontSize: 56, color: RED, letterSpacing: "0.01em", whiteSpace: "nowrap" }}>
                      {l.en}
                      <span style={{ position: "absolute", left: 0, bottom: -4, height: 7, width: `${(mark * 100).toFixed(1)}%`, background: RED }} />
                    </span>
                  </span>
                  {l.post}
                </div>
                <div style={{ marginTop: 12, fontFamily: "Archivo", fontWeight: 500, fontSize: 32, color: "#5A5A5A" }}>{l.gloss}</div>
              </div>
            );
          })}
          <div style={{ marginTop: 44, borderTop: "2px solid #CFCAC0", paddingTop: 14, fontFamily: "Archivo", fontWeight: 500, fontSize: 22, color: "#8A8478", letterSpacing: "0.03em" }}>{credit}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
