// photo / TornHorizon: the VV §3 date card with a horizon line (VV 22:40 "2009 / VIDEO LEAKED ON YOUTUBE", 17:42 "1987 / WITNESS A CRIME";
// wp3 sec_A DateCard @1204). Rendered ON TWOS: 2 px white line at 0.59 H draws from the left (8 f), a small white year slides in from the right,
// the amber Bebas subtitle slides right -> centre in 22 f (bezier .221,.496,.454,1.01) and then floats +-8 px, a torn B/W print (still or live
// clip) rises from BEHIND the line (masked below it, 20 f ease-out) and turns colour over 4 f with a x1.15 amber bloom. Optional corner badge
// (e.g. a video length) popped on its word. Our version: off-white torn fringe, the print keeps a +0.5 %/s drift, sparse dust over black.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { EZ, FONT, H, Media, W, clamp01, fs, lerp } from "../../core";
import { CardVig, Specks, TornPrint, fitBox } from "./shared";

export type TornHorizonProps = {
  src: string; // still or clip (a clip plays from photoAt)
  aspect?: number;
  pos?: string;
  year: string; // small white line under the horizon
  title: string; // amber subtitle (caps)
  yearAt?: number;
  titleAt?: number; // land it on the spoken word (VV: within +-0.7 s of the year)
  photoAt?: number;
  colourAt?: number; // B/W -> colour (VV +1.9 s)
  badge?: string; // small dark badge in the print corner
  badgeAt?: number;
  accent?: string; // subtitle core (VV amber #D0B53E)
  lineY?: number; // horizon (VV 0.59 H)
  cap?: number; // title cap (px)
  labelCap?: number; // year cap (px)
  subCap?: number; // badge cap (px)
};

export const TornHorizon: React.FC<TornHorizonProps> = ({
  src, aspect = 16 / 9, pos = "50% 50%", year, title, yearAt = 6, titleAt = 16, photoAt = 22, colourAt = 64, badge, badgeAt = 70, accent = "#D0B53E", lineY = Math.round(0.59 * H), cap = 80, labelCap = 38, subCap = 28,
}) => {
  const k0 = useCurrentFrame();
  const g = Math.floor(k0 / 2) * 2; // on twos (VV 12 fps designed-graphic feel)
  const lineW = W * EZ.out2((g - 8) / 8);
  const yk = EZ.dateSlide((g - yearAt) / 20);
  const yearX = lerp(W + 160, W / 2, yk);
  const sk = EZ.dateSlide((g - titleAt) / 22);
  const subDx = lerp(W * 0.62, 0, sk) + (g > titleAt + 22 ? 8 * Math.sin(((g - titleAt - 22) / 24) * Math.PI) : 0);
  const pk = EZ.out3((g - photoAt) / 20);
  const box = fitBox(aspect, 1000, 0.52 * H);
  const pw = box.w, ph = box.h;
  const top = lerp(lineY + 10, lineY - ph + 34, pk) - 0.12 * Math.max(0, g - photoAt - 20); // rests cut by the line, keeps rising slowly
  const col = clamp01((g - colourAt) / 4);
  const bloom = 1 + 0.15 * col;
  const drift = 1 + 0.005 * (Math.max(0, k0 - photoAt) / 30);
  const yf = fs("inter", labelCap), tf = fs("bebas", cap);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 50% ${((lineY - 160) / H) * 100}%, rgba(70,52,18,${(0.22 + 0.08 * col).toFixed(3)}), rgba(0,0,0,0) 70%)` }} />
      <Specks k={k0} n={40} seed={9} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: lineY, overflow: "hidden" }}>
        {g >= photoAt ? (
          <div style={{ position: "absolute", left: W / 2 - pw / 2, top, width: pw, height: ph, transform: `rotate(-1.2deg) scale(${drift.toFixed(5)})`, transformOrigin: "50% 100%" }}>
            <TornPrint w={pw} h={ph} seed={11} paper="#E4E1D8">
              <Sequence from={photoAt} layout="none"><Media src={src} pos={pos} style={{ filter: `grayscale(${(1 - col).toFixed(3)}) contrast(1.08)` }} /></Sequence>
              <CardVig k={0.42} />
              {badge && g >= badgeAt ? (
                <div style={{ position: "absolute", right: 20, bottom: 22, padding: "3px 10px", borderRadius: 6, background: "rgba(0,0,0,.82)", fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", subCap), color: "#fff" }}>{badge}</div>
              ) : null}
            </TornPrint>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", left: 0, top: lineY - 1, width: lineW, height: 2, background: "#F4F4F4", boxShadow: "0 0 6px rgba(255,255,255,.5)" }} />
      {g >= yearAt ? (
        <div style={{ position: "absolute", left: yearX, top: lineY + 24, transform: "translateX(-50%)", fontFamily: FONT.inter, fontWeight: 400, fontSize: yf, color: "#F2F2F2", letterSpacing: "0.06em" }}>{year}</div>
      ) : null}
      {g >= titleAt ? (
        <div style={{ position: "absolute", left: 0, width: W, top: lineY + 34 + yf * 1.05, textAlign: "center", transform: `translateX(${subDx.toFixed(1)}px)`, fontFamily: FONT.bebas, fontSize: tf, lineHeight: 1, letterSpacing: "0.04em", color: accent,
          textShadow: `0 0 ${(6 * bloom).toFixed(1)}px ${accent}, 0 0 ${(18 * bloom).toFixed(1)}px rgba(168,112,42,.55), 0 0 ${(40 * bloom).toFixed(1)}px rgba(90,60,30,.5)` }}>{title}</div>
      ) : null}
    </AbsoluteFill>
  );
};
