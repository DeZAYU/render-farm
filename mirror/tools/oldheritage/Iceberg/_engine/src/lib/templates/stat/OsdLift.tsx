// stat / OsdLift: the dashcam's own speed / time readout lifted out of the frame (REFERENCE_SYNTHESIS §H7).
// REF: Dashcam Vol.3 C (source OSD kept as evidence: 70mai GPS/speed @16:24, @12:21) + Farrell F3b counter, GoFundMe 4:08.2 (roll 17 f ease-out,
// colour flip in 1 f on the turn) + Dashcam Vol.1 E6 look-here punch bez(0.33,0,0.12,1) + Caving ring+dim @29:47.6 (rest of the frame L 87 -> 44 over
// 12 f, release 18 f). Footage keeps playing at 1x with the DD linear push.
// OUR VERSION: the real OSD pixels (src rect, source px) are cropped and scaled up IN PLACE over the dimmed footage, then re-set in D-DIN Exp: the
// value rolls to the spoken figure and flips to the theme accent on `flipAt`. The original region underneath is covered by a feathered blur patch
// so the lifted copy never leaves a ghost beside it (M-057). Modes: "speed" (km/h | mph) and "clock" (hh:mm or hh:mm:ss).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WATERPARK, EZ, FreshLayer, H, W, clamp01, drift, lerp, linPush, type Theme } from "../../core";
import { ClipLayer, FootPlate } from "../labels/kit";
import { type SrcRect, fsOf, scrRect } from "../labels/dash1kit";

export type OsdLiftProps = {
  media: string; mediaStart?: number; push?: number;
  src: SrcRect; // the OSD digits in the source frame [x, y, w, h] (source px of the 1920x1080 media)
  mode?: "speed" | "clock";
  unit?: "km/h" | "mph"; // speed mode
  from: number | string; // value shown when the digits are re-set (speed number, or "10:29" / "10:29:41")
  value: number | string; // the spoken value the readout rolls to
  seconds?: boolean; // clock mode: show hh:mm:ss
  theme?: Theme;
  at: number; // lift start (local)
  liftDur?: number; // lift ease (D1 E6 punch curve) in frames
  scale?: number; // lift factor of the crop
  to?: { x: number; y: number }; // optional screen centre to lift toward (default: in place, kept inside the frame)
  setAt?: number; // the real pixels hand over to our D-DIN Exp digits (6 f)
  rollAt?: number; // roll start (17 f ease-out, Farrell F3b)
  rollDur?: number;
  flipAt?: number; // 1 f flip to accent (the turn: "...and at 10:32 the house explodes")
  outAt?: number; // exit: readout fades 8 f, the dim releases over 18 f (CV), the patch lets the source OSD back last
  dim?: number; // brightness of the rest of the frame (CV 44/87 ~ 0.5; Farrell PG7 down to 0.17)
};

const toSec = (v: number | string) => {
  if (typeof v === "number") return v;
  const p = v.split(":").map((q) => parseInt(q, 10) || 0);
  return p[0] * 3600 + (p[1] ?? 0) * 60 + (p[2] ?? 0);
};
const clock = (s: number, sec: boolean) => {
  const t = Math.max(0, Math.round(s));
  const hh = String(Math.floor(t / 3600) % 24).padStart(2, "0"), mm = String(Math.floor(t / 60) % 60).padStart(2, "0"), ss = String(t % 60).padStart(2, "0");
  return sec ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
};

