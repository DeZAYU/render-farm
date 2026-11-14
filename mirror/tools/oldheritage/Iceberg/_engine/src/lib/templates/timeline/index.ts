// Family "timeline": year sequences. nodes {year, label, media?, at} (at = LOCAL frame the node lands; at <= 0 = present at entry).
import type { VariantDef } from "../../core";
import { DayStrip } from "./DayStrip";
import { HorizonTrack } from "./HorizonTrack";
import { VerticalStack } from "./VerticalStack";
import { RulerTicker } from "./RulerTicker";
import { WorldCamera } from "./WorldCamera";
import { YearScroll } from "./YearScroll";

export const variants: VariantDef[] = [
  {
    family: "timeline", name: "WorldCamera", component: WorldCamera,
    defaultProps: {
      nodes: [
        { year: "2015", label: "the event", media: "demo/voa_fire_still.png", at: 0 },
        { year: "2019", label: "first ruling", media: "demo/n2019_pts.png", at: 0 },
        { year: "2023", label: "released", at: 24 },
        { year: "2026", label: "final ruling", at: 96 },
      ],
      dashFrom: 2, redLast: true, wideAt: 170,
    },
    durationInFrames: 240, thumbFrame: 236, stripFrames: [0, 24, 34, 60, 96, 110, 150, 180, 236],
    ref: "Visual Venture @ 3:28.0 (MOTION §11 world-space infographic with camera phases) + Dashcam Vol.1 I11 item entry; wp3 sec_C Timeline @ 6544",
    when: "A story across years told by the camera travelling a line: past events with photos, then a dashed 'not over yet' segment to a red final year.",
    props: "nodes {year, label, media?, at}[], gap, dashFrom?, redLast, wideAt?, zoom",
    twist: "dashed future segment drawn on the DD scroll curve; optional closing pull-back to the whole line; alternating VV phase curves; years/labels counter-scale with the camera so on-screen caps stay >= cap / labelCap at any zoom",
    sfx: [{ event: "title_wall_move", at: 96, note: "the camera travel to the last node" }],
    axes: { geometry: "horizontal line in world space", entry: "camera travel node to node", layout: "cards above, years below", accent: "dashed future + red last year" },
  },
  {
    family: "timeline", name: "YearScroll", component: YearScroll,
    defaultProps: {
      nodes: [
        { year: "1998", label: "the site opens", at: 0 },
        { year: "2004", label: "first warning", at: 30 },
        { year: "2011", label: "renovation approved", at: 90 },
        { year: "2015", label: "the night of the event", at: 150 },
        { year: "2020", label: "closed for good", at: 210 },
      ],
    },
    durationInFrames: 270, thumbFrame: 262, stripFrames: [0, 30, 40, 48, 70, 100, 160, 220, 262],
    ref: "Abyssal @ 0:38.0 (iceberg level sink, ICEBERG_MOTION.md tilted plane) + Dashcam Vol.3 @ 0:08.0-0:14.4 (E4 scroll velocity, edge defocus)",
    when: "A long run-up of years (history of a place, escalation over a decade) where each year is one VO beat; reads as 'sinking' toward the event.",
    props: "nodes {year, label, at}[], pitch, norm (scroll frames)",
    twist: "focus is continuous (red/label fade with distance to the focus band), yawed plane keeps turning, motion blur on the scroll peak",
    sfx: [{ event: "transition_whoosh", at: 30, note: "soft, per scroll" }],
    axes: { geometry: "vertical yawed column", entry: "DD scroll sink", layout: "years right-aligned, labels right of a rule", accent: "red year in a focus band" },
  },
  {
    family: "timeline", name: "HorizonTrack", component: HorizonTrack,
    defaultProps: {
      nodes: [
        { year: "2015", label: "THE NIGHT IT HAPPENED", media: "demo/ken_1908.png", at: 4 },
        { year: "2019", label: "THE FIRST VERDICT", media: "demo/n2019_pts.png", at: 96 },
        { year: "2023", label: "THE PARK TODAY", media: "demo/cna_abandoned_g.png", at: 190 },
      ],
    },
    durationInFrames: 280, thumbFrame: 270, stripFrames: [4, 14, 30, 70, 96, 104, 120, 196, 270],
    ref: "Visual Venture @ 17:42 / 20:00 / 22:40 (MOTION §3 date cards with a horizon line, on twos)",
    when: "Two to four dated chapters in a row ('In 2015… by 2019… today'), each with its own image; the shared line makes them one track.",
    props: "nodes {year, label (caps), media?, at}[], gap, accent, lineY",
    twist: "one persistent line: the strip slides on the VV subtitle curve, prints sink behind the line and the next one rises; year ticks on the line",
    sfx: [{ event: "transition_whoosh", at: 96, note: "per slide" }],
    axes: { geometry: "horizon line strip", entry: "slide along the line (on twos)", layout: "print above, year + amber title below", accent: "amber glow, B/W->colour" },
  },
  {
    family: "timeline", name: "RulerTicker", component: RulerTicker,
    defaultProps: {
      nodes: [
        { year: 2015, label: "the event", at: 0 },
        { year: 2019, label: "sentenced", at: 30 },
        { year: 2023, label: "released", at: 110 },
        { year: 2026, label: "still in court", at: 190 },
      ],
    },
    durationInFrames: 260, thumbFrame: 250, stripFrames: [0, 30, 40, 50, 70, 110, 130, 200, 250],
    ref: "Farrell GR @ 6:09.3 (counter rolling; story NUMBER) + Dashcam Vol.3 @ 1:47.87 (E5 stat '23 years') + Dashcam Vol.3 E4 scroll velocity",
    when: "Elapsed time is the point ('four years later', 'it took eleven years'); also counts down when the years go back.",
    props: "nodes {year (number), label, at}[], unit (px per year), norm, from?",
    twist: "the readout rolls with the ruler, red markers stay on reached years, ruler edges defocus, motion blur on the fast scroll",
    sfx: [{ event: "riser", at: 30, note: "short, under the roll" }, { event: "title_word_hit", at: 70, note: "label lands" }],
    axes: { geometry: "horizontal ruler + needle", entry: "ruler scroll + rolling digits", layout: "big readout over the needle", accent: "red needle + red label" },
  },
  {
    family: "timeline", name: "VerticalStack", component: VerticalStack,
    defaultProps: {
      rows: [
        { year: "2004", text: "the event, a short fact line", at: 4 },
        { year: "2006", text: "first decision: a short line", at: 40 },
        { text: "second decision: case dropped", at: 80 },
      ],
      slot: { text: "NOBODY WAS HELD RESPONSIBLE", at: 116, fillAt: 146 },
    },
    durationInFrames: 200, thumbFrame: 190, stripFrames: [0, 8, 40, 52, 80, 116, 130, 150, 190],
    ref: "Visual Venture @ 3:28.0 (MOTION §11 world-space camera, vertical) + Dashcam Vol.1 @ 4:15.8 (E9 red bar fill) + VV @ 1:02.6 (§1 chapter box: red box, white Bebas caps +0.15 em)",
    when: "The legal / official aftermath as a list that ends in an absence ('nobody went to prison', 'no charges'): the empty slot is the point.",
    props: "rows {year?, text, at}[], slot? {text, at, fillAt}, pitch",
    twist: "the camera tilts down (growing rotateX) as entries land; the final slot is outlined empty first, then fills red with a slam",
    sfx: [{ event: "sub_boom", at: 146, note: "on the slot fill" }],
    axes: { geometry: "vertical rule, left-anchored", entry: "row wipes + camera tilt down", layout: "years left of the rule, text right", accent: "empty red slot that fills" },
  },
  {
    family: "timeline", name: "DayStrip", component: DayStrip,
    defaultProps: {
      title: { text: "Place Name", red: "Hospital", at: 4 },
      rows: [
        { count: 30, at: 20, dur: 60, label: "PERSON ONE", tags: [{ text: "first tag", at: 70 }, { text: "second tag", at: 84, red: true }] },
        { count: 6, at: 110, dur: 18, label: "PERSON TWO", red: true, tags: [{ text: "surgery", at: 124, red: true }] },
      ],
    },
    durationInFrames: 170, thumbFrame: 160, stripFrames: [0, 10, 24, 40, 60, 84, 112, 130, 160],
    ref: "VV MOTION §15 rule 10 (mechanical rhythm for mechanical meaning) + Farrell story NUMBER (figure on its word) + Dashcam Vol.3 @ 0:03.4 (E2 rounded label)",
    when: "A duration in days ('around a month in hospital', 'seventeen days'), with what happened in that time as tags; a second row for a parallel person.",
    props: "rows {count, at, dur?, label?, red? (last cell red), tags {text, at, red?}[]}[], title? {text, red?, at}, unit",
    twist: "cells light at a constant (mechanical) rate with a bright front, the day counter runs with them; DD label face for place and tags",
    axes: { geometry: "row(s) of day cells", entry: "cell-by-cell lighting", layout: "title above, tags below, count right", accent: "bright lighting front / red last day" },
  },
];
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
