// toll / SingleFile: large pixel people rise one by one into a single-file line that grows, a count beside them; the camera pulls back so the
// whole line always fits. REF: Farrell YT @ 22:36 (E3 pixel glyphs: hard pop from black, blocky glyph with glow and a dim reflected floor, locked or
// slow push) + Visual Venture @ 1:44.1 (MOTION §7 crowd: the group pulls back while new figures arrive) + VV §13 pop-up rise (bezier .015,-.151,
// .012,.998, a very hard ease-out) for each figure. Use it for small numbers that must be felt one by one (victims, missing people).
// Our version: each figure rises from below the floor line on its word, with a reflection on the floor; `red` figures glow red.
import React from "react";
import { useCurrentFrame } from "remotion";
import { EZ, H, MBlur, RoundText, RC, W, clamp01, lerpLog } from "../../core";
import { P, PPDefs, PP_H, PP_W, PixelTexture, Plate, RED, WHITE, fmt } from "./shared";

export type FilePerson = { at: number; red?: boolean };
export type SingleFileProps = { people: FilePerson[]; word?: string; px?: number; gapCells?: number };

export const SingleFile: React.FC<SingleFileProps> = ({ people, word, px = 13, gapCells = 4 }) => {
  const k = useCurrentFrame();
  const pw = PP_W * px, ph = PP_H * px, pitch = (PP_W + gapCells) * px;
  const floorY = 640;
  // camera: fit the current line (log zoom, eased per arrival), centre on the line
  const fitZ = (n: number) => Math.min(1, (W * 0.62) / Math.max(pitch, n * pitch));
  let z = fitZ(1);
  people.forEach((p, i) => { if (i > 0) z = lerpLog(z, fitZ(i + 1), EZ.settle((k - p.at) / 36)); });
  z *= 1 + 0.006 * (k / 30);
  let cxLine = 0;
  people.forEach((p, i) => { cxLine += (i === 0 ? pitch / 2 : pitch / 2 * EZ.settle((k - p.at) / 36)); });
  const lineX = W * 0.6 - cxLine * z;
  const fast = people.some((p) => k - p.at >= 0 && k - p.at < 6);
  const count = people.filter((p) => k >= p.at + 2).length;
  return (
    <Plate bg="#030303">
      <MBlur on={fast} samples={6}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <PPDefs />
          <defs>
            <linearGradient id="sf-refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.22" /><stop offset="0.6" stopColor="#fff" stopOpacity="0" /></linearGradient>
            <mask id="sf-mask" maskUnits="userSpaceOnUse" x={-20000} y={-20000} width={40000} height={40000}><rect x={-20000} y={floorY} width={40000} height={ph * 1.2} fill="url(#sf-refl)" /></mask>
            <clipPath id="sf-clip"><rect x={-20000} y={-20000} width={40000} height={20000 + floorY} /></clipPath>
          </defs>
          <g transform={`translate(${lineX.toFixed(2)} ${floorY}) scale(${z.toFixed(5)}) translate(0 ${-floorY})`}>
            {[0, 1].map((refl) => (
              <g key={refl} mask={refl ? "url(#sf-mask)" : undefined}>
                <g transform={refl ? `translate(0 ${2 * floorY}) scale(1 -1)` : undefined}><g clipPath="url(#sf-clip)">
                  {people.map((p, i) => {
                    const q = k - p.at;
                    if (q < 0) return null;
                    const rise = EZ.hardOut(q / 18);
                    const sq = 1.12 - 0.12 * EZ.out3(q / 8);
                    const fill = p.red ? RED : WHITE;
                    const x = i * pitch + (pitch - pw) / 2;
                    const y = floorY - ph + (1 - rise) * (ph + 40);
                    return (
                      <g key={i} style={{ filter: refl ? undefined : p.red ? "drop-shadow(0 0 6px rgba(255,30,40,.9)) drop-shadow(0 0 22px rgba(220,10,20,.55))" : "drop-shadow(0 0 5px rgba(255,255,255,.55)) drop-shadow(0 0 20px rgba(200,220,255,.22))" }}>
                        <P x={x - (sq - 1) * pw / 2} y={y} px={px} sx={sq} sy={1 / sq} fill={fill} />
                      </g>
                    );
                  })}
                </g></g>
              </g>
            ))}
          </g>
          <rect x={0} y={floorY} width={W} height={2} fill="rgba(233,233,230,.16)" />
        </svg>
      </MBlur>
      <PixelTexture cell={4} k={0.18} />
      {count > 0 ? (
        <div style={{ position: "absolute", left: 90, width: 520, top: 360, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, filter: "drop-shadow(0 4px 12px rgba(0,0,0,.7))" }}>
          <RoundText text={fmt(count)} cap={150} colour="#FFFFFF" />
          {word ? <div style={{ opacity: clamp01((k - people[0].at - 8) / 8) }}><RoundText text={word} cap={52} colour={RC.labelRed} /></div> : null}
        </div>
      ) : null}
    </Plate>
  );
};
