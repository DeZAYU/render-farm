// labels / NameTag: REF Dashcam Vol.2 E10 name label @2:32.70-2:33.35 "trucker carl bayer" (lowercase, letters DECODE IN from blurred ghosts
// 152.70-152.90; a dark-red translucent box with a bright red 2 px border WIPES L->R 152.90-153.17 (0.27 s); a red POINTER LINE DROPS to the
// subject ~153.3; lower-middle y ~0.80 H; follows the shot +-10 px) + FONTS.md "Name tag box" (Helvetica Neue Light class -> Inter 300,
// tracking +0.22 em, #FFEDEA on #7A0E0E, as spoken). Also D2 17:38.5 "Brian" / "Lauren" tags beside the heads.
// OUR VERSION: the pointer end follows the person (`track`, source px, push applied); ghosts are the same glyphs, blurred, so nothing reflows.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, hash, linPush } from "../../core";
import { FootPlate, type TrackKey, scr, trackAt } from "./kit";

export type NameTagProps = { media: string; mediaStart?: number; push?: number; text: string; at: number; x?: number; y?: number; track?: TrackKey[]; cap?: number; outAt?: number };
export const NameTag: React.FC<NameTagProps> = ({ media, mediaStart = 0, push = 0.045, text, at, x = W / 2, y = 0.8 * H, track, cap = 50, outAt }) => {
  const f = useCurrentFrame();
  const k = f - at;
  const fsz = fs("inter", cap);
  const track_ = 0.22 * fsz;
  const padX = 30, padY = 18, bh = cap + 2 * padY + cap * 0.42;
  const by = y - bh / 2;
  const wipe = EZ.out2((k - 6) / 8);
  const s = linPush(f, push);
  const pt = track?.length ? scr(trackAt(track, f), s) : null;
  const drop = EZ.out3((k - 18) / 7);
  const o = outAt === undefined ? 1 : 1 - clamp01((f - outAt) / 6);
  const sway = { x: 6 * Math.sin(f / 37), y: 4 * Math.sin(f / 29 + 1) }; // "follows the shot +-10 px"
  return (
    <FootPlate src={media} startFrom={mediaStart} push={push}>
      {k >= 0 && o > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translate(${sway.x.toFixed(2)}px, ${sway.y.toFixed(2)}px)` }}>
          {pt && drop > 0 ? (
            <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 0 4px rgba(255,26,26,.7))" }}>
              <line x1={pt.x - sway.x} y1={pt.y < by ? by : by + bh} x2={pt.x - sway.x} y2={(pt.y < by ? by : by + bh) + (pt.y - sway.y - (pt.y < by ? by : by + bh)) * drop} stroke="#FF1A1A" strokeWidth={3} />
              <circle cx={pt.x - sway.x} cy={pt.y - sway.y} r={5} fill="#FF1A1A" opacity={drop >= 1 ? 1 : 0} />
            </svg>
          ) : null}
          {/* the box sizes itself to the glyphs (no canvas measure: per-glyph spans lose kerning); the wipe is a clip on the box only */}
          <div style={{ position: "absolute", left: x, top: by, height: bh, transform: "translateX(-50%)", display: "flex", alignItems: "center", padding: `0 ${padX - track_ / 2}px 0 ${padX}px`, boxSizing: "border-box" }}>
            {wipe > 0 ? (
              <div style={{ position: "absolute", inset: 0, background: "rgba(122,14,14,.78)", border: "2px solid #F0141B", boxSizing: "border-box",
                boxShadow: "0 0 10px rgba(240,20,27,.45), 0 6px 18px rgba(0,0,0,.45)", clipPath: `inset(-20px ${((1 - wipe) * 100).toFixed(2)}% -20px -20px)` }} />
            ) : null}
            <div style={{ position: "relative", display: "flex", fontFamily: FONT.inter, fontWeight: 300, fontSize: fsz, lineHeight: 1, color: "#FFEDEA", whiteSpace: "pre", marginTop: -fsz * 0.08 }}>
              {[...text].map((c, i) => {
                const on = k >= 1 + Math.floor(hash(i * 7.3 + text.length) * 6);
                const g = clamp01((k + 1) / 2);
                return (
                  <span key={i} style={{ letterSpacing: track_, opacity: on ? 1 : 0.32 * g, filter: on ? undefined : "blur(5px)", textShadow: on ? "0 0 6px rgba(255,190,180,.35), 0 2px 4px rgba(0,0,0,.6)" : undefined }}>{c}</span>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </FootPlate>
  );
};
