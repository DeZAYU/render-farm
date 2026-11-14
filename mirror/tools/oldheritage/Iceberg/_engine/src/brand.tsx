// ICEBERG CHANNEL grammar, measured from the reference the owner chose (Occult Inquisitor, "The Most DISTURBING Dashcam Disasters Ever
// Caught On Camera", EDJojKcP7Qk; frames in _ref/): footage is the case; graphics are few and plain.
//   TitleCard   the case opener: a cold blue-grey iceberg peak, slow push, the title in a distressed serif (white, soft glow).
//   RedLabel    a place / name / date: a red box with heavy black caps, wiped on (bottom-centre or under an inset).
//   Inset       a photo or a zoom of the footage in a thin white frame, over a blurred copy of the same picture.
//   Aerial      a real aerial (USGS NAIP) with a tilt-shift falloff, slow push, a white box drawn round the spot, + RedLabel.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig, continueRender, delayRender } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export const RED = "#E3141B";

let fontP: Promise<void> | null = null;
const useFonts = () => {
  const [h] = React.useState(() => delayRender("brand fonts"));
  React.useEffect(() => {
    if (!fontP) fontP = Promise.all([
      new FontFace("Elite", `url(${staticFile("fonts/SpecialElite-Regular.ttf")})`).load(),
      new FontFace("ArchivoBlk", `url(${staticFile("fonts/Archivo-wdth-wght.ttf")})`, { weight: "100 900", stretch: "62% 125%" }).load(),
    ]).then((fs) => { fs.forEach((f) => document.fonts.add(f)); });
    fontP.then(() => continueRender(h));
  }, [h]);
};

/** the case title over the case's OWN footage (owner: no iceberg in a countdown video): a dark, slowly pushed frame, distressed serif */
export const TitleCard: React.FC<{ dur: number; title: string; bg: string; pos?: string }> = ({ dur, title, bg, pos = "50% 50%" }) => {
  useFonts();
  const f = useCurrentFrame();
  const z = 1.06 + 0.07 * io(f / dur);
  const t = out(interpolate(f, [8, 30], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})`, filter: "brightness(0.42) contrast(1.1) saturate(0.6) blur(2px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.7) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: "Elite", fontSize: 100, letterSpacing: "0.04em", color: "#F2F2F0",
        opacity: t, filter: `blur(${(1 - t) * 6}px)`, transform: `translateY(${(1 - t) * 10}px)`, textShadow: "0 0 18px rgba(255,255,255,.25), 0 2px 8px rgba(0,0,0,.7)" }}>{title}</div>
    </AbsoluteFill>
  );
};

/** a real aerial photo with marks dropped on specific places one by one (e.g. each destroyed house), slow push; px = image pixels */
export const MarkMap: React.FC<{ src: string; iw: number; ih: number; focus: [number, number]; z0?: number; z1?: number; marks: [number, number][]; at: number; every: number; size?: number; label?: string; labelAt?: number }> = ({ src, iw, ih, focus, z0 = 1.15, z1 = 1.35, marks, at, every, size = 26, label, labelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {marks.map(([x, y], i) => {
          const g = out(interpolate(f, [at + i * every, at + i * every + 8], [0, 1], cl)); if (g <= 0) return null;
          const X = ox + x * base, Y = oy + y * base, s = size * (1.6 - 0.6 * g);
          return <g key={i} opacity={g}><rect x={X - s / 2} y={Y - s / 2} width={s} height={s} fill="rgba(227,20,27,.35)" stroke={RED} strokeWidth={3} />
            <rect x={X - s / 2 - 2} y={Y - s / 2 - 2} width={s + 4} height={s + 4} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={1} /></g>;
        })}
      </svg>
      {label && <RedLabel text={label} at={labelAt ?? 0} />}
    </AbsoluteFill>
  );
};

export const RedLabel: React.FC<{ text: string; at?: number; hold?: number; x?: number; y?: number; size?: number }> = ({ text, at = 0, hold = 9999, x = 0.5, y = 0.9, size = 46 }) => {
  useFonts();
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  if (f < at || f > at + hold + 8) return null;
  const w = out(interpolate(f, [at, at + 9], [0, 1], cl)), o = interpolate(f, [at + hold, at + hold + 8], [1, 0], cl);
  return (
    <div style={{ position: "absolute", left: x * width, top: y * height, transform: "translate(-50%, -50%)", opacity: o }}>
      <div style={{ background: RED, padding: `${size * 0.14}px ${size * 0.32}px`, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, boxShadow: "0 6px 18px rgba(0,0,0,.45)" }}>
        <div style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontStretch: "100%", fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: size, lineHeight: 1, color: "#0B0B0B", textTransform: "uppercase", whiteSpace: "pre", letterSpacing: "0.01em" }}>{text}</div>
      </div>
    </div>
  );
};

type Media = { src: string; from?: number; still?: boolean };
const Pic: React.FC<Media & { style: React.CSSProperties }> = ({ src, from = 0, still, style }) =>
  still ? <Img src={staticFile(src)} style={style} /> : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={style} />;

/** white-framed inset over a blurred copy of the same picture. box = inset size as a fraction of the frame width; crop = object-position */
export const Inset: React.FC<Media & { bg?: Media; box?: number; ar?: number; pos?: string; label?: string; labelAt?: number; drift?: number }> = ({ src, from, still, bg, box = 0.5, ar = 16 / 9, pos = "50% 50%", label, labelAt = 8, drift = 0.06 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const k = out(interpolate(f, [0, 12], [0, 1], cl)), d = io(f / durationInFrames);
  const W = width * box, H = W / ar;
  const b = bg ?? { src, from, still };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Pic {...b} style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(14px) brightness(.62)", transform: `scale(${1.05 + 0.04 * d})` }} />
      <div style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2 - 30, width: W, height: H, border: "6px solid #fff", boxShadow: "0 18px 50px rgba(0,0,0,.6)", overflow: "hidden",
        transform: `scale(${0.94 + 0.06 * k})`, opacity: k }}>
        <Pic src={src} from={from} still={still} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${1 + drift * d})` }} />
      </div>
      {label && <RedLabel text={label} at={labelAt} x={0.5} y={(height / 2 + H / 2 - 30 + 34) / height} />}
    </AbsoluteFill>
  );
};

