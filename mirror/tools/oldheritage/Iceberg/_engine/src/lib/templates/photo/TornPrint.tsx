// photo / TornPrint: a print torn off a larger sheet DROPS onto the black, lands, and a red glowing name wipes in under it. REF: VV §5 torn print
// (VV @ 1:29.3: torn edge, print a few degrees off-axis, name wiping L->R with a hard edge) + VV @ 12:47.3 §13 hard rise curve (bezier .015,-.151,
// .012,.998) used here as the landing + Dashcam Vol.1 @ 0:47.5 "name with glow" (FONTS.md: rounded face, red #FA0105, red glow 8-10 px, no box).
// Unlike VVSettle (teal plate, full torn border, slow 3 s pull-back, teal neon Oswald name) and TornHorizon (horizon line, rising print, amber
// Bebas title) this is: pure black, a cream gloss-print border on three clean-cut sides and ONE deep fibrous tear, a fast drop-and-land entry
// with the shadow tightening on impact, then a slow camera move to a point of interest (`focus`), and the DD red name.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, Media, RoundText, W, clamp01, lerp, lerpLog, rng } from "../../core";
import { CardVig, fitBox } from "../../core/kits/photo";

export type TornPrintProps = {
  src: string;
  aspect?: number;
  pos?: string;
  name?: string;
  nameAt?: number;
  side?: "right" | "left"; // which edge is torn
  focus?: { x: number; y: number; zoom: number; at: number }; // camera move to a point of the print (fractions), e.g. "a stain on the wall"
  mono?: number;
  seed?: number;
  cap?: number; // name cap
};

/** one deep fibrous tear on the right edge (px), clean straight cuts elsewhere */
const tear = (w: number, h: number, seed: number, depth: number) => {
  const r = rng(seed * 131 + 7);
  const pts: string[] = [`0px 0px`, `${(w - depth * 0.4).toFixed(1)}px 0px`];
  let x = w - depth * 0.4;
  for (let y = 0; y <= h; y += 7) {
    x = Math.min(w, Math.max(w - depth, x + (r() - 0.5) * depth * 0.55));
    pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
  }
  pts.push(`${(w - depth * 0.5).toFixed(1)}px ${h}px`, `0px ${h}px`);
  return `polygon(${pts.join(",")})`;
};

export const TornPrint: React.FC<TornPrintProps> = ({ src, aspect = 4 / 3, pos, name, nameAt = 30, side = "right", focus, mono = 0.25, seed = 9, cap = 58 }) => {
  const k = useCurrentFrame();
  const box = fitBox(aspect, 1180, 690);
  const B = 22; // print border
  const pw = box.w + 2 * B, ph = box.h + 2 * B;
  const land = EZ.hardOut(clamp01(k / 16));
  const s = lerp(1.16, 1, land), dy = lerp(-46, 0, land), rot = lerp(-7.5, -2.2, EZ.out3(k / 22)) + 0.08 * (k / 30);
  const sh = lerp(70, 26, land), so = lerp(0.35, 0.8, land);
  const fu = focus ? EZ.settle(clamp01((k - focus.at) / 66)) : 0;
  const z = (focus ? lerpLog(1, focus.zoom, fu) : 1) * (1 + 0.005 * (k / 30));
  const fx = focus ? lerp(0, (0.5 - focus.x) * box.w, fu) : 0, fy = focus ? lerp(0, (0.5 - focus.y) * box.h, fu) : 0;
  const cy = 470;
  const nk = k - nameAt;
  const wipe = EZ.nameWipe(clamp01(nk / 18)) * 100;
  const clip = tear(pw, ph, seed, 46);
  return (
    <AbsoluteFill style={{ background: "#010101" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 44%, #141210 0%, #050404 60%, #010101 100%)" }} />
      <MBlur on={k < 10 || (focus !== undefined && fu > 0.05 && fu < 0.5)} samples={6}>
        <AbsoluteFill style={{ transformOrigin: `50% ${(cy / H) * 100}%`, transform: `scale(${z.toFixed(5)}) translate(${fx.toFixed(2)}px, ${fy.toFixed(2)}px)` }}>
          <div style={{ position: "absolute", left: W / 2 - pw / 2, top: cy - ph / 2 + dy, width: pw, height: ph, transform: `rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(5)})${side === "left" ? " scaleX(-1)" : ""}`,
            filter: `drop-shadow(0 ${(sh * 0.45).toFixed(1)}px ${sh.toFixed(1)}px rgba(0,0,0,${so.toFixed(3)}))` }}>
            {/* paper fibres along the tear: a lighter, rougher copy just outside the print edge */}
            <div style={{ position: "absolute", inset: 0, background: "#F4F1E8", clipPath: tear(pw + 6, ph, seed + 3, 50) }} />
            <div style={{ position: "absolute", inset: 0, clipPath: clip, background: "linear-gradient(135deg, #EEE9DC, #E2DCCB)" }}>
              <div style={{ position: "absolute", left: B, top: B, width: box.w, height: box.h, overflow: "hidden", transform: side === "left" ? "scaleX(-1)" : undefined }}>
                <Media src={src} pos={pos} style={{ filter: `grayscale(${mono}) contrast(1.1) brightness(.9)` }} />
                <CardVig k={0.45} />
                <AbsoluteFill style={{ background: "linear-gradient(120deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 32%)" }} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </MBlur>
      {name && nk >= 0 ? (
        <div style={{ position: "absolute", left: 0, width: W, top: cy + ph / 2 + 70, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-block", clipPath: `inset(-40% ${(100 - wipe).toFixed(2)}% -40% -10%)`, filter: "drop-shadow(0 0 5px rgba(250,1,5,.8)) drop-shadow(0 0 14px rgba(250,1,5,.5))" }}>
            <RoundText text={name} cap={cap} colour="#FA0105" />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
