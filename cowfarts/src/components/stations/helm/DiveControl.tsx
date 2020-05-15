import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getRequestedDepth, getCurrentDepth } from "../../../gettorz";
import { requestDepth } from "../../../gameActions";
import "./DiveControl.css";

interface DivingControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

// Should really get this from the hull system
const crushDepthFeet = 1000;
const MAX_INDICATOR_DEPTH = 1200;
const neverExceedDepthFeet = 666;

const DivingControl = ({ game, latestUpdate }: DivingControlProps) => {
  const [depth, setDepth] = useState(getRequestedDepth(latestUpdate));
  const modDepth = (num: number) => () => {
    const newDepth = depth + num;
    setDepth(newDepth);
    requestDepth(game, newDepth);
  };

  const currentDepth = getCurrentDepth(latestUpdate);
  const requestedDepth = getRequestedDepth(latestUpdate);

  const makeStyleForDepth = (depth: number) => ({
    top: `${(100 * depth) / MAX_INDICATOR_DEPTH}%`,
  });

  const requestedDepthStyle = makeStyleForDepth(requestedDepth);
  const currentDepthStyle = makeStyleForDepth(currentDepth);
  const neverExceedDepthStyle = makeStyleForDepth(neverExceedDepthFeet);
  const crushDepthStyle = makeStyleForDepth(crushDepthFeet);

  return (
    <div>
      <div className="depth-controller">
        Dive controller
        <div className="depth-controller-clickarea">
          <div className="depth-controller-line">
            <div
              className="depth-indicator current-depth-indicator"
              style={currentDepthStyle}
            >
              Current ({Math.round(currentDepth)} feet)
            </div>
            <div
              className="depth-indicator requested-depth-indicator"
              style={requestedDepthStyle}
            >
              Requested ({Math.round(requestedDepth)} feet)
            </div>
            <div
              className="depth-indicator never-exceed-depth-indicator"
              style={neverExceedDepthStyle}
            >
              Never-Exceed
            </div>
            <div
              className="depth-indicator crush-depth-indicator"
              style={crushDepthStyle}
            >
              Crush Depth
            </div>
          </div>
        </div>
      </div>
      <span>Requested depth: {depth}</span>
      <button onClick={modDepth(1)}>Deeper!</button>
      <button onClick={modDepth(-1)}>Shallower!</button>
    </div>
  );
};

export default DivingControl;
