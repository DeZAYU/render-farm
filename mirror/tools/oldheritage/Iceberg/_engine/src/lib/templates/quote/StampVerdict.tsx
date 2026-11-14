// quote / StampVerdict: a rubber stamp HITS a card / document with the key phrase. REF DD stamp (Dashcam case-file language: red ink, condensed
// caps, the corkboard index card of D1 E12 @14:44.4) + DD D1 white-flash impact grammar (a 1-2 f kick on contact) + Farrell evidence E1 (one
// element per noun). Map: c02 #43 (index card "NAME SURNAME", stamp "GUILT FULLY ESTABLISHED" on "fully established", attribution
// "- deputy prosecutor, 2006"), c08 #32 (a page as the document, the phrase stamped over it).
// OUR VERSION: the document is a cream index card (or any page/photo `src`) on a dark desk with a slow push; the stamp falls from above the lens
// (x1.7 -> x1 in 4 f, accelerating), lands rotated with a 2 f camera kick and a dust of ink, double-ruled red frame in Bebas caps with a rough
// ink texture (missing bits, displaced edges); a faint ghost of the impact lingers 6 f. Attribution types under the card.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, asset, clamp01, fs, ghost } from "../../core";
import { InkDefs, kick } from "../../core/kits/verdict";
import { typedN } from "../../core/kits/labels";

export type StampVerdictProps = {
  title?: string; lines?: string[]; src?: string; // index card text, or a document image
  stamp: string; stampAt: number; rot?: number; attribution?: { text: string; at: number }; seed?: number; cap?: number; labelCap?: number; subCap?: number;
};
export const StampVerdict: React.FC<StampVerdictProps> = ({ title = "NAME SURNAME", lines = ["Case no. ____", "Charge: ____"], src, stamp, stampAt, rot = -9, attribution, seed = 5, cap = 96, labelCap = 30, subCap = 32 }) => {
  const f = useCurrentFrame();
  const k = f - stampAt;
  const fall = EZ.in2(clamp01((k + 4) / 4)); // 4 f in, accelerating to contact at k = 0
  const sScale = k < -4 ? 0 : k < 0 ? 1.7 - 0.7 * fall : 1;
  const sO = k < -4 ? 0 : k < 0 ? 0.35 + 0.4 * fall : 0.92;
  const kk = kick(k, 12, seed);
  const push = 1 + 0.012 * (f / 30);
  const cardW = 1180, cardH = 700;
  const id = `stamp-ink-${seed}`;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 48%, #2a2622 0%, #0d0b0a 70%, #050505 100%)", overflow: "hidden" }}>
      <InkDefs id={id} seed={seed} rough={3} holes={0.3} />
      <AbsoluteFill style={{ transform: `translate(${kk.x.toFixed(2)}px, ${kk.y.toFixed(2)}px) scale(${push.toFixed(5)})` }}>
        <div style={{ position: "absolute", left: W / 2 - cardW / 2, top: H * 0.46 - cardH / 2, width: cardW, height: cardH, transform: "rotate(-1.6deg)", boxShadow: "0 30px 70px rgba(0,0,0,.7), 0 4px 10px rgba(0,0,0,.5)",
          background: src ? "#fff" : "linear-gradient(175deg, #F4EFE2, #E7DFCC)", overflow: "hidden" }}>
          {src ? <Img src={asset(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (
            <>
              {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 150 + i * 60, height: 2, background: "rgba(70,110,170,.28)" }} />)}
              <div style={{ position: "absolute", left: 0, right: 0, top: 118, height: 3, background: "rgba(200,40,40,.55)" }} />
              <div style={{ position: "absolute", left: 60, top: 42, fontFamily: FONT.courier, fontWeight: 700, fontSize: fs("courier", labelCap * 1.5), color: "#1b1b1b", letterSpacing: "0.04em" }}>{title}</div>
              {lines.map((l, i) => <div key={i} style={{ position: "absolute", left: 60, top: 162 + i * 66, fontFamily: FONT.courier, fontWeight: 700, fontSize: fs("courier", labelCap), color: "#2a2a2a" }}>{l}</div>)}
            </>
          )}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 90% at 40% 30%, rgba(255,255,255,.08), rgba(0,0,0,.18) 100%)" }} />
        </div>
        {k >= -4 ? (
          <div style={{ position: "absolute", left: W / 2, top: H * 0.52, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sScale.toFixed(4)})`, opacity: sO, mixBlendMode: k >= 0 ? "multiply" : "normal" }}>
            <div style={{ width: "max-content", filter: `url(#${id})`, padding: "18px 36px", border: "9px solid #B3000C", outline: "4px solid #B3000C", outlineOffset: 8, color: "#B3000C",
              fontFamily: FONT.bebas, fontSize: fs("bebas", cap), lineHeight: 1, letterSpacing: "0.04em", whiteSpace: "nowrap", textAlign: "center" }}>{stamp}</div>
          </div>
        ) : null}
        {k >= 0 && k < 6 ? (
          <div style={{ position: "absolute", left: W / 2, top: H * 0.52, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${(1 + 0.04 * k).toFixed(3)})`, opacity: 0.25 * (1 - k / 6),
            width: 900, height: 220, borderRadius: 30, background: "radial-gradient(ellipse at center, rgba(179,0,12,.6), rgba(179,0,12,0) 70%)" }} />
        ) : null}
      </AbsoluteFill>
      {attribution ? (
        <div style={{ position: "absolute", left: 0, width: W, top: H * 0.46 + cardH / 2 + 60, textAlign: "center", fontFamily: FONT.inter, fontWeight: 500, fontStyle: "italic", fontSize: fs("inter", subCap), color: "#CFCFCF",
          opacity: ghost(f - attribution.at, 4, 0.5), whiteSpace: "pre" }}>{attribution.text.slice(0, typedN(attribution.text, f - attribution.at, 0.5))}</div>
      ) : null}
    </AbsoluteFill>
  );
};
