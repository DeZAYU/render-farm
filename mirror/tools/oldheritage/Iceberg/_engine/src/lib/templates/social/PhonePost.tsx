// social / PhonePost: a vertical social post PLAYING inside a phone, over a blurred, darkened copy of the same clip (Abyssal I8 blur fill,
// never black bars). The phone rises in oversize and settles (VV recession, quick start / long settle) with a small handheld roll drift;
// the post's own chrome (handle, caption) sits at the bottom of the screen. Optional `dive`: an accelerating push into the screen (Nocturn
// CP3 +2.7 -> +11 %/s) that drops the bezel and chrome and lands on the Abyssal centre panel (x .311-.686, full height): the hand-over into
// the raw vertical clip. Optional typed translation (D3 boxed caption).
// REF Abyssal vertical phone clips + blur fill @0:02.6 / 33:26-34:56 (I8) + Farrell PG6 page/clip in a phone (OF 22:21.8) + Nocturn CP3
// accelerating push into the player (psy 8:17.6) + VV §1 recession.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { EZ, FONT, MBlur, Media, clamp01, fs, lerp, lerpLog } from "../../core";
import { TypedCaption, type CaptionLine } from "../page/shared";

export type PhonePostProps = {
  clip: string; // vertical (9:16) clip or still
  startFrom?: number; // clip in-point (frames)
  handle?: string; caption?: string; meta?: string; // the post chrome (typeset; omit for a bare screen)
  enter?: number; // rise duration (default 30)
  dive?: { at: number; d?: number }; // push into the screen -> centre panel
  captions?: CaptionLine[];
  cap?: number; // post caption cap (default 28)
  labelCap?: number; // handle cap (default 30)
  subCap?: number; // meta ("· 3d") cap (default 28)
  captionCap?: number; // typed translation cap (default 40)
};
const SCR_H = 1000, SCR_W = (SCR_H * 9) / 16, BEZ = 16;
const DIVE = Easing.bezier(0.55, 0, 0.85, 0.75);
const Inner: React.FC<PhonePostProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const ue = EZ.quick(f / (p.enter ?? 30));
  const dv = p.dive ? DIVE(clamp01((f - p.dive.at) / (p.dive.d ?? 26))) : 0;
  const panelS = 720 / SCR_W; // Abyssal panel width 720 px
  const s = lerpLog(lerp(1.14, 1, ue) * (1 + 0.006 * t), panelS, dv);
  const y = lerp(760, 0, ue) * (1 - dv);
  const rot = (lerp(-7, -2.2, ue) + 0.25 * t) * (1 - dv);
  const chrome = 1 - clamp01(dv * 2.2);
  // the typed translation sits where the post chrome is: the chrome text steps back (8 f) while a caption line is up
  const capOn = (p.captions ?? []).reduce((a, c, i, arr) => { const end = c.until ?? (arr[i + 1]?.at ?? Infinity); return Math.max(a, clamp01(Math.min(f - c.at, end - f) / 8)); }, 0);
  const fill = (
    <AbsoluteFill style={{ transform: "scale(1.15)", filter: "blur(40px) brightness(0.25) saturate(0.9)" }}>
      <Media src={p.clip} startFrom={p.startFrom} />
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {fill}
      <div style={{ position: "absolute", left: 960 - SCR_W / 2 - BEZ, top: 540 - SCR_H / 2 - BEZ, width: SCR_W + 2 * BEZ, height: SCR_H + 2 * BEZ, borderRadius: 64 * (1 - dv) + 2,
        background: `rgba(10,10,12,${chrome})`, boxShadow: `0 50px 120px rgba(0,0,0,${0.75 * chrome}), inset 0 0 0 2px rgba(120,120,130,${0.5 * chrome})`,
        transform: `translateY(${y.toFixed(1)}px) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(4)})` }}>
        <div style={{ position: "absolute", left: BEZ * chrome, top: BEZ * chrome, width: SCR_W + 2 * BEZ * (1 - chrome), height: SCR_H + 2 * BEZ * (1 - chrome), borderRadius: 50 * chrome, overflow: "hidden", background: "#000" }}>
          <Media src={p.clip} startFrom={p.startFrom} />
          {chrome > 0 && (p.handle || p.caption) ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 460, opacity: chrome * (1 - capOn), background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.78))" }}>
              <div style={{ position: "absolute", left: 28, right: 28, bottom: 36, color: "#fff", fontFamily: FONT.inter, textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
                {p.handle ? <div style={{ fontWeight: 700, fontSize: fs("inter", p.labelCap ?? 30), marginBottom: 10, whiteSpace: "nowrap" }}>{p.handle}{p.meta ? <span style={{ fontWeight: 400, opacity: 0.8, marginLeft: 14, fontSize: fs("inter", p.subCap ?? 28) }}>{p.meta}</span> : null}</div> : null}
                {p.caption ? <div style={{ fontWeight: 500, fontSize: fs("inter", p.cap ?? 28), lineHeight: 1.22 }}>{p.caption}</div> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
export const PhonePost: React.FC<PhonePostProps> = (p) => {
  const f = useCurrentFrame();
  const entering = f >= 1 && f < (p.enter ?? 30) * 0.45;
  const diving = !!p.dive && f > p.dive.at + 6 && f < p.dive.at + (p.dive.d ?? 26);
  return (
    <AbsoluteFill>
      <MBlur on={entering || diving}><Inner {...p} /></MBlur>
      <TypedCaption lines={p.captions} cap={p.captionCap ?? 40} />
    </AbsoluteFill>
  );
};
