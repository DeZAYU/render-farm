// quote / WitnessLine: one reported witness / victim line WRITTEN in a marker hand over a dark plate. REF Farrell text T6 (quote lines over a
// dimmed plate) as the frame, with a hand-written variant: the line is WRITTEN ON letter by letter at writing speed (not typed, not ghosted), each
// letter landing with a little ink spread; the key word gets a hand-drawn red underline stroke on its word. FONTS.md: default face = Varela Round + round
// stroke (the Dashcam label face); Lacquer (title-wall brush) only via face="lacquer". Map: c08 #11 ("LIKE A TORPEDO" on "torpedo", "- his stepdaughter"; no
// photo of the person), c08 #20 ("INCONCEIVABLE" ... "HE SHOULDN'T HAVE SURVIVED", reported speech: no quotation marks).
// Differs from QuoteOnPlate (grotesk caps, whole lines) and RedSentence/WordPops (static pops on black): a handwritten, tilted line.
import React from "react";
import { useCurrentFrame } from "remotion";
import { CAP, EZ, FONT, H, RC, W, clamp01, fs, ghost, measure } from "../../core";
import { DefocusPlate } from "../../core/kits/verdict";

export type HandLine = { text: string; at: number; red?: boolean; underline?: boolean };
export type WitnessLineProps = { media?: string; mediaStart?: number; lines: HandLine[]; attribution?: { text: string; at: number }; cap?: number; subCap?: number; cps?: number; tilt?: number;
  /** typeface (FONTS.md roles): "round" (default) = the Dashcam label face, Varela Round + round stroke (Arial Rounded MT Bold weight);
   *  "lacquer" = the title-wall brush face (reviewers flag it outside the title wall: use only with sign-off) */
  face?: "round" | "lacquer" };
/** a hand-drawn underline (tapered ribbon with a slight wave) under a span of width w */
const Underline: React.FC<{ w: number; p: number; colour: string; seed?: number }> = ({ w, p, colour, seed = 1 }) => {
  if (p <= 0) return null;
  const n = 40, top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * p;
    const x = -8 + t * (w + 16);
    const y = 6 * Math.sin(t * 3.1 + seed) - 6 * t;
    const th = 9 * Math.min(1, t / 0.08) * Math.min(1, (p - t) / 0.06 + (p >= 1 ? 1 : 0)) * (p >= 1 ? Math.min(1, (1 - t) / 0.12) : 1) + 1.5;
    top.push(`${x.toFixed(1)},${(y - th / 2).toFixed(1)}`);
    bot.unshift(`${x.toFixed(1)},${(y + th / 2).toFixed(1)}`);
  }
  return (
    <svg width={w + 40} height={60} style={{ position: "absolute", left: -10, bottom: -42, overflow: "visible" }}>
      <polygon points={[...top, ...bot].join(" ")} transform="translate(10 30)" fill={colour} style={{ filter: "drop-shadow(0 0 6px rgba(227,10,16,.5))" }} />
    </svg>
  );
};
export const WitnessLine: React.FC<WitnessLineProps> = ({ media, mediaStart = 0, lines, attribution, cap = 92, subCap = 30, cps = 14, tilt = -2.5, face = "round" }) => {
  const f = useCurrentFrame();
  const round = face === "round";
  const fam = round ? FONT.round : FONT.lacquer;
  const sw = round ? 0.076 * cap : 1.5;
  const fsz = round ? (cap - sw) / CAP.round : fs("lacquer", cap);
  const cpf = cps / 30;
  return (
    <DefocusPlate media={media} mediaStart={mediaStart} blur={16} dim={0.3} sat={0.3}>
      <div style={{ position: "absolute", left: W / 2, top: H * 0.47, transform: `translate(-50%,-50%) rotate(${tilt}deg) scale(${(1 + 0.004 * (f / 30)).toFixed(5)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: cap * 0.55 }}>
        {lines.map((l, i) => {
          const k = f - l.at;
          const n = k < 0 ? 0 : (k * cpf) + 1; // fractional: the current letter is mid-stroke
          const done = n >= l.text.length;
          const ul = l.underline && done ? EZ.out2(clamp01((f - (l.at + l.text.length / cpf) - 2) / 10)) : 0;
          return (
            <div key={i} style={{ position: "relative", whiteSpace: "pre", fontFamily: fam, fontSize: fsz, lineHeight: 1.05, color: l.red ? "#F1332E" : "#F3F1EC", letterSpacing: "0.03em",
              WebkitTextStroke: `${sw.toFixed(2)}px ${l.red ? "#F1332E" : "#F3F1EC"}`, paintOrder: "stroke fill", strokeLinejoin: "round", filter: l.red ? "drop-shadow(0 0 10px rgba(241,51,46,.45)) drop-shadow(0 4px 10px rgba(0,0,0,.7))" : "drop-shadow(0 4px 10px rgba(0,0,0,.75))" }}>
              {[...l.text].map((c, j) => {
                const local = n - j; // >1 = written
                const o = local <= 0 ? 0 : clamp01(local * 1.6);
                const sc = local <= 0 ? 1 : 1 + 0.12 * (1 - clamp01(local));
                return <span key={j} style={{ display: "inline-block", opacity: o, transform: `scale(${sc.toFixed(3)})`, transformOrigin: "50% 80%" }}>{c}</span>;
              })}
              {l.underline ? <Underline w={measure(l.text, `${fsz}px "${fam}"`) + l.text.length * 0.03 * fsz} p={ul} colour={RC.ringRed} seed={i + 1} /> : null}
            </div>
          );
        })}
        {attribution ? (
          <div style={{ marginTop: cap * 0.2, fontFamily: FONT.inter, fontWeight: 500, fontSize: fs("inter", subCap), color: "#BEBEBE", letterSpacing: "0.02em", opacity: ghost(f - attribution.at, 6, 0), transform: `rotate(${-tilt}deg)` }}>{attribution.text}</div>
        ) : null}
      </div>
    </DefocusPlate>
  );
};
