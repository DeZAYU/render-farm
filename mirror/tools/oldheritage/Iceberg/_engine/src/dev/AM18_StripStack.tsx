// AM18 StripStack (Black Sunday): the real AP story as the Deseret News printed it on 10 Jun 1991 ("3 are killed in accidents at Ohio
// amusement park", captured page) cut into its three real strips: masthead headline + date, the pond paragraphs, the Flight Commander
// paragraphs. Each strip drops onto a dark table one at a time (lands with a small settle and a tightening contact shadow, slightly
// askew like clippings laid down by hand), the camera following down the stack. A soft light picks out the paragraph the VO is on and
// the rest of the paper falls into shade. Used in two parts of one case (t0 = the frame this part starts at inside the device's own
// time line) so the second part continues the same table: the third strip lands when the VO reaches the second accident. No red.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Strip = { y0: number; y1: number; land: number; rot: number; dx: number };
type Key = { at: number; y: number; k: number };
type Focus = { y0: number; y1: number; at: number };
const cam = (f: number, ks: Key[]) => {
  let c = { y: ks[0].y, k: ks[0].k };
  for (let i = 1; i < ks.length; i++) {
    const a = ks[i - 1], b = ks[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u };
  }
  return c;
};
const focusAt = (f: number, fs: Focus[]) => {
  let cur: Focus | null = null, prev: Focus | null = null;
  for (const x of fs) if (f >= x.at) { prev = cur; cur = x; }
  if (!cur) return { y0: 0, y1: 0, a: 0 };
  const u = io(interpolate(f, [cur.at, cur.at + 18], [0, 1], cl));
  if (!prev) return { y0: cur.y0, y1: cur.y1, a: u };
  return { y0: prev.y0 + (cur.y0 - prev.y0) * u, y1: prev.y1 + (cur.y1 - prev.y1) * u, a: 1 };
};

export const StripStack: React.FC<{ sheet: string; sw: number; sh: number; bg: string; strips: Strip[]; keys: Key[]; focus: Focus[]; t0?: number; cx?: number }> = ({ sheet, sw, sh, bg, strips, keys, focus, t0 = 0, cx }) => {
  const fl = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const f = fl + t0;
  const c = cam(f, keys);
  const fo = focusAt(f, focus);
  const left = 960 - (cx ?? sw / 2) * c.k, top = 540 - c.y * c.k;
  return (
    <AbsoluteFill style={{ background: "#070707", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.12 + 0.04 * (fl / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) brightness(.28) saturate(.6)" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left, top, width: sw * c.k, height: sh * c.k }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: sw, height: sh, transform: `scale(${c.k})`, transformOrigin: "0 0" }}>
          {strips.map((s, i) => {
            const u = out(interpolate(f, [s.land, s.land + 16], [0, 1], cl));
            if (f < s.land) return null;
            const lift = 1 - u;
            const shade = fo.a > 0 ? (s.y1 < fo.y0 || s.y0 > fo.y1 ? 0.5 * fo.a : 0) : 0;
            return (
              <div key={i} style={{ position: "absolute", left: s.dx, top: s.y0, width: sw, height: s.y1 - s.y0, overflow: "hidden", background: "#FAF9F7",
                transform: `translateY(${-90 * lift}px) scale(${1 + 0.06 * lift}) rotate(${s.rot + 1.5 * lift}deg)`, opacity: Math.min(1, u * 1.6),
                boxShadow: `0 ${10 + 30 * lift}px ${24 + 50 * lift}px rgba(0,0,0,${0.75 - 0.3 * lift})` }}>
                <Img src={staticFile(sheet)} style={{ position: "absolute", left: 0, top: -s.y0, width: sw, height: sh }} />
                {/* light on the paragraph being read, shade elsewhere on this strip */}
                {fo.a > 0 && s.y1 >= fo.y0 && s.y0 <= fo.y1 && <>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: Math.max(0, fo.y0 - s.y0 - 10), background: `rgba(12,12,14,${0.5 * fo.a})` }} />
                  <div style={{ position: "absolute", left: 0, right: 0, top: Math.max(0, fo.y1 - s.y0 + 10), bottom: 0, background: `rgba(12,12,14,${0.5 * fo.a})` }} />
                </>}
                {shade > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(12,12,14,${shade})` }} />}
                <div style={{ position: "absolute", inset: 0, background: "rgba(238,226,200,.12)", mixBlendMode: "multiply" }} />
              </div>
            );
          })}
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
