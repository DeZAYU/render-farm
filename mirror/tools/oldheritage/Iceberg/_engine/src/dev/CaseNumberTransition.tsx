// CaseNumberTransition — the between-cases transition, built to the measurements of Disturbing Dose's case change
// (_ref/DisturbingDose/STYLE.md, "8 Most Horrific Natural Disasters Caught on Dashcam" 1:10.37, case 2):
//   f0–1   the outgoing case's last frame breaks up (block tears, horizontal echo, pixel blocks)              (DD: 2 frames)
//   f2–13  hard cut to the incoming footage THROUGH a datamosh: the old picture's blocks are carried along the new
//          footage's own motion vectors (block matching on the real frames), blocks refresh to the new picture in a
//          rising random order, some come in pixelated, a few rows tear sideways; resolves by ~0.4 s             (DD: 6–8 frames)
//   f6–16  the big glossy red number assembles through the same blocks (masked cells + sliced echoes), solid at 0.5 s
//   →1.77s hold, rock steady, centred a touch right/up (DD: glyph 20 % of frame height, centre 51 % / 47 %)
//   →2.4 s  the number drops to ~35 % then fades out with its red bloom (DD: 0.33 s + 0.4 s ghost)
//   footage under it: slightly desaturated + vignette, a broad red bloom (screen) round the number.
//   sound: sub hit + digital crackle on the cut (DD's hit = 89 % energy 20–120 Hz, crackle 8–16 kHz, ~0.25 s).
// Props: number; src (incoming footage, public path) + from (s); outFrame (outgoing last frame image, optional);
// moshDir (public dir with in_000.jpg… = src at from + k/30, 960×540, made by _tools/make_transitions.py — the
// datamosh needs the real pixels of the incoming frames); sfx (public wav, optional); font (public ttf).
import React from "react";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";

export type CaseNumberTransitionProps = { number: number; src: string; from: number; outFrame?: string; moshDir: string; moshN?: number; sfx?: string; font?: string; seed?: number };
export const CNT_DUR = 75; // 2.5 s at 30 fps

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MW = 960, MH = 540, B = 12;           // mosh canvas (half res → 24 px blocks at 1080p, like DD's 8–16 px at 720p)
const COLS = MW / B, ROWS = MH / B;
const OUT_F = 2;                            // frames of outgoing break-up before the cut
const STEPS = 12;                           // datamosh steps after the cut
const NX = 982, NY = 510, NSIZE = 300;      // number centre (px @1920×1080) and font size (cap ≈ 218 px = 20 % of height)

const hash = (a: number, b: number, c: number) => { let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; h ^= h >>> 16; return ((h >>> 0) % 100000) / 100000; };

// ---------- image cache ----------
const imgCache = new Map<string, Promise<HTMLImageElement>>();
const loadImg = (u: string) => {
  if (!imgCache.has(u)) imgCache.set(u, new Promise((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = u; }));
  return imgCache.get(u)!;
};
const fontCache = new Map<string, Promise<void>>();
const loadFont = (u: string) => {
  if (!fontCache.has(u)) fontCache.set(u, new FontFace("CNTRound", `url(${u})`).load().then((f) => { document.fonts.add(f); }));
  return fontCache.get(u)!;
};

