// footage / RiderCamTakeover (set "midway", Amusement Park "MIDWAY AFTER DARK" second-camera device, REFERENCE_SYNTHESIS §I3 AP-1 + §I4 #5).
// REF Dashcam Vol.2 E6 PiP grow / shrink @7:26.87-7:36.27 (GROW 2.57 s = 77 f bezier(0.40,0.22,0.00,0.92) on the word that turns to it,
// SHRINK 3.63 s = 109 f bezier(0.47,0.12,0.01,0.85)) + Dashcam Vol.1 PiP @0:00 (static, enters with the shot) + Nocturn nA6 floating card
// @FINAL 0:02 (8 f soft pop-in).
// Our version: the rider's POV clip sits as a PiP inside the ground shot and GROWS TO FULL FRAME (not to 0.787 W) when the VO turns to the
// riders, then shrinks back to its corner when it returns to the onlookers. Both clips run on their own clocks with linear pushes.
// IDENTITY FIX 2026-10-19 (review #11: read as footage/PipCam reskinned): no coloured border. The PiP is the RIDER CAM itself: a dark
// action-cam housing rim, a fisheye lens mask (rounded barrel corners + lens fall-off vignette + slight barrel scale) that relaxes to the
// plain full frame as it grows, and a small LED "RIDER CAM" tag (kit led.tsx, magenta dots on a dark plate) that rides in its corner.
import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame } from "remotion";
import { EZ, H, Media, Vignette, W, clamp01, lerp, linPush } from "../../core";
import { LedText, ledSize, pickAccent } from "../../core/kits/led";
import { WATERPARK, type Theme } from "../../core/themes";

const GROW = Easing.bezier(0.4, 0.22, 0, 0.92), SHRINK = Easing.bezier(0.47, 0.12, 0.01, 0.85);
export type RiderCamTakeoverProps = {
  media: string; // ground shot
  mediaStart?: number;
  rider: string; // rider POV clip
  riderStart?: number;
  push?: number; // linear push / s on the ground shot
  rest?: number; // PiP width at rest, fraction of W (0.36)
  corner?: "tr" | "tl" | "br" | "bl";
  inAt?: number; // PiP appears (8 f pop-in); default 0 = with the shot
  growAt?: number; // the word that turns to the riders
  growDur?: number; // 77
  shrinkAt?: number; // back to the onlookers
  shrinkDur?: number; // 109
  border?: number; // housing rim px (6)
  tag?: string; // LED tag text ("RIDER CAM"; "" = none)
  theme?: Theme;
  fire?: boolean;
};

export const RiderCamTakeover: React.FC<RiderCamTakeoverProps> = ({
  media, mediaStart = 0, rider, riderStart = 0, push = 0.03, rest = 0.36, corner = "tr", inAt = 0, growAt, growDur = 77, shrinkAt, shrinkDur = 109, border = 6, tag = "RIDER CAM", theme = WATERPARK, fire,
}) => {
  const f = useCurrentFrame();
  const acc = pickAccent(theme, fire);
  const glow = fire ? "rgba(255,255,255,.5)" : theme.accentGlow;
  // u = 0 (corner PiP) .. 1 (full frame)
  let u = 0;
  if (growAt !== undefined && f >= growAt) u = GROW(clamp01((f - growAt) / growDur));
  if (shrinkAt !== undefined && f >= shrinkAt) u = 1 - SHRINK(clamp01((f - shrinkAt) / shrinkDur));
  const m = 44;
  const rw = rest * W, rh = (rw * 9) / 16;
  const r0 = {
    x: corner === "tr" || corner === "br" ? W - m - rw : m,
    y: corner === "tr" || corner === "tl" ? m : H - m - rh,
    w: rw, h: rh,
  };
  const r = { x: lerp(r0.x, 0, u), y: lerp(r0.y, 0, u), w: lerp(r0.w, W, u), h: lerp(r0.h, H, u) };
  const k = f - inAt;
  const pop = k < 0 ? 0 : EZ.out3(k / 8);
  const ps = lerp(0.94, 1, pop);
  const rim = border * (1 - u); // housing rim thickness
  const lens = 1 - u; // fisheye mask strength (relaxes to the plain frame at full size)
  const rad = 0.2 * r.h * lens; // barrel corner radius
  const tagCell = 5;
  const tg = tag ? ledSize(tag.toUpperCase(), tagCell) : { w: 0, h: 0 };
  const tm = lerp(18, 46, u) + rad * 0.28; // tag margin inside the lens (clear of the rounded corner)
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${linPush(f, push).toFixed(5)})` }}><Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence></AbsoluteFill>
      <Vignette />
      {pop > 0 ? (
        <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, opacity: pop, transform: `scale(${ps.toFixed(4)})`, transformOrigin: `${corner[1] === "r" ? "100%" : "0%"} ${corner[0] === "t" ? "0%" : "100%"}`,
          borderRadius: rad, overflow: "hidden", background: "#000",
          boxShadow: lens > 0.01 ? `0 0 0 ${rim.toFixed(2)}px #120c10, 0 0 0 ${(rim + 1.5 * lens).toFixed(2)}px rgba(255,240,248,${(0.14 * lens).toFixed(3)}), 0 16px 36px rgba(0,0,0,${(0.6 * lens).toFixed(2)})` : undefined }}>
          {/* barrel: the rider clip slightly over-scaled inside the lens */}
          <AbsoluteFill style={{ transform: `scale(${(linPush(f, 0.02) * (1 + 0.07 * lens)).toFixed(5)})` }}><Sequence layout="none"><Media src={rider} startFrom={riderStart} /></Sequence></AbsoluteFill>
          {/* fisheye fall-off: dark lens edge + a faint inner rim reflection */}
          {lens > 0.01 ? (
            <AbsoluteFill style={{ borderRadius: rad, opacity: lens, background: "radial-gradient(ellipse 62% 66% at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,.42) 88%, rgba(0,0,0,.8) 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07), inset 0 2px 10px rgba(255,255,255,.08)" }} />
          ) : null}
          {u > 0.6 ? <Vignette opacity={(u - 0.6) / 0.4} /> : null}
          {tag ? (
            <>
              <div style={{ position: "absolute", left: tm - 10, top: tm - 9, width: tg.w + 20, height: tg.h + 18, borderRadius: 5, background: "rgba(10,4,8,.72)", boxShadow: "0 2px 8px rgba(0,0,0,.5)" }} />
              <LedText text={tag.toUpperCase()} cell={tagCell} x={tm} y={tm + tg.h / 2} anchor="left" colour={acc} glow={glow} glowPx={[3, 10]} ghost={0} bloom={0.45} />
            </>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
