// endscreen / Slot: the outro end-screen plate. YouTube end-screen geometry (16:9 canvas; the video element is placed in YouTube Studio over
// the slot, ~0.31 W wide; the subscribe element is a circle; keep the slot and the subscribe area free of anything readable).
// Look: Rule 0 house style. A blurred, darkened montage of the video's own media (crossfading Farrell-style slow pushes, DD grade vignette,
// dust specks) under an empty slot drawn as the DD Vol.2 carousel "next clip" card (Dashcam Vol.2 @ 0:33.4: dark card, 5 px red border; I9
// card scale settle ez(.4,0,.2,1)), an empty ring for the subscribe element, and an optional "watch next" line in the DD rounded label face
// (white words rise, red key word sharpens, D3 E2). Entry: fade up from black 18 f, the card settles 1.06 -> 1 with the stagger plate ->
// card (+8 f) -> ring (+14 f) -> words. Zoo 2026-10-18: layout "two" (two stacked slots right, subscribe left) + wordsOut. Nothing sits under the YouTube elements but the empty slot.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { CAP, EZ, Media, RC, RoundText, Vignette, W, clamp01, measure } from "../../core";
import { Specks } from "../../core/kits/photo";

export type ESWord = { text: string; at: number; red?: boolean };
export type SlotProps = {
  media: string[]; // montage plate (stills or clips), cycled
  hold?: number; // frames per montage item
  layout?: "right" | "centre" | "two"; // slot right + subscribe left; slot centred + subscribe under-left; "two": TWO video slots stacked right + subscribe left (Zoo 2026-10-18)
  wordsOut?: number; // frame the "watch next" line fades out (keeps the tail clean)
  words?: ESWord[]; // "watch next" line
  subscribe?: boolean; // reserve + draw the subscribe ring
  guides?: boolean; // draw the exact YouTube element boxes (layout check only)
  cap?: number; // "watch next" cap
};

const CARD = Easing.bezier(0.4, 0, 0.2, 1);

