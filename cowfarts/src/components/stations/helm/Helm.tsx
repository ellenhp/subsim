import React, { useState } from "react";
import { StationComponent } from "..";
import { requestSpeed } from "../../../game";

const Helm: StationComponent = ({ game }) => {
  const [speed, setSpeed] = useState(0);
  const modSpeed = (num: number) => () => {
    const newSpeed = speed + num;
    setSpeed(newSpeed);
    requestSpeed(game, newSpeed);
  };

  return (
    <div>
      <h1>Helm</h1>
      <span>Requested speed: {speed}</span>
      <button onClick={modSpeed(1)}>Faster!</button>
      <button onClick={modSpeed(1)}>Slower!</button>
    </div>
  );
};

export default Helm;
