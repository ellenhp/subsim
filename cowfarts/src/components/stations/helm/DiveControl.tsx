import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getRequestedDepth } from "../../../gettorz";
import { requestDepth } from "../../../gameActions";

interface DivingControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const DivingControl = ({ game, latestUpdate }: DivingControlProps) => {
  const [depth, setDepth] = useState(getRequestedDepth(latestUpdate));
  const modDepth = (num: number) => () => {
    const newDepth = depth + num;
    setDepth(newDepth);
    requestDepth(game, newDepth);
  };

  return (
    <>
      <span>Requested depth: {depth}</span>
      <button onClick={modDepth(1)}>Deeper!</button>
      <button onClick={modDepth(-1)}>Shallower!</button>
    </>
  );
};

export default DivingControl;
