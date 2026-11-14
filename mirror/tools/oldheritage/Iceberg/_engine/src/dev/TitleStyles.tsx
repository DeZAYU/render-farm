// Case-title styles (13 Nov, owner: "intro text which u use, the very first second text, diff styles"): eight ways to open a case on
// its OWN darkened footage frame, all inside the channel look (distressed serif "Elite", white, red only as a small accent).
// A = the current brand TitleCard for reference. 4 s each over DC01's title frame.
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RED } from "../brand";

let fontP: Promise<void> | null = null;
const useFonts = () => {
  const [h] = React.useState(() => delayRender("title fonts"));
  React.useEffect(() => {
    if (!fontP) fontP = Promise.all([
      new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load(),
      new FontFace("ArchivoBlk", `url(${staticFile("fonts/Archivo-wdth-wght.ttf")})`, { weight: "100 900", stretch: "62% 125%" }).load(),
    ]).then((fs) => { fs.forEach((f) => document.fonts.add(f)); });
    fontP.then(() => continueRender(h));
  }, [h]);
};

export const N = 120;
const BGI = "case/graded/title.jpg", TITLE = "THE EXCAVATOR ARREST", PLACE = "HARDWICK, VERMONT · 2022";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const E = Easing.bezier(0.25, 0.1, 0.25, 1);
const k = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...cl, easing: E });
const W = "#F2F2F0", GLOW = "0 0 18px rgba(255,255,255,.22), 0 2px 8px rgba(0,0,0,.75)";

const Bg: React.FC<{ dim?: number; blur?: number; z?: [number, number]; ox?: number }> = ({ dim = 0.42, blur = 2, z = [1.06, 1.13], ox = 0 }) => {
  const f = useCurrentFrame(), u = f / N;
  return (<AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
    <Img src={staticFile(BGI)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z[0] + (z[1] - z[0]) * u}) translateX(${ox * u}px)`,
      filter: `brightness(${dim}) contrast(1.1) saturate(0.6) blur(${blur}px)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.72) 100%)" }} />
  </AbsoluteFill>);
};
const Tag: React.FC<{ c: string; name: string }> = ({ c, name }) => (
  <div style={{ position: "absolute", left: 36, top: 30, fontFamily: "ArchivoBlk", fontWeight: 700, fontSize: 24, letterSpacing: 3, color: "rgba(255,255,255,.55)" }}>{c} · {name}</div>
);
const Place: React.FC<{ at: number; top: number; align?: "center" | "left"; left?: number }> = ({ at, top, align = "center", left = 0 }) => {
  const f = useCurrentFrame(), t = k(f, at, at + 18);
  return <div style={{ position: "absolute", left, right: align === "center" ? 0 : undefined, top, textAlign: align, fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "110%",
    fontSize: 26, letterSpacing: "0.32em", color: "rgba(242,242,240,.78)", opacity: t, transform: `translateY(${(1 - t) * 6}px)` }}>{PLACE}</div>;
};

// A. current brand card (reference)
const A: React.FC = () => {
  const f = useCurrentFrame(), t = k(f, 8, 30);
  return (<AbsoluteFill><Bg />
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: "Elite", fontSize: 100, letterSpacing: "0.04em", color: W,
      opacity: t, filter: `blur(${(1 - t) * 6}px)`, transform: `translateY(${(1 - t) * 10}px)`, textShadow: GLOW }}>{TITLE}</div>
    <Tag c="A" name="CURRENT" /></AbsoluteFill>);
};

