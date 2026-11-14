// quote / PhraseSlam_A (EDITOR A sibling of SlamCard / KineticTitle / WordPops; Amusement Park 2026-10-19).
// ONE reported phrase (a quote's key words) slammed over the case footage: the phrase lands from x1.6 to x1 in 5 f with a 2 f kick and a
// 1 f white flash on its key word, the key word red; a small attribution line types on under it. The footage keeps playing underneath at
// 46 % with a radial dark centre, and the camera keeps a slow push (+3 %/s) plus a 1.5 px/s/s settle drift on the phrase, never parked.
// Bebas caps for the phrase (cap 112, wraps to two lines), Inter 600 for the attribution. Use for "past the edge of a catastrophe".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type PhraseSlamAProps = { media: string; mediaStart?: number; lines: { text: string; red?: boolean }[]; at: number; attribution?: { text: string; at: number }; cap?: number };
const RED = "#E30A10";
export const PhraseSlam_A: React.FC<PhraseSlamAProps> = ({ media, mediaStart = 0, lines, at, attribution, cap = 112 }) => {
  const f = useCurrentFrame();
  const k = f - at;
  const u = EZ.in2(clamp01(k / 5));
  const s = k < 0 ? 0 : 1.6 - 0.6 * u;
  const kick = k >= 5 && k < 9 ? Math.sin(((k - 5) / 4) * Math.PI) * 6 : 0;
  const flash = k >= 5 && k < 6 ? 1 : 0;
  const ak = attribution ? f - attribution.at : -1;
  const shown = attribution ? attribution.text.slice(0, Math.max(0, Math.min(attribution.text.length, Math.floor(ak / 1.3)))) : "";
  const drift = k > 5 ? -0.75 * ((k - 5) / 30) ** 1.2 * 10 : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <FootPlate src={media} startFrom={mediaStart} push={0.03} filter="brightness(.46) saturate(.85)" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,0,0,.6), rgba(0,0,0,0) 100%)" }} />
      {k >= 0 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translate(${kick.toFixed(1)}px, ${drift.toFixed(1)}px) scale(${s.toFixed(4)})`, opacity: clamp01(k / 2) }}>
          {lines.map((ln, i) => (
            <div key={i} style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), lineHeight: 1.08, color: ln.red ? RED : "#FDFDFD", textAlign: "center", whiteSpace: "nowrap", filter: `drop-shadow(0 6px 18px rgba(0,0,0,.75))${ln.red ? " drop-shadow(0 0 14px rgba(227,10,16,.5))" : ""}` }}>{ln.text}</div>
          ))}
          {shown ? <div style={{ marginTop: 28, fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", 28), color: "rgba(240,240,240,.88)", whiteSpace: "nowrap" }}>{shown}</div> : null}
        </AbsoluteFill>
      ) : null}
      {flash ? <AbsoluteFill style={{ background: "#fff", opacity: 0.14 }} /> : null}
    </AbsoluteFill>
  );
};
