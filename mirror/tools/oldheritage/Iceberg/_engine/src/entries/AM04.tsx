import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/AM04";
registerRoot(() => <Composition id="AM04" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