// ---------- the datamosh simulation (deterministic: frame k re-simulates steps 0..k so parallel/out-of-order rendering is exact) ----------
const lumaSmall = (img: CanvasImageSource) => {
  const c = document.createElement("canvas"); c.width = MW / 4; c.height = MH / 4;
  const x = c.getContext("2d", { willReadFrequently: true })!; x.drawImage(img, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height).data; const l = new Float32Array(c.width * c.height);
  for (let i = 0; i < l.length; i++) l[i] = d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11;
  return l;
};
/** block-matching motion (from prev → cur), one vector per 48 px macro cell of the mosh canvas, in mosh px */
const motion = (prev: Float32Array, cur: Float32Array) => {
  const w = MW / 4, h = MH / 4, cb = 12, R = 4; const mcx = Math.floor(w / cb), mcy = Math.floor(h / cb);
  const v: [number, number][] = [];
  for (let by = 0; by < mcy; by++) for (let bx = 0; bx < mcx; bx++) {
    let best = 1e18, bdx = 0, bdy = 0;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      let s = 0;
      for (let y = 0; y < cb; y += 2) for (let x = 0; x < cb; x += 2) {
        const X = bx * cb + x, Y = by * cb + y, PX = X + dx, PY = Y + dy;
        if (PX < 0 || PY < 0 || PX >= w || PY >= h) { s += 255; continue; }
        s += Math.abs(cur[Y * w + X] - prev[PY * w + PX]);
      }
      s += (Math.abs(dx) + Math.abs(dy)) * 2; // prefer small vectors on flat areas
      if (s < best) { best = s; bdx = dx; bdy = dy; }
    }
    v.push([bdx * 4, bdy * 4]);
  }
  return { v, mcx, mcy };
};

let pbC: HTMLCanvasElement | null = null;
const pixelBlock = (ctx: CanvasRenderingContext2D, src: CanvasImageSource, sx: number, sy: number, dx: number, dy: number, cell: number) => {
  // sample the block at 1/cell resolution and draw it back up with no smoothing = the "pixel block" look
  if (!pbC) { pbC = document.createElement("canvas"); pbC.width = B; pbC.height = B; }
  const t = pbC, tx = t.getContext("2d")!; const n = Math.max(1, Math.round(B / cell)); const sw = src instanceof HTMLImageElement ? B * (src.width / MW) : B;
  tx.clearRect(0, 0, B, B); tx.drawImage(src, sx, sy, sw, sw * (B / B), 0, 0, n, n);
  ctx.imageSmoothingEnabled = false; ctx.drawImage(t, 0, 0, n, n, dx, dy, B, B); ctx.imageSmoothingEnabled = true;
};

const tear = (ctx: CanvasRenderingContext2D, src: HTMLCanvasElement, k: number, seed: number, amount: number) => {
  // horizontal tears: whole block rows slide sideways (+ a faint echo copy), like DD's duplicated truck
  for (let r = 0; r < ROWS; r++) {
    const h = hash(r, k, seed + 11);
    if (h > amount) continue;
    const rows = 1 + Math.floor(hash(r, k, seed + 12) * 3), dx = (hash(r, k, seed + 13) - 0.35) * 160;
    ctx.drawImage(src, 0, r * B, MW, rows * B, dx, r * B, MW, rows * B);
    ctx.globalAlpha = 0.45; ctx.drawImage(src, 0, r * B, MW, rows * B, dx * 2.1, r * B, MW, rows * B); ctx.globalAlpha = 1;
  }
};

