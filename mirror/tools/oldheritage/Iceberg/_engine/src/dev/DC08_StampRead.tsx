// DC08 StampRead: the Ball PD tape is 4:3 and the 16:9 picture normally hides its burned-in stamp. On "just after four that
// afternoon" the camera sits low on the full tape, on the stamp's own clock (16:06), slides along to the officer's name it carries,
// then rises back into the picture onto the man in the white vest. While the camera reads the stamp the picture above it dims, so
// the camera's own record is what is read; nothing is typed over the tape.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CK, CamA, camAt, cl } from "./DC08_kit";

export const StampRead: React.FC<{ src: string; from: number; keys: CK[]; band: number; dimTo: number }> = ({ src, from, keys, band, dimTo }) => {
  const f = useCurrentFrame();
  const c = camAt(f, keys);
  // dim while the camera is low (on the stamp); lifts as it rises into the picture
  const low = interpolate(c.y, [0.55, 0.8], [0, 1], cl);
  const d = Math.min(low, interpolate(f, [0, 10, dimTo, dimTo + 30], [0.6, 1, 1, 0], cl));
  return (
    <AbsoluteFill>
      <CamA src={src} from={from} ar={4 / 3} keys={keys}
        layers={<>
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: `${band * 100}%`, background: `rgba(0,0,0,${0.62 * d})` }} />
          <div style={{ position: "absolute", left: 0, top: `${band * 100}%`, right: 0, bottom: 0, boxShadow: `inset 0 0 0 9999px rgba(255,255,255,${0.04 * d})` }} />
        </>} />
    </AbsoluteFill>
  );
};