/** real aerial: tilt-shift falloff, slow push toward the spot, a white box drawn round it, the red place label */
export const Aerial: React.FC<{ src: string; iw: number; ih: number; spot: [number, number, number, number]; z0?: number; z1?: number; label?: string; boxAt?: number; labelAt?: number }> = ({ src, iw, ih, spot, z0 = 1.0, z1 = 1.25, label, boxAt = 10, labelAt = 18 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const t = io(f / durationInFrames), z = z0 + (z1 - z0) * t;
  const base = Math.max(width / iw, height / ih) * z; // image px -> screen px
  const cx = (spot[0] + spot[2]) / 2, cy = (spot[1] + spot[3]) / 2;
  const ox = width / 2 - cx * base, oy = height / 2 - cy * base;
  const clampX = Math.min(0, Math.max(width - iw * base, ox)), clampY = Math.min(0, Math.max(height - ih * base, oy));
  const bx = spot[0] * base + clampX, by = spot[1] * base + clampY, bw = (spot[2] - spot[0]) * base, bh = (spot[3] - spot[1]) * base;
  const g = out(interpolate(f, [boxAt, boxAt + 14], [0, 1], cl));
  const P = 2 * (bw + bh);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: clampX, top: clampY, width: iw * base, height: ih * base, filter: "saturate(1.05) contrast(1.05)" }} />
      {/* tilt-shift: blur bands top and bottom */}
      <AbsoluteFill style={{ backdropFilter: "blur(6px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, #000 100%)", maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, #000 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
      </svg>
      {label && <RedLabel text={label} at={labelAt} x={(bx + bw / 2) / width} y={Math.min(0.92, (by + bh + 40) / height)} />}
    </AbsoluteFill>
  );
};

/** a time ruler for a short sequence of clock times (warning -> touchdown -> impact): white ticks over a dark copy of the footage,
 *  the ruler glides so each event lands centre on its word; events get the red label; a bracket shows the gap ("17 MIN") */
