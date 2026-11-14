// evidence / ClaimSplit: two SIDES of a dispute as two columns of index cards on a dark wall (plaintiffs vs defendants, claimants vs
// respondents). Each column's heading lands with a red underline wipe; its cards rise into place on their words (short lift, quick settle, a pin);
// the camera starts on the first column and travels to frame both when the other side appears; red strings link opposing cards.
// REF Dashcam Vol.1 E12 (884.4-902.7: items on their nouns, pins, red string 10 f) + VV §11 world-space camera @3:28.0 (quick start /
// long settle phases). Differs from Corkboard (scattered items on cork, item-to-item camera) and SplitCompare (one claim + glyph per side).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, MBlur, PushPin, RC, RoundText, clamp01, fs, lerp, lerpLog } from "../../core";

export type ClaimCard = { text: string; sub?: string; at: number };
export type ClaimSplitProps = {
  left: { title: string; at: number; cards: ClaimCard[] };
  right: { title: string; at: number; cards: ClaimCard[] };
  links?: { l: number; r: number; at: number }[]; // red string between card l (left) and card r (right)
  pullAt?: number;
  cap?: number; // heading cap (default 56)
  labelCap?: number; // card text cap (default 36)
  subCap?: number; // card sub-line cap (default 32)
};
const CX = 480, CW = 700, CH = 170, TOPY = -250, STEP = 196;
const cardY = (i: number) => TOPY + i * STEP + CH / 2;
const Card: React.FC<{ c: ClaimCard; x: number; i: number; f: number; lc: number; sc: number }> = ({ c, x, i, f, lc, sc }) => {
  const k = f - c.at;
  if (k < 0) return null;
  const u = EZ.quick(k / 14);
  const rot = ((i * 53) % 7 - 3) * 0.45;
  return (
    <div style={{ position: "absolute", left: x - CW / 2, top: cardY(i) - CH / 2 + 50 * (1 - u), width: CW, height: CH, opacity: clamp01(k / 6), transform: `rotate(${(rot * u + 6 * (1 - u)).toFixed(3)}deg)`,
      background: "#F4F2EC", boxShadow: `${(4 + 14 * (1 - u)).toFixed(1)}px ${(8 + 26 * (1 - u)).toFixed(1)}px ${(14 + 20 * (1 - u)).toFixed(1)}px rgba(0,0,0,.55)`,
      display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 34 }}>
      <div style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", lc), lineHeight: 1.15, color: "#151515", whiteSpace: "nowrap" }}>{c.text}</div>
      {c.sub ? <div style={{ fontFamily: FONT.inter, fontWeight: 500, fontSize: fs("inter", sc), lineHeight: 1.15, color: "#4a4743", marginTop: 6, whiteSpace: "nowrap" }}>{c.sub}</div> : null}
      <PushPin x={CW / 2} y={12} r={12} opacity={clamp01((k - 8) / 4)} />
    </div>
  );
};
const Head: React.FC<{ title: string; at: number; x: number; f: number; cap: number }> = ({ title, at, x, f, cap }) => {
  const k = f - at;
  if (k < 0) return null;
  return (
    <div style={{ position: "absolute", left: x - CW / 2, top: TOPY - 140, width: CW, display: "flex", flexDirection: "column", alignItems: "center",
      opacity: clamp01(k / 12), transform: `translateY(${(19 * (1 - EZ.out3(k / 22))).toFixed(2)}px)` }}>
      <RoundText text={title} cap={cap} colour="#FDFDFD" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }} />
      <div style={{ width: CW * 0.8 * EZ.out2((k - 6) / 14), height: 6, background: RC.d1Red, marginTop: 10, boxShadow: "0 0 10px rgba(235,24,25,.6)" }} />
    </div>
  );
};
const Inner: React.FC<ClaimSplitProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  const both = EZ.quick((f - p.right.at) / 36);
  const pu = p.pullAt !== undefined ? EZ.settle((f - p.pullAt) / 40) : 0;
  const n = Math.max(p.left.cards.length, p.right.cards.length);
  const midY = (TOPY - 140 + cardY(n - 1) + CH / 2) / 2;
  const cx = lerp(-CX * 0.62, 0, both);
  const cy = lerp(lerp(-120, midY, both), midY, pu);
  const z = lerpLog(lerpLog(1.12, 0.94, both), 0.9, pu) * (1 + 0.008 * t); // settled zoom >= 0.9 keeps card text >= 28 px cap
  return (
    <AbsoluteFill style={{ background: "#0e0f10" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 62% 60% at 50% 46%, #23262a 0%, #0e0f10 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px, 540px) scale(${z.toFixed(4)}) translate(${-cx}px, ${-cy}px)` }}>
        <Head title={p.left.title} at={p.left.at} x={-CX} f={f} cap={p.cap ?? 56} />
        <Head title={p.right.title} at={p.right.at} x={CX} f={f} cap={p.cap ?? 56} />
        {p.left.cards.map((c, i) => <Card key={`l${i}`} c={c} x={-CX} i={i} f={f} lc={p.labelCap ?? 36} sc={p.subCap ?? 32} />)}
        {p.right.cards.map((c, i) => <Card key={`r${i}`} c={c} x={CX} i={i} f={f} lc={p.labelCap ?? 36} sc={p.subCap ?? 32} />)}
        <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {(p.links ?? []).map((l, i) => {
            const u = EZ.out3((f - l.at) / 10);
            if (u <= 0) return null;
            const a = { x: -CX + CW / 2 - 10, y: cardY(l.l) }, b = { x: CX - CW / 2 + 10, y: cardY(l.r) };
            return (
              <g key={i}>
                <path d={`M${a.x},${a.y} Q0,${(a.y + b.y) / 2 + 40} ${b.x},${b.y}`} fill="none" stroke="#C40D0D" strokeWidth={5} pathLength={1} strokeDasharray={`${u} 1`}
                  style={{ filter: "drop-shadow(2px 5px 3px rgba(0,0,0,.5))" }} />
              </g>
            );
          })}
        </svg>
        {(p.links ?? []).map((l, i) => (f >= l.at ? (
          <React.Fragment key={`p${i}`}>
            <PushPin x={-CX + CW / 2 - 10} y={cardY(l.l)} r={11} opacity={clamp01((f - l.at) / 4)} />
            <PushPin x={CX - CW / 2 + 10} y={cardY(l.r)} r={11} opacity={clamp01((f - l.at - 8) / 4)} />
          </React.Fragment>
        ) : null))}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 74% 72% at 50% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
export const ClaimSplit: React.FC<ClaimSplitProps> = (p) => {
  const f = useCurrentFrame();
  return <MBlur on={f > p.right.at + 1 && f < p.right.at + 14}><Inner {...p} /></MBlur>;
};
