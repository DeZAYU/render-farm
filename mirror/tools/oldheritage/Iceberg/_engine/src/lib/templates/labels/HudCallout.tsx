// labels / HudCallout: REF Dashcam Vol.1 E4 bracket callout @1:07.9-1:09.3 "[2004 Subaru Forester XT]" and @7:02 "[chasing...]" (a thin red
// polyline ~3 px, two segments, runs from the object to a "[" bracket; the LINE DRAWS FIRST, then the words type in ~3 f per word; Helvetica
// Bold class #EF020C, thin red glow ~4 px; leads the speech by 0.4-1.0 s). wp3 Intro3 HudCallout "[Liseberg, Sweden]" @ abs 88 (approved).
// OUR VERSION: Inter 700; the anchor can follow the object (`track` keys in source px, the footage push applied), with a red dot on it.
import React from "react";
import { useCurrentFrame } from "remotion";
import { CHIP_TONE, EZ, FONT, H, RC, W, clamp01, fs, linPush, measure, type ChipTone } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "./kit";

export type HudCalloutProps = {
  media: string; mediaStart?: number; push?: number; text: string; at: number; track: TrackKey[]; // anchor (source px); one key = static
  elbow?: { dx: number; dy: number }; left?: boolean; cap?: number; wordStep?: number; outAt?: number;
  tone?: ChipTone | "hud"; // "hud" (default) = the D1 red bracket text; "light" = white type on a dark chip (M-024: busy / bright plates)
};
export const HudCallout: React.FC<HudCalloutProps> = ({ media, mediaStart = 0, push = 0.045, text, at, track, elbow = { dx: -150, dy: -150 }, left = true, cap = 40, wordStep = 3, outAt, tone = "hud" }) => {
  const f = useCurrentFrame();
  const k = f - at;
  const s = linPush(f, push);
  const a = trackAt(track, f);
  const p = scr(a, s);
  const fsz = fs("inter", cap);
  const full = measure(text, `700 ${fsz}px ${FONT.inter}`);
  // keep the label inside the 80 px safe margin: decide the side ONCE, from the anchor at the entry frame (no mid-shot flip)
  const p0 = scr(trackAt(track, at), linPush(at, push));
  const fitsL = p0.x - Math.abs(elbow.dx) - 50 - full >= 80, fitsR = p0.x + Math.abs(elbow.dx) + 50 + full <= W - 80;
  const goLeft = left ? (fitsL || !fitsR) : !(fitsR || !fitsL);
  const left_ = goLeft;
  const e = { x: p.x + (goLeft ? -1 : 1) * Math.abs(elbow.dx), y: p.y + elbow.dy };
  const end = { x: e.x + (left_ ? -40 : 40), y: e.y };
  const L = Math.hypot(e.x - p.x, e.y - p.y) + 40;
  const lp = EZ.out2(k / 8);
  const words = text.split(" ");
  const nW = k < 8 ? 0 : Math.min(words.length, Math.floor((k - 8) / wordStep) + 1);
  const o = outAt === undefined ? 1 : 1 - clamp01((f - outAt) / 6);
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {k >= 0 && o > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: o }}>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 4px rgba(239,2,12,.8))" }}>
            <polyline points={`${p.x},${p.y} ${e.x},${e.y} ${end.x},${end.y}`} fill="none" stroke={RC.hudRed} strokeWidth={3} strokeLinejoin="round" strokeDasharray={`${(L * lp).toFixed(1)} 4000`} />
            <circle cx={p.x} cy={p.y} r={5} fill={RC.hudRed} opacity={lp} />
          </svg>
          {tone !== "hud" && nW > 0 ? (
            <div style={{ position: "absolute", left: (left_ ? end.x - 10 - full : end.x + 10) - 12, width: full + 28, top: end.y - fsz * 0.6 - 6, height: fsz * 1.2 + 12, background: CHIP_TONE[tone].fill, borderRadius: 4, borderLeft: left_ ? undefined : `3px solid ${RC.hudRed}`, borderRight: left_ ? `3px solid ${RC.hudRed}` : undefined }} />
          ) : null}
          <div style={{ position: "absolute", left: left_ ? end.x - 10 - full : end.x + 10, width: full + 4, top: end.y - fsz * 0.6, fontFamily: FONT.inter, fontWeight: 700, fontSize: fsz, lineHeight: 1.2, color: tone === "hud" ? RC.hudRed : CHIP_TONE[tone].text, whiteSpace: "pre",
            textShadow: tone === "hud" ? "0 0 4px rgba(239,2,12,.7), 0 2px 6px rgba(0,0,0,.7)" : CHIP_TONE[tone].shadow }}>
            {words.map((w, i) => <span key={i} style={{ opacity: i < nW ? 1 : 0 }}>{i ? " " : ""}{w}</span>)}
          </div>
        </div>
      ) : null}
    </FootPlate>
  );
};
