import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { requestHeading } from "../../../gameActions";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getRequestedHeading } from "../../../gettorz";

interface SteeringControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const SteeringControl = ({ game, latestUpdate }: SteeringControlProps) => {
  const [heading, setHeading] = useState(getRequestedHeading(latestUpdate));
  const modHeading = (num: number) => () => {
    const newHeading = (heading + num + 360) % 360;
    setHeading(newHeading);
    requestHeading(game, newHeading);
  };

  return (
    <div className="steering-control card">
      <span>Requested Heading: {heading}</span>
      <button onClick={modHeading(-5)}>Left!</button>
      <button onClick={modHeading(5)}>Right!</button>
    </div>
  );
};

export default SteeringControl;
