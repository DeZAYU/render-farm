// Family "social": social / video pages with an optional typed translation (D3 I13 boxed caption, Nunito 700 white on #000). Frames LOCAL.
import type { VariantDef } from "../../core";
import { CreatorCard } from "./CreatorCard";
import { typingSfx } from "../page/shared";
import { CommentStack } from "./CommentStack";
import { PhonePost } from "./PhonePost";
import { PostCard } from "./PostCard";
import { WatchPage } from "./WatchPage";

const YT_CAP = [
  { text: "The camera on my head was only meant to record my life", at: 66 },
  { text: "to film one summer with my friends", at: 96 },
  { text: "but it ended up filming something else", at: 126 },
];
const PH_CAP = [{ text: "“Where is that light coming from?”", at: 48, until: 104 }];
export const variants: VariantDef[] = [
  {
    family: "social", name: "WatchPage", component: WatchPage,
    defaultProps: {
      src: "demo/pg_yt.png", cssW: 1150, cssH: 1200, start: { cx: 566, cy: 405, s: 1.6 }, push: { cx: 300, cy: 1012, s: 3.05, at: 36, d: 40 },
      lines: [{ r: [28.5, 952.5, 245, 14], at: 64 }, { r: [28.5, 972.5, 167, 14], at: 94 }, { r: [28.5, 992.5, 181.5, 14], at: 124 }],
      captions: YT_CAP, glitchOutAt: 176,
    },
    durationInFrames: 180, thumbFrame: 150, stripFrames: [0, 20, 36, 48, 60, 70, 100, 150, 177],
    ref: "Caving watch page + red bar @22:06.8 / 35:38.6 (settle §I-1 @6:13, Glitch A @0:44.45) + D3 I13 boxed caption; wp3 sec_B YTPage @ abs 4480",
    when: "The source video / uploader: 'in the video's description he wrote…'. The red bars track the lines the VO paraphrases; the caption translates them.",
    props: "src/cssW/cssH, start {cx,cy,s}, push? {cx,cy,s,at,d}, lines? {r, at}[] (red bars), captions? CaptionLine[], glitchOutAt?",
    twist: "the real description is 'read' line by line: bar + typed translation per line, DOF on the read lines",
    sfx: [...typingSfx(YT_CAP), { event: "glitch", at: 176, note: "Caving Glitch A exit (no SFX in the ref; optional)" }],
    axes: { geometry: "flat white capture, settle", entry: "pull-out settle 1.11 -> 1", layout: "player -> description lines", accent: "Caving red bar + typed caption" },
  },
  {
    family: "social", name: "CommentStack", component: CommentStack,
    defaultProps: {
      still: "demo/look_f50.png", title: "Strange lights over the lake (full video)",
      rows: [
        { name: "@markus.v", meta: "2 years ago", text: "I was there that night. Nobody talks about what happened after." },
        { name: "@hollowpine", meta: "2 years ago", text: "Pause at 0:41 and look at the treeline." },
        { name: "@d.ramirez", meta: "1 year ago", text: "My brother filmed the same thing from the other side of the water." },
        { name: "@ann_kt", meta: "11 months ago", text: "Why did they take the original upload down?" },
        { name: "@quietfeed", meta: "8 months ago", text: "This is the only copy left online." },
      ],
      first: 8, every: 14, scrollBy: 420, mark: { i: 2, at: 96 },
    },
    durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 8, 14, 22, 30, 50, 80, 110, 140],
    ref: "Visual Venture §12 comment stack @5:45.4-5:49.6 + Nocturn CP12 comments red glow bar (door 6:10.0; live 7:08.6)",
    when: "Viewer reaction as evidence ('people in the comments said…'); one comment can be singled out with the red glow bar as it is read.",
    props: "still (media), title, rows {name, text, meta?, avatar?, colour?}[], first, every, scrollAt/scrollBy/scrollDur, mark? {i, at}, captions?, cap (comment 30), labelCap (name 28), subCap (meta 28), titleCap (32), captionCap (40)",
    twist: "the VV stack keeps its single scroll; the singled-out comment gets the Nocturn red glow bar (white type on red)",
    sfx: [],
    axes: { geometry: "light-grey page, framed player", entry: "rows every 14 f + one scroll", layout: "vertical comment list", accent: "word ghost + red glow bar" },
  },
  {
    family: "social", name: "PostCard", component: PostCard,
    defaultProps: {
      bg: "demo/kena.png",
      cards: [
        { src: "demo/pg_wiki_ex.png", cssW: 510, cssH: 185, at: 8, out: 80, width: 1380, roll: -4, marks: [{ rects: [[9, 136.5, 448, 17], [9, 162.5, 166.5, 17]], at: 34, dur: 30 }] },
        { src: "demo/pg_amcham_ex.png", cssW: 615, cssH: 220, at: 86, width: 1300, roll: 3 },
      ],
    },
    durationInFrames: 170, thumbFrame: 70, stripFrames: [0, 3, 6, 10, 20, 50, 70, 84, 92, 110, 165],
    ref: "Caving comment cards @21:31-21:42 (3-D cards over the blurred last frame, 12 f in / 8 f out) + Nocturn CP13 post + yellow marker (shop 1:13.3) / CP14 tilted post (shop 13:30.8)",
    when: "A post, comment or forum reply read aloud over the story's last picture; chain 2-3 cards for several voices.",
    props: "bg (media: the last frame), cards {src,cssW,cssH, crop?, at, out?, marks?, width?, roll?}[], markColour, captions?",
    twist: "the outgoing shot shrinks into a bordered screen behind the cards (6 f), so the cut never leaves the story",
    sfx: [{ event: "title_wall_move", at: 8, note: "card swing-in" }, { event: "title_wall_move", at: 86 }],
    axes: { geometry: "3-D swinging card over a framed plate", entry: "swing in from lower right", layout: "one post at a time", accent: "yellow marker" },
  },
  {
    family: "social", name: "PhonePost", component: PhonePost,
    defaultProps: {
      clip: "demo/clip_vertical.mp4", handle: "@night.drive", meta: "· 3d", caption: "this showed up on my camera at 2am and I still can't explain it",
      captions: PH_CAP, dive: { at: 110, d: 26 },
    },
    durationInFrames: 140, thumbFrame: 80, stripFrames: [0, 3, 8, 14, 30, 80, 112, 124, 139],
    ref: "Abyssal vertical clips + blur fill @0:02.6 / 33:26-34:56 (I8 panel x .311-.686) + Farrell PG6 phone (OF 22:21.8) + Nocturn CP3 push into the player (psy 8:17.6)",
    when: "A clip that was posted on TikTok / Reels / Shorts: show it AS a post first, then dive into it for the raw.",
    props: "clip (vertical media), startFrom, handle, caption, meta, enter, dive? {at, d}, captions?, cap (post caption 28), labelCap (handle 30), subCap (meta 28), captionCap (40)",
    twist: "the dive drops bezel + chrome and lands exactly on the Abyssal centre panel, so the raw continues without a cut",
    sfx: [...typingSfx(PH_CAP), { event: "zoom_boom", at: 110, note: "optional, anchor = dive.at" }],
    axes: { geometry: "phone over blur-fill", entry: "rise + recession settle", layout: "9:16 screen + post chrome", accent: "dive into the screen" },
  },
  {
    family: "social", name: "CreatorCard", component: CreatorCard,
    defaultProps: {
      src: "demo/pg_yt.png", srcW: 1150, srcH: 1200, view: [15, 68, 1128, 694], card: [70, 205, 1005, 405],
      lines: [{ r: [80, 210, 990, 130], at: 40 }, { r: [275, 398, 560, 205], at: 70 }], liftAt: 10,
      captions: [{ text: "\u201cDocumentary\u201d", at: 72, until: 136 }],
    },
    durationInFrames: 140, thumbFrame: 120, stripFrames: [0, 10, 16, 24, 40, 50, 74, 90, 120],
    ref: "D3 I13 typed text (Dashcam Vol.3 @8:12.5) + Caving read-line bars (@22:06.8 / 35:38.6) + Farrell B4 lift-out (OF 4:29.5)",
    when: "The uploader's own words burned into the video (title card, on-video caption, thumbnail line), read out by the VO.",
    props: "src (still / clip), srcW/srcH, view [x0,y0,x1,y1], card [x,y,w,h], lines {r, at, dur}[], liftAt, tilt, captions?",
    twist: "no highlight colour: the creator's own pixels brighten line by line with a soft light wipe",
    sfx: [],
    axes: { geometry: "text region lifted off the frame", entry: "lift-out over defocused frame", layout: "the creator's own type", accent: "light wipe + glow" },
  },
];
