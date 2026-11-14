// TP23 CountDiff — two tallies side by side over the darkened rescue footage: the park's count (15, three gates of five) and the
// fire service's count (16): the right tally redraws the same fifteen, mark for mark, then one extra stroke lands on its own in red.
// A thin white rule joins the two fifteens so the only difference left standing is the red mark. Names in RedLabels, no numerals.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1);

const Tally: React.FC<{ n: number; x: number; y: number; at: number; every: number; redLast?: boolean; redAt?: number }> = ({ n, x, y, at, every, redLast, redAt }) => {
  const f = useCurrentFrame();
  const H = 150, gap = 30, gw = 4 * gap + 40;
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5), k = i % 5, red = redLast && i === n - 1;
    const t0 = red && redAt !== undefined ? redAt : at + i * every;
    const u = out(interpolate(f, [t0, t0 + (red ? 9 : 5)], [0, 1], cl));
    if (u <= 0) continue;
    const gx = x + g * (gw + 46);
    if (k < 4) {
      const mx = gx + k * gap + (red ? 34 : 0);
      marks.push(<line key={i} x1={mx} y1={y + H} x2={mx} y2={y + H - H * u} stroke={red ? RED : "#fff"} strokeWidth={red ? 12 : 9} strokeLinecap="round" />);
    } else {
      // the gate: a diagonal through the four
      const ax = gx - 18, ay = y + H * 0.8, bx = gx + 3 * gap + 18, by = y + H * 0.2;
      marks.push(<line key={i} x1={ax} y1={ay} x2={ax + (bx - ax) * u} y2={ay + (by - ay) * u} stroke="#fff" strokeWidth={9} strokeLinecap="round" />);
    }
  }
  return <>{marks}</>;
};

export const CountDiff: React.FC<{ bg: string; bgFrom: number; rate?: number; leftAt: number; rightAt: number; redAt: number; ruleAt: number; leftName: string; rightName: string }> = ({ bg, bgFrom, rate = 0.5, leftAt, rightAt, redAt, ruleAt, leftName, rightName }) => {
  const f = useCurrentFrame(); const { width, durationInFrames } = useVideoConfig();
  const fade = interpolate(f, [0, 8], [0, 1], cl);
  const z = 1.08 + 0.06 * (f / durationInFrames);
  const y = 450, gw = 4 * 30 + 40, span = 3 * gw + 2 * 46;
  const lx = width * 0.27 - span / 2, rx = width * 0.73 - span / 2 - 40;
  const r = out(interpolate(f, [ruleAt, ruleAt + 16], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, filter: "brightness(.32) saturate(.55) blur(3px)" }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 48%, rgba(0,0,0,0) 35%, rgba(0,0,0,.6) 100%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: fade, filter: "drop-shadow(0 3px 8px rgba(0,0,0,.8))" }}>
        <line x1={width / 2} y1={360} x2={width / 2} y2={790} stroke="rgba(255,255,255,.55)" strokeWidth={3} />
        <Tally n={15} x={lx} y={y} at={leftAt} every={2} />
        <Tally n={16} x={rx} y={y} at={rightAt} every={2} redLast redAt={redAt} />
        {/* the rule: the two fifteens match, end to end */}
        {r > 0 && <line x1={lx - 30} y1={y + 200} x2={lx - 30 + (rx + span - 10 - (lx - 30)) * r} y2={y + 200} stroke="#fff" strokeWidth={4} strokeDasharray="14 10" />}
      </svg>
      <RedLabel text={leftName} at={leftAt - 4} x={0.27} y={0.34} size={40} />
      <RedLabel text={rightName} at={rightAt - 4} x={0.73 - 20 / 1920} y={0.34} size={40} />
    </AbsoluteFill>
  );
};
