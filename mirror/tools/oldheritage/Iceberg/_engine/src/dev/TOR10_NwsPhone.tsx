// TOR10 NwsPhone: the NWS Gaylord damage-survey statement read the way people in Gaylord read it, on a phone. A white phone settles
// in 3-D over the driver's own clip (blurred, dark); the statement is re-typeset sharp (real text, IEM archive), the screen scrolls
// from the header down to the Start rows, a thumb taps "Start Time" (red ring), the row expands into a red-edged card with the time
// and place set large, and the camera eases in on it. Source credited small under the phone. Built for TOR10 only.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../lib/core/type";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.55, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Row = { k: string; v: string };
const ROWS: Row[] = [
  { k: "Rating:", v: "EF3" }, { k: "Estimated Peak Wind:", v: "150 mph" }, { k: "Path Length /statute/:", v: "16.6 miles" },
  { k: "Path Width /maximum/:", v: "200.0 yards" }, { k: "Fatalities:", v: "2" }, { k: "Injuries:", v: "44" }, { k: "", v: "" },
  { k: "Start Date:", v: "05/20/2022" }, { k: "Start Time:", v: "3:35 PM EDT" }, { k: "Start Location:", v: "6 S Elmira / Antrim County" },
  { k: "Start Lat/Lon:", v: "44.9802 / -84.8821" }, { k: "", v: "" }, { k: "End Date:", v: "05/20/2022" }, { k: "End Time:", v: "3:55 PM EDT" },
  { k: "End Location:", v: "1 NE Sparr / Otsego County" },
];
const TAP = 8; // row index tapped

export const NwsPhone: React.FC<{ dur: number; bg: string; bgFrom: number; tapAt?: number; big: [string, string]; credit: string }> = ({ dur, bg, bgFrom, tapAt = 40, big, credit }) => {
  const f = useCurrentFrame();
  const enter = out(interpolate(f, [0, 22], [0, 1], cl));
  const u = io(interpolate(f, [0, dur], [0, 1], cl));
  const ry = -16 + 12 * enter + 3 * u, rx = 6 - 4 * enter;
  const scroll = io(interpolate(f, [16, tapAt - 4], [0, 1], cl));     // header -> start rows
  const tap = interpolate(f, [tapAt, tapAt + 14], [0, 1], cl);
  const open = out(interpolate(f, [tapAt + 6, tapAt + 24], [0, 1], cl));
  const push = io(interpolate(f, [tapAt, dur], [0, 1], cl));
  const PW = 560, PH = 1080 * 0.94, SW = PW - 28, rowH = 46, cardH = 230 * open;
  const listTop = 300, tapY = listTop + TAP * rowH;
  const scrollY = -scroll * (tapY - 330);
  const z = 1 + 0.32 * push, oy = -60 * push;
  const vid = <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(.42) saturate(.8)", transform: `scale(${1.35 + 0.05 * u})` }}>{vid}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 70% at 50% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,.6) 100%)" }} />
      <AbsoluteFill style={{ perspective: 2200, transform: `scale(${z}) translateY(${oy}px)`, transformOrigin: `50% ${(1080 - PH) / 2 + 120 + tapY + scrollY}px` }}>
        <div style={{ position: "absolute", left: 960 - PW / 2, top: (1080 - PH) / 2 + 40 * (1 - enter), width: PW, height: PH, borderRadius: 64, background: "#F4F4F2",
          transform: `rotateY(${ry.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg)`, opacity: interpolate(f, [0, 6], [0, 1], cl),
          boxShadow: "0 50px 110px rgba(0,0,0,.8), inset 0 0 0 2px rgba(0,0,0,.08)", padding: 14, boxSizing: "border-box" }}>
          <div style={{ position: "relative", width: SW, height: PH - 28, borderRadius: 52, overflow: "hidden", background: "#fff" }}>
            {/* status bar + browser bar */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: "#fff", zIndex: 3, borderBottom: "1px solid #e4e4e4" }}>
              <div style={{ position: "absolute", left: 44, top: 22, fontFamily: FONT.inter, fontWeight: 600, fontSize: 22, color: "#111" }}>8:41</div>
              <div style={{ position: "absolute", left: SW / 2 - 60, top: 16, width: 120, height: 32, borderRadius: 16, background: "#0b0b0b" }} />
              <div style={{ position: "absolute", left: 24, right: 24, top: 64, height: 42, borderRadius: 14, background: "#efefef", fontFamily: FONT.inter, fontSize: 19, color: "#555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                weather.gov/apx
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 120 + scrollY, padding: "0 30px" }}>
              <div style={{ height: 6, width: 70, background: RED, marginTop: 30 }} />
              <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: 31, color: "#0b0b0b", marginTop: 14, lineHeight: 1.12 }}>Public Information Statement</div>
              <div style={{ fontFamily: FONT.inter, fontWeight: 500, fontSize: 19, color: "#666", marginTop: 8 }}>National Weather Service Gaylord MI<br />833 PM EDT Sat May 21 2022</div>
              <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 17, color: "#222", marginTop: 18 }}>...NWS DAMAGE SURVEY FOR 05/20/22 GAYLORD TORNADO EVENT</div>
              <div style={{ position: "absolute", left: 30, right: 30, top: listTop - 120 + 120 }}>
                {ROWS.map((r, i) => {
                  const hit = i === TAP;
                  return (
                    <React.Fragment key={i}>
                      <div style={{ position: "relative", height: rowH, display: "flex", alignItems: "center", fontFamily: FONT.mono, fontSize: 16, color: "#1a1a1a", whiteSpace: "nowrap",
                        background: hit ? `rgba(227,20,27,${0.1 * tap})` : "transparent", borderRadius: 8 }}>
                        <span style={{ width: 214, flex: "none", color: "#555" }}>{r.k}</span><span style={{ fontWeight: hit ? 700 : 500 }}>{r.v}</span>
                        {hit && f >= tapAt && f < tapAt + 18 && (
                          <div style={{ position: "absolute", left: 300, top: rowH / 2, width: 20 + 90 * tap, height: 20 + 90 * tap, borderRadius: "50%",
                            border: `4px solid ${RED}`, opacity: 1 - tap, transform: "translate(-50%,-50%)" }} />
                        )}
                      </div>
                      {hit && (
                        <div style={{ height: cardH, overflow: "hidden" }}>
                          <div style={{ margin: "8px 0", borderLeft: `8px solid ${RED}`, background: "#fafafa", boxShadow: "0 6px 18px rgba(0,0,0,.12)", padding: "18px 22px", opacity: open }}>
                            <div style={{ fontFamily: FONT.inter, fontWeight: 600, fontSize: 18, color: RED, letterSpacing: "0.08em" }}>TOUCHDOWN</div>
                            <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: 64, color: "#0b0b0b", lineHeight: 1.05, marginTop: 4 }}>{big[0]}</div>
                            <div style={{ fontFamily: FONT.inter, fontWeight: 600, fontSize: 25, color: "#222", marginTop: 8 }}>{big[1]}</div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(${115 + ry * 2}deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.12) 50%, rgba(255,255,255,0) 60%)` }} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 56, bottom: 36, textAlign: "right", fontFamily: FONT.inter, fontWeight: 500, fontSize: 20, color: "rgba(255,255,255,.7)",
        opacity: interpolate(f, [12, 24], [0, 1], cl) }}>{credit}</div>
    </AbsoluteFill>
  );
};