export const Slot: React.FC<SlotProps> = ({ media, hold = 120, layout = "right", words = [], subscribe = true, guides = false, cap = 54, wordsOut }) => {
  const k = useCurrentFrame();
  const n = Math.max(1, media.length), X = 24; // crossfade frames
  // geometry (YouTube end-screen video element ~0.31 W; ours 0.32 W slot + border)
  const sw = Math.round(0.32 * W), sh = Math.round((sw * 9) / 16);
  const two = layout === "two";
  const slot = layout === "right" ? { x: 940, y: 340 } : two ? { x: 1060, y: 170 } : { x: (W - sw) / 2, y: 300 };
  const slots = two ? [slot, { x: slot.x, y: slot.y + sh + 70 }] : [slot];
  const ringD = 200;
  const ring = layout === "right" ? { x: 470, y: slot.y + sh / 2 } : two ? { x: 520, y: 540 } : { x: slot.x - 40 - ringD / 2, y: slot.y + sh + 140 };
  const wo = wordsOut === undefined ? 1 : 1 - clamp01((k - wordsOut) / 14);
  const up = clamp01(k / 18);
  const ck = k - 8, cs = 1.06 - 0.06 * CARD(clamp01(ck / 24)), co = clamp01(ck / 10);
  const rk = k - 22, ro = clamp01(rk / 12);
  const f = (cap - 0.076 * cap) / CAP.round, space = measure(" ", `${f}px "Varela Round"`) * 0.9;
  const lineX = layout === "right" ? slot.x : W / 2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* montage plate */}
      <AbsoluteFill style={{ opacity: up, filter: "blur(16px) brightness(.38) saturate(.75)", transform: "scale(1.08)" }}>
        {media.map((m, i) => {
          const from = i * hold;
          return (
            <Sequence key={i} from={from - X} durationInFrames={i === n - 1 ? Infinity : hold + 2 * X} layout="none">
              <MontageItem src={m} from={from} hold={hold} x={X} last={i === n - 1} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 55% 48%, rgba(60,8,8,.18) 0%, rgba(0,0,0,0) 60%)", opacity: up }} />
      <Vignette />
      <Specks k={k} n={36} seed={23} max={0.2} />
      {/* the empty video slot: DD carousel card */}
      {slots.map((q, i) => {
        const o2 = clamp01((ck - i * 6) / 10), s2 = 1.06 - 0.06 * CARD(clamp01((ck - i * 6) / 24));
        return <div key={i} style={{ position: "absolute", left: q.x, top: q.y, width: sw, height: sh, opacity: i ? o2 : co, transform: `scale(${(i ? s2 : cs).toFixed(4)})`, transformOrigin: "50% 50%",
          background: "linear-gradient(160deg, rgba(20,20,22,.78), rgba(6,6,7,.86))", boxShadow: `0 0 0 5px ${RC.d1Red}, 0 0 34px rgba(235,24,25,.28), 0 30px 70px rgba(0,0,0,.75)` }} />;
      })}
      {subscribe ? (
        <div style={{ position: "absolute", left: ring.x - ringD / 2, top: ring.y - ringD / 2, width: ringD, height: ringD, borderRadius: "50%", opacity: ro * 0.9,
          transform: `scale(${(1.08 - 0.08 * EZ.out3(rk / 20)).toFixed(4)})`, border: "4px solid rgba(253,253,253,.85)",
          boxShadow: "0 0 18px rgba(255,255,255,.18), inset 0 0 30px rgba(0,0,0,.6), 0 20px 50px rgba(0,0,0,.6)", background: "rgba(0,0,0,.35)" }} />
      ) : null}
      {words.length ? (
        <div style={{ position: "absolute", left: layout === "right" ? lineX : two ? ring.x - 300 : 0, width: layout === "right" ? undefined : two ? 600 : W, top: two ? ring.y - ringD / 2 - 150 : slot.y - 118, opacity: wo, display: "flex", justifyContent: layout === "right" ? "flex-start" : "center", gap: space }}>
          {words.map((w, i) => {
            const q = k - w.at;
            if (q < 0) return <div key={i} style={{ opacity: 0 }}><RoundText text={w.text} cap={cap} colour="#fff" /></div>;
            const rise = (w.red ? 22 : 19) * (1 - EZ.out3(q / 26));
            const o = w.red ? 0.2 + 0.8 * EZ.out2(q / 10) : EZ.out2(q / 16);
            const b = w.red ? 8 * (1 - clamp01(q / 10)) : 0;
            const glow = w.red ? "drop-shadow(0 0 6px rgba(242,37,34,.75)) drop-shadow(0 0 16px rgba(242,37,34,.45)) drop-shadow(0 3px 6px rgba(0,0,0,.5))" : "drop-shadow(0 4px 8px rgba(0,0,0,.65))";
            return (
              <div key={i} style={{ opacity: o, transform: `translateY(${rise.toFixed(2)}px)`, filter: `${glow}${b > 0.05 ? ` blur(${b.toFixed(2)}px)` : ""}` }}>
                <RoundText text={w.text} cap={cap} colour={w.red ? "#F22522" : "#FDFDFD"} />
              </div>
            );
          })}
        </div>
      ) : null}
      {guides ? (
        <>
          {slots.map((q, i) => <div key={i} style={{ position: "absolute", left: q.x + (sw - 0.31 * W) / 2, top: q.y + (sh - (0.31 * W * 9) / 16) / 2, width: 0.31 * W, height: (0.31 * W * 9) / 16, outline: "2px dashed #0f0" }} />)}
          <div style={{ position: "absolute", left: ring.x - ringD / 2, top: ring.y - ringD / 2, width: ringD, height: ringD, borderRadius: "50%", outline: "2px dashed #0f0" }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/** one montage still/clip: linear push (Farrell), crossfade in/out over x frames */
const MontageItem: React.FC<{ src: string; from: number; hold: number; x: number; last: boolean }> = ({ src, hold, x, last }) => {
  const q = useCurrentFrame(); // local to the Sequence (starts x frames before `from`)
  const o = Math.min(clamp01(q / x), last ? 1 : clamp01((hold + 2 * x - q) / x));
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${(1 + 0.012 * (q / 30)).toFixed(5)})` }}>
      <Media src={src} />
    </AbsoluteFill>
  );
};
