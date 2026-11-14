import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/AM07";
registerRoot(() => <Composition id="AM07" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
