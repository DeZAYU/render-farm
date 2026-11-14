// footage / PhonePanel: vertical phone clips. REF Dashcam Vol.3 I14 vertical clip (case 15 Tianjin @12:22-12:26: centred at its native aspect,
// fill = the same clip scaled to cover, gblur sigma 30, brightness -35 %) + Abyssal I8 vertical blur fill (@33:28-34:56: a centre panel x .311-.686
// (720 px, the 9:16 source enlarged ~1.19x, cropped top/bottom), the sides = the same clip blurred ~40 px at 10-35 % of the panel's luma; HARD
// panel edge, no border, no shadow; never black bars). Both layers run the same clock and the Dashcam linear push.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { H, Media, Vignette, W, linPush } from "../../core";

export type PhonePanelProps = { media: string; mediaStart?: number; push?: number; panelW?: number; blur?: number; dim?: number; pos?: string };
export const PhonePanel: React.FC<PhonePanelProps> = ({ media, mediaStart = 0, push = 0.03, panelW = 720, blur = 40, dim = 0.28, pos = "50% 45%" }) => {
  const f = useCurrentFrame();
  const s = linPush(f, push);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${(1.12 * s).toFixed(5)})`, filter: `blur(${blur}px) brightness(${dim}) saturate(.85)` }}>
        <Sequence layout="none"><Media src={media} startFrom={mediaStart} /></Sequence>
      </AbsoluteFill>
      <Vignette />
      <div style={{ position: "absolute", left: (W - panelW) / 2, top: 0, width: panelW, height: H, overflow: "hidden" }}>
        <div style={{ width: "100%", height: "100%", transform: `scale(${s.toFixed(5)})` }}>
          <Media src={media} startFrom={mediaStart} pos={pos} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
