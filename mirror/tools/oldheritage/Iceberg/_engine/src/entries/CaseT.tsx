// Case-number transition (dev/CaseNumberTransition.tsx). Rendered per case by _tools/make_transitions.py with --props.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { CaseT, CNT_DUR, CaseNumberTransitionProps } from "../dev/CaseNumberTransition";
const defaults: CaseNumberTransitionProps = { number: 2, src: "job/in.mp4", from: 0, outFrame: "job/out.png", moshDir: "job/m", sfx: "t/case_t.wav" };
registerRoot(() => <Composition id="CaseT" component={CaseT as React.FC<any>} durationInFrames={CNT_DUR} fps={30} width={1920} height={1080} defaultProps={defaults} />);
