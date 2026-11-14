// caseopener / CentreSettle: REF Dashcam Vol.1 E1 centre number on a freeze (#3 @2:19.17: glyph 250-322 px centred at (0.50, 0.49 H), glossy top,
// red glow 15-20 px, focus-in 8 -> 0 px in 6 f, alpha 0.4 -> 1 in 11 f; the footage is FROZEN under it, then resumes with a hard continue)
// + the D1 corner variant (#12 @13:22.1, number top-right paired with a mid-frame date). OUR VERSION: the D3 number identity (Nunito 900,
// red gradient) and one continuous gesture: the centred number settles into the D3 corner slot (quick start / long settle, motion-blurred)
// on the frame the footage resumes, then date and place stack as two centred lines (word-rise) under the corner number.
import React from "react";
import { EZ, H, MBlur, W, clamp01, lerp, lerpLog } from "../../core";
import { CORNER, CaseGlyph, FootPlate, RiseRow } from "../labels/kit";
import { type CaseOpenerProps, Fill, LabelBand, presence, useF } from "./shared";

export type CentreSettleProps = CaseOpenerProps & { freezeFrame?: number; settleAt?: number; settleDur?: number; bigGlyph?: number; cap?: number };
export const CentreSettle: React.FC<CentreSettleProps> = ({
  number, dateWords, placeWords, media, mediaStart = 0, push = 0.045, numberAt = 2, numberOut = 110, dateOut, placeOut, settleAt = 46, settleDur = 26, bigGlyph = 300, cap = 74,
}) => {
  const f = useF();
  const k = f - numberAt;
  // freeze push +0.7 %/s (D3 I10, under a label), then the Dashcam +4.5 %/s once the clip resumes (continuous scale)
  const t = f / 30, ts = settleAt / 30;
  const sc = f < settleAt ? 1 + 0.007 * t : 1 + 0.007 * ts + push * (t - ts);
  const u = EZ.quick(clamp01((f - settleAt) / settleDur));
  const ex = clamp01((f - numberOut) / 30);
  const o = k < 0 ? 0 : (0.4 + 0.6 * EZ.out3(k / 11)) * (1 - ex * ex);
  const blur = k < 0 ? 0 : 8 * (1 - clamp01(k / 6));
  const x = lerp(W / 2, CORNER.x, u), y = lerp(0.49 * H, CORNER.y, u);
  const s = lerpLog(1, CORNER.glyph / bigGlyph, u);
  const fast = f > settleAt && f < settleAt + settleDur * 0.55;
  const y1 = 0.5 * H - cap * 1.0, y2 = 0.5 * H + cap * 1.0;
  const bandO = 0.36 * Math.max(presence(f, dateWords, dateOut), presence(f, placeWords, placeOut));
  return (
    <Fill>
      <FootPlate src={media} startFrom={mediaStart} push={0} base={sc} freezeAt={0} resumeAt={settleAt}>
        <LabelBand o={bandO} h={420} wPct={40} />
        <RiseRow words={dateWords} cap={cap} y={y1} exitAt={dateOut} />
        {placeWords?.length ? <RiseRow words={placeWords} cap={cap} y={y2} exitAt={placeOut} /> : null}
        {o > 0 ? (
          <MBlur on={fast} samples={6}>
            <CaseGlyph text={number} glyph={bigGlyph} x={x} y={y} opacity={o} blur={blur} glow={1 - u} gloss={0.55 * (1 - u)} style={{ transform: `translate(-50%,-50%) scale(${s.toFixed(4)})` }} />
          </MBlur>
        ) : null}
      </FootPlate>
    </Fill>
  );
};
