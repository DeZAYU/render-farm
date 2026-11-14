import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/DC13";
registerRoot(() => <Composition id="DC13" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
