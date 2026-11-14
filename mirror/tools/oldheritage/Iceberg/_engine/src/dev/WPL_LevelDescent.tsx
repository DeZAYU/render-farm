// WPL (Workplace level pieces, one shared component for WPL1..WPL5): the level call over the photoreal iceberg (public/ice3), the berg
// dropping one level deeper each time: L1 the tip, L2 the waterline, L3 just under the water, L4 the eye sockets, L5 the jaw in the abyss
// (ice3 depth levels 1, 3, 4, 6, 7). The first 98 frames are the kit's LevelCard_AB unchanged (black -> wide berg, "Level N" typed on the
// waterline -> the real Blender dolly down to the level's depth -> lands on its close-up); after that the close-up keeps going: the same
// constant drift continued plus a slow eased push (so long calls never sit still), the underwater shimmer below the surface, and the
// level's name from the cut sheet typed small under it. A 10-frame fade to black hands over to the case's own title card.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AB, DRIFT, FONT_AB, FontsAB, LevelCard_AB, PLATES_ICE3, closeAB } from "../lib/templates/iceberg/abyss";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.sin);
export const LC = 98;               // LevelCard_AB length used (its minimum: push ends at 86, 12 f landing)
const P1 = 72 + 14;                 // LevelCard_AB push end (holdUntil 72 + 14 dolly frames)
export const ICE_LEVEL = [0, 1, 3, 4, 6, 7]; // WP level n -> ice3 depth level

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.24, pointerEvents: "none" }}>
    <svg width="1920" height="1080"><filter id={`gwl${f % 8}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 8} /><feColorMatrix type="saturate" values="0" /></filter><rect width="1920" height="1080" filter={`url(#gwl${f % 8})`} opacity={0.5} /></svg>
  </AbsoluteFill>
);

export const LevelDescent: React.FC<{ n: number; name: string; nameAt?: number }> = ({ n, name, nameAt = LC - 6 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const lv = ICE_LEVEL[n], src = closeAB(PLATES_ICE3, lv), shimmer = lv >= 4 ? 7 : 0;
  const t = f - P1, rest = Math.max(1, dur - LC);
  // continuation of LevelCard_AB's drift (identical at the hand-over frame) + an eased push that starts with zero speed
  const extra = 0.10 * io(interpolate(f, [LC, dur], [0, 1], cl)) * Math.min(1, rest / 240);
  const sc = 1 + DRIFT.s * t + extra, tx = DRIFT.x * t;
  const typed = name.slice(0, Math.max(0, Math.floor((f - nameAt) / 1.0) + 1));
  const nameOp = interpolate(f, [nameAt, nameAt + 4], [0, 1], cl);
  const end = interpolate(f, [dur - 10, dur - 1], [0, 1], cl);
  const id = `wpl${f}`;
  return (
    <FontsAB>
      <AbsoluteFill style={{ background: "#000" }}>
        {f < LC ? <LevelCard_AB dur={LC} level={lv} label={`Level ${n}`} /> : (
          <AbsoluteFill>
            {shimmer > 0 && (
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <filter id={id} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency={`${0.004 + 0.0004 * Math.sin(f / 23)} 0.012`} numOctaves={2} seed={3} result="n" />
                  <feOffset in="n" dy={-f * 0.9} result="no" /><feDisplacementMap in="SourceGraphic" in2="no" scale={shimmer} xChannelSelector="R" yChannelSelector="G" /></filter>
              </svg>
            )}
            <Img src={staticFile(src)} style={{ position: "absolute", width: 1920, height: 1080, objectFit: "cover", transformOrigin: "50% 42%",
              transform: `translateX(${tx.toFixed(2)}px) scale(${sc.toFixed(5)})`, filter: shimmer > 0 ? `url(#${id})` : undefined }} />
            <Grain f={f} />
          </AbsoluteFill>
        )}
        {f >= nameAt && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", whiteSpace: "pre", fontFamily: FONT_AB.type, fontSize: 58,
            letterSpacing: "0.04em", color: AB.white, textShadow: AB.shadow + ", 0 0 24px rgba(0,0,0,.8)", opacity: nameOp }}>
            {typed.padEnd(name.length, " ")}
          </div>
        )}
        <AbsoluteFill style={{ background: "#000", opacity: end }} />
      </AbsoluteFill>
    </FontsAB>
  );
};