export const OsdLift: React.FC<OsdLiftProps> = ({
  media, mediaStart = 0, push = 0.045, src, mode = "speed", unit = "km/h", from, value, seconds = false, theme = WATERPARK,
  at, liftDur = 14, scale = 2.6, to, setAt, rollAt, rollDur = 17, flipAt, outAt, dim = 0.45,
}) => {
  const f = useCurrentFrame();
  const th = theme;
  const s = linPush(f, push);
  const r = scrRect(src, s); // the OSD on screen (moves with the push)
  if (f < at - 3) return <FootPlate src={media} startFrom={mediaStart} push={push} />;
  const sAt = setAt ?? at + liftDur + 6;
  const rAt = rollAt ?? sAt + 8;
  const outU = outAt === undefined ? 0 : EZ.inout(clamp01((f - outAt) / 18));
  // lift: scale 1 -> `scale` about the crop centre, toward `to` (default in place, clamped 60 px inside the frame)
  const u = EZ.punch(clamp01((f - at) / liftDur));
  const L = lerp(1, scale, u) * drift(Math.max(0, f - at - liftDur), 0.006);
  const c0 = { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  const bw = r.w * scale, bh = r.h * scale;
  const tgt = to ?? { x: Math.min(W - 60 - bw / 2, Math.max(60 + bw / 2, c0.x)), y: Math.min(H - 60 - bh / 2, Math.max(60 + bh / 2, c0.y)) };
  const cx = lerp(c0.x, tgt.x, u), cy = lerp(c0.y, tgt.y, u);
  const dimA = (1 - dim) * clamp01((f - at) / 12) * (1 - outU); // CV: down over 12 f, release 18 f
  const patchA = clamp01((f - at + 3) / 3) * (1 - clamp01((f - (outAt ?? 1e9) - 6) / 8)); // hides the original until the lifted copy has gone
  // value: real pixels until setAt, then our digits (6 f hand-over); roll 17 f ease-out; 1 f flip to accent
  const setU = clamp01((f - sAt) / 6);
  const ru = EZ.out3(clamp01((f - rAt) / rollDur));
  let text: string;
  if (mode === "clock") text = clock(lerp(toSec(from), toSec(value), ru), seconds);
  else text = String(Math.round(lerp(Number(from), Number(value), ru)));
  const flipped = flipAt !== undefined && f >= flipAt;
  const colour = flipped ? th.accent : th.neutral;
  const cap = r.h * 0.62; // digits fill the OSD height (box-relative, then scaled with the lift)
  const size = fsOf(th.num.face, cap);
  const uSize = fsOf(th.text.face, cap * 0.42);
  const pad = Math.max(32, Math.round(r.h * 0.7)); // patch bleed: a wide feather so no hard light band rings the original region
  const boxO = 1 - EZ.in2(clamp01((f - (outAt ?? 1e9)) / 8)); // exit: the lifted readout fades out in 8 f where it is
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {/* feathered blur patch over the original OSD region: no ghost of the source digits (M-057) */}
      {patchA > 0 ? (
        <div style={{ position: "absolute", left: r.x - pad, top: r.y - pad, width: r.w + 2 * pad, height: r.h + 2 * pad, opacity: patchA, backdropFilter: "blur(22px) brightness(.6)", WebkitBackdropFilter: "blur(22px) brightness(.6)",
          WebkitMaskImage: "radial-gradient(closest-side, #000 52%, transparent 100%)", maskImage: "radial-gradient(closest-side, #000 52%, transparent 100%)" }} />
      ) : null}
      {dimA > 0.002 ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dimA.toFixed(3)})` }} /> : null}
      {boxO > 0 ? (
        <div style={{ position: "absolute", left: cx - r.w / 2, top: cy - r.h / 2, width: r.w, height: r.h, transform: `scale(${L.toFixed(4)})`, transformOrigin: "50% 50%", opacity: boxO,
          boxShadow: `0 ${(4 / L).toFixed(2)}px ${(14 / L).toFixed(2)}px rgba(0,0,0,${(0.55 * u).toFixed(2)})` }}>
          {/* the real OSD pixels: the same clip, same push, cropped to the src rect */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", filter: setU > 0 ? `blur(${(1.5 * setU).toFixed(2)}px) brightness(${(1 - 0.88 * setU).toFixed(3)})` : undefined }}>
            <div style={{ position: "absolute", left: -r.x, top: -r.y, width: W, height: H }}>
              <AbsoluteFill style={{ transform: `scale(${s.toFixed(5)})` }}><ClipLayer src={media} startFrom={mediaStart} /></AbsoluteFill>
            </div>
          </div>
          {/* M-057/M-048: from setAt the digits sit on a clean solid dark plate (crop darkened >= 88 % + plate), never on the blurred source pixels */}
          {setU > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(6,8,10,${(0.86 * setU).toFixed(3)})` }} /> : null}
          {setU > 0 ? (
            <FreshLayer>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: cap * 0.22, opacity: setU, whiteSpace: "pre" }}>
                <span style={{ fontFamily: th.num.face, fontWeight: th.num.weight, fontSize: size, lineHeight: 1, color: colour, fontVariantNumeric: "tabular-nums",
                  textShadow: flipped ? `0 0 ${(cap * 0.25).toFixed(1)}px ${th.accentGlow}` : "0 1px 3px rgba(0,0,0,.8)" }}>{text}</span>
                {mode === "speed" ? <span style={{ fontFamily: th.text.face, fontWeight: th.text.weight, fontSize: uSize, lineHeight: 1, color: th.dim, alignSelf: "flex-end", marginBottom: cap * 0.32 }}>{unit.toUpperCase()}</span> : null}
              </div>
            </FreshLayer>
          ) : null}
        </div>
      ) : null}
    </FootPlate>
  );
};
