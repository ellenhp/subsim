import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { requestHeading } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";

interface SteeringControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const SteeringControl = ({ game }: SteeringControlProps) => {
  const [heading, setHeading] = useState(0);
  const modHeading = (num: number) => () => {
    const newHeading = (heading + num + 360) % 360;
    setHeading(newHeading);
    requestHeading(game, newHeading);
  };

  return (
    <>
      <span>Requested Heading: {heading}</span>
      <button onClick={modHeading(-5)}>Left!</button>
      <button onClick={modHeading(5)}>Right!</button>
    </>
  );
};

export default SteeringControl;
