// Family "diagram": the line-art cross-section KIT (kit.tsx: Scene geometry + Structure/Crowd/Operators/Plume/Cloud/HeatLines/Kicked/FloorFire,
// world camera with named-ease keys) and the variants that tell a cause beat by beat on it, plus a clean node diagram. All frames LOCAL.
// The stage/pool/crowd geometry is a prop (DEMO_SCENE is only the placeholder). Silent by measurement (VV / FA explainers carry no SFX).
import type { VariantDef } from "../../core";
import { BUILD_DEMO, BuildOnWords } from "./BuildOnWords";
import { SPRAY_DEMO, EmitterSpray } from "./EmitterSpray";
import { IGNITION_DEMO, IgnitionFront } from "./IgnitionFront";
import { SPREAD_DEMO, SpreadPullback } from "./SpreadPullback";
import { CLEAN_DEMO, CleanDiagram } from "./CleanDiagram";
import { ISO_DEMO, IsoBlueprint } from "./IsoBlueprint";
import { FLOORPLAN_DEMO, FloorPlan } from "./FloorPlan";
import { ROOF_DEMO, RoofPonding } from "./RoofPonding";
import { FLOW_DEMO, TopDownFlow } from "./TopDownFlow";
import { SECTION_DEMO, StructureSection } from "./StructureSection";
import { MECH_DEMO, MechanismLoop } from "./MechanismLoop";
import { CUTAWAY_DEMO, Cutaway3D } from "./Cutaway3D";
import { ELEVATION_DEMO, ElevationDrop } from "./ElevationDrop";
import { SCALE_DEMO, ScaleCompare } from "./ScaleCompare";
import { MOAT_DEMO, MoatSection } from "./MoatSection";