const simulate = (canvas: HTMLCanvasElement, frame: number, out: HTMLImageElement | null, ins: HTMLImageElement[], lumas: Float32Array[], seed: number) => {
  const ctx = canvas.getContext("2d")!;
  const buf = document.createElement("canvas"); buf.width = MW; buf.height = MH; const bx = buf.getContext("2d")!;
  const tmp = document.createElement("canvas"); tmp.width = MW; tmp.height = MH; const tx = tmp.getContext("2d")!;
  // start buffer: the outgoing frame (or black)
  bx.fillStyle = "#000"; bx.fillRect(0, 0, MW, MH); if (out) bx.drawImage(out, 0, 0, MW, MH);
  if (frame < OUT_F) {
    // outgoing break-up: tears + pixel blocks + a red-shifted echo
    tx.drawImage(buf, 0, 0);
    tear(tx, buf, frame, seed, 0.18 + frame * 0.14);
    for (let i = 0; i < 40 + frame * 50; i++) {
      const cx = Math.floor(hash(i, frame, seed + 3) * COLS), cy = Math.floor(hash(i, frame, seed + 4) * ROWS);
      pixelBlock(tx, buf, cx * B, cy * B, cx * B, cy * B, hash(i, frame, seed + 5) < 0.5 ? 4 : 6);
    }
    ctx.clearRect(0, 0, MW, MH); ctx.drawImage(tmp, 0, 0);
    return;
  }
  const kMax = Math.min(STEPS - 1, frame - OUT_F, ins.length - 1);
  // the outgoing frame as it was left at the cut (its own break-up) is what gets moshed
  tx.drawImage(buf, 0, 0); tear(tx, buf, 1, seed, 0.32); bx.drawImage(tmp, 0, 0);
  const pRef = [0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.87, 0.93, 0.975, 1.01, 1.01, 1.01];
  const pPix = [0.65, 0.6, 0.52, 0.45, 0.38, 0.3, 0.22, 0.15, 0.08, 0.03, 0, 0];
  const pTear = [0.2, 0.16, 0.12, 0.1, 0.08, 0.06, 0.04, 0.02, 0, 0, 0, 0];
  for (let k = 0; k <= kMax; k++) {
    const cur = ins[k];
    const mv = k === 0 ? null : motion(lumas[k - 1], lumas[k]);
    tx.clearRect(0, 0, MW, MH);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = c * B, y = r * B, h = hash(c * 131 + r, k, seed);
      // a refreshed block stays refreshed (monotone): its threshold is fixed per block
      const thr = 0.7 * hash(Math.floor(c / 4), Math.floor(r / 3), seed + 1) + 0.3 * hash(c, r, seed + 2);
      if (thr < pRef[k]) {
        if (hash(Math.floor(c / 3), Math.floor(r / 2), seed + k * 7 + 40) < pPix[k] * 0.9 + 0.1 * h) pixelBlock(tx, cur, x * (cur.width / MW), y * (cur.height / MH), x, y, 3);
        else tx.drawImage(cur, x * (cur.width / MW), y * (cur.height / MH), B * (cur.width / MW), B * (cur.height / MH), x, y, B, B);
      } else {
        // P-frame bleed: carry the OLD picture along the NEW footage's motion (amplified), plus a little of the new residual
        let dx = 0, dy = 0;
        if (mv) { const mx = Math.min(mv.mcx - 1, Math.floor(c / 4)), my = Math.min(mv.mcy - 1, Math.floor(r / 4)); [dx, dy] = mv.v[my * mv.mcx + mx]; }
        const sx = Math.max(0, Math.min(MW - B, x - dx * 1.8)), sy = Math.max(0, Math.min(MH - B, y - dy * 1.8));
        tx.drawImage(buf, sx, sy, B, B, x, y, B, B);
        tx.globalAlpha = 0.12 + 0.05 * k; tx.drawImage(cur, x * (cur.width / MW), y * (cur.height / MH), B * (cur.width / MW), B * (cur.height / MH), x, y, B, B); tx.globalAlpha = 1;
      }
    }
    if (pTear[k] > 0) { const t2 = document.createElement("canvas"); t2.width = MW; t2.height = MH; t2.getContext("2d")!.drawImage(tmp, 0, 0); tear(tx, t2, k + 7, seed, pTear[k]); }
    bx.clearRect(0, 0, MW, MH); bx.drawImage(tmp, 0, 0);
  }
  ctx.clearRect(0, 0, MW, MH); ctx.drawImage(buf, 0, 0);
};

const Mosh: React.FC<{ frame: number; out?: string; moshDir: string; n: number; seed: number }> = ({ frame, out, moshDir, n, seed }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [h] = React.useState(() => delayRender("datamosh"));
  React.useEffect(() => {
    let live = true;
    const urls = Array.from({ length: n }, (_, k) => staticFile(`${moshDir}/in_${String(k).padStart(3, "0")}.jpg`));
    Promise.all([out ? loadImg(staticFile(out)) : Promise.resolve(null), Promise.all(urls.map(loadImg))]).then(([o, ins]) => {
      if (!live || !ref.current) return;
      const lumas = ins.map((i) => lumaSmall(i));
      simulate(ref.current, frame, o, ins, lumas, seed);
      continueRender(h);
    }).catch((e) => { console.error(e); continueRender(h); });
    return () => { live = false; };
  }, [frame, out, moshDir, n, seed, h]);
  return <canvas ref={ref} width={MW} height={MH} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", imageRendering: "pixelated" }} />;
};

