import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getRequestedSpeed, getActualSpeed } from "../../../gettorz";
import { requestSpeed } from "../../../gameActions";
import "./PropulsionControl.css";

interface PropulsionControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const maxSpeed = 30;

const PropulsionControl = ({ game, latestUpdate }: PropulsionControlProps) => {
  const requestedSpeed = getRequestedSpeed(latestUpdate);
  const actualSpeed = getActualSpeed(latestUpdate);
  const modSpeed = (num: number) => () => {
    const newSpeed = requestedSpeed + num;
    requestSpeed(game, newSpeed);
  };

  const onClickAreaClick = (event: React.MouseEvent) => {
    const { left, right } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / (right - left);
    const targetSpeed = Math.round(x * maxSpeed);
    requestSpeed(game, targetSpeed);
  };

  const requestedStyle = { left: `${(100 * requestedSpeed) / maxSpeed}%` };
  const actualStyle = { left: `${(100 * actualSpeed) / maxSpeed}%` };
  return (
    <div className="propulsion-control card">
      Propulsion Controller
      <div className="propulsion-bar-wrapper">
        <span className="requested-speed">
          Target Speed: {requestedSpeed}kts
        </span>
        <div className="propulsion-clickarea" onClick={onClickAreaClick}>
          <div
            className="requested-speed-bar"
            style={{ width: `${(100 * requestedSpeed) / maxSpeed}%` }}
          />
          <div
            className="actual-speed-bar"
            style={{ width: `${(100 * actualSpeed) / maxSpeed}%` }}
          />
        </div>
        <span className="actual-speed">Actual Speed: {actualSpeed}kts</span>
      </div>
      <button onClick={modSpeed(1)}>Faster!</button>
      <button onClick={modSpeed(-1)}>Slower!</button>
    </div>
  );
};

export default PropulsionControl;