export const TimeRuler: React.FC<{ bg: string; bgFrom?: number; t0: number; t1: number; events: { t: number; label: string; at: number }[]; span?: { a: number; b: number; label: string; at: number } }> = ({ bg, bgFrom = 0, t0, t1, events, span }) => {
  useFonts();
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const pxPerMin = 64, y = height * 0.56;
  // camera: centre on the latest event already announced (eased between them)
  let cx = events[0].t, prev = events[0];
  for (const e of events) { if (f >= e.at - 14) { const k = io(interpolate(f, [e.at - 14, e.at + 6], [0, 1], cl)); cx = prev.t + (e.t - prev.t) * k; prev = e; } }
  if (span && f >= span.at - 10) cx = cx + ((span.a + span.b) / 2 - cx) * io(interpolate(f, [span.at - 10, span.at + 12], [0, 1], cl));
  const X = (m: number) => width / 2 + (m - cx) * pxPerMin;
  const hhmm = (m: number) => { const h = 5, mm = Math.round(m); return `${h}:${String(mm).padStart(2, "0")}`; };
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(10px) brightness(.35) grayscale(.4)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={0} y1={y} x2={width} y2={y} stroke="rgba(255,255,255,.75)" strokeWidth={3} />
        {Array.from({ length: Math.round(t1 - t0) + 1 }, (_, i) => t0 + i).map((m) => (
          <g key={m}>
            <line x1={X(m)} y1={y - (m % 5 === 0 ? 26 : 12)} x2={X(m)} y2={y} stroke="#fff" strokeWidth={m % 5 === 0 ? 3 : 1.5} opacity={m % 5 === 0 ? 0.9 : 0.5} />
            {m % 5 === 0 && <text x={X(m)} y={y + 44} fill="rgba(255,255,255,.75)" fontFamily="ArchivoBlk" fontWeight={700} fontSize={26} textAnchor="middle">{hhmm(m)} PM</text>}
          </g>
        ))}
        {span && f >= span.at && (() => { const g = out(interpolate(f, [span.at, span.at + 16], [0, 1], cl)); const xa = X(span.a), xb = xa + (X(span.b) - xa) * g;
          return <g><line x1={xa} y1={y - 90} x2={xb} y2={y - 90} stroke={RED} strokeWidth={5} /><line x1={xa} y1={y - 104} x2={xa} y2={y - 76} stroke={RED} strokeWidth={5} />{g > 0.98 && <line x1={xb} y1={y - 104} x2={xb} y2={y - 76} stroke={RED} strokeWidth={5} />}</g>; })()}
        {events.map((e, i) => { const g = out(interpolate(f, [e.at, e.at + 10], [0, 1], cl)); if (g <= 0) return null;
          return <g key={i} opacity={g}><circle cx={X(e.t)} cy={y} r={11 * g + 3} fill={RED} stroke="#fff" strokeWidth={3} /><line x1={X(e.t)} y1={y} x2={X(e.t)} y2={y - 60 * g} stroke="#fff" strokeWidth={2} /></g>; })}
      </svg>
      {events.map((e, i) => <RedLabel key={i} text={`${e.label} ${hhmm(e.t)}`} at={e.at + 4} x={X(e.t) / width} y={(y - 150) / height} size={40} />)}
      {span && <RedLabel text={span.label} at={span.at + 14} x={((X(span.a) + X(span.b)) / 2) / width} y={(y - 210) / height} size={40} />}
    </AbsoluteFill>
  );
};

/** the event's scar on a real satellite image, traced in red as it is spoken (px = image pixels), slow push along it */
export const ScarTrace: React.FC<{ src: string; iw: number; ih: number; path: [number, number][]; at: number; len: number; z0?: number; z1?: number; label?: string; labelAt?: number }> = ({ src, iw, ih, path, at, len, z0 = 1.1, z1 = 1.3, label, labelAt }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const cxi = path.reduce((a, p) => a + p[0], 0) / path.length, cyi = path.reduce((a, p) => a + p[1], 0) / path.length;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - cxi * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - cyi * base));
  const pts = path.map(([x, y]) => [ox + x * base, oy + y * base]);
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "saturate(.9) contrast(1.05)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth={14} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray={`${g} 1`} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && <RedLabel text={label} at={labelAt ?? at + len} />}
    </AbsoluteFill>
  );
};

/** then / now on the same ground: two aligned aerials, a white wipe line crosses at `at`, red labels name each side */
export const ThenNow: React.FC<{ then: string; now: string; iw: number; ih: number; focus: [number, number]; at: number; len?: number; z0?: number; z1?: number; thenLabel: string; nowLabel: string }> = ({ then, now, iw, ih, focus, at, len = 26, z0 = 1.6, z1 = 1.75, thenLabel, nowLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - focus[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - focus[1] * base));
  const w = io(interpolate(f, [at, at + len], [0, 1], cl)), xw = width * w;
  const st: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(then)} style={st} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: xw, overflow: "hidden" }}><Img src={staticFile(now)} style={st} /></div>
      {w > 0 && w < 1 && <div style={{ position: "absolute", left: xw - 3, top: 0, bottom: 0, width: 6, background: "#fff", boxShadow: "0 0 18px rgba(0,0,0,.6)" }} />}
      <RedLabel text={thenLabel} at={4} hold={at - 4} x={0.5} y={0.88} />
      <RedLabel text={nowLabel} at={at + len - 4} x={0.5} y={0.88} />
    </AbsoluteFill>
  );
};
