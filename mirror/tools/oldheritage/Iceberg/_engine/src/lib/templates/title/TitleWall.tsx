// title / TitleWall: the Dashcam tile wall + two-line title. REF Dashcam Vol.3 E8 @ 0:38.5 (wall of red case tiles, white Nunito 800 digits with
// glow, cylinder bend, outer tiles defocused, "MOST DISTURBING" red over white) + D1 E13 @ 0:56.4-0:57.8; wp3 Intro3 WallScene @ abs 517-708
// (approved). Tiles flicker on in 24 f (seeded), the title lines glitch-flicker in (12 f, slice offsets), the camera lands close and pulls back
// (log-zoom ease-out 30 f) with a life creep; a soft light sweep crosses once. Optional dive: the camera flies into one tile until it fills the frame
// (the tile flips to its clip/still first) = the hand-off into case 1.
// Our version: every tile carries a real graded frame under the red (luminosity 42 %), so the wall is made of the video's own cases.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, Media, W, clamp01, fs, hash, lerp, lerpLog } from "../../core";

export type TitleWallProps = {
  lines: { text: string; colour: string; glow: string }[]; // top -> bottom; DD: red key line over white
  tiles: string[]; // one image per tile (number = index + 1); missing = plain red tile
  cols?: number; rows?: number;
  face?: "bebas" | "lacquer"; // Bebas = approved wp3 look; Lacquer = the D3 drip face surrogate (FONTS.md)
  titleAt?: number; // first title frame
  zoomFrom?: number; // camera zoom at frame 0 (close), pulls back to 0.95
  dive?: { tile: number; at: number; dur: number; media?: string }; // fly into tile N
};
const TW = 262, TH = (262 * 9) / 16, GX = 28, GY = 40;

const TitleLine: React.FC<{ k: number; text: string; colour: string; glow: string; size: number; face: string }> = ({ k, text, colour, glow, size, face }) => {
  if (k < 0) return <div style={{ height: size * 0.9 }} />;
  const flick = k >= 12 ? 1 : [0.0, 0.9, 0.2, 1, 0.5, 1, 0.15, 1, 0.8, 1, 0.9, 1][Math.floor(k)];
  const g = k < 12 ? 1 - k / 12 : 0;
  const base: React.CSSProperties = { fontFamily: face, fontSize: size, lineHeight: 0.9, color: colour, letterSpacing: face === FONT.lacquer ? "0.04em" : "0.02em", whiteSpace: "nowrap" };
  const kk = Math.floor(k);
  const slices = g > 0 ? [0, 1, 2].map((i) => ({ top: hash(kk * 3 + i) * 80, h: 8 + hash(kk * 7 + i) * 22, dx: (hash(kk * 11 + i) - 0.5) * 60 * g })) : [];
  return (
    <div style={{ position: "relative", opacity: flick }}>
      <div style={{ ...base, textShadow: glow, WebkitTextStroke: face === FONT.lacquer ? `3px ${colour}` : undefined }}>{text}</div>
      {slices.map((sl, i) => (
        <div key={i} style={{ ...base, position: "absolute", left: sl.dx, top: 0, clipPath: `inset(${sl.top}% 0 ${Math.max(0, 100 - sl.top - sl.h)}% 0)` }}>{text}</div>
      ))}
    </div>
  );
};

