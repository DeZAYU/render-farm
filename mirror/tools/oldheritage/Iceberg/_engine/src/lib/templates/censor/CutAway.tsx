// censor / CutAway: the stylised cut-away (FULL_PLAN CENSORSHIP (b)): the clip FREEZES on a safe frame just before the moment, then in 12 f the
// frame goes to a heavy defocus, darkens and takes the case accent as a tint, while a slow push continues; the narration carries the moment.
// REF: D1 E6 look-here freeze (exact-frame freeze, dim -30 %, Dashcam Vol.1 @ 2:18.6 / 3:03) + Farrell T5 stat switch background (Farrell T5 L05:
// defocus sigma 12, gain .45, saturation down) + D1 C12 tinted blob colour. Our version: the tint is a duotone (shadows ink, highlights accent),
// so it reads as a deliberate graded plate, not a broken blur; optional single line of text (DD label) rides on it.
import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { EZ, RoundText, clamp01, drift, lerp } from "../../core";
import { Footage, Graded } from "./shared";

export type CutAwayProps = {
  media: string; startFrom?: number;
  freezeAt: number; // local frame to freeze on (the last SAFE frame)
  accent?: string; // case accent (default DD red)
  line?: { text: string; at: number; red?: string }; // optional rounded label, e.g. { text: "moments later", red: "the fire spread" }
};
export const CutAway: React.FC<CutAwayProps> = ({ media, startFrom = 0, freezeAt, accent = "#B0141A", line }) => {
  const f = useCurrentFrame();
  const k = f - freezeAt;
  const u = EZ.out3(k / 12);
  const fr = k >= 0;
  const blur = 26 * u, dark = lerp(1, 0.42, u), sat = lerp(1, 0.15, u);
  const plate = <Footage src={media} startFrom={startFrom} />;
  return (
    <Graded>
      <AbsoluteFill style={{ transform: fr ? `scale(${(drift(k, 0.03) * (1 + 0.06 * u)).toFixed(5)})` : undefined, filter: fr ? `blur(${blur.toFixed(1)}px) brightness(${dark.toFixed(3)}) saturate(${sat.toFixed(3)})` : undefined }}>
        {fr ? <Freeze frame={freezeAt}>{plate}</Freeze> : plate}
      </AbsoluteFill>
      {fr ? <AbsoluteFill style={{ background: accent, mixBlendMode: "color", opacity: 0.75 * u }} /> : null}
      {fr ? <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,${(0.6 * u).toFixed(2)}) 100%)` }} /> : null}
      {line && f >= line.at ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 26, opacity: clamp01((f - line.at) / 12), transform: `translateY(${(18 * (1 - EZ.out3((f - line.at) / 22))).toFixed(1)}px)`, filter: "drop-shadow(0 4px 10px rgba(0,0,0,.6))" }}>
            <RoundText text={line.text} cap={64} colour="#F4F4F4" />
            {line.red ? <RoundText text={line.red} cap={64} colour="#F92B30" /> : null}
          </div>
        </AbsoluteFill>
      ) : null}
    </Graded>
  );
};
