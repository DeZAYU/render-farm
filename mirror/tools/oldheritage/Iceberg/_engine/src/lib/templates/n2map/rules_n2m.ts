// N2M house rules in code (owner 2026-10-25: rules live in code). TerrainMap_N2M THROWS at render when:
//  - the instance is outside 5-11 s (maps are explained, not lingered on: Smoothness_Guide "maps >= 1 s + words/3", OWNER_TASTE maps 3-5 s;
//    a 3D flight needs >= 5 s to read as a move, not a zoom);
//  - the plate would be stretched beyond +-20 % (time-warped Blender motion starts to look wrong);
//  - any label / road / route / pin would not have finished its entry AND held >= 1.5 s before the plate ends (nothing appears cut off);
//  - a primary label has more than 4 words (no VO-restating text: names only).
import type { TerrainMapProps } from "./TerrainMap_N2M";

export const N2M_MIN = { minDur: 150, maxDur: 330, hold: 45, labelEntry: 12, maxStretch: 0.2 } as const;
export const assertN2M = (p: TerrainMapProps, plateLen: number, rate: number) => {
  const R = N2M_MIN;
  if (p.dur < R.minDur || p.dur > R.maxDur) throw new Error(`rules_n2m: TerrainMap_N2M is ${p.dur} f, needs ${R.minDur}-${R.maxDur} f`);
  if (Math.abs(rate - 1) > R.maxStretch) throw new Error(`rules_n2m: plate ${plateLen} f stretched to ${p.dur} f (x${rate.toFixed(2)}), max +-${R.maxStretch * 100} % - re-render the plate at this length`);
  const need = (name: string, end: number) => {
    if (end + R.hold > plateLen) throw new Error(`rules_n2m: ${name} lands at plate frame ${end}, needs >= ${R.hold} f hold before ${plateLen}`);
  };
  (p.labels ?? []).forEach((l) => {
    if (l.kind === "primary" && l.text.trim().split(/\s+/).length > 4) throw new Error(`rules_n2m: primary label "${l.text}" > 4 words (names only)`);
    const end = l.at + R.labelEntry + Math.ceil(l.text.length * 0.9);
    if (!l.out) need(`label "${l.text}"`, end);
    else if (l.out - end < R.hold) throw new Error(`rules_n2m: label "${l.text}" is readable ${l.out - end} f, needs >= ${R.hold} f`);
  });
  if (p.road) need("road", p.road.at + p.road.dur);
  if (p.route) need("route", p.route.at + p.route.dur);
  if (p.pin) need("pin", p.pin.at + 10);
};
