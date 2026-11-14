// lookhere / TrackTrail (set dash2, Dashcam "INSTRUMENT" H2): a vehicle / wheel trajectory drawn on the footage itself.
// REF Dashcam Vol.2 E3 tracked arrow @0:07.88-0:09.70 (marker follows the subject at up to -424 px/s, appears in place, out 5-6 f) +
// Dashcam Vol.1 E5 ring path @15:38.0-15:48.3 (10 s follow, 30-80 px/s) + Farrell FA F7 route GM @2:57.1 (a line with a LEADING DOT, constant
// arc-length, 10 f ease-out into the head).
// Ours: a small accent dot rides the tracked object and leaves a 4 px trail that fades over 1.0 s, so the swerve / roll / ramp stays readable
// after the object has passed. Optional head label: a HudBox-like chip in theme colours (leader 6 f, box wipe 6 f, then the words). Silent.
import React from "react";
import { useCurrentFrame } from "remotion";
import { WATERPARK, EZ, FPS, H, W, clamp01, linPush, type Theme } from "../../core";
import { ThemeChip } from "./dash2kit";
import { FootPlate, type TrackKey, scr, trackAt } from "../../core/kits/labels";

export type TrailLabel = { text: string; at: number; dx?: number; dy?: number; cap?: number; outAt?: number };
export type TrackTrailProps = {
  media: string; mediaStart?: number; push?: number;
  track: TrackKey[]; // object centre per frame (source px)
  at: number; // dot appears (local frame of the noun)
  outAt?: number; // dot + trail fade out (6 f)
  trailSec?: number; // trail fade length (1.0 s)
  width?: number; // trail width px (4)
  dotR?: number; // head dot radius px
  label?: TrailLabel;
  theme?: Theme;
};

export const TrackTrail: React.FC<TrackTrailProps> = ({ media, mediaStart = 0, push = 0.045, track, at, outAt, trailSec = 1.0, width = 4, dotR = 10, label, theme = WATERPARK }) => {
  const f = useCurrentFrame();
  const s = linPush(f, push);
  const k = f - at;
  const life = Math.round(trailSec * FPS);
  const o = outAt === undefined ? 1 : 1 - EZ.out2((f - outAt) / 6);
  // trail samples: every frame back to max(at, f - life), positions in source px mapped with the CURRENT push (the trail lives on the image)
  const pts: { x: number; y: number; age: number }[] = [];
  if (k >= 0) {
    const n = Math.min(life, Math.floor(k));
    pts.push({ ...scr(trackAt(track, f), s), age: 0 });
    for (let i = 1; i <= n; i++) pts.push({ ...scr(trackAt(track, f - i), s), age: i });
    if (k < life && k - n > 0) pts.push({ ...scr(trackAt(track, at), s), age: k });
  }
  const head = pts[0];
  const dotIn = EZ.out3(k / 6);
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {k >= 0 && o > 0 ? (
        <>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o }}>
            <g style={{ filter: `drop-shadow(0 0 4px ${theme.accentGlow}) drop-shadow(0 1px 2px rgba(0,0,0,.6))` }}>
              {pts.slice(1).map((q, i) => {
                const a = pts[i];
                const fade = clamp01(1 - q.age / life);
                return <line key={i} x1={a.x.toFixed(1)} y1={a.y.toFixed(1)} x2={q.x.toFixed(1)} y2={q.y.toFixed(1)} stroke={theme.accent} strokeWidth={width * (0.55 + 0.45 * fade)} strokeLinecap="round" opacity={fade * fade * 0.6 + fade * 0.4} />;
              })}
              <circle cx={head.x} cy={head.y} r={dotR * (0.4 + 0.6 * dotIn)} fill={theme.accent} stroke={theme.neutral} strokeWidth={2} opacity={clamp01(k / 3)} />
            </g>
          </svg>
          {label ? (
            <ThemeChip k={f - label.at} p={head} elbow={{ x: head.x + (label.dx ?? 120), y: head.y + (label.dy ?? -110) }} text={label.text} cap={label.cap ?? 34} theme={theme}
              o={o * (label.outAt === undefined ? 1 : 1 - EZ.out2((f - label.outAt) / 6))} />
          ) : null}
        </>
      ) : null}
    </FootPlate>
  );
};
