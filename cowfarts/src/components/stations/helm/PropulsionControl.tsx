import React, { useState } from "react";
import { Game } from "../../../game";
import { requestSpeed } from "../../../game";

const PropulsionControl = ({ game }: { game: Game }) => {
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