// ---------- the number ----------
const Number3D: React.FC<{ text: string; cells?: (boolean)[]; slices?: { y0: number; y1: number; dx: number; a: number }[] }> = ({ text, cells, slices }) => {
  const W = 1920, H = 1080;
  const glyph = (id: string, extra?: React.SVGProps<SVGTextElement>) => (
    <text x={NX} y={NY} textAnchor="middle" dominantBaseline="central" fontFamily="CNTRound, 'Arial Rounded MT Bold', 'Arial Rounded MT', Arial" fontWeight={700} fontSize={NSIZE} letterSpacing={-6} {...extra} key={id}>{text}</text>
  );
  const maskId = "cntmask";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="cntfill" x1="0" y1={NY - 120} x2="0" y2={NY + 120} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF4238" /><stop offset="0.45" stopColor="#FF1A18" /><stop offset="1" stopColor="#E0100F" />
        </linearGradient>
        {/* bevel + gloss: blurred alpha as a height map, specular light from the upper left, an inner shade low right */}
        <filter id="cntbevel" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="hb" />
          <feSpecularLighting in="hb" surfaceScale="3" specularConstant="0.6" specularExponent="24" lightingColor="#FFE6E6" result="sp">
            <fePointLight x={NX - 260} y={NY - 330} z={260} />
          </feSpecularLighting>
          <feComposite in="sp" in2="SourceAlpha" operator="in" result="spIn" />
          <feOffset in="SourceAlpha" dx="-5" dy="-7" result="off" />
          <feGaussianBlur in="off" stdDeviation="5" result="offb" />
          <feComposite in="SourceAlpha" in2="offb" operator="out" result="innerShade" />
          <feFlood floodColor="#6A0008" floodOpacity="0.38" />
          <feComposite in2="innerShade" operator="in" result="shade" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="shade" /></feMerge>
          <feComposite in2="spIn" operator="arithmetic" k1="0" k2="1" k3="0.42" k4="0" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
        <filter id="cntglow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="22" /></filter>
        <filter id="cntshadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter>
        {cells && (
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            {cells.map((on, i) => on ? <rect key={i} x={NX - 300 + (i % 25) * 24} y={NY - 180 + Math.floor(i / 25) * 24} width={24} height={24} fill="#fff" /> : null)}
          </mask>
        )}
      </defs>
      <g mask={cells ? `url(#${maskId})` : undefined}>
        {glyph("glow", { fill: "#FF1A1A", opacity: 0.55, filter: "url(#cntglow)" })}
        {glyph("shadow", { fill: "#2A0003", opacity: 0.55, filter: "url(#cntshadow)", transform: "translate(4 7)" })}
        {glyph("face", { fill: "url(#cntfill)", stroke: "url(#cntfill)", strokeWidth: 7, strokeLinejoin: "round", filter: "url(#cntbevel)" })}
      </g>
      {slices?.map((s, i) => (
        <g key={i} opacity={s.a}>
          <clipPath id={`cntsl${i}`}><rect x={0} y={s.y0} width={W} height={s.y1 - s.y0} /></clipPath>
          <g clipPath={`url(#cntsl${i})`} transform={`translate(${s.dx} 0)`}>{glyph("sl" + i, { fill: "#FF2020" })}</g>
        </g>
      ))}
    </svg>
  );
};

