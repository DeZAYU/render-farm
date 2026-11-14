// photo / ArchiveStill: an archive photograph presented as a scanned print on black, with a parallax foreground inside the print and the caption
// set INSIDE the card. REF: SIRIUS E5 photo card on pure black (SIRIUS @ 13:18, no border beyond the photo, still on black) + Farrell evidence R10
// archive treatment (near-neutral mono with a faint cool highlight lift, crushed blacks, live grain, heavy vignette; Farrell GF @ 7:44 B5 slow
// ease-in fade-up from black) + Farrell opener cut-out parallax. Entry: the print "develops" out of black (ease-in fade-up, exposure lift) while
// the camera is already pushing; the foreground cut-out pushes faster than the print; the caption line rises in on its word inside the card.
// Differs from SiriusDrop (no slide, landscape print with a scan border, caption inside) and KenBurnsParallax (a card on black, mono archive).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, Media, W, clamp01, fs } from "../../core";
import { CardVig, Specks, fitBox } from "../../core/kits/photo";

export type ArchiveStillProps = {
  src: string;
  aspect?: number;
  pos?: string;
  fg?: string; // cut-out PNG (same framing) for the parallax foreground
  mask?: number[]; // or: polygon (fractions of the PRINT) lifted from src as the foreground
  name?: string; // caption, strong part
  role?: string; // caption, light part
  captionAt?: number;
  mono?: number; // 1 = archive mono (default .9)
  develop?: number; // fade-up frames
  cap?: number; // caption name cap (px)
  subCap?: number; // caption role cap (px)
};

export const ArchiveStill: React.FC<ArchiveStillProps> = ({ src, aspect = 3 / 2, pos, fg, mask, name, role, captionAt = 30, mono = 0.9, develop = 40, cap = 30, subCap = 28 }) => {
  const k = useCurrentFrame();
  const box = fitBox(aspect, 1380, 800);
  const pw = box.w, ph = box.h, B = 16;
  const dev = EZ.in2(clamp01(k / develop)) * 0.55 + 0.45 * EZ.out2(clamp01(k / develop)); // slow ease-in fade-up (Farrell B5), not a pop
  const t = (k + 1) / 30;
  const sP = 1.0 + 0.009 * t, sF = 1.0 + 0.022 * t; // print push vs foreground parallax
  const grain = Math.floor(k / 2);
  const poly = mask ? `polygon(${mask.map((v, i) => `${(v * 100).toFixed(2)}%${i % 2 ? "," : ""}`).join(" ").replace(/,$/, "")})` : undefined;
  const capF = fs("inter", cap), roleF = fs("inter", subCap);
  const ck = k - captionAt;
  const grade = `grayscale(${mono}) contrast(1.18) brightness(${(0.3 + 0.62 * dev).toFixed(3)}) sepia(.08) hue-rotate(160deg) saturate(.6)`;
  return (
    <AbsoluteFill style={{ background: "#020202" }}>
      <Specks k={k} n={22} seed={31} max={0.18} />
      <div style={{ position: "absolute", left: W / 2 - pw / 2 - B, top: H / 2 - ph / 2 - B - 10, width: pw + 2 * B, height: ph + 2 * B, transform: `scale(${(1.0 + 0.006 * t).toFixed(5)}) rotate(-0.6deg)`,
        background: `rgba(${Math.round(150 * dev)},${Math.round(148 * dev)},${Math.round(142 * dev)},1)`, boxShadow: `0 30px 80px rgba(0,0,0,${(0.85 * dev).toFixed(3)})` }}>
        <div style={{ position: "absolute", left: B, top: B, width: pw, height: ph, overflow: "hidden", background: "#000" }}>
          <div style={{ position: "absolute", inset: 0, transform: `scale(${sP.toFixed(5)})` }}><Media src={src} pos={pos} style={{ filter: grade }} /></div>
          {fg || poly ? (
            <div style={{ position: "absolute", inset: 0, transform: `scale(${sF.toFixed(5)})`, transformOrigin: "50% 60%", clipPath: fg ? undefined : poly }}>
              <Media src={fg ?? src} pos={pos} style={{ filter: grade }} />
            </div>
          ) : null}
          <CardVig k={0.62} />
          {/* live grain (Farrell: stillness kept alive by texture) */}
          <svg width={pw} height={ph} style={{ position: "absolute", inset: 0, opacity: 0.16, mixBlendMode: "overlay" }}>
            <filter id="arch-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={grain % 97} /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width={pw} height={ph} filter="url(#arch-grain)" />
          </svg>
          {name || role ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 190, background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.72))" }}>
              <div style={{ position: "absolute", left: 34, bottom: 28, display: "flex", alignItems: "baseline", gap: 16, opacity: clamp01(ck / 10), transform: `translateY(${(14 * (1 - EZ.out3(ck / 18))).toFixed(2)}px)`,
                textShadow: "0 2px 8px rgba(0,0,0,.8)", whiteSpace: "nowrap" }}>
                {name ? <span style={{ fontFamily: FONT.inter, fontWeight: 600, fontSize: capF, color: "#F2F3F3" }}>{name}</span> : null}
                {role ? <span style={{ fontFamily: FONT.inter, fontWeight: 400, fontSize: roleF, color: "#B8BCBE", opacity: clamp01((ck - 5) / 8) }}>{role}</span> : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,.7) 100%)" }} />
    </AbsoluteFill>
  );
};
