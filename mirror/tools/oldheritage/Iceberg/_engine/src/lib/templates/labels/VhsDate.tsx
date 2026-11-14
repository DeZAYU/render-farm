// labels / VhsDate: REF Abyssal (Chinese iceberg) typed date @0:42.6-0:45.0 "DECEMBER 20, 2015" (study I3: the story's first shot BLURS
// ~25-30 px behind it; VCR OSD Mono caps, cap ~.09 H, white with a 2-3 px RGB fringe (red left, cyan right) + black shadow 4 4 0; TYPED as it
// is spoken (~18 char/s, 1-2 chars every 3-6 f, pauses at word breaks); a RED BLOCK CURSOR #E00000 follows, then blinks ~0.5 s on/off; out:
// text fades 0.85 s while the background UN-BLURS in 0.3 s, no cut) + Abyssal location label @0:46.5 (VCR, bottom-right, soft glow, fade-in 23 f).
// Use sparingly (Rule 0: an Abyssal signature): a VHS/CCTV-era case, archive tape, a found-footage date.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, measure } from "../../core";
import { FootPlate, type Word } from "./kit";

export type VhsDateProps = { media: string; mediaStart?: number; push?: number; words: Word[]; step?: number; cap?: number; y?: number; outAt?: number; outDur?: number; place?: { text: string; at: number }; labelCap?: number };
const Fringe: React.FC<{ text: string; fsz: number; o?: number }> = ({ text, fsz, o = 1 }) => {
  const base: React.CSSProperties = { position: "absolute", left: 0, top: 0, fontFamily: FONT.vcr, fontSize: fsz, lineHeight: 1, whiteSpace: "pre" };
  return (
    <div style={{ position: "relative", opacity: o }}>
      <div style={{ ...base, position: "relative", color: "#fff", textShadow: "4px 4px 0 #000" }}>{text}</div>
      <div style={{ ...base, left: -2, color: "rgba(255,0,0,.6)", mixBlendMode: "screen" }}>{text}</div>
      <div style={{ ...base, left: 2, color: "rgba(0,255,255,.6)", mixBlendMode: "screen" }}>{text}</div>
    </div>
  );
};
export const VhsDate: React.FC<VhsDateProps> = ({ media, mediaStart = 0, push = 0.03, words, step = 4, cap = 96, y = 0.51 * H, outAt, outDur = 26, place, labelCap = 38 }) => {
  const f = useCurrentFrame();
  const fsz = fs("vcr", cap);
  const full = words.map((w) => w.text).join(" ");
  const adv = measure("M", `${fsz}px "${FONT.vcr}"`);
  const fullW = adv * full.length;
  const x0 = (W - fullW) / 2;
  // characters typed so far (each word from its own onset, `step` f per char)
  let shown = "";
  let lastT = 0;
  words.forEach((w, i) => {
    const n = f < w.at ? 0 : Math.min(w.text.length, Math.floor((f - w.at) / step) + 1);
    if (n > 0) { shown += (i ? " " : "") + w.text.slice(0, n); lastT = w.at + (w.text.length - 1) * step; }
  });
  const first = words[0]?.at ?? 0;
  const done = shown.length === full.length;
  const eo = outAt === undefined ? 0 : clamp01((f - outAt) / outDur);
  const unblur = outAt === undefined ? 0 : clamp01((f - (outAt + outDur - 9)) / 9);
  const blur = 26 * EZ.out2((f - first + 8) / 15) * (1 - unblur);
  const blink = done ? Math.floor((f - lastT) / 15) % 2 === 0 : true;
  const showCursor = f >= first - 4 && eo < 1 && blink;
  const po = place ? EZ.out2((f - place.at) / 23) * (1 - eo) : 0;
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push} base={1.05} filter={blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined}>
      <div style={{ position: "absolute", left: x0, top: y - fsz * 0.55, display: "flex", alignItems: "flex-start", opacity: 1 - eo }}>
        <Fringe text={shown} fsz={fsz} />
        {showCursor ? <div style={{ width: adv * 0.92, height: fsz * 0.86, marginLeft: shown ? adv * 0.08 : 0, marginTop: fsz * 0.04, background: "#E00000", boxShadow: "4px 4px 0 #000" }} /> : null}
      </div>
      {place && po > 0 ? (
        <div style={{ position: "absolute", right: 0.11 * W, top: 0.918 * H - fs("vcr", labelCap) * 0.8, opacity: po, filter: "drop-shadow(0 0 8px rgba(255,255,255,.35))" }}>
          <Fringe text={place.text} fsz={fs("vcr", labelCap)} />
        </div>
      ) : null}
    </FootPlate>
  );
};
