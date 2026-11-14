// TOR15 WatchCrawl: SPC Tornado Watch 235 (27 Apr 2011, 145 PM CDT) as what it was written for: "URGENT - IMMEDIATE BROADCAST
// REQUESTED". The real watch text re-typeset sharp as a generic TV warning bulletin (no station branding) over the dimmed Cullman
// footage: the watch number slab wipes in, the PDS line is typed onto a white bar, the four watch areas stack in (MUCH OF ALABAMA
// lit red on "northern Alabama"), the issue time is marked on "1:45", and the watch's own hazard sentence runs as a bottom crawl.
// Replaces the ChipLift_N2P page template (owner, 3 Nov: no blog/page template, no highlighter bar on a scanned page).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";
import { FONT } from "../lib/core/type";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const out = Easing.bezier(0.16, 1, 0.3, 1), io = Easing.bezier(0.45, 0, 0.2, 1);

const PDS = "...THIS IS A PARTICULARLY DANGEROUS SITUATION...";
const AREAS = ["MUCH OF ALABAMA", "NORTHWEST GEORGIA", "SOUTHEAST MISSISSIPPI", "SOUTHERN MIDDLE TENNESSEE"];
const CRAWL = "DESTRUCTIVE TORNADOES...LARGE HAIL TO 4 INCHES IN DIAMETER...THUNDERSTORM WIND GUSTS TO 80 MPH...AND DANGEROUS LIGHTNING ARE POSSIBLE IN THESE AREAS"
  + "     ■     EFFECTIVE THIS WEDNESDAY AFTERNOON AND EVENING FROM 145 PM UNTIL 1000 PM CDT     ■     ";

type P = { bg: string; bgFrom: number; areaAt?: number; timeAt?: number };

