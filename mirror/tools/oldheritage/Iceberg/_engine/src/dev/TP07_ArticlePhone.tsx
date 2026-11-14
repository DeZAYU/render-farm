// TP07 (Joker's Jinx): the KTVU article (13 Apr 2017) read on a phone. The page is SET in real type (no scan): a phone in a clean white
// frame, turned slightly in 3-D over a dark blurred photo of the ride, scrolls to the paragraph; the spoken words are marked by a red
// marker stroke sweeping through them in time with the VO, then the phone eases in. Source credited small (KTVU, URL bar + corner).
// part 1: the 2014 paragraph ("same position as ... 2014", "about five hours"); part 2: the inspection paragraph (March 3, 2017; no violations).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Run = string | { t: string; at: number; len: number };
const P1: Run[][] = [
  ["When they finally were back on the ground, Desieareus said he was \"relieved. Very relieved.\""],
  ["The Joker's Jinx has been stuck before, on August 10, 2014. ", { t: "It took about five hours for those riders to be rescued.", at: -2, len: 0 },
    " In a live interview on FOX 5 DC, Prince George's County Fire Department spokesperson Mark Brady said the coaster is ",
    { t: "stuck in about the same position as it was back in 2014", at: -1, len: 0 }, ", and it could take the same amount of time to get the riders down safely."],
  ["At that time, the park said it was a technical issue with the coaster's launch that caused it to get stuck."],
];
const P2: Run[][] = [
  ["According to Six Flags' website, the Joker's Jinx is 1 minute and 15 seconds long and reaches speeds of up to 60 MPH in just over three seconds."],
  ["The Maryland Department of Labor, Licensing and Regulation oversees amusement ride inspections, and they say the Joker's Jinx was ",
    { t: "last inspected on March 3, 2017", at: -1, len: 0 }, ". ", { t: "It does not have any outstanding violations.", at: -2, len: 0 }],
  ["It was introduced in 1999, and is full of twists and turns."],
];

const Mark: React.FC<{ t: string; p: number }> = ({ t, p }) => (
  <span style={{ backgroundImage: `linear-gradient(${RED}, ${RED})`, backgroundRepeat: "no-repeat", backgroundPosition: "0 100%", backgroundSize: `${p * 100}% 16%`,
    color: p > 0.02 ? "#000" : "#2a2a2a", fontWeight: p > 0.02 ? 650 : 430, paddingBottom: 2 }}>{t}</span>
);

/** sweeps: [start frame, end frame] for the 1st and 2nd marked run of the part; scroll: page Y offsets (px) before -> after */
export const ArticlePhone: React.FC<{ part: 1 | 2; bg: string; sweeps: [[number, number], [number, number]]; scroll: [number, number] }> = ({ part, bg, sweeps, scroll }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 14], [0, 1], cl));
  const d = io(f / durationInFrames);
  const sy = interpolate(io(interpolate(f, [4, 34], [0, 1], cl)), [0, 1], scroll);
  const paras = part === 1 ? P1 : P2;
  // marked runs: order of appearance in VO (part 1: "same position" first, "five hours" second)
  const sweepOf = (code: number) => {
    const idx = part === 1 ? (code === -1 ? 0 : 1) : (code === -1 ? 0 : 1);
    const [a, b] = sweeps[idx];
    return interpolate(f, [a, b], [0, 1], cl);
  };
  const W = 820, H = 1560, X = width * 0.5 - W / 2, Y = 70;
  const rotY = -12 + 8 * d, rotX = 9 - 3 * d, sc = 0.94 + 0.08 * d + 0.04 * k;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.4)", transform: `scale(${1.05 + 0.04 * d})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 20%, rgba(0,0,0,.55) 80%)" }} />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, transformOrigin: "50% 22%", opacity: k,
          transform: `translateY(${(1 - k) * 60}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${sc})`,
          background: "#0c0c0c", borderRadius: 64, border: "7px solid #fff", boxShadow: "0 40px 90px rgba(0,0,0,.75)", padding: 18 }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: "#fbfbf9" }}>
            {/* URL bar (source) */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 118, background: "#f0f0ee", borderBottom: "1px solid #ddd", zIndex: 2 }}>
              <div style={{ position: "absolute", left: 34, right: 34, top: 50, height: 52, borderRadius: 14, background: "#e2e2e0", fontFamily: "Inter", fontSize: 24, color: "#444", whiteSpace: "nowrap", overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.01em" }}>ktvu.com/news/24-people-rescued-from-stalled…</div>
            </div>
            {/* article column */}
            <div style={{ position: "absolute", left: 44, right: 40, top: 150, transform: `translateY(${-sy}px)`, fontFamily: "Inter", fontSize: 37, lineHeight: 1.5, color: "#2a2a2a", fontWeight: 430 }}>
              {paras.map((p, i) => (
                <p key={i} style={{ margin: "0 0 42px 0" }}>
                  {p.map((r, j) => typeof r === "string" ? <span key={j}>{r}</span> : <Mark key={j} t={r.t} p={io(sweepOf(r.at))} />)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 46, bottom: 34, fontFamily: "Archivo", fontWeight: 700, fontVariationSettings: "'wght' 700, 'wdth' 100", fontSize: 22, letterSpacing: "0.08em", color: "rgba(255,255,255,.7)", opacity: k }}>
        SOURCE: KTVU FOX 2, APRIL 13, 2017
      </div>
    </AbsoluteFill>
  );
};
