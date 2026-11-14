// dash1 (Dashcam "INSTRUMENT") additions to the title family. The lead merges `extra` into index.ts.
import type { VariantDef } from "../../core";
import { VideoWall } from "./VideoWall";

const clips = ["demo/clip_park.mp4", "demo/clip_fire.mp4", "demo/clip_party.mp4"];
export const extra: VariantDef[] = [
  {
    family: "title", name: "VideoWall", component: VideoWall, durationInFrames: 180, thumbFrame: 40, stripFrames: [4, 12, 40, 58, 62, 66, 88, 92],
    defaultProps: {
      cells: clips, cellStarts: [0, 8, 16, 4, 12], cols: 5, rows: 4,
      title: [{ text: "20", at: 4, face: "num", cap: 150, key: true }, { text: "Most Disturbing Dashcam Moments", at: 10, cap: 62 }], titleOut: 52,
      stops: [{ cell: 6, at: 66 }, { cell: 13, at: 92 }, { cell: 3, at: 118 }, { cell: 16, at: 144 }],
    },
    ref: "REFERENCE_SYNTHESIS §H2 Direction A title device + B6: Nocturn NB5 video wall VIRAL 0:22.0-0:35.3 (cells 1/3 W, zoom 2.45x, whips 6-8 f with motion blur) + Dashcam Vol.3 wall camera @0:33.08-0:46.5 (lands on each case as it is named)",
    when: "The video's title / tease: a wall of the cases' own clips; the camera whips from case to case as the VO names them.",
    props: "cells[] clips, cellStarts[], cols, rows, stops [{cell, at = landing frame}], title [{text, at, face title|num, cap, key}], titleOut, zoom (2.45), whip (7), firstDur (10), tilt, roll, dof, theme",
    twist: "every cell plays footage; tilted wall plane with radial DOF; title on the wide dimmed wall in D-DIN 700 + D-DIN Exp; landed cell lit, others dimmed",
    sfx: [{ event: "title_word_hit", at: 4 }, { event: "title_wall_move", at: 56, note: "+2.1 LU, per move: anchor = move start (stop.at - whip)" }, { event: "title_wall_move", at: 85 }, { event: "title_wall_move", at: 111 }, { event: "title_wall_move", at: 137 }],
    axes: { geometry: "tilted wall of playing clips, cells 1/3 W", entry: "whips 6-8 f with motion blur at 2.45x", layout: "centred title on the wide wall, then case landings", accent: "accent numeral + lit landed cell" },
  },
];
