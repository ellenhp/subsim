import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { requestHeading } from "../../../gameActions";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getRequestedHeading, getCurrentHeading } from "../../../gettorz";
import "./SteeringControl.css";

interface SteeringControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const SteeringControl = ({ game, latestUpdate }: SteeringControlProps) => {
  const requestedHeading = getRequestedHeading(latestUpdate);
  const currentHeading = getCurrentHeading(latestUpdate);
  const [heading, setHeading] = useState(getRequestedHeading(latestUpdate));
  const modHeading = (num: number) => () => {
    const newHeading = (heading + num + 360) % 360;
    setHeading(newHeading);
    requestHeading(game, newHeading);
  };

  const requestedHeadingStyle = {
    transform: `rotate(${requestedHeading + 270}deg)`,
  };

  const currentHeadingStyle = {
    transform: `rotate(${currentHeading + 270}deg)`,
  };

  return (
    <div className="steering-control card">
      <div className="steering-dial">
        <div
          className="requested-bearing dial-hand"
          style={requestedHeadingStyle}
        >
          >
        </div>
        <div className="actual-bearing dial-hand" style={currentHeadingStyle}>
          >
        </div>
        <div className="dial-center" />
      </div>
      <span>Requested Heading: {heading}</span>
      <button onClick={modHeading(-5)}>Fine-tune (left)</button>
      <button onClick={modHeading(5)}>Fine-tune (right)</button>
    </div>
  );
};

export default SteeringControl;
