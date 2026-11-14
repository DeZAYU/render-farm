// labels / SpeakerCaptions: clip-speech captions coded by WHO speaks (REFERENCE_SYNTHESIS §H16 + §A7).
// REF: Dashcam Vol.1 speaker-anchored boxes @2:48-3:01 (168-181 s: black boxes ~85 %, ~40 px, placed beside the speaker, white civilians, cyan
// police) + D1 kinetic 911 captions @18:28.8-18:38.8 (1108.8-1118.8 s: 1-2 words per chunk, bold ~60 px, y 0.85-0.92, key words cyan) + D2 caption
// timing (on -0.12 s before the line, off +0.3-0.6 s after it). DD: never VO over clip speech.
// OUR VERSION: role colour = the theme accent for police / dispatcher, neutral white for civilians; the theme text face (D-DIN 700 for DASH; Inter 600 opt-in) on 85 % boxes;
// anchors optionally tracked (source px keys, the plate push applied). Kinetic mode for 911 / radio audio: chunks bottom-centre, *key* words in accent.
import React from "react";
import { useCurrentFrame } from "remotion";
import { WATERPARK, EZ, FONT, H, W, clamp01, linPush, measure, type Theme } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "./kit";
import { fontStr, fsOf } from "./dash1kit";

export type Role = "police" | "dispatcher" | "civilian" | "driver" | "caller";
export type Speaker = { id: string; role: Role; track?: TrackKey[]; x?: number; y?: number; side?: "left" | "right" };
/** one spoken line: local frames of its first and last spoken word. Mark key words with *asterisks* (kinetic mode accent). */
export type CapLine = { who: string; text: string; at: number; end: number; words?: { text: string; at: number }[] };

export type SpeakerCaptionsProps = {
  media: string; mediaStart?: number; push?: number;
  speakers: Speaker[];
  lines: CapLine[];
  mode?: "anchored" | "kinetic";
  theme?: Theme;
  face?: "inter" | "theme"; // default "theme" = the theme text face (DASH: D-DIN 700, STYLE INSTRUMENT); "inter" = Inter 600 (Direction A)
  cap?: number; // >= 40 anchored; kinetic default 44 (D1 ~60 px bold)
  lead?: number; // frames the caption appears before the line (D2: 0.12 s = 4 f)
  hang?: number; // frames it stays after the line (0.3-0.6 s: 12 f)
  maxW?: number; // max box width (anchored), px
  gap?: number; // px between the speaker point and the box (anchored)
  y?: number; // kinetic baseline (0.85-0.92 H)
};

const ACCENT_ROLES: Role[] = ["police", "dispatcher"];

