// labels / SceneTitle: the place name INSIDE the road shot (REFERENCE_SYNTHESIS §H8).
// REF: Farrell F1 "THE KOLYMA HIGHWAY" GM 1:32.9-1:37.0 (+ V3 0:10 "SHENZHEN / CHINA"): the title sits in the sky band and moves with the
// camera's push, rotated +4-5 deg for perspective, the right-hand letters blurred ~4 px (depth of field), rises + fades in 6-8 f, holds 3.7-7 s,
// a low hit at text-in. Farrell text: in 6-8 f, per-word stagger 1-2 f (SG 4.2). Footage: DD linear push (never eased).
// OUR VERSION: the title is TRACKED to the road's vanishing point (track keys in source px, like lookhere/TrackedRing), scales with the plate push
// plus a forward "approach" growth, D-DIN 700 caps with the key word in the theme accent. Replaces DD's mid-frame two-tone label on road footage.
import React from "react";
import { useCurrentFrame } from "remotion";
import { WATERPARK, EZ, FreshLayer, clamp01, drift, linPush, type Theme } from "../../core";
import { FootPlate, type TrackKey, type Word, scr, trackAt } from "./kit";
import { fsOf } from "./dash1kit";

export type SceneTitleProps = {
  media: string; mediaStart?: number; push?: number;
  words: Word[]; // e.g. [{text:"Angeles",at:6},{text:"Forest",at:8},{text:"Highway",at:10,red:true}] (red = key word in accent)
  track: TrackKey[]; // the road's vanishing point / horizon point, source px (1920x1080) per local frame
  theme?: Theme;
  cap?: number; // cap height px at scale 1 (Farrell title ~ 0.07-0.09 H)
  lift?: number; // px between the horizon point and the title baseline (source px, scales with the push)
  rot?: number; // perspective rotateY in deg (+4..5: the right side recedes)
  rotZ?: number; // optional roll to match a tilted horizon
  approach?: number; // extra forward growth per second (the road comes toward us), log rate
  dof?: number; // depth-of-field ramp across the line, px (clamped to <= 2; the accent/key word is never blurred)
  guard?: number; // bright-plate contrast guard: peak alpha of a soft local darken behind the title (0 = off; 0.42 default for bright skies)
  outAt?: number; // exit start (8 f fade)
};

export const SceneTitle: React.FC<SceneTitleProps> = ({
  media, mediaStart = 0, push = 0.045, words, track, theme = WATERPARK, cap = 78, lift = 70, rot = 4.5, rotZ = 0, approach = 0.02, dof = 2, guard = 0.42, outAt,
}) => {
  const f = useCurrentFrame();
  const th = theme;
  const s = linPush(f, push);
  const a = trackAt(track, f);
  const p = scr(a, s);
  const at0 = words.length ? words[0].at : 0;
  const k0 = f - at0;
  if (k0 < 0) return <FootPlate src={media} startFrom={mediaStart} push={push} />;
  const ex = outAt === undefined ? 0 : clamp01((f - outAt) / 8);
  const sc = s * drift(k0, approach);
  const size = fsOf(th.title.face, cap);
  // the title row: each word rises 16 px + fades over 7 f from its own spoken frame (Farrell 6-8 f). DOF = a <= 2 px ramp across the line
  // (left sharp -> right soft), never on the key word (M-024: the key word must be the most legible part)
  const dofPx = Math.min(2, Math.max(0, dof));
  const n = words.length;
  const row = (
    <div style={{ display: "flex", gap: size * 0.26, whiteSpace: "pre", fontFamily: th.title.face, fontWeight: th.title.weight, fontSize: size, lineHeight: 1 }}>
      {words.map((w, i) => {
        const k = f - w.at;
        const u = EZ.out3(k / 7);
        const b = w.red || n < 2 ? 0 : dofPx * (i / (n - 1));
        return (
          <span key={i} style={{ opacity: k < 0 ? 0 : clamp01(k / 7), transform: `translateY(${(16 * (1 - u)).toFixed(2)}px)`, color: w.red ? th.accent : th.neutral, filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : undefined,
            textShadow: w.red ? `0 0 2px rgba(0,0,0,.55), 0 3px 10px rgba(0,0,0,.75), 0 0 14px ${th.accentGlow}` : "0 0 2px rgba(0,0,0,.5), 0 3px 10px rgba(0,0,0,.7)" }}>
            {w.text.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
  // bright-plate contrast guard: a soft local darken (feathered ellipse) behind the line, fading in with the first word; no box edge
  const gO = guard * clamp01(k0 / 7);
  const pad = size * 0.9;
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      <FreshLayer>
        <div style={{ position: "absolute", left: p.x, top: p.y - lift * s, width: 0, height: 0, perspective: 1600, opacity: 1 - ex * ex, filter: ex > 0 ? `blur(${(3 * ex).toFixed(2)}px)` : undefined }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: "max-content", transformOrigin: "50% 100%", transform: `translateX(-50%) scale(${sc.toFixed(5)}) rotateY(${rot}deg) rotateZ(${rotZ}deg)` }}>
            {gO > 0.004 ? <div style={{ position: "absolute", left: -pad * 2, right: -pad * 2, top: -pad * 1.5, bottom: -pad * 1.5, pointerEvents: "none",
              background: `radial-gradient(closest-side, ${[0, 0.25, 0.5, 0.75, 1].map((q) => `rgba(0,0,0,${(gO * Math.exp(-2 * q * q) * (1 - q * q)).toFixed(3)}) ${(q * 100).toFixed(0)}%`).join(", ")})` }} /> : null}
            <div style={{ position: "relative" }}>{row}</div>
          </div>
        </div>
      </FreshLayer>
    </FootPlate>
  );
};