export const TitleWall: React.FC<TitleWallProps> = ({ lines, tiles, cols = 5, rows = 3, face = "bebas", titleAt = 10, zoomFrom = 1.5, dive }) => {
  const f = useCurrentFrame();
  const n = cols * rows;
  const tc = (i: number) => {
    const c = i % cols, r = Math.floor(i / cols);
    return { x: -((cols - 1) / 2) * (TW + GX) + c * (TW + GX), y: -((rows - 1) / 2) * (TH + GY) + r * (TH + GY), c };
  };
  // camera: close -> wide (D3 pull-back, log ease-out 30 f) + life creep; optional dive
  const u = EZ.out3(f / 30);
  let z = lerpLog(zoomFrom, 0.95, u) * (1 + (0.012 * f) / 30);
  const mid = tc(Math.floor(n / 2));
  let cx = lerp(mid.x, 0, u), cy = lerp(mid.y, -150, u);
  let d = 0;
  if (dive && f >= dive.at) {
    d = EZ.punch((f - dive.at) / dive.dur);
    const t = tc(dive.tile - 1);
    z = lerpLog(z, W / TW, d); cx = lerp(cx, t.x, d); cy = lerp(cy, t.y, d);
  }
  const tileOn = (i: number) => {
    if (f >= 24) return 1;
    const h = hash(i * 91.7 + Math.floor(f / 2) * 12.9898);
    const p = f / 24;
    return h < p * 0.85 ? 1 : h < p * 0.85 + 0.25 ? 0.4 : 0;
  };
  const size = face === "lacquer" ? fs("lacquer", 75) * 1.55 : 150;
  const sweep = clamp01((f - (titleAt + 14)) / 36);
  const fast = dive ? f >= dive.at + 4 && f < dive.at + dive.dur - 4 : false;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 55%, #2a0004 0%, #0a0001 55%, #000 100%)" }} />
      <MBlur on={fast} samples={6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: W / 2, top: H / 2, transformOrigin: "0 0", transform: `scale(${z.toFixed(5)}) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)` }}>
            {Array.from({ length: n }, (_, i) => {
              const p = tc(i);
              const isDive = dive && dive.tile === i + 1;
              const dd = isDive ? d : 0;
              const edge = Math.abs(p.c - (cols - 1) / 2);
              const numO = clamp01((f - (titleAt + ((i * 7) % 13))) / 4) * (isDive && dive ? 1 - clamp01((f - (dive.at - 14)) / 6) : 1);
              const flip = isDive && dive?.media ? clamp01((f - (dive.at - 14)) / 8) : 0;
              return (
                <div key={i} style={{ position: "absolute", left: p.x - TW / 2, top: p.y - TH / 2, width: TW, height: TH, opacity: isDive ? 1 : tileOn(i),
                  transform: `perspective(1600px) rotateY(${((p.c - (cols - 1) / 2) * -7 * (1 - dd)).toFixed(2)}deg)`, filter: isDive && d > 0 ? undefined : `blur(${(edge * 0.8).toFixed(2)}px)` }}>
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 4 * (1 - dd), background: "linear-gradient(160deg, #C00010 0%, #8A000C 55%, #4A0005 100%)", boxShadow: "0 0 26px rgba(190,0,16,.35), inset 0 1px 0 rgba(255,120,120,.25)" }}>
                    {tiles[i] ? <div style={{ position: "absolute", inset: 0, opacity: 0.42, mixBlendMode: "luminosity" }}><Media src={tiles[i]} /></div> : null}
                    {flip > 0 && dive?.media ? <div style={{ position: "absolute", inset: 0, opacity: flip }}><Media src={dive.media} /></div> : null}
                    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: FONT.nunito, fontWeight: 800, fontSize: fs("nunito", 54), lineHeight: 1, color: "#F0EEEE", opacity: numO, textShadow: "0 0 6px rgba(255,255,255,.45), 0 2px 4px rgba(0,0,0,.5)" }}>{i + 1}</span>
                    </AbsoluteFill>
                  </div>
                  {isDive && flip > 0 ? <div style={{ position: "absolute", inset: -5, border: "3px solid #D9D9D9", borderRadius: 6, opacity: flip * (1 - d) }} /> : null}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, top: tc(0).y - TH / 2 - 34, transform: "translate(-50%,-100%)", display: "flex", flexDirection: "column", alignItems: "center", gap: face === "lacquer" ? -26 : 2, opacity: 1 - d }}>
              {lines.map((l, i) => (
                <TitleLine key={i} k={f - titleAt - (lines.length - 1 - i) * 3 * (i === 0 ? 1 : 0)} text={l.text} colour={l.colour} glow={l.glow} size={size} face={face === "lacquer" ? FONT.lacquer : FONT.bebas} />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </MBlur>
      {sweep > 0 && sweep < 1 ? (
        <AbsoluteFill style={{ background: `linear-gradient(100deg, rgba(255,255,255,0) ${-30 + sweep * 130}%, rgba(255,236,226,.12) ${-20 + sweep * 130}%, rgba(255,255,255,0) ${-10 + sweep * 130}%)`, mixBlendMode: "screen" }} />
      ) : null}
    </AbsoluteFill>
  );
};