export const SpeakerCaptions: React.FC<SpeakerCaptionsProps> = ({
  media, mediaStart = 0, push = 0.04, speakers, lines, mode = "anchored", theme = WATERPARK, face = "theme", cap, lead = 4, hang = 12, maxW = 0.42 * W, gap = 70, y = 0.89 * H,
}) => {
  const f = useCurrentFrame();
  const th = theme;
  const s = linPush(f, push);
  const t = face === "inter" ? { face: FONT.inter, weight: 600 } : th.text;
  const roleOf = (id: string) => speakers.find((q) => q.id === id);
  const live = lines.filter((l) => f >= l.at - lead && f < l.end + hang);
  const strip = (x: string) => x.replace(/\*/g, "");
  if (mode === "kinetic") {
    const cs = Math.max(40, cap ?? 44);
    const size = fsOf(t.face, cs);
    const font = fontStr({ face: t.face, weight: Math.max(700, t.weight) }, size);
    return (
      <FootPlate src={media} startFrom={mediaStart} push={push}>
        {live.map((l, li) => {
          const sp = roleOf(l.who);
          const acc = sp ? ACCENT_ROLES.includes(sp.role) : false;
          // chunks of 1-2 words: given word timings, or spread evenly over the line
          const ws = l.words ?? l.text.split(/\s+/).filter(Boolean).map((w, i, a) => ({ text: w, at: Math.round(l.at + ((l.end - l.at) * i) / Math.max(1, a.length)) }));
          const chunks: { text: string; at: number }[] = [];
          for (let i = 0; i < ws.length; i += 2) {
            const two = i + 1 < ws.length && strip(ws[i].text).length + strip(ws[i + 1].text).length <= 12; // short pairs travel together
            chunks.push({ text: two ? `${ws[i].text} ${ws[i + 1].text}` : ws[i].text, at: ws[i].at });
            if (!two) i -= 1;
          }
          let ci = -1;
          chunks.forEach((c, i) => { if (f >= c.at - lead) ci = i; });
          if (ci < 0) return null;
          const c = chunks[ci];
          const k = f - (c.at - lead);
          const endO = 1 - clamp01((f - (l.end + hang - 3)) / 3);
          const u = EZ.out3(k / 4);
          const tw = measure(strip(c.text), font);
          return (
            <div key={li} style={{ position: "absolute", left: W / 2 - tw / 2, top: y - 0.8 * size, opacity: clamp01(k / 3) * endO, transform: `scale(${(1.06 - 0.06 * u).toFixed(4)})`, transformOrigin: "50% 80%",
              fontFamily: t.face, fontWeight: Math.max(700, t.weight), fontSize: size, lineHeight: 1, whiteSpace: "pre", color: acc ? th.accent : th.neutral,
              textShadow: "0 2px 4px rgba(0,0,0,.9), 0 0 16px rgba(0,0,0,.55)" }}>
              {c.text.split(" ").map((w, i) => {
                const key = /^\*.*\*[.,!?]*$/.test(w);
                return <span key={i} style={key ? { color: th.accent, textShadow: `0 0 10px ${th.accentGlow}, 0 2px 4px rgba(0,0,0,.9)` } : undefined}>{(i ? " " : "") + strip(w)}</span>;
              })}
            </div>
          );
        })}
      </FootPlate>
    );
  }
  // anchored boxes beside the speaker
  const cs = Math.max(40, cap ?? 40);
  const size = fsOf(t.face, cs);
  const font = fontStr(t, size);
  const padX = cs * 0.5, padY = cs * 0.34, lh = size * 1.18;
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {live.map((l, li) => {
        const sp = roleOf(l.who);
        const acc = sp ? ACCENT_ROLES.includes(sp.role) : false;
        const src = sp?.track?.length ? trackAt(sp.track, f) : { x: sp?.x ?? W * 0.5, y: sp?.y ?? H * 0.55 };
        const p = scr(src, s);
        const side = sp?.side ?? (p.x < W / 2 ? "right" : "left");
        const text = strip(l.text);
        const one = measure(text, font);
        const inner = Math.min(one, maxW - 2 * padX);
        const nLines = Math.max(1, Math.ceil(one / Math.max(1, inner) - 0.02));
        const bw = inner + 2 * padX + 2, bh = nLines * lh + 2 * padY;
        let bx = side === "right" ? p.x + gap : p.x - gap - bw;
        bx = Math.min(W - 48 - bw, Math.max(48, bx));
        const by = Math.min(H - 48 - bh, Math.max(48, p.y - bh / 2));
        const k = f - (l.at - lead);
        const o = clamp01(k / 3) * (1 - clamp01((f - (l.end + hang - 3)) / 3));
        return (
          <div key={li} style={{ position: "absolute", left: bx, top: by, width: bw, opacity: o, transform: `translateY(${(6 * (1 - EZ.out3(k / 5))).toFixed(2)}px)`,
            background: "rgba(0,0,0,.85)", padding: `${padY}px ${padX}px`, boxSizing: "border-box",
            fontFamily: t.face, fontWeight: t.weight, fontSize: size, lineHeight: `${lh}px`, color: acc ? th.accent : th.neutral, overflowWrap: "break-word" }}>
            {text}
          </div>
        );
      })}
    </FootPlate>
  );
};