// B. typewriter: struck letter by letter (each lands with a tiny ink settle), then the place line
const B: React.FC = () => {
  const f = useCurrentFrame(), per = 2.2, start = 10;
  return (<AbsoluteFill><Bg />
    <div style={{ position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", fontFamily: "Elite", fontSize: 96, letterSpacing: "0.06em", color: W, textShadow: GLOW }}>
      {TITLE.split("").map((c, i) => { const a = f - start - i * per; const o = a < 0 ? 0 : 1; const j = a >= 0 && a < 3 ? (3 - a) * 0.6 : 0;
        return <span key={i} style={{ opacity: o, display: "inline-block", transform: `translateY(${-j}px)`, filter: `blur(${j * 0.3}px)`, whiteSpace: "pre" }}>{c}</span>; })}
    </div>
    <Place at={start + TITLE.length * per + 6} top={590} />
    <Tag c="B" name="TYPEWRITER STRIKE" /></AbsoluteFill>);
};

// C. stacked editorial: small spaced kicker, one huge word, a thin rule draws between, place under
const C: React.FC = () => {
  const f = useCurrentFrame(), a = k(f, 6, 26), r = k(f, 18, 44), b = k(f, 22, 46);
  return (<AbsoluteFill><Bg dim={0.36} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "115%", fontSize: 40,
      letterSpacing: "0.5em", color: W, opacity: a, transform: `translateY(${(1 - a) * 8}px)` }}>THE EXCAVATOR</div>
    <div style={{ position: "absolute", left: 960 - 330 * r, width: 660 * r, top: 404, height: 2, background: "rgba(242,242,240,.8)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 418, textAlign: "center", fontFamily: "Elite", fontSize: 200, letterSpacing: "0.03em", color: W, textShadow: GLOW,
      opacity: b, filter: `blur(${(1 - b) * 8}px)`, transform: `scale(${1.04 - 0.04 * b})` }}>ARREST</div>
    <Place at={44} top={660} />
    <Tag c="C" name="STACKED" /></AbsoluteFill>);
};

// D. light sweep: a soft band of light travels across and leaves the letters lit (film-print feel), slight gate weave
const D: React.FC = () => {
  const f = useCurrentFrame(), x = interpolate(f, [8, 52], [-30, 130], { ...cl, easing: E }), wv = Math.sin(f * 0.7) * 0.6;
  const mask = `linear-gradient(90deg, #000 ${x - 30}%, rgba(0,0,0,.0) ${x + 4}%)`;
  return (<AbsoluteFill><Bg dim={0.38} />
    <AbsoluteFill style={{ transform: `translate(${wv}px, ${wv * 0.5}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: "Elite", fontSize: 104, letterSpacing: "0.05em", color: W, textShadow: GLOW,
        WebkitMaskImage: mask, maskImage: mask }}>{TITLE}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: "Elite", fontSize: 104, letterSpacing: "0.05em", color: "#fff",
        WebkitMaskImage: `linear-gradient(90deg, transparent ${x - 8}%, #000 ${x}%, transparent ${x + 8}%)`, maskImage: `linear-gradient(90deg, transparent ${x - 8}%, #000 ${x}%, transparent ${x + 8}%)`,
        textShadow: "0 0 30px rgba(255,240,220,.9)", opacity: x > 110 ? 0 : 1 }}>{TITLE}</div>
    </AbsoluteFill>
    <Place at={50} top={598} />
    <Tag c="D" name="LIGHT SWEEP" /></AbsoluteFill>);
};

// E. depth: the title sits on its own plane in 3-D; the camera drifts past, the footage behind defocuses as the title sharpens
const Ed: React.FC = () => {
  const f = useCurrentFrame(), u = k(f, 0, N), t = k(f, 6, 34);
  return (<AbsoluteFill><Bg dim={0.4} blur={1 + 5 * t} ox={-40} />
    <AbsoluteFill style={{ perspective: 1400 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", fontFamily: "Elite", fontSize: 110, letterSpacing: "0.04em", color: W, textShadow: GLOW,
        transform: `translateZ(${120 * u}px) rotateY(${14 - 22 * u}deg) translateX(${40 - 60 * u}px)`, opacity: t, filter: `blur(${(1 - t) * 10}px)` }}>{TITLE}</div>
    </AbsoluteFill>
    <Place at={40} top={604} />
    <Tag c="E" name="DEPTH DRIFT" /></AbsoluteFill>);
};

// F. case number: a huge hollow "01" breathes in behind, the title settles over it, a small red square leads the place line
const Fn: React.FC = () => {
  const f = useCurrentFrame(), n = k(f, 0, 30), t = k(f, 14, 38), p = k(f, 40, 56);
  return (<AbsoluteFill><Bg dim={0.36} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontFamily: "ArchivoBlk", fontWeight: 900, fontStretch: "120%", fontSize: 560, lineHeight: 1,
      color: "transparent", WebkitTextStroke: "3px rgba(242,242,240,.22)", opacity: n, transform: `scale(${1.08 - 0.08 * n})` }}>01</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 474, textAlign: "center", fontFamily: "Elite", fontSize: 100, letterSpacing: "0.04em", color: W, textShadow: GLOW,
      opacity: t, filter: `blur(${(1 - t) * 6}px)` }}>{TITLE}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, opacity: p }}>
      <div style={{ width: 14, height: 14, background: RED }} />
      <div style={{ fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "110%", fontSize: 26, letterSpacing: "0.32em", color: "rgba(242,242,240,.8)" }}>{PLACE}</div>
    </div>
    <Tag c="F" name="CASE NUMBER" /></AbsoluteFill>);
};