export const variants: VariantDef[] = [
  {
    family: "diagram", name: "BuildOnWords", component: BuildOnWords, defaultProps: BUILD_DEMO, durationInFrames: 176, thumbFrame: 170, stripFrames: [0, 4, 12, 24, 40, 60, 74, 90, 110, 125, 150, 170],
    ref: "Farrell story #3 (explainer built on the words, returns #15/#33) + FA evidence E1 (IG @ 2:47.5) + VV §11 world-plane camera (Visual Venture TV @ 3:28.0) + D1 E4 HUD (@ 1:07.9) + D3 E5 stat (@ 1:47.87); wp3 sec_A PoolDiagram @ abs 1827",
    when: "Setting the scene of an accident/event in cross-section: where things were, how many people, before anything happens.",
    props: "scene (Scene kit geometry), at {ground,pit,pitFrames,stage,crowd,crowdFrames}, hud {text,at,until,x,y,dx,dy}, stat {value,prefix,word,at,wordAt,y}, cam0, cam CamSpec[], drift; M-024 caps: labelCap (HUD, 34)",
    twist: "pit draws as one stroke, pull-back reveals the stage on its noun, seeded crowd fill, number rolls up while the red word rises",
    sfx: [],
    axes: { geometry: "line-art cross-section", entry: "strokes draw on their nouns", layout: "world plane + stat top", accent: "red HUD box + red stat word" },
  },
  {
    family: "diagram", name: "EmitterSpray", component: EmitterSpray, defaultProps: SPRAY_DEMO, durationInFrames: 157, thumbFrame: 140, stripFrames: [0, 8, 20, 40, 48, 60, 76, 100, 118, 126, 140],
    ref: "Farrell story 'the diagram returns' (#15/#33) + VV §11 phase C push (Visual Venture TV @ 3:28.0) + D1 E4 HUD bracket callout (Dashcam Vol.1 @ 1:07.9); wp3 sec_A CannonDiagram @ abs 2166",
    when: "Showing how something was released / sprayed / spread by people or machines over others (powder, gas, water, smoke).",
    props: "scene, operatorsAt, sprayAt, cylinderAt, hud {text,at,emitter,dx,dy}, plumeLife, tintSpeed, cloudFrom, cam0, cam; M-024 caps: labelCap (HUD, 34)",
    twist: "tint front travels with the plume, cloud builds from it, camera follows the plume; motion blur on both moves",
    sfx: [],
    axes: { geometry: "cross-section + particle plume", entry: "push to the operators, follow the plume", layout: "left stage -> right crowd", accent: "multicolour particles + HUD" },
  },
  {
    family: "diagram", name: "IgnitionFront", component: IgnitionFront, defaultProps: IGNITION_DEMO, durationInFrames: 154, thumbFrame: 96, stripFrames: [0, 20, 40, 52, 64, 80, 90, 100, 112, 124, 140, 152],
    ref: "VV §7 tank hold -> burst (Visual Venture TV @ 10:43.0, x2.98 / 57 f log bezier .326,0,.143,.807) + FA evidence E1 + Farrell 'explainer returns'; wp3 sec_A IgnDiagram @ abs 2879 + sec_B CausePicto @ abs 3208",
    when: "The moment of cause: dense + heat -> it goes up. Ends in a white-hot core you can cut on.",
    props: "scene, denseAt, heatAt, ignAt, lamp, frontSpeed, burstAt, burstFrames, zoom, target, cam0, coreAt, operators",
    twist: "heat lines from the source lamp, front speed/source/target are props, white-core bloom hides the cut; motion blur on the burst",
    sfx: [{ event: "white_flash_hit", at: 148, note: "only if the next beat enters through the core (anchor = coreAt)" }],
    axes: { geometry: "cross-section + flame front", entry: "held drift -> log burst", layout: "stage left, cloud centre-right", accent: "orange flame palette + bloom" },
  },
  {
    family: "diagram", name: "SpreadPullback", component: SpreadPullback, defaultProps: SPREAD_DEMO, durationInFrames: 187, thumbFrame: 180, stripFrames: [0, 10, 30, 50, 70, 100, 110, 120, 135, 160, 180],
    ref: "VV §11 world-plane camera phases A/C (Visual Venture TV @ 3:28.0) + Farrell story #15 (the diagram returns, the spread lands on its word); wp3 sec_B SpreadDiagram @ abs 3882",
    when: "Aftermath / escalation: people flee, it spreads along the ground, the camera pulls back to show the scale.",
    props: "scene, runAt, runFrames, runMax, kickAt, kickFrames, cloudsAt, fireAt, fireFrames, airCloud, airFadeFrames, cam0, cam, drift",
    twist: "air cloud burns out while the floor takes over; grains behind the front take the flame palette; pull-back on the spread",
    sfx: [],
    axes: { geometry: "cross-section + floor front", entry: "push into the crowd, long pull-back", layout: "pit fills the frame", accent: "floor fire sweeping L->R" },
  },
  {
    family: "diagram", name: "CleanDiagram", component: CleanDiagram, defaultProps: CLEAN_DEMO, durationInFrames: 120, thumbFrame: 110, stripFrames: [0, 2, 8, 22, 30, 40, 56, 64, 72, 84, 86, 110],
    ref: "Farrell story IG @ 2:54.0-3:04.8 (person linked to two circles, built on the words, tilt-down 2.93 %H/s) + IG @ 2:47.6 (line icon crossed out in red) + Farrell evidence rule 10",
    when: "Who did what to whom / responsibility chains / how a scheme or process works; a missing or failed link crossed out.",
    props: "nodes [{id,glyph,label,sub,x,y,at,r,accent,cross}], links [{from,to,at,label,dashed,accent,bend,frames,both}], cam0, cam, tiltPerS, pushPerS, accent, bg; M-024 caps: labelCap (36), subCap (28)",
    twist: "line icons in thin rings, links draw as arrows with riding labels, red cross-out on the word, plane re-centres quick-start / long-settle",
    sfx: [],
    axes: { geometry: "node graph", entry: "ring draw + 0.25 s fade per node", layout: "triangle / flow, labels under", accent: "red accent node + red X" },
  },
  {
    family: "diagram", name: "IsoBlueprint", component: IsoBlueprint, defaultProps: ISO_DEMO, durationInFrames: 170, thumbFrame: 150, stripFrames: [0, 6, 16, 30, 40, 60, 74, 96, 116, 130, 136, 150],
    ref: "VV §11 world-space infographic (Visual Venture TV @ 3:28.0, quick-start / long-settle camera, bezier .31,0,0,.957) + Farrell story 'the explainer returns' (#15/#33) + D1 E4 HUD callout (Dashcam Vol.1 @ 1:07.9)",
    when: "How a structure / installation is built and where it failed (pool + plant room, a flume on a frame, a stage rig); returns on later beats with recolours, cracks, drop-outs and moving glyphs.",
    props: "unit, origin, parts [box {x,y,z,w,d,h,fill water|glass|solid|none,recolour,crack,drop} | line {pts,dashed,width} | glyph {glyph,x,y,z,size,moves[{at,d,to,rot}],until}], vapour[], lamps[{state,flickerAt,label}], labels[], tags[] (HUD), cam0, cam, drift, palette blueprint|line; M-024 caps: labelCap (30 plan labels; HUD max(28,labelCap))",
    twist: "true isometric boxes with hidden edges dashed, water/glass/solid faces, vapour wisps, an indicator lamp that flickers and stays dark, red recolour + crack + drop-out",
    sfx: [],
    axes: { geometry: "isometric line-art", entry: "parts draw on their nouns", layout: "3/4 iso view, camera between parts", accent: "red recolour / crack + HUD" },
  },
  {
    family: "diagram", name: "FloorPlan", component: FloorPlan, defaultProps: FLOORPLAN_DEMO, durationInFrames: 170, thumbFrame: 165, stripFrames: [0, 8, 20, 30, 50, 66, 84, 104, 112, 132, 150, 165],
    ref: "Farrell story #3 (explainer built on the words, returns twice) + FA evidence E1 (Instagram @ 2:47.5, one element per noun) + VV §11 world camera (Visual Venture TV @ 3:28.0) + D1 E5 ring language for the marker",
    when: "Where things are inside a building / site seen from above (pools, rooms, seats, columns); returns to pin a spot, fill a crowd, hatch the zone that failed. Also the 'PlanView' intent (columns counted one by one, a '?' on one).",
    props: "zones [{id,pts|rect{x,y,w,h,r},kind room|water|floor,label,labelAt,labelPos,at,drawFrames}], flows [{pts,at,spacing,speed}], crowds [{zone,n,at,frames,small,seed}], markers [{x,y,at,label,red}], hatches [{zone,at,label}], columns {pts,at,countAt,countStep,question{index,at}}, cam0, cam, drift, bg; M-024 caps: labelCap (30)",
    twist: "red hatch + label for the failed zone, 5 f marker ring, seeded dot crowds (small dots = children), numbered column ticks",
    sfx: [],
    axes: { geometry: "top-down plan", entry: "outlines draw, fills fade per noun", layout: "plan fills frame, camera re-frames", accent: "red hatch zone + marker ring" },
  },
  {
    family: "diagram", name: "RoofPonding", component: RoofPonding, defaultProps: ROOF_DEMO, durationInFrames: 180, thumbFrame: 120, stripFrames: [0, 10, 26, 40, 60, 76, 96, 116, 134, 138, 142, 150, 170],
    ref: "Farrell story explainer (built on the words, returns #15/#33) + VV §7 tank hold -> burst -> hold (Visual Venture TV @ 10:43.0, log bezier .326,0,.143,.807) for the failure",
    when: "A load-builds-up-until-it-fails mechanism in side section: ponding on a flat roof, snow load, a sagging floor; returns with the blocked downpipe / trusses.",
    props: "span {x0,x1,top,floor,lip,thick}, title {text,red,at}, rainAt, rainStop, pondAt, steps [{at,sag,depth,label}], fail {at,zoom,frames,label}, downpipe {at,side,drops[{at,kind nest|ball,label}]}, trusses {at,n,highlightAt,colour,label}, labels[]; M-024 caps: labelCap (30)",
    twist: "real water region between the sagging beam and a flat water line; the loop is a (sag, depth) step sequence with alternating cause labels; hinged failure with a shake under motion blur",
    sfx: [{ event: "sub_boom", at: 134, note: "optional, on the failure (anchor = fail.at)" }],
    axes: { geometry: "side section", entry: "rain, then step loop", layout: "span centred, title top-left", accent: "blue water, red failure" },
  },
  {
    family: "diagram", name: "TopDownFlow", component: TopDownFlow, defaultProps: FLOW_DEMO, durationInFrames: 150, thumbFrame: 70, stripFrames: [0, 10, 20, 34, 50, 70, 90, 96, 104, 116, 140],
    ref: "VV §11 world-space camera (Visual Venture TV @ 3:28.0, quick-start / long-settle) + Farrell story explainer (built on the words); c02-08 legend 'flow arrows' intent",
    when: "A ride / channel / conveyor seen from above where flow is the mechanism: current carries boats past an obstacle; the pumps stop and everything stalls.",
    props: "path P2[] (centreline), closed, width, drawAt, flow {at,speed,offAt,tau,spacing}, boats {n,at,colour,size}, obstacles [{x,y,r,at,label}], pumps [{s 0..1,at,label,offLabel,side}], labels [{text,at,x,y,red}], cam0, cam, drift; M-024 caps: labelCap (30)",
    twist: "one integrated flow clock drives arrows, boats and pump impellers, so 'off' decays everything physically; lamp green -> red",
    sfx: [],
    axes: { geometry: "top-down channel loop", entry: "banks draw, flow starts", layout: "loop fills frame", accent: "cyan water, red OFF" },
  },
  {
    family: "diagram", name: "StructureSection", component: StructureSection, defaultProps: SECTION_DEMO, durationInFrames: 160, thumbFrame: 56, stripFrames: [0, 10, 24, 40, 64, 80, 88, 96, 104, 112, 122, 140],
    ref: "wp3 sec_A/B line-art section system (white glowing strokes, colour = meaning) + Farrell story 'the explainer returns' (#15/#33, phases) + VV §7 hold -> burst (Visual Venture TV @ 10:43.0) for the collapse",
    when: "A building / structure (dome, hall, pool floor with drain + grate) that draws on its nouns and then fails in phases across returning beats: crack, glazing burst, dust, columns falling like dominoes, roof span dropping, grate lifting.",
    props: "members [{id,pts|arc{cx,cy,rx,ry,a0,a1},closed,at,drawFrames,width,fill glass|solid|water|none,colour,pivot}], events [crack{target,at,frames,u0,u1} | shatter{target,at} | dust{x,y,at,n} | fall{target,at,dir,frames,angle} | drop{target,at,dy,frames,rot} | lift{target,at,dx,dy,frames,rot} | red{at}], marks [{glyph,x,y,at,size,until}], dims [{x0,y0,x1,y1,text,at}], labels, cam0, cam, drift; M-024 caps: labelCap (30)",
    twist: "generic member geometry + a phased failure event list (crack crawl, shards, dust, domino falls, span drop, whole drawing to red) with impact shake; never figures",
    sfx: [{ event: "sub_boom", at: 118, note: "optional on the main drop" }],
    axes: { geometry: "structural section (members)", entry: "members draw on their nouns", layout: "elevation centred, camera to the failing part", accent: "red crack + red collapse" },
  },
  {
    family: "diagram", name: "MechanismLoop", component: MechanismLoop, defaultProps: MECH_DEMO, durationInFrames: 160, thumbFrame: 100, stripFrames: [0, 10, 24, 40, 60, 72, 86, 98, 106, 118, 120, 126, 150],
    ref: "Farrell story explainer (built on the words, returns #15/#33) + VV §11 world camera (Visual Venture TV @ 3:28.0) + D1 4 f white flash (Dashcam Vol.1) on the failure",
    when: "A ride mechanism in side elevation: flume on supports, conveyor, loads moving; they stop and bunch, weights stack, a joint gives way and the section drops out. Abstract (dots / empty raft outlines), never falling bodies.",
    props: "path P2[], ground, drawAt, supports {every,at}, joints u[], conveyor {u0,u1,at}, loads {n,at,kind dot|raft,spacing,speed,start,bunch{u,spread,at}}, water {at,dropAt}, heightRule {x,top,label,at}, weights [{label,at}], counter {value,at}, brittleAt, fail {joint,at}, cam0, cam, drift; M-024 caps: labelCap (30)",
    twist: "side elevation with height rule + support trusses + section joints; a load clock that compresses into a bunch; brittle line; segment drop-out with loads removed + 4 f flash",
    sfx: [{ event: "white_flash_hit", at: 118, note: "anchor = fail.at" }],
    axes: { geometry: "side-elevation schematic", entry: "flume draws, supports rise", layout: "diagonal run across frame", accent: "red joint + white flash" },
  },
  {
    family: "diagram", name: "Cutaway3D", component: Cutaway3D, defaultProps: CUTAWAY_DEMO, durationInFrames: 150, thumbFrame: 40, stripFrames: [0, 12, 24, 40, 50, 66, 72, 84, 96, 106, 120, 140],
    ref: "VV §11 world-space infographic (Visual Venture TV @ 3:28.0) + Farrell story 'the explainer returns' (#15/#33) + VV §7 colour = meaning",
    when: "A ride vehicle / raft / funnel object in 3-D: who sat where (empty seats light), belts, then what it did (hit, lift, roll over), weight, water depth. Never figures.",
    props: "radius, tube, seats, tilt, drawAt, seatMarks [{seat,at,label}], beltsAt, beltsRedAt, pose0, poses [{at,d,ease,x,z,lift,roll,yaw}], water {at,y,flowFadeAt}, rock {x,z,at,r}, gauge {at,label,x}, tag {at,text}, shakeAt []; M-024 caps: labelCap (30)",
    twist: "a true 3-D ring with depth-sorted empty seats posed by roll/lift/travel keys; the roll-over makes the belts hang under the hull in red",
    sfx: [],
    axes: { geometry: "3-D ring object", entry: "line model draws, seats light", layout: "object centre, gauge left, tag top-right", accent: "belts white -> red" },
  },
  {
    family: "diagram", name: "ElevationDrop", component: ElevationDrop, defaultProps: ELEVATION_DEMO, durationInFrames: 170, thumbFrame: 160, stripFrames: [0, 12, 24, 40, 52, 66, 80, 96, 108, 116, 128, 140, 160],
    ref: "Farrell story explainer (built on the words, returns #15/#33) + VV §7 hold -> burst (Visual Venture TV @ 10:43.0) for the fall + D1 E4 red HUD language (Dashcam Vol.1 @ 1:07.9) for the warning chip",
    when: "Suspended elements (ductwork, lights, panels) that fell: the height, the domino sequence, then close-ups of why (water inside, rust, weak cables) and the replacement (fabric).",
    props: "hall {x0,x1,roof,floor}, pool {x0,x1,depth,at}, run {x0,x1,y,n,h,gap,at}, rule {x,label,at}, drop {at,stagger,order,frames}, waterAt, rustAt, cablesAt, fabricAt, chip {text,at}, labels, cam0, cam, drift; M-024 caps: labelCap (30)",
    twist: "a hanging array with a staggered gravity cascade landing on floor / in the pool, per-section condition states (water, rust, red thinning cables), steel -> fabric morph",
    sfx: [],
    axes: { geometry: "hall elevation + hanging run", entry: "array draws, rule rises", layout: "wide elevation, close-up on one section", accent: "rust orange + red cables" },
  },
  {
    family: "diagram", name: "ScaleCompare", component: ScaleCompare, defaultProps: SCALE_DEMO, durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 8, 20, 40, 56, 70, 90, 110, 140],
    ref: "Farrell silhouette/scale explainers (refstudy/fullstudy/motion/silhouette: white line figure beside the object, rule tick-to-tick, value on the word) + VV §11 world-space infographic (Visual Venture TV @ 3:28.0, quick start / long settle) + D3 E5 stat type (@ 1:47.87). NEW 2026-10-18 (Zoo)",
    when: "How big / heavy / deep something is against a person (an animal's length and weight, a moat's depth, a drop's height); the same world returns with glyphs moving (dragged down, walking over).",
    props: "items [{glyph,x,y,size,at,draw,colour,flip,rot,mode,moves[{at,d,x,y,rot,ease}],outAt,label{text,at,dx,dy}}], rules [{x0,y0,x1,y1,at,frames,label,labelAt,colour,side}], lines [{pts,at,frames,dashed,colour,width,closed}], fills [{pts,at,colour}], tags [{text,at,x,y,colour,cap,align,outAt}], cam0, cam CamSpec[], drift; M-024 caps: labelCap (34), tag cap (84)",
    twist: "true relative scale; rules draw tick-to-tick and the value lands on its word; glyphs move along keyed paths; constant on-screen type under the camera",
    sfx: [],
    axes: { geometry: "line-art silhouettes + measured rules", entry: "strokes draw on their nouns, rule on the value word", layout: "world plane, side view", accent: "red rules + red Bebas value" },
  },
  {
    family: "diagram", name: "MoatSection", component: MoatSection, defaultProps: MOAT_DEMO, durationInFrames: 120, thumbFrame: 80, stripFrames: [0, 10, 24, 36, 44, 56, 64, 72, 80, 100],
    ref: "StructureSection (wp3 sec_A/B line-art section system) + Farrell story 'the explainer returns' (#15/#33) + Waterpark c04 Cutaway3D depth gauge; zoo rebuild c07/c10",
    when: "An animal enclosure in side section (visitors' path / barrier / wall, moat, island or far bank, live wire); returns with a visitor, keeper or the animal moving along paths, splash rings, thrown stones, a typed time tag, a wall raised or the moat drained.",
    props: "members (presets moatIsland / moatVisitors or own), events (StructureSection: lift/drop/crack/red), labels, dims, wires [{pts,at}], splashes [{x,y,at}], stones [{x0,y0,x1,y1,at,n}], movers [{kind person|keeper|animal,pts,at,frames,size,until}], tag {text,at}, drift; M-024 caps: labelCap (30)",
    twist: "live dashed wire, movers on paths with motion blur, animal as a dark rimmed silhouette (never a figure in harm), splash rings + stone arcs",
    sfx: [],
    axes: { geometry: "line-art side section (enclosure)", entry: "parts draw on their nouns, movers travel paths", layout: "visitors left, animal side right", accent: "yellow live wire + cyan water" },
  },
];
// new set "midway" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_midway.md)
import { extra as extra_midway } from "./new_midway";
variants.push(...extra_midway);
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
