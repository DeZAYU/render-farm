// AM12 StrikeTitle: the case title in the owner's approved style B (13 Nov, dev/TitleStyles.tsx "typewriter strike"): on the case's own
// darkened frame, the title struck letter by letter in the distressed serif (each letter lands with a tiny ink settle), then the
// place · year line under it. Parametrised copy of style B (TitleStyles is a demo board, not importable per case).
import React from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.25, 0.1, 0.25, 1);
const W = "#F2F2F0", GLOW = "0 0 18px rgba(255,255,255,.22), 0 2px 8px rgba(0,0,0,.75)";
let fontP: Promise<void> | null = null;
const useFonts = () => {
  const [h] = React.useState(() => delayRender("strike fonts"));
  React.useEffect(() => {
    if (!fontP) fontP = Promise.all([
      new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load(),
      new FontFace("ArchivoBlk", `url(${staticFile("fonts/Archivo-wdth-wght.ttf")})`, { weight: "100 900", stretch: "62% 125%" }).load(),
    ]).then((fs) => { fs.forEach((f) => document.fonts.add(f)); });
    fontP.then(() => continueRender(h));
  }, [h]);
};

export const StrikeTitle: React.FC<{ title: string; place: string; bg: string }> = ({ title, place, bg }) => {
  useFonts();
  const f = useCurrentFrame(); const { durationInFrames: N } = useVideoConfig();
  const per = 2.2, start = 10, u = f / N;
  const pa = start + title.length * per + 6, t = interpolate(f, [pa, pa + 18], [0, 1], { ...cl, easing: E });
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.07 * u})`, filter: "brightness(0.42) contrast(1.1) saturate(0.6) blur(2px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", fontFamily: "Elite", fontSize: 96, letterSpacing: "0.06em", color: W, textShadow: GLOW }}>
        {title.split("").map((c, i) => { const a = f - start - i * per; const o = a < 0 ? 0 : 1; const j = a >= 0 && a < 3 ? (3 - a) * 0.6 : 0;
          return <span key={i} style={{ opacity: o, display: "inline-block", transform: `translateY(${-j}px)`, filter: `blur(${j * 0.3}px)`, whiteSpace: "pre" }}>{c}</span>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "110%",
        fontSize: 26, letterSpacing: "0.32em", color: "rgba(242,242,240,.78)", opacity: t, transform: `translateY(${(1 - t) * 6}px)` }}>{place}</div>
    </AbsoluteFill>
  );
};
