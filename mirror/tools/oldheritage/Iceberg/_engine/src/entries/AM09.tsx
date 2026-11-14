import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/AM09";
registerRoot(() => <Composition id="AM09" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
