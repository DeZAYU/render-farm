// photo / PagePhotoCrop: a news photo CUT OUT of the captured article (its credit line kept), laid over the same page blurred and dark, oversize ->
// settle, with a caption strip set inside the crop on its word and an optional DD HUD chip. REF: wp3 sec_C beat 17 / C#17 (the CNA photo taken
// from the page) + VV rule 4 recession (oversize -> settle, VV §5 pull-back bezier .559,0,.181,.609) + Farrell evidence rule 9 (source identity
// kept: credits stay in frame) + Dashcam Vol.1 @ 1:09.3 E4 HUD callout (red leader + box, FONTS.md Inter 700 cap 24).
// The page stays visible as context (the photo's origin), the photo is the subject.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, FONT, H, HudBox, PagePlane, W, asset, clamp01, fs, lerp, type ChipTone, type Rect } from "../../core";
import { CardVig } from "../../core/kits/photo";

export type PagePhotoCropProps = {
  page: { src: string; cssW: number; cssH: number };
  crop: Rect; // the photo on the page (css px)
  credit?: Rect; // the credit/byline line on the page (css px), pasted under the photo
  name?: string; // caption strong part
  role?: string;
  captionAt?: number;
  chip?: { text: string; at: number; p: { x: number; y: number } }; // HUD callout; p = point in the PHOTO (fractions)
  chipTone?: ChipTone; // "light" (default: white type, red outline, dark fill; M-024 contrast) | "red"
  width?: number; // screen width of the cut-out
  cap?: number; // caption name cap (px)
  subCap?: number; // caption role cap (px)
  labelCap?: number; // HUD chip cap (px)
};

const Crop: React.FC<{ src: string; cssW: number; cssH: number; r: Rect; s: number }> = ({ src, cssW, cssH, r, s }) => (
  <div style={{ position: "relative", width: r[2] * s, height: r[3] * s, overflow: "hidden", background: "#fff", isolation: "isolate" }}>
    <Img src={asset(src)} style={{ position: "absolute", left: -r[0] * s, top: -r[1] * s, width: cssW * s, height: cssH * s, mixBlendMode: "multiply" }} />
  </div>
);

export const PagePhotoCrop: React.FC<PagePhotoCropProps> = ({ page, crop, credit, name, role, captionAt = 30, chip, chipTone = "light", width = 1300, cap = 30, subCap = 28, labelCap = 28 }) => {
  const k = useCurrentFrame();
  const s = width / crop[2];
  const u = clamp01(k / 72);
  const sc = 1.14 - 0.14 * EZ.photoPull(u) - 0.01 * Math.max(0, k - 72) / 30;
  const rot = lerp(1.8, -0.9, EZ.photoRot(u)) - 0.05 * (k / 30);
  const pad = 18;
  const ph = crop[3] * s, chH = credit ? credit[3] * s * 0.9 + 14 : 0;
  const totalH = ph + chH + 2 * pad;
  const top = H / 2 - totalH / 2 - 10;
  const ck = k - captionAt;
  const strip = EZ.out3(clamp01(ck / 12));
  const bgS = Math.max(1.25, (W / page.cssW) * 1.08) * (1 + 0.006 * (k / 30));
  return (
    <AbsoluteFill style={{ background: "#0c0c0c" }}>
      <AbsoluteFill style={{ filter: "blur(14px) brightness(.32) saturate(.7)" }}>
        <PagePlane src={page.src} cssW={page.cssW} cssH={page.cssH} cx={crop[0] + crop[2] / 2} cy={crop[1] + crop[3] / 2} s={bgS} shadow="none" />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.65) 100%)" }} />
      <div style={{ position: "absolute", left: W / 2 - width / 2 - pad, top, width: width + 2 * pad, height: totalH, background: "#FBFBF9", transform: `scale(${sc.toFixed(5)}) rotate(${rot.toFixed(3)}deg)`,
        boxShadow: "0 28px 70px rgba(0,0,0,.75), 0 3px 8px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: pad, top: pad, width, height: ph, overflow: "hidden" }}>
          <Crop src={page.src} cssW={page.cssW} cssH={page.cssH} r={crop} s={s} />
          <CardVig k={0.3} />
          {name || role ? (
            <div style={{ position: "absolute", left: 0, bottom: 26, height: cap * 2.6, width: `${(strip * 100).toFixed(2)}%`, maxWidth: width, overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(8,8,9,.82)" }} />
              <div style={{ position: "absolute", left: 28, top: 0, height: cap * 2.6, display: "flex", alignItems: "center", gap: 14, whiteSpace: "nowrap", opacity: clamp01((ck - 6) / 6) }}>
                {name ? <span style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", cap), color: "#F6F7FB" }}>{name}</span> : null}
                {role ? <span style={{ fontFamily: FONT.inter, fontWeight: 400, fontSize: fs("inter", subCap), color: "#C3C5C8" }}>{role}</span> : null}
              </div>
            </div>
          ) : null}
        </div>
        {credit ? (
          <div style={{ position: "absolute", left: pad, top: pad + ph + 10, transformOrigin: "0 0", transform: "scale(.9)" }}>
            <Crop src={page.src} cssW={page.cssW} cssH={page.cssH} r={credit} s={s} />
          </div>
        ) : null}
      </div>
      {chip ? (() => {
        const px = W / 2 - width / 2 + chip.p.x * width, py = top + pad + chip.p.y * ph;
        const right = chip.p.x < 0.5;
        return <HudBox k={k - chip.at} p={{ x: px, y: py }} elbow={{ x: right ? px + 160 : px - 160, y: py - 120 }} text={chip.text} cap={labelCap} dir={right ? 1 : -1} dot tone={chipTone} />;
      })() : null}
    </AbsoluteFill>
  );
};
