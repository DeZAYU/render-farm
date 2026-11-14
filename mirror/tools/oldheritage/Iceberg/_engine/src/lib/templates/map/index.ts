// Family "map": place context. All frames LOCAL. Geo data (outline layers, georeferenced imagery, lon/lat points) comes in as props; the
// defaults use the demo geography in public/demo (Blue Marble crop + outline JSON) with generic placeholder names.
import type { VariantDef } from "../../core";
import { SatelliteMapBox } from "./SatelliteMapBox";
import { COUNTRY_LOCATOR_DEMO, CountryLocator } from "./CountryLocator";
import { DOT_MAP_DEMO, DotMap3D } from "./DotMap3D";
import { ROUTE_DEMO, RouteMap } from "./RouteMap";
import { PARK_DEMO, ParkPlan } from "./ParkPlan";
import { PINDROP_DEMO, PinDrop3D } from "./PinDrop3D";
import { SITEPLAN_DEMO, SitePlanTrace } from "./SitePlanTrace";
import { FLIGHT_DEMO, FlightArc } from "./FlightArc";

export const variants: VariantDef[] = [
  {
    family: "map", name: "SatelliteMapBox", component: SatelliteMapBox,
    defaultProps: {
      src: "demo/mapstill.png", pin: { x: 0.3675, y: 0.498 }, pinAt: 2,
      box: [{ t: "Harbour", at: 14 }, { t: "District", at: 24 }], sub: [{ t: "City", at: 45 }, { t: "Name", at: 52 }],
      elbow: { dx: 150, dy: -150 }, scale0: 1.12, zoomPerS: 0.025, orbitDegPerS: -1.0, cap: 40, scan: 0.07,
    },
    durationInFrames: 105, thumbFrame: 80, stripFrames: [0, 2, 5, 8, 11, 14, 24, 60, 100],
    ref: "Dashcam Vol.1 @ 0:04.8-0:07.1 E10/E4 'the Second Street Bridge' map box; wp3 sec_A MapBox @ abs 922",
    when: "First mention of a specific place (venue, street, district) when you have a satellite/aerial still of it. Once per case at most.",
    props: "src, pin {x,y} 0..1, pinAt, box Word[] (words on their spoken words), sub Word[] (white words under the pin), elbow {dx,dy}, scale0, zoomPerS, orbitDegPerS, cap, scan; M-024 caps: subCap (30)",
    twist: "orbit pivots on the pin (pin never drifts), box words pop on their spoken words, white sub-place under the pin, D1 scan texture",
    sfx: [],
    axes: { geometry: "photo still + HUD box", entry: "hard cut, pin pop -> leader -> box wipe", layout: "pin centre-left, box upper right", accent: "red outlined box" },
  },
  {
    family: "map", name: "CountryLocator", component: CountryLocator, defaultProps: COUNTRY_LOCATOR_DEMO,
    durationInFrames: 150, thumbFrame: 130, stripFrames: [0, 10, 30, 40, 48, 56, 66, 80, 92, 104, 130, 149],
    ref: "Farrell evidence D1 map flight (Grindr @ 0:07-0:17 'Spain's northern port city of Bilbao', burst table every 4 f, outline glows in on the deceleration) + D1 E10 pin + D3 E2 place label @ 0:03.4; wp3 sec_B HospMap @ abs 5126 (Blue Marble + outline data)",
    when: "Introducing where a story happens when the viewer won't know the country/region: region -> country -> place in one move.",
    props: "proj, region/country GeoLayer, imagery GeoImage, wide/close {lon,lat,span}, fadeIn, burstAt, burstFrames, outline colour, dimOutside, place {lon,lat,at,words,dx,dy,cap}, drift; M-024 caps: labelCap (place, 58 unless place.cap)",
    twist: "DD red outline (not Farrell cyan), imagery wakes only on landing, outside dims, log zoom with linear screen travel of the target + motion blur",
    sfx: [{ event: "zoom_boom", at: 30, note: "optional, on a hard story beat only (anchor = burst start)" }],
    axes: { geometry: "vector outlines -> satellite", entry: "fade from black, hold, log-zoom burst", layout: "centred country, pin + label right", accent: "glowing red country outline" },
  },
  {
    family: "map", name: "DotMap3D", component: DotMap3D, defaultProps: DOT_MAP_DEMO,
    durationInFrames: 140, thumbFrame: 125, stripFrames: [0, 8, 16, 30, 45, 60, 66, 72, 84, 100, 125],
    ref: "Dashcam Vol.1 @ 22:02 E10 3-D satellite map (25 f dissolve, orbit -4.4 deg/s) + @ 0:05.0 E4 map box; wp3 sec_B HospMap @ abs 5126",
    when: "Many sites at once: where victims were taken, sightings, branches, incidents spreading across a country.",
    props: "imagery, outline, centre, pxPerDeg, tilt, rot0, rotPerS, dissolve, points [{lon,lat,n}], jitter, origin, dotsFrom/dotsTo, box {lon,lat,lineAt,words,dx,dy}, label, credit, seed; M-024 caps: cap (40), labelCap (30), subCap (source line, 28)",
    twist: "dots light in order of distance from the origin (the spread reads as travel) with a 3 f glow pop; one continuous leader stroke under motion blur",
    sfx: [],
    axes: { geometry: "tilted 3-D plane", entry: "25 f dissolve + orbit", layout: "map fills frame, box top right", accent: "white glowing dots" },
  },
  {
    family: "map", name: "RouteMap", component: RouteMap, defaultProps: ROUTE_DEMO,
    durationInFrames: 150, thumbFrame: 130, stripFrames: [0, 12, 24, 40, 60, 80, 96, 104, 112, 130],
    ref: "Farrell evidence D3 route draw (Google Maps @ 2:57-3:07, constant-speed arc-length draw, 10 f ease-out into the arrowhead, leading dot, push +0.47 %/s) + D1 E10 pin + D3 E5 stat @ 1:47.87",
    when: "A journey, chase, drive or distance that matters (how far they got, how far help was).",
    props: "imagery, outline, from/to {lon,lat,label Word[]}, via LonLat[], drawAt, drawFrames, distance {value?,unit,decimals,prefix} (auto great-circle if no value), pad, pushPerS, dashed, colour; M-024 caps: cap (stat, 54), labelCap (end labels, 40)",
    twist: "dark graded satellite + DD red dashed route with glow; the distance rolls up with the drawn length and lands with the pin; auto framing",
    sfx: [],
    axes: { geometry: "top-down satellite + path", entry: "hard cut, line draws at constant speed", layout: "route diagonal, stat on the line", accent: "red dashed route + red unit" },
  },
  {
    family: "map", name: "ParkPlan", component: ParkPlan, defaultProps: PARK_DEMO, durationInFrames: 180, thumbFrame: 100, stripFrames: [0, 6, 14, 30, 44, 56, 72, 86, 100, 116, 130, 150, 178],
    ref: "D1 E10/E4 map-box language (Dashcam Vol.1 @ 0:05.0) + FA evidence E1 (Instagram @ 2:47.5, one element per noun) + Farrell evidence rule 10",
    when: "Inside a theme park / campus / festival site: which area is which, where the ride/building is, and what burned or was lost. Drawn by us (never a copied park map).",
    props: "areas [{id,pts,name,colour,at,labelAt,labelPos,highlightAt,burnAt,burnFrames}], water [{pts,at}], walks [{pts,at}], buildings [{x,y,w,h,rot,at,charAt}], callouts [{x,y,at,words,sub,elbow}], dimOthersAt, cam0, cam, drift; M-024 caps: cap (36), labelCap (area names, 30; highlighted x1.25), subCap (30)",
    twist: "organic illustrated areas from a few control points, highlighted area glows DD red with a map box, burn-out to charred grey with ember flicker",
    sfx: [],
    axes: { geometry: "illustrated plan", entry: "areas tint in one by one", layout: "site fills frame, names centred", accent: "red highlighted area -> charred grey" },
  },
  {
    family: "map", name: "PinDrop3D", component: PinDrop3D, defaultProps: PINDROP_DEMO, durationInFrames: 130, thumbFrame: 110, stripFrames: [0, 8, 18, 30, 40, 46, 52, 56, 64, 74, 90, 110],
    ref: "D1 E10 / E4 map box (Dashcam Vol.1 @ 0:05.0: pin, red leader, outlined box wiping L->R in 6 f, then the words) + VV §11 world camera (Visual Venture TV @ 3:28.0) + D3 E2 place label (@ 0:03.4)",
    when: "Placing a town / resort in its country when no satellite still is needed: the country is the context, the pin is the place.",
    props: "country GeoLayer, region GeoLayer, centre, pxPerDeg, tilt, riseFrames, rot0, rotPerS, depth, pin {lon,lat,dropAt}, box Word[], sub Word[], elbow, title Word[], plateColour; M-024 caps: cap (40), subCap (30), titleCap (64)",
    twist: "extruded vector country plate tilting up out of the flat, a physical pin drop with shadow + landing ripple, then the map box",
    sfx: [],
    axes: { geometry: "extruded vector plate", entry: "tilt-up + pin drop", layout: "plate centre, box upper right, title top-left", accent: "red pin + ripple + box" },
  },
  {
    family: "map", name: "SitePlanTrace", component: SitePlanTrace, defaultProps: SITEPLAN_DEMO, durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 8, 16, 26, 36, 50, 64, 80, 100, 106, 126, 140],
    ref: "FA evidence E1 (Instagram @ 2:47.5, one element per noun) + D1 E10 / E4 map language (Dashcam Vol.1 @ 0:05.0) + Farrell evidence rule 10 (one element changes at a time)",
    when: "What happened WHERE on a site: which building, the route the engine took, the gate that was locked, the evacuation route that was blocked.",
    props: "src (aerial), scanFrames, elements [{pts 0..1,at,label,labelAt,redAt,fill}], routes [{pts,at,frames,colour white|green|red,redAt,label}], icons [{glyph,at,route,from,to,moveAt,moveFrames,x,y,size}], cones [{x,y,dir,spread,len,at,label}], locks [{x,y,at}], cam0, cam, drift; M-024 caps: labelCap (30, on-screen at any zoom)",
    twist: "scan-line reveal of the vector trace over a darkened aerial; marching-dash routes that recolour on their word; icons follow routes and stop; red lock drop",
    sfx: [],
    axes: { geometry: "vector trace over aerial", entry: "scan line reveal", layout: "aerial full frame", accent: "routes green -> red, red lock" },
  },
  {
    family: "map", name: "FlightArc", component: FlightArc, defaultProps: FLIGHT_DEMO, durationInFrames: 140, thumbFrame: 130, stripFrames: [0, 6, 14, 24, 38, 50, 64, 80, 96, 112, 130],
    ref: "VV §11 world camera (Visual Venture TV @ 3:28.0) + FA evidence E1 (Instagram @ 2:47.5, one element per noun) + D1 E10 pin language",
    when: "People converging on one place from far away, or messages sent out to several recipients that never answered.",
    props: "layers GeoLayer[], hub {lon,lat,label,at}, arcs [{lon,lat,at,frames,label,sub,dir in|out,greyAt,greyLabel,colour}], pad, pushPerS",
    twist: "lifted arcs with comet heads and glowing trails, auto-framing of all places, a grey dashed 'no reply' state",
    sfx: [],
    axes: { geometry: "outline map + arcs", entry: "arcs launch on their words", layout: "hub with spokes", accent: "red arcs, grey no-reply" },
  },
];
// new set "dash2" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash2.md)
import { extra as extra_dash2 } from "./new_dash2";
variants.push(...extra_dash2);
