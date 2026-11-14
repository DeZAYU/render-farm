// Family "n2map" (N2M, algrow-2 channel maps, v3 2026-10-26). Study: Disasters2/maps3d/MAP_STUDY.md. Pipeline: Disasters2/maps3d/README in MAP_STUDY.md §4.
import type { VariantDef } from "../../core";
import { TerrainMap_N2M, type TerrainMapProps } from "./TerrainMap_N2M";
export * from "./TerrainMap_N2M";
export * from "./rules_n2m";

/** Case 1 (Cobb Parkway / McCollum Field) preset. Keys are PLATE frames of maps3d/render/c01 (270 f, camera lands at 210, pinGlow at 150). */
export const C01_COBB: Omit<TerrainMapProps, "dur"> = {
  plate: "n2map/c01/f_%04d.jpg", trackSrc: "n2map/c01_track.json", fadeIn: 9,
  labels: [
    { anchor: "kennesaw", text: "Kennesaw Mountain", kind: "faint", at: 8, out: 92, up: 30 },
    { anchor: "airport", text: "Cobb County Intl Airport", kind: "box", at: 84, up: 64 },
    { anchor: "pin", text: "Cobb Parkway", kind: "primary", at: 152, up: 92, dx: -40 },
  ],
  guide: { line: "approach", at: 118, dur: 30, from: "end" },
  road: { line: "parkway", at: 136, dur: 34 },
  pin: { anchor: "pin", at: 148 },
  route: { line: "path", at: 172, dur: 50, plane: true },
};

const F = "n2map";
export const variants: VariantDef[] = [
  {
    family: F, name: "TerrainMap_N2M", component: TerrainMap_N2M, durationInFrames: 270, thumbFrame: 250, stripFrames: [0, 40, 90, 130, 160, 190, 220, 260],
    defaultProps: { dur: 270, ...C01_COBB },
    ref: "LEMMiNO D.B. Cooper 1:06 / 2:28-2:42 / 7:18 / 9:42-9:48 (charcoal hillshade, slate water, hairline roads, boxed tracked labels on a tick, typed primary label, dashed route + plane glyph, pin dot + white ring); Fern Japan's Chernobyl 8:24 / 10:00 / 12:16 (lit 3D map, tilted drifting camera, miniature DOF, one coloured ring)",
    when: "A real place the footage cannot show, when WHERE explains the event (approach paths, distances, terrain). Once per case at most, 5-11 s, under the VO line that names the place.",
    props: "dur (150-330), plate (mp4), track | trackSrc (json), labels [{anchor,text,kind:'primary'|'box'|'faint',at,out,up,dx}], guide/road/route {line,at,dur}, route.plane, pin {anchor,at}, fadeIn, fadeOut. Keys in plate frames.",
    twist: "real relief + real aerial at night in Blender (one continuous eased flight, moonlight, fog, amber practical at the pin) with crisp Remotion overlays from the Blender camera projection; amber only on the pin + route",
    sfx: [{ event: "dissolve_01 (soft whoosh, -23 re VO) on the cut in", at: 0 }, { event: "sub_pulse_01 (-20 re VO) as the pin lands", at: 146 }],
    axes: { geometry: "3D terrain", entry: "flight + type-on labels", layout: "pin + leader box", accent: "amber pin/route" },
  },
];
