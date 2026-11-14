// AM20 PaperFR (Parc Saint-Paul "Formule 1"): a real French press page (AFP via Brut, captured) as a printed sheet sliding in along a
// dark desk from the right, settling with a slight skew; the camera then travels ALONG the key line from its first word to its last,
// as if read, while one thin red rule draws under the phrase; the rest of the sheet sinks into shade. Because the page is French, the
// English meaning of that one line types in beneath the frame (Elite, white, on a soft dark band), letter by letter after the rule.
// Props: page + pw/ph, line = [x0, y0, x1, y1] of the key phrase (page px), en = English line, k = reading scale, bg still, ruleAt.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const PaperFR: React.FC<{ page: string; pw: number; ph: number; line: [number, number, number, number]; en: string; bg: string; k?: number; k0?: number; ruleAt: number }> = ({ page, pw, ph, line, en, bg, k = 1.25, k0 = 0.95, ruleAt }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const slide = out(interpolate(f, [0, 26], [0, 1], cl));
  const read = io(interpolate(f, [22, ruleAt + 30], [0, 1], cl));
  const kk = k0 + (k - k0) * read + 0.04 * (f / dur);
  const lx0 = line[0] + 140, lx1 = line[2] - 140, ly = (line[1] + line[3]) / 2;
  const fx = pw / 2 + ((lx0 + (lx1 - lx0) * read) - pw / 2) * read, fy = ph / 2 + (ly - ph / 2) * read;
  const left = 960 - fx * kk + (1 - slide) * 1500, top = 560 - fy * kk;
  const ru = out(interpolate(f, [ruleAt, ruleAt + 16], [0, 1], cl));
  const shade = 0.5 * io(interpolate(f, [ruleAt - 10, ruleAt + 14], [0, 1], cl));
  const nch = Math.floor(interpolate(f, [ruleAt + 14, ruleAt + 14 + en.length * 1.4], [0, en.length], cl));
  const band = out(interpolate(f, [ruleAt + 6, ruleAt + 20], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#060606", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.1 + 0.05 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.3) saturate(.6)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left, top, width: pw * kk, height: ph * kk, transform: `rotate(${-1.6 + 0.8 * read}deg)`, boxShadow: "0 36px 80px rgba(0,0,0,.8)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${kk})`, transformOrigin: "0 0", background: "#fff", padding: 0 }}>
          <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(238,226,200,.14)", mixBlendMode: "multiply" }} />
          {/* shade everything but the key line */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: Math.max(0, line[1] - 16), background: `rgba(10,10,12,${shade})` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: line[3] + 16, bottom: 0, background: `rgba(10,10,12,${shade})` }} />
          {ru > 0 && <div style={{ position: "absolute", left: line[0], top: line[3] + 3, height: 5, width: (line[2] - line[0]) * ru, background: RED }} />}
        </div>
      </div>
      {band > 0 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, height: 110, opacity: band,
        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.62) 30%, rgba(0,0,0,.62) 70%, rgba(0,0,0,0) 100%)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontFamily: "Elite", fontSize: 52, color: "#F2F2F0", letterSpacing: "0.02em",
          textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>{en.slice(0, nch)}<span style={{ opacity: 0 }}>{en.slice(nch)}</span></div>
      </div>}
    </AbsoluteFill>
  );
};
