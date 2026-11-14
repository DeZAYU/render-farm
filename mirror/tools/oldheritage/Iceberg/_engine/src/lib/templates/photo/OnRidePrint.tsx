// photo / OnRidePrint (set "midway", Amusement Park "MIDWAY AFTER DARK" b-roll / thin-footage device, REFERENCE_SYNTHESIS §I3 + §I4 #6).
// REDESIGN 2026-10-19 (review #10: the first version was the D2 E12 clothesline polaroid again = photo/Polaroid; f0-f8 showed an empty plate).
// REF Visual Venture §5 settle (drop bezier(0.503,0,0.201,0.819), rotation settle bezier(0,0.45,0.4,1)) + Dashcam Vol.2 E12 camera move numbers
// only (push log over 2.0 s ez(0,.6,.2,1)) + Dashcam Vol.2 E5 strip shift (55 f ez(.45,0,.25,1)) + Dashcam Vol.1 typed "40 minutes" @0:15.6
// (2 f / char) + the park's own ride-photo kiosk (on-ride photo prints: full-bleed landscape print with the ride's branded band).
// Our version: the ride's photo KIOSK. A dark kiosk fascia across the top carries the ride name as a magenta LED dot-matrix strip (kit led.tsx);
// the on-ride print (live clip or still, full bleed, NO polaroid margin, no cord/peg) feeds out of the printer slot under it from f0, is
// released, drops a few px with a VV settle while the camera pushes in on it; a gloss sheen crosses the print once. The print's branded band
// (ride name + typed caption, hot part in the accent) sits under the photo. Backdrop = the same clip blurred sigma 30 at 35 % (never on black).
// mode "strip": the kiosk prints a vertical strip of 2-4 frames on dark glossy paper; on each item's `at` the printer steps the next frame
// out of the slot (the strip advances one frame), so the newest frame is always under the slot (FilmStrip = horizontal reel, not a print).
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { EZ, H, Media, W, clamp01, lerp, lerpLog } from "../../core";
import { CardVig } from "../../core/kits/photo";
import { LedText, fsFace, pickAccent } from "../../core/kits/led";
import { WATERPARK, type Theme } from "../../core/themes";

const PULL = Easing.bezier(0.35, 0, 0.2, 1); // D2 E12 push, eased IN (fix 2026-10-19 v4 review: no velocity jump after the print settles)
const SHIFT = Easing.bezier(0.45, 0, 0.25, 1); // D2 E5 strip shift
const FEED = Easing.bezier(0.25, 0.1, 0.25, 1); // printer eject: quick start, soft stop
export type PrintCaption = { text: string; hot?: boolean };
export type PrintItem = { src: string; startFrom?: number; at?: number; caption?: PrintCaption[]; captionAt?: number };
export type OnRidePrintProps = {
  mode?: "single" | "strip";
  items: PrintItem[]; // single: items[0]; strip: 2-4 stills, items[i].at = the frame the printer steps frame i out (i >= 1)
  bg?: string; // blurred backdrop (default items[0].src)
  bgStart?: number;
  dropDur?: number; // feed frames (30): the print ejects from the slot over this, starting on f0
  pull?: number; // camera push frames after the release (60 = 2.0 s)
  caption?: PrintCaption[]; // single mode: typed in the print's branded band, 2 f/char
  captionAt?: number;
  printW?: number; // single-mode print width at camera 1 (1120); lower it for small source photos so the pushed print stays <= the source px (M-068)
  rideName?: string; // LED ride-name strip on the kiosk fascia + printed in the band ("SKY RIDER")
  paper?: string; // band / strip paper colour (dark gloss)
  ink?: string; // caption colour (default theme neutral)
  theme?: Theme;
  fire?: boolean;
};

const typedSpans = (parts: PrintCaption[], n: number, ink: string, acc: string, glow: string) => {
  let left = n;
  return parts.map((p, i) => {
    const show = p.text.slice(0, Math.max(0, Math.min(p.text.length, left)));
    left -= p.text.length;
    return <span key={i} style={{ color: p.hot ? acc : ink, textShadow: p.hot ? `0 0 10px ${glow}` : undefined }}>{show}</span>;
  });
};
const capLen = (parts?: PrintCaption[]) => (parts ?? []).reduce((a, p) => a + p.text.length, 0);
const typedCount = (k: number, len: number) => (k < 0 ? 0 : Math.min(len, Math.floor(k / 2) + 1));

