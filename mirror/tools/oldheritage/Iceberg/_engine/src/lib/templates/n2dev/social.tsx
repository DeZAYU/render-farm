// n2dev social devices: PostCard (a post rises over its own blurred media), CommentStack (comments stack, one lifts), WatchPage (a generic
// dark video page, the camera glides into the player = "where the clip was first uploaded"). Generic UI: no platform logos; avatars blurred.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01, lerp, lerpLog } from "../../core";
import { EI, K, Pic, Plate, type PlateP, Typed, assertDev, envIO, mono, sans, typedN } from "./kit";

type Base = PlateP & { dur: number };
const Avatar: React.FC<{ seed: number; size?: number }> = ({ seed, size = 56 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", flex: "none", background: `linear-gradient(135deg, hsl(${(seed * 67) % 360} 30% 45%), hsl(${(seed * 67 + 40) % 360} 35% 25%))`, filter: "blur(1.5px)" }} />
);
const fmtK = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(v >= 1e4 ? 0 : 1)}K` : `${Math.round(v)}`);

// ---------------------------------------------------------------- PostCard_D
/** a post card rises (eased) over a blurred copy of its media, text types, counters roll up; the camera drifts in on the card. */
export const PostCard_D: React.FC<Base & { handle: string; time?: string; text: string; media?: string; mediaFrom?: number; likes?: number; shares?: number; at?: number }> = (p) => {
  const { dur, handle, time = "2h", text, media, mediaFrom = 0, likes = 0, shares = 0, at = 6 } = p;
  assertDev("PostCard", dur);
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const k = EI.quick((f - at) / 22);
  const z = lerp(1, 1.06, EI.smooth(f / dur));
  const n = typedN(f, text.length, at + 14, 40);
  const c = EI.quick((f - at - 24) / 40);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Plate src={p.src ?? media} from={p.src ? p.from : mediaFrom} blur={30} dim={0.6} />
      <div style={{ position: "absolute", left: 960, top: 540, width: 820, transform: `translate(-50%, -50%) translate3d(0, ${lerp(80, 0, k).toFixed(2)}px, 0) scale3d(${z.toFixed(5)}, ${z.toFixed(5)}, 1)`, opacity: clamp01(k * 1.5),
        background: "#0E1820", border: "1px solid rgba(166,246,255,.18)", borderRadius: 18, padding: "26px 30px", boxShadow: "0 30px 80px rgba(0,0,0,.7)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar seed={handle.length} />
          <div><div style={{ ...sans(26, 600, 0), color: K.ice }}>{handle}</div><div style={{ ...sans(19, 400, 0), color: K.frost }}>{time}</div></div>
        </div>
        <div style={{ ...sans(30, 400, 0), color: K.ice, marginTop: 18, lineHeight: 1.35, whiteSpace: "pre-wrap" }}><Typed text={text} n={n} /></div>
        {media && <div style={{ marginTop: 18, height: 380, borderRadius: 12, overflow: "hidden", position: "relative" }}><Pic src={media} from={mediaFrom} /></div>}
        <div style={{ display: "flex", gap: 40, marginTop: 18, ...mono(22, 500, 0.06), color: K.frost }}>
          <span>♥ {fmtK(likes * c)}</span><span>⇄ {fmtK(shares * c)}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- CommentStack_D
export type Comment = { who: string; t: string; at: number; likes?: number; key?: boolean };
/** comments slide in one by one (eased, stacked); the `key` comment lifts forward with an ice-cyan hairline while the rest dim. */
export const CommentStack_D: React.FC<Base & { comments: Comment[] }> = (p) => {
  const { dur, comments } = p;
  assertDev("CommentStack", dur, () => (comments.some((c, i) => i > 0 && c.at - comments[i - 1].at < 12) ? "comments < 12 f apart" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 12);
  const shown = comments.filter((c) => f >= c.at);
  const keyC = comments.find((c) => c.key);
  const lift = keyC ? EI.cam((f - keyC.at - 20) / 16) : 0;
  const scroll = Math.max(0, shown.length - 4) * 150;
  const sY = lerp(0, scroll, 1);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Plate {...p} dim={p.src ? (p.dim ?? 0.7) : undefined} blur={p.src ? 20 : undefined} />
      <div style={{ position: "absolute", left: 960, top: 180, width: 960, transform: `translate(-50%, ${(-sY).toFixed(2)}px)` }}>
        {comments.map((c, i) => {
          const k = EI.quick((f - c.at) / 14);
          if (k <= 0) return null;
          const isKey = !!c.key, dimOther = !isKey ? lift * 0.6 : 0;
          return (
            <div key={i} style={{ display: "flex", gap: 18, padding: "20px 26px", marginBottom: 14, background: "rgba(14,24,32,.92)", borderRadius: 14, borderLeft: isKey ? `3px solid rgba(166,246,255,${0.3 + 0.7 * lift})` : "3px solid transparent",
              opacity: clamp01(k * 1.5) * (1 - dimOther), transform: `translate3d(${lerp(40, 0, k).toFixed(2)}px, 0, 0) scale(${isKey ? lerp(1, 1.06, lift).toFixed(4) : 1})`, boxShadow: isKey ? `0 ${20 * lift}px ${50 * lift}px rgba(0,0,0,.6)` : undefined, position: "relative", zIndex: isKey ? 2 : 1 }}>
              <Avatar seed={i + 3} size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ ...sans(20, 600, 0), color: K.frost }}>{c.who}</div>
                <div style={{ ...sans(28, 400, 0), color: K.ice, marginTop: 4, lineHeight: 1.3 }}>{c.t}</div>
                {c.likes !== undefined && <div style={{ ...mono(18, 400, 0.06), color: K.frost, marginTop: 8 }}>♥ {fmtK(c.likes)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- WatchPage_D
/** a generic dark video page (player + title + views + channel row) seen wide, then the camera glides INTO the player until the clip fills the
 *  frame (hand-off to footage). */
export const WatchPage_D: React.FC<Base & { media: string; mediaFrom?: number; title: string; channel: string; views: string; date?: string; at?: number; len?: number }> = (p) => {
  const { dur, media, mediaFrom = 0, title, channel, views, date = "", at = 40, len = 44 } = p;
  assertDev("WatchPage", dur, () => (len < 30 ? "glide < 30 f" : null));
  const f = useCurrentFrame();
  const o = Math.min(EI.cam(f / 10), 1);
  const PW = 1180, PH = PW * 0.5625, px = 160, py = 130;
  const zEnd = 1920 / PW;
  const k = EI.cam((f - at) / len);
  const z = lerpLog(lerp(0.96, 1, EI.quick(f / 30)), zEnd, k);
  const cx = lerp(960, px + PW / 2, k), cy = lerp(540, py + PH / 2, k);
  const tx = 960 - cx * z, ty = 540 - cy * z;
  const n = typedN(f, title.length, 8, 40);
  return (
    <AbsoluteFill style={{ background: "#0B0E11", opacity: o, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate3d(${tx.toFixed(3)}px, ${ty.toFixed(3)}px, 0) scale3d(${z.toFixed(5)}, ${z.toFixed(5)}, 1)`, willChange: "transform" }}>
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 80, borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", padding: "0 40px", gap: 30 }}>
          <div style={{ width: 120, height: 26, borderRadius: 6, background: "rgba(255,255,255,.1)" }} />
          <div style={{ marginLeft: 260, width: 640, height: 44, borderRadius: 22, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }} />
        </div>
        <div style={{ position: "absolute", left: px, top: py, width: PW, height: PH, background: "#000", borderRadius: lerp(14, 0, k), overflow: "hidden" }}>
          <Pic src={media} from={mediaFrom} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: "rgba(255,255,255,.2)", opacity: 1 - k }}><div style={{ width: `${clamp01(f / dur) * 100}%`, height: "100%", background: K.ice }} /></div>
        </div>
        <div style={{ position: "absolute", left: px, top: py + PH + 26, width: PW, ...sans(34, 600, 0), color: "#F1F1F1" }}><Typed text={title} n={n} /></div>
        <div style={{ position: "absolute", left: px, top: py + PH + 90, display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar seed={channel.length} size={52} />
          <div><div style={{ ...sans(22, 600, 0), color: "#EEE" }}>{channel}</div><div style={{ ...sans(18, 400, 0), color: "#9AA" }}>{views}{date ? `  ·  ${date}` : ""}</div></div>
        </div>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: px + PW + 50, top: py + i * 150, width: 420, height: 130, display: "flex", gap: 14 }}>
            <div style={{ width: 210, height: 118, borderRadius: 10, background: "rgba(255,255,255,.07)" }} />
            <div style={{ flex: 1 }}><div style={{ height: 16, background: "rgba(255,255,255,.1)", borderRadius: 4, marginBottom: 10 }} /><div style={{ height: 14, width: "70%", background: "rgba(255,255,255,.06)", borderRadius: 4 }} /></div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 40, ...mono(18, 500, 0.2), color: K.ice, opacity: EI.cam((f - 12) / 10) * (1 - k) }}>FIRST UPLOAD</div>
    </AbsoluteFill>
  );
};
