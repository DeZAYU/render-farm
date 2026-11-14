// quote / QuoteOnPlate: reported words over a defocused footage plate, with an attribution line. REF Farrell text T6 I08 (quote lines over a
// dimmed face, IG 5:39.04: the plate defocuses and dims, the lines arrive one at a time) + Farrell T5 / R11 plate treatment (blur ~12, gain ~.45,
// desaturated, the clip keeps playing) + VV §8 ghosting on the voice (0.3 -> 1 in 4 f). Map: c03 #9 ("IF IT HAPPENED ONCE MORE..." / "...SHUT
// THE RIDE DOWN FOR THE DAY", attribution "- operator's evidence to the inquest"), c05 #25.
// Differs from quote/WordSyncPhoto (photo, lowercase, word by word, re-centring) and quote/Typewriter (typed characters): here WHOLE LINES land on
// their words as caps (one line per entry, no re-wrap while the tracking closes), each one ghosting in while its letter-spacing CLOSES (0.16 -> 0.02 em) and it rises 12 px; left-aligned block with a dark
// left-side falloff over the moving plate; the key phrase can be red; the attribution arrives with a red dash.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, FONT, H, RC, W, clamp01, fs, ghost } from "../../core";
import { DefocusPlate } from "../../core/kits/verdict";

export type PlateLine = { text: string; at: number; red?: boolean };
export type QuoteOnPlateProps = { media: string; mediaStart?: number; lines: PlateLine[]; attribution?: { text: string; at: number }; cap?: number; subCap?: number; x?: number; maxW?: number };
export const QuoteOnPlate: React.FC<QuoteOnPlateProps> = ({ media, mediaStart = 0, lines, attribution, cap = 58, subCap = 30, x = 0.1 * W, maxW = 1350 }) => {
  const f = useCurrentFrame();
  const fsz = fs("inter", cap);
  const first = lines[0]?.at ?? 0;
  const shade = EZ.out2(clamp01((f - first + 10) / 16));
  return (
    <DefocusPlate media={media} mediaStart={mediaStart} blur={12} dim={0.42} sat={0.4}>
      <div style={{ position: "absolute", inset: 0, opacity: shade, background: "linear-gradient(90deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,0) 75%)" }} />
      <div style={{ position: "absolute", left: x, top: H / 2, transform: "translateY(-50%)", width: maxW }}>
        {lines.map((l, i) => {
          const k = f - l.at;
          const g = ghost(k, 5, 0.25);
          const close = EZ.out3(clamp01(k / 18));
          const y = 12 * (1 - EZ.out3(clamp01(k / 14)));
          return (
            <div key={i} style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fsz, lineHeight: 1.18, letterSpacing: `${(0.16 - 0.14 * close).toFixed(3)}em`, color: l.red ? RC.ringRed : "#F2F2F2",
              opacity: g, transform: `translateY(${y.toFixed(2)}px)`, marginBottom: cap * 0.32, whiteSpace: "nowrap", textShadow: l.red ? "0 0 16px rgba(227,10,16,.45), 0 4px 12px rgba(0,0,0,.7)" : "0 4px 12px rgba(0,0,0,.7)" }}>
              {l.text}
            </div>
          );
        })}
        {attribution ? (
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: cap * 0.5, opacity: ghost(f - attribution.at, 6, 0) }}>
            <div style={{ width: 46 * EZ.out3(clamp01((f - attribution.at) / 10)), height: 5, background: RC.ringRed, boxShadow: "0 0 8px rgba(227,10,16,.6)" }} />
            <div style={{ fontFamily: FONT.inter, fontWeight: 500, fontStyle: "italic", fontSize: fs("inter", subCap), color: "#C9C9C9", letterSpacing: "0.01em", textShadow: "0 2px 6px rgba(0,0,0,.7)" }}>{attribution.text}</div>
          </div>
        ) : null}
      </div>
    </DefocusPlate>
  );
};