export const OnRidePrint: React.FC<OnRidePrintProps> = ({
  mode = "single", items, bg, bgStart = 0, dropDur = 30, pull = 60, caption, captionAt = 34, rideName = "SKY RIDER", paper = "#140A10", ink, theme = WATERPARK, fire, printW,
}) => {
  const f = useCurrentFrame();
  const acc = pickAccent(theme, fire);
  const glow = fire ? "rgba(255,255,255,.5)" : theme.accentGlow;
  const inkC = ink ?? theme.neutral;
  const strip = mode === "strip";
  // ---- kiosk fascia + slot
  const FAS = 158; // fascia height (screen px at camera 1)
  const slotY = FAS;
  const cell = 11;
  // ---- print geometry
  const PWd = strip ? 820 : (printW ?? 1120), PH = (PWd * 9) / 16;
  const BAND = strip ? 0 : 96; // single: printed branded band under the photo
  const M = strip ? 18 : 0; // strip: dark paper border
  const GAP = strip ? 70 : 0; // strip: caption row under each frame
  const n = strip ? Math.max(1, items.length) : 1;
  const pitch = strip ? PH + GAP : PH + BAND; // one printed frame
  const cardW = PWd + 2 * M;
  // ---- feed: starts on f0 (the print is already coming out of the slot on the first frame)
  const feed0 = FEED(clamp01((f + 7) / (dropDur + 7)));
  let pos = 0;
  if (strip) for (let i = 1; i < n; i++) pos += SHIFT(clamp01((f - (items[i].at ?? 1e9)) / 55));
  const fed = pitch * (feed0 + pos) + (strip ? M : 0); // paper length out of the slot
  // ---- single: release + VV settle drop + camera push in on the print
  const relAt = dropDur + 4;
  const rk = f - relAt;
  const drop = strip ? 0 : 44 * EZ.photoY(clamp01(rk / 26));
  const rot = strip ? 0 : -1.4 * EZ.photoRot(clamp01(rk / 32)) * (rk > 0 ? 1 : 0);
  const printTop = slotY + fed - (strip ? n * pitch + M : pitch) + drop; // top edge of the paper
  const camK = strip ? 0 : PULL(clamp01(rk / pull));
  const cam = lerpLog(1, strip ? 1 : 1.28, camK) * Math.exp(0.005 * (f / 30));
  const focusY = strip ? slotY + PH / 2 + M + 30 : slotY + 44 + pitch / 2;
  const cardX = W / 2 - cardW / 2;
  // gloss sheen: one diagonal pass after the release (glossy print), plus a faint static top-left gloss
  const sheen = clamp01((f - relAt) / 36);
  const capSize = fsFace(theme.title.face, strip ? 30 : 32);
  const nameSize = fsFace(theme.title.face, 36);
  const bgSrc = bg ?? items[0]?.src;
  const frame = (it: PrintItem, i: number) => {
    // strip: frame i is printed i-th; the newest frame sits closest to the slot, so frame i's top = paper top + (n-1-i) * pitch
    const y = strip ? M + (n - 1 - i) * pitch : 0;
    const dimK = strip ? Math.min(1, Math.abs(i - pos)) : 0;
    const capParts = strip ? it.caption : caption;
    const capAt = strip ? (it.captionAt ?? (it.at ?? 0) + 12) : captionAt;
    const shown = typedCount(f - capAt, capLen(capParts));
    return (
      <React.Fragment key={i}>
        <div style={{ position: "absolute", left: M, top: y, width: PWd, height: PH, overflow: "hidden", background: "#111", filter: dimK > 0.01 ? `brightness(${(1 - 0.45 * dimK).toFixed(3)})` : undefined }}>
          <AbsoluteFill style={{ transform: `scale(${(1.02 + 0.015 * (f / 30)).toFixed(5)})` }}>
            <Sequence layout="none"><Media src={it.src} startFrom={it.startFrom ?? 0} /></Sequence>
          </AbsoluteFill>
          <CardVig k={0.32} />
        </div>
        {strip && capParts && shown > 0 ? (
          <div style={{ position: "absolute", left: M + 4, top: y + PH + (GAP - capSize * 0.72) / 2, fontFamily: theme.title.face, fontWeight: theme.title.weight, fontSize: capSize, lineHeight: 0.72,
            whiteSpace: "pre", letterSpacing: "0.03em", opacity: 1 - 0.4 * dimK }}>
            {typedSpans(capParts, shown, inkC, acc, glow)}
          </div>
        ) : null}
      </React.Fragment>
    );
  };
  const paperH = strip ? n * pitch + M : pitch;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* backdrop: the same clip, blurred sigma 30 at 35 % (Zoo Q2: never on black) */}
      {bgSrc ? (
        <AbsoluteFill style={{ transform: `scale(${(1.15 * Math.pow(cam, 0.3)).toFixed(5)})`, filter: "blur(30px) brightness(.35)" }}>
          <Sequence layout="none"><Media src={bgSrc} startFrom={bgStart} /></Sequence>
        </AbsoluteFill>
      ) : null}
      {/* camera: push about the print + a small pan that lifts the print to frame centre, so the fascia leaves the frame (no bar left at the top) */}
      <AbsoluteFill style={{ transform: `translateY(${(-(focusY - H / 2 + 60) * camK).toFixed(2)}px) scale(${cam.toFixed(5)})`, transformOrigin: `${W / 2}px ${focusY}px` }}>
        {/* the print (paper), clipped at the slot line: nothing of it exists above the printer slot */}
        <div style={{ position: "absolute", left: -300, top: slotY, width: W + 600, height: 2600, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: cardX + 300, top: printTop - slotY, width: cardW, height: paperH, transformOrigin: `${cardW / 2}px 0px`, transform: `rotate(${rot.toFixed(3)}deg)`,
          borderRadius: 5, background: paper, overflow: "hidden", boxShadow: "0 26px 60px rgba(0,0,0,.7), 0 4px 12px rgba(0,0,0,.5)" }}>
          {(strip ? items : items.slice(0, 1)).map(frame)}
          {!strip ? (
            // printed branded band: magenta rule, ride name (Oswald 600) left, typed caption right
            <div style={{ position: "absolute", left: 0, top: PH, width: PWd, height: BAND, background: paper, borderTop: `6px solid ${acc}`, boxSizing: "border-box",
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", whiteSpace: "pre" }}>
              <div style={{ fontFamily: theme.title.face, fontWeight: theme.title.weight, fontSize: nameSize, lineHeight: 1, color: theme.neutral, letterSpacing: "0.04em" }}>{rideName.toUpperCase()}</div>
              <div style={{ fontFamily: theme.title.face, fontWeight: theme.title.weight, fontSize: capSize, lineHeight: 1, letterSpacing: "0.03em" }}>
                {caption ? typedSpans(caption, typedCount(f - captionAt, capLen(caption)), inkC, acc, glow) : null}
              </div>
            </div>
          ) : null}
          {/* gloss: static top-left sheen + one diagonal pass after the release */}
          <AbsoluteFill style={{ background: "linear-gradient(125deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 30%)", pointerEvents: "none" }} />
          {sheen > 0 && sheen < 1 ? (
            <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(255,255,255,0) ${(lerp(-40, 120, sheen) - 12).toFixed(1)}%, rgba(255,255,255,.16) ${lerp(-40, 120, sheen).toFixed(1)}%, rgba(255,255,255,0) ${(lerp(-40, 120, sheen) + 12).toFixed(1)}%)`, pointerEvents: "none" }} />
          ) : null}
        </div>
        </div>
        {/* kiosk fascia: dark panel, magenta LED ride-name strip, printer slot lip at its bottom edge (drawn over the paper so the print feeds out of it) */}
        <div style={{ position: "absolute", left: -40, top: -200, width: W + 80, height: FAS + 200, background: "linear-gradient(180deg, rgba(12,6,10,.86) 0%, rgba(23,11,18,.84) 70%, rgba(10,5,8,.9) 100%)",
          boxShadow: `0 10px 30px rgba(0,0,0,.7), inset 0 -2px 18px ${glow.replace(/[\d.]+\)$/, ".18)")}` }} />
        <LedText text={rideName.toUpperCase()} cell={cell} x={W / 2} y={Math.max((FAS - 22) / 2, 54 + 3.5 * cell + 4)} colour={acc} glow={glow} glowPx={[6, 22]} ghost={0.22} ghostColour={theme.dim} bloom={0.5} />
        <div style={{ position: "absolute", left: cardX - 30, top: slotY - 16, width: cardW + 60, height: 16, borderRadius: 3, background: "linear-gradient(180deg, #000 0%, #050203 60%, #2a1a22 100%)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,.9), 0 1px 0 rgba(255,235,245,.14)" }} />
        <div style={{ position: "absolute", left: -40, top: slotY - 1, width: W + 80, height: 2, background: "rgba(255,235,245,.10)" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