// G. documentary lower-left: footage stays brighter, title left-aligned low with a thin white bar that grows, place under it
const G: React.FC = () => {
  const f = useCurrentFrame(), bar = k(f, 6, 30), t = k(f, 14, 40);
  return (<AbsoluteFill><Bg dim={0.55} blur={0} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 45%)" }} />
    <div style={{ position: "absolute", left: 120, top: 770 - 110 * bar, width: 4, height: 110 * bar + 52, background: W }} />
    <div style={{ position: "absolute", left: 150, top: 690, fontFamily: "Elite", fontSize: 92, letterSpacing: "0.03em", color: W, textShadow: GLOW,
      clipPath: `inset(0 ${100 - 100 * t}% 0 0)` }}>{TITLE}</div>
    <Place at={40} top={800} align="left" left={154} />
    <Tag c="G" name="DOCUMENTARY LOWER-LEFT" /></AbsoluteFill>);
};

// H. signal lock: the title arrives like a tape locking on (two short horizontal slips + faint colour split), then holds clean
const H: React.FC = () => {
  const f = useCurrentFrame(), a = f - 10, on = a >= 0 ? 1 : 0;
  const slip = a < 0 ? 0 : a < 3 ? 26 : a < 5 ? -12 : a < 7 ? 5 : 0, split = a >= 0 && a < 8 ? (8 - a) * 0.8 : 0;
  const base: React.CSSProperties = { position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: "Elite", fontSize: 100, letterSpacing: "0.04em" };
  return (<AbsoluteFill><Bg />
    <div style={{ ...base, color: "rgba(255,40,40,.55)", transform: `translateX(${slip - split}px)`, opacity: on * (split > 0 ? 1 : 0) }}>{TITLE}</div>
    <div style={{ ...base, color: "rgba(40,200,255,.55)", transform: `translateX(${slip + split}px)`, opacity: on * (split > 0 ? 1 : 0) }}>{TITLE}</div>
    <div style={{ ...base, color: W, textShadow: GLOW, transform: `translateX(${slip}px)`, opacity: on }}>{TITLE}</div>
    <Place at={30} top={598} />
    <Tag c="H" name="SIGNAL LOCK" /></AbsoluteFill>);
};

const ALL = [A, B, C, D, Ed, Fn, G, H];
export const COUNT = ALL.length;
export const TitleStyles: React.FC = () => { useFonts(); return (
  <AbsoluteFill style={{ background: "#000" }}>{ALL.map((V, i) => <Sequence key={i} from={i * N} durationInFrames={N}><V /></Sequence>)}</AbsoluteFill>); };
