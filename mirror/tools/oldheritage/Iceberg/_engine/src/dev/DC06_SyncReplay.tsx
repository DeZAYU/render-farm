// DC06 SyncReplay: the front camera replays the crash at half speed, full frame, the camera easing toward the Jeep as it comes over
// the median from the left; on "crossed the median" a thin white seam opens down the middle and the inside camera slides in on the
// right, synced to the same instant, so the viewer sees the Jeep arriving and the officer's head still down at the same time. Both
// halves keep running through the hit (airbag, pink flare). No text.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, ease, io } from "./DC01_kit";

export const SyncReplay: React.FC<{ front: string; inner: string; from: number; splitAt: number; fKeys: [number, number, number][]; iFocus: [number, number] }> =
  ({ front, inner, from, splitAt, fKeys, iFocus }) => {
  const f = useCurrentFrame();
  const sp = ease(f, splitAt, splitAt + 20);
  // front camera: keys [frame, scale, focusX]
  let s = fKeys[0][1], x = fKeys[0][2];
  for (let i = 1; i < fKeys.length; i++) if (f >= fKeys[i - 1][0]) { const u = io(interpolate(f, [fKeys[i - 1][0], fKeys[i][0]], [0, 1], cl)); s = fKeys[i - 1][1] + (fKeys[i][1] - fKeys[i - 1][1]) * u; x = fKeys[i - 1][2] + (fKeys[i][2] - fKeys[i - 1][2]) * u; }
  const fw = 1920 - 960 * sp;                                            // front panel width shrinks to the left half
  const vw = 1920 * s, vh = 1080 * s;
  const vl = Math.min(0, Math.max(fw - vw, fw / 2 - x * vw)), vt = (1080 - vh) / 2;
  const iw = 960 * 1.2, ih = iw * 9 / 16 > 1080 ? iw * 9 / 16 : 1080, iW = ih * 16 / 9;  // inner cam covers its half
  const il = Math.min(0, Math.max(960 - iW, 480 - iFocus[0] * iW)), it = Math.min(0, Math.max(1080 - ih, 540 - iFocus[1] * ih));
  const st = Math.round(from * 30);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: fw, height: 1080, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(front)} startFrom={st} playbackRate={0.5} muted style={{ position: "absolute", left: vl, top: vt, width: vw, height: vh }} />
      </div>
      {sp > 0 && <div style={{ position: "absolute", left: 1920 - 960 * sp, top: 0, width: 960, height: 1080, overflow: "hidden", boxShadow: "-6px 0 0 #fff" }}>
        <OffthreadVideo src={staticFile(inner)} startFrom={st} playbackRate={0.5} muted style={{ position: "absolute", left: il, top: it, width: iW, height: ih }} />
      </div>}
    </AbsoluteFill>
  );
};
