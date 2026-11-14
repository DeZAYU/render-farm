// photo / VVSettle: the VV §5 "settling print" (VV 1:29.3 de Carli card; wp3 sec_B HurtCard @5268, sec_C ChuCard @5903).
// Dark teal plate + anamorphic flare, a B/W torn print a few degrees off-axis that enters OVERSIZE and pulls back 16-23 % (bezier .559,0,.181,.609),
// rotation starting at full speed and easing out (+3..7 deg), y drop +49 px, optional teal neon name wiping L->R with a hard edge in 27 f while
// the pull-back is at peak speed (with VV's 1-frame letter dropouts). Our version: an off-white torn paper fringe, an optional trace of colour
// (`mono` < 1 keeps the DD grade), and the move never stops: after the settle the print keeps receding / rotating slowly until the cut.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, Media, W, clamp01, fs } from "../../core";
import { CardVig, Flare, Specks, TornPrint, fitBox, flickerOff } from "./shared";

export type VVSettleProps = {
  src: string; // photo (or clip), public-relative
  aspect?: number; // source w/h (default 0.75 portrait)
  pos?: string; // object-position inside the print
  name?: string; // neon name (caps), optional
  nameAt?: number; // local frame the wipe starts (VV: ~+0.4 s after the spoken name)
  mono?: number; // 1 = full B/W (VV), 0 = full colour; default 0.85
  pull?: number; // pull-back fraction (0.16-0.23)
  over?: number; // entry oversize (VV rule 4 recession)
  rot?: [number, number]; // start / end rotation (deg)
  settle?: number; // frames of the measured settle (VV 77 @ 24 fps = 96 @ 30)
  seed?: number;
  cap?: number; // name cap height (px)
};

export const VVSettle: React.FC<VVSettleProps> = ({
  src, aspect = 0.75, pos = "50% 35%", name, nameAt = 34, mono = 0.85, pull = 0.2, over = 1.1, rot = [-2.2, 3.5], settle = 96, seed = 5, cap = 92,
}) => {
  const k = useCurrentFrame();
  const u = clamp01(k / settle), tail = Math.max(0, k - settle) / 30;
  const s = over * (1 - pull * EZ.photoPull(u)) * Math.exp(-0.012 * tail); // keeps receding after the settle
  const r = rot[0] + (rot[1] - rot[0]) * EZ.photoRot(u) + 0.12 * tail;
  const y = 49 * EZ.photoY(u) + 3 * tail;
  const box = fitBox(aspect, 1500, 880);
  const cw = box.w, ch = box.h;
  // name: screen space, low on the print
  const nf = fs("oswald", cap);
  const wipe = name ? clamp01((k - nameAt) / 27) : 0;
  const wp = EZ.nameWipe(wipe) * 100;
  const wiping = wipe > 0 && wipe < 1;
  const nameY = H / 2 + y + ch * s * 0.24;
  return (
    <AbsoluteFill style={{ background: "#0C1416" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 62% 70% at 52% 50%, #16282C 0%, #0C1416 55%, #050809 100%)" }} />
      <Flare k={k} />
      <Specks k={k} n={26} seed={seed + 3} colour="190,235,230" max={0.25} />
      <div style={{ position: "absolute", left: W / 2 - cw / 2, top: H / 2 - ch / 2, width: cw, height: ch, transform: `translateY(${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(5)})`,
        filter: "drop-shadow(0 22px 42px rgba(0,0,0,.65))" }}>
        <TornPrint w={cw} h={ch} seed={seed}>
          <Media src={src} pos={pos} style={{ filter: `grayscale(${mono}) contrast(1.15) brightness(.95)` }} />
          <CardVig k={0.5} />
        </TornPrint>
      </div>
      {name && wipe > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: nameY - nf * 0.62, textAlign: "center" }}>
          <span style={{ display: "inline-block", clipPath: `inset(-40% ${(100 - wp).toFixed(2)}% -40% -10%)`, fontFamily: FONT.oswald, fontWeight: 700, fontSize: nf, lineHeight: 1.2,
            letterSpacing: "0.03em", color: "#62DACA", textShadow: "0 0 4px #9ff, 0 0 14px #3fb8a8, 0 0 34px #2a7a70" }}>
            {[...name].map((c, i) => <span key={i} style={{ opacity: flickerOff(i, k, wiping) ? 0.25 : 1 }}>{c}</span>)}
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
