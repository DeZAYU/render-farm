// moved to src/core/kits/geo.tsx (kept as a re-export so existing imports work); demo geodata stays here
import TW from "../../../../public/demo/taiwan.json";
import CN from "../../../../public/demo/china.json";
import type { GeoLayer, GeoImage } from "../../core/kits/geo";
export * from "../../core/kits/geo";
export const DEMO_COUNTRY: GeoLayer = { paths: TW.paths, lon0: TW.proj.lon0, latTop: TW.proj.lat_top, sx: TW.proj.k * 100, sy: 100 };
export const DEMO_REGION: GeoLayer = { paths: [CN.china, CN.taiwan], lon0: CN.lon0, latTop: CN.lat0, sx: CN.k * CN.scale, sy: CN.scale };
export const DEMO_BM: GeoImage = { src: "demo/bm_taiwan_dd.jpg", lonW: 115.5833, lonE: 126.4167, latS: 17.5833, latN: 29.4167 };
