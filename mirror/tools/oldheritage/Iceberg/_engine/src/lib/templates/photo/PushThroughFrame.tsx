// photo / PushThroughFrame: the camera pushes THROUGH a dark foreground frame (a window, a doorway, a hatch) into a full-frame photo.
// REF: VV @ 10:43.0 (MOTION §7 tank "hold -> burst -> hold": locked ~1.3 s, then a log-zoom push x2.98 bezier (0.326,0,0.143,0.807), motion
// blurred) + VV rule 4 recession / oversize -> settle (the photo behind settles while the frame flies past) + Farrell parallax cut-out (FA
// openers: the foreground layer moves faster than the background) + VV rule 8 depth by occlusion. The frame is either a cut-out PNG (`fg`,
// transparent hole) or generated: a dark panel with a rounded opening, an inner lip highlight, optional mullion and a faint glass reflection.
// The label lands after the push in the DD rounded label face (white words rise, red key word sharpens, D3 E2).
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, Media, RoundText, Vignette, W, asset, clamp01, measure, CAP } from "../../core";

export type PTWord = { text: string; at: number; red?: boolean };
export type PushThroughFrameProps = {
  src: string; // the photo behind
  pos?: string;
  fg?: string; // optional cut-out foreground PNG (alpha hole); overrides the generated frame
  hole?: { x: number; y: number; w: number; h: number; r?: number }; // generated opening, frame fractions
  mullion?: boolean; // a vertical bar splitting the opening
  pushAt?: number; // start of the burst
  dur?: number; // burst frames
  through?: number; // frame zoom at the end of the burst
  words?: PTWord[];
  labelY?: number; // label centre (frame fraction)
  cap?: number; // label cap
};

export const PushThroughFrame: React.FC<PushThroughFrameProps> = ({
  src, pos, fg, hole = { x: 0.17, y: 0.13, w: 0.66, h: 0.66, r: 0.05 }, mullion = true, pushAt = 30, dur = 42, through = 4.2, words = [], labelY = 0.83, cap = 66,
}) => {
  const k = useCurrentFrame();
  const u = clamp01((k - pushAt) / dur);
  const e = EZ.tankBurst(u);
  const t = k / 30;
  const cx = (hole.x + hole.w / 2) * W, cy = (hole.y + hole.h / 2) * H;
  const zF = Math.exp(Math.log(through) * e) * (1 + 0.006 * Math.min(t, pushAt / 30));
  const zP = 1.14 * (1 + 0.1 * e) * (1 + 0.01 * Math.max(0, k - pushAt - dur) / 30) * (1 + 0.004 * t); // oversize photo, then a slow life push
  const fBlur = 2.5 + 14 * e;
  const fOp = 1 - clamp01((e - 0.82) / 0.18);
  const fast = u > 0.08 && u < 0.75;
  const hx = hole.x * W, hy = hole.y * H, hw = hole.w * W, hh = hole.h * H, hr = (hole.r ?? 0.05) * H;
  const panel = `M0 0H${W}V${H}H0Z M${hx + hr} ${hy}H${hx + hw - hr}A${hr} ${hr} 0 0 1 ${hx + hw} ${hy + hr}V${hy + hh - hr}A${hr} ${hr} 0 0 1 ${hx + hw - hr} ${hy + hh}H${hx + hr}A${hr} ${hr} 0 0 1 ${hx} ${hy + hh - hr}V${hy + hr}A${hr} ${hr} 0 0 1 ${hx + hr} ${hy}Z`;
  const sw = 0.076 * cap, f = (cap - sw) / CAP.round, space = measure(" ", `${f}px "Varela Round"`) * 0.9;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <MBlur on={fast} samples={6}>
        <AbsoluteFill>
          <AbsoluteFill style={{ transformOrigin: `${(cx / W) * 100}% ${(cy / H) * 100}%`, transform: `scale(${zP.toFixed(5)})` }}><Media src={src} pos={pos} /></AbsoluteFill>
          <Vignette />
          {fOp > 0 ? (
            <AbsoluteFill style={{ transformOrigin: `${(cx / W) * 100}% ${(cy / H) * 100}%`, transform: `scale(${zF.toFixed(5)})`, filter: `blur(${fBlur.toFixed(2)}px)`, opacity: fOp }}>
              {fg ? <Img src={asset(fg)} style={{ width: W, height: H, objectFit: "cover" }} /> : (
                <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
                  <defs>
                    <linearGradient id="ptf-panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b1c20" /><stop offset="0.55" stopColor="#0d0e10" /><stop offset="1" stopColor="#060607" /></linearGradient>
                    <linearGradient id="ptf-glass" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0.3" stopColor="#fff" stopOpacity="0" /><stop offset="0.45" stopColor="#dfe8ff" stopOpacity="0.10" /><stop offset="0.5" stopColor="#fff" stopOpacity="0" /></linearGradient>
                  </defs>
                  <rect x={hx} y={hy} width={hw} height={hh} rx={hr} fill="url(#ptf-glass)" transform={`translate(${(-60 + 2 * k).toFixed(1)} 0)`} />
                  {mullion ? <rect x={cx - 14} y={hy - 4} width={28} height={hh + 8} fill="#0b0c0e" stroke="rgba(255,255,255,.08)" strokeWidth={2} /> : null}
                  <path d={panel} fill="url(#ptf-panel)" fillRule="evenodd" />
                  <rect x={hx - 3} y={hy - 3} width={hw + 6} height={hh + 6} rx={hr + 3} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth={5} />
                  <rect x={hx + 2} y={hy + 2} width={hw - 4} height={hh - 4} rx={hr - 2} fill="none" stroke="rgba(0,0,0,.6)" strokeWidth={8} style={{ filter: "blur(6px)" }} />
                </svg>
              )}
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>
      </MBlur>
      {words.length ? (
        <div style={{ position: "absolute", left: 0, width: W, top: labelY * H, transform: "translateY(-60%)", display: "flex", justifyContent: "center", gap: space }}>
          {words.map((w, i) => {
            const q = k - w.at;
            if (q < 0) return <div key={i} style={{ opacity: 0 }}><RoundText text={w.text} cap={cap} colour="#fff" /></div>;
            const rise = (w.red ? 22 : 19) * (1 - EZ.out3(q / 26));
            const o = w.red ? 0.2 + 0.8 * EZ.out2(q / 10) : EZ.out2(q / 16);
            const b = w.red ? 8 * (1 - clamp01(q / 10)) : 0;
            const glow = w.red ? "drop-shadow(0 0 6px rgba(242,37,34,.75)) drop-shadow(0 0 16px rgba(242,37,34,.45)) drop-shadow(0 3px 6px rgba(0,0,0,.5))" : "drop-shadow(0 4px 8px rgba(0,0,0,.65))";
            return (
              <div key={i} style={{ opacity: o, transform: `translateY(${rise.toFixed(2)}px)`, filter: `${glow}${b > 0.05 ? ` blur(${b.toFixed(2)}px)` : ""}` }}>
                <RoundText text={w.text} cap={cap} colour={w.red ? "#F22522" : "#FDFDFD"} />
              </div>
            );
          })}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