export const CaseNumberTransition: React.FC<CaseNumberTransitionProps> = ({ number, src, from, outFrame, moshDir, moshN = 14, sfx, font = "t/ArialRoundedBold.ttf", seed = 7 }) => {
  const f = useCurrentFrame();
  const [fh] = React.useState(() => delayRender("cnt font"));
  React.useEffect(() => { loadFont(staticFile(font)).then(() => continueRender(fh)).catch(() => continueRender(fh)); }, [font, fh]);

  // number visibility: assemble f6→16, hold, drop to 35 % by f61, gone by f72
  const inA = interpolate(f, [6, 16], [0, 1], cl);
  const outA = f < 53 ? 1 : f < 61 ? interpolate(f, [53, 61], [1, 0.35], { ...cl, easing: Easing.bezier(0.4, 0, 0.6, 1) }) : interpolate(f, [61, 72], [0.35, 0], cl);
  const vis = f < 6 ? 0 : Math.min(inA < 1 ? 0.35 + 0.65 * inA : 1, outA);
  const assembling = f >= 6 && f < 17;
  const cells = assembling ? Array.from({ length: 25 * 15 }, (_, i) => hash(i, 3, seed + 21) < Easing.bezier(0.3, 0, 0.4, 1)(inA) * 1.08 || (f >= 9 && hash(i, f, seed + 22) < 0.12)) : undefined;
  const slices = assembling && f < 13 ? [0, 1, 2].map((j) => { const y0 = NY - 110 + hash(j, f, seed + 30) * 200; return { y0, y1: y0 + 10 + hash(j, f, seed + 31) * 34, dx: (hash(j, f, seed + 32) - 0.5) * 140, a: 0.5 }; }) : undefined;
  const bloom = vis * (assembling ? 0.7 + 0.5 * inA : 1) * (f >= 15 && f <= 19 ? 1.12 : 1);
  const outBlur = f > 53 ? interpolate(f, [53, 72], [0, 3], cl) : 0;
  const moshOn = f < OUT_F + STEPS + 2;
  const moshA = f < OUT_F + STEPS - 2 ? 1 : interpolate(f, [OUT_F + STEPS - 2, OUT_F + STEPS + 1], [1, 0], cl);

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* footage + mosh, graded: slightly desaturated, a touch of contrast; the mosh itself gets a cold, drained look like DD's */}
      <AbsoluteFill style={{ filter: "saturate(0.62) contrast(1.07) brightness(0.95)" }}>
        <Sequence from={OUT_F} layout="none">
          <AbsoluteFill><OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
        </Sequence>
        {moshOn && <AbsoluteFill style={{ opacity: moshA, filter: f >= OUT_F ? "saturate(0.55) contrast(1.12)" : undefined }}><Mosh frame={f} out={outFrame} moshDir={moshDir} n={moshN} seed={seed} /></AbsoluteFill>}
      </AbsoluteFill>
      {/* chromatic fringe at the edges during the break-up only */}
      {f < OUT_F + 6 && <AbsoluteFill style={{ boxShadow: "inset 6px 0 18px rgba(255,0,40,.35), inset -6px 0 18px rgba(0,180,255,.3)", opacity: interpolate(f, [0, OUT_F + 6], [1, 0], cl) }} />}
      {/* red bloom round the number (screen), and the vignette */}
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: bloom, background: `radial-gradient(ellipse 640px 540px at ${NX}px ${NY}px, rgba(255,30,30,.62) 0%, rgba(240,22,22,.40) 35%, rgba(210,12,12,.16) 68%, rgba(0,0,0,0) 100%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      {vis > 0 && <AbsoluteFill style={{ opacity: vis, filter: outBlur ? `blur(${outBlur}px)` : undefined }}><Number3D text={String(number)} cells={cells} slices={slices} /></AbsoluteFill>}
      {/* fine grain so the number sits in the footage rather than on it */}
      <AbsoluteFill style={{ opacity: 0.06, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' seed='${f % 17}'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")` }} />
      {sfx && <Audio src={staticFile(sfx)} />}
    </AbsoluteFill>
  );
};

/** demo / per-case wrapper used by entries/CaseT.tsx (props come from --props) */
export const CaseT: React.FC<CaseNumberTransitionProps> = (p) => <CaseNumberTransition {...p} />;