export const WatchCrawl: React.FC<P> = ({ bg, bgFrom, areaAt = 96, timeAt = 140 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const push = 1.04 + 0.05 * io(f / durationInFrames);
  const slab = out(interpolate(f, [6, 18], [0, 1], cl));
  const bar = out(interpolate(f, [14, 24], [0, 1], cl));
  const chars = Math.round(interpolate(f, [20, 50], [0, PDS.length], cl));
  const crawlIn = out(interpolate(f, [4, 16], [0, 1], cl));
  const urgent = Math.round(interpolate(f, [2, 26], [0, 38], cl));
  const lit = out(interpolate(f, [areaAt, areaAt + 8], [0, 1], cl));
  const tMark = out(interpolate(f, [timeAt, timeAt + 14], [0, 1], cl));
  const timeIn = out(interpolate(f, [54, 68], [0, 1], cl));
  const blink = Math.floor(f / 12) % 2 === 0 ? 1 : 0.25;
  const L = 130, T = 250;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", transform: `scale(${push})`, filter: "brightness(.36) saturate(.55) blur(3px)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.35) 62%, rgba(0,0,0,.15) 100%)" }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0px, rgba(255,255,255,.025) 1px, transparent 1px, transparent 4px)" }} />

      {/* URGENT line, typed */}
      <div style={{ position: "absolute", left: L, top: 150, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: RED, opacity: blink }} />
        <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 30, letterSpacing: "0.08em", color: "#F2F2F0" }}>{"URGENT - IMMEDIATE BROADCAST REQUESTED".slice(0, urgent)}</div>
      </div>

      {/* watch number slab */}
      <div style={{ position: "absolute", left: L, top: T, clipPath: `inset(0 ${(1 - slab) * 100}% 0 0)`, background: RED, padding: "14px 34px 10px 30px", boxShadow: "0 10px 30px rgba(0,0,0,.5)" }}>
        <div style={{ fontFamily: FONT.archivo, fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 112, lineHeight: 1, color: "#0B0B0B", letterSpacing: "0.005em" }}>TORNADO WATCH 235</div>
      </div>
      {/* PDS line, typed on a white bar */}
      <div style={{ position: "absolute", left: L, top: T + 150, width: 1560, height: 94, background: "#F4F4F2", transformOrigin: "left center", transform: `scaleX(${bar})`, boxShadow: "0 10px 30px rgba(0,0,0,.45)" }} />
      <div style={{ position: "absolute", left: L + 28, top: T + 167, fontFamily: FONT.archivo, fontWeight: 800, fontVariationSettings: "'wght' 800, 'wdth' 92", fontSize: 60, lineHeight: 1, color: "#0B0B0B", whiteSpace: "pre" }}>
        {PDS.slice(0, chars)}<span style={{ opacity: chars < PDS.length ? 1 : 0, color: RED }}>|</span>
      </div>

      {/* areas */}
      <div style={{ position: "absolute", left: L, top: T + 290, fontFamily: FONT.mono, fontWeight: 500, fontSize: 24, letterSpacing: "0.1em", color: "rgba(242,242,240,.7)",
        opacity: interpolate(f, [34, 44], [0, 1], cl) }}>A TORNADO WATCH FOR PORTIONS OF</div>
      {AREAS.map((a, i) => {
        const k = out(interpolate(f, [40 + i * 7, 52 + i * 7], [0, 1], cl));
        const hot = i === 0 ? lit : 0;
        return (
          <div key={a} style={{ position: "absolute", left: L, top: T + 336 + i * 64, opacity: k, transform: `translateX(${(1 - k) * -40}px)` }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{ position: "absolute", left: -12, right: -14, top: -7, bottom: -5, background: RED, transformOrigin: "left center", transform: `scaleX(${hot})` }} />
              <div style={{ position: "relative", fontFamily: FONT.archivo, fontWeight: 800, fontVariationSettings: "'wght' 800, 'wdth' 100", fontSize: 46, lineHeight: 1.0,
                color: hot > 0.5 ? "#0B0B0B" : "#F2F2F0", textShadow: hot > 0.5 ? "none" : "0 2px 10px rgba(0,0,0,.6)" }}>{a}</div>
            </div>
          </div>
        );
      })}

      {/* issue time */}
      <div style={{ position: "absolute", left: 1130, top: T + 330, opacity: timeIn, transform: `translateY(${(1 - timeIn) * 20}px)` }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: 500, fontSize: 24, letterSpacing: "0.1em", color: "rgba(242,242,240,.7)" }}>ISSUED</div>
        <div style={{ position: "relative", marginTop: 6, fontFamily: FONT.archivo, fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 104, lineHeight: 1, color: "#F2F2F0" }}>
          1:45 PM CDT
          <div style={{ position: "absolute", left: 0, bottom: -16, height: 8, width: "100%", background: RED, transformOrigin: "left center", transform: `scaleX(${tMark})` }} />
        </div>
        <div style={{ marginTop: 30, fontFamily: FONT.mono, fontWeight: 600, fontSize: 30, letterSpacing: "0.06em", color: "#F2F2F0" }}>WED APR 27 2011</div>
        <div style={{ marginTop: 8, fontFamily: FONT.mono, fontWeight: 500, fontSize: 24, letterSpacing: "0.06em", color: "rgba(242,242,240,.7)" }}>UNTIL 10:00 PM CDT</div>
      </div>

      {/* source, small */}
      <div style={{ position: "absolute", right: 60, bottom: 116, fontFamily: FONT.mono, fontWeight: 500, fontSize: 19, letterSpacing: "0.06em", color: "rgba(242,242,240,.55)" }}>
        SOURCE: NWS STORM PREDICTION CENTER, WATCH 235 (IEM TEXT ARCHIVE)
      </div>

      {/* bottom crawl */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, height: 72, transform: `translateY(${(1 - crawlIn) * 110}px)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#F4F4F2", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 17, left: 470 - f * 7, whiteSpace: "pre", fontFamily: FONT.archivo, fontWeight: 700, fontVariationSettings: "'wght' 700, 'wdth' 96", fontSize: 40, lineHeight: 1, color: "#0B0B0B" }}>{CRAWL + CRAWL}</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 430, background: RED, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "8px 0 18px rgba(0,0,0,.35)" }}>
          <div style={{ fontFamily: FONT.archivo, fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 40, color: "#0B0B0B", letterSpacing: "0.02em" }}>TORNADO WATCH</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
