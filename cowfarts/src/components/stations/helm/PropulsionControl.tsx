import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { requestSpeed } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";

interface PropulsionControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const PropulsionControl = ({ game }: PropulsionControlProps) => {
  const [speed, setSpeed] = useState(0);
  const modSpeed = (num: number) => () => {
    const newSpeed = speed + num;
    setSpeed(newSpeed);
    requestSpeed(game, newSpeed);
  };

  return (
    <>
      <span>Requested speed: {speed}</span>
      <button onClick={modSpeed(1)}>Faster!</button>
      <button onClick={modSpeed(-1)}>Slower!</button>
    </>
  );
};

export default PropulsionControl;
