import React, { useState } from "react";
import { GameConnection } from "../../../game";
import { requestHeading, requestSpeed } from "../../../gameActions";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getRequestedHeading, getCurrentHeading } from "../../../gettorz";
import "./SteeringControl.css";

interface SteeringControlProps {
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
}

const bearingLabelLookup: { [deg: number]: string } = {
  0: "N",
  90: "E",
  180: "S",
  270: "W",
};

const SteeringControl = ({ game, latestUpdate }: SteeringControlProps) => {
  const requestedHeading = getRequestedHeading(latestUpdate);
  const currentHeading = getCurrentHeading(latestUpdate);
  const modHeading = (num: number) => () => {
    const newHeading = (requestedHeading + num + 360) % 360;
    requestHeading(game, newHeading);
  };

  const requestedHeadingStyle = {
    transform: `translateY(-50%) rotate(${requestedHeading + 270}deg)`,
  };

  const currentHeadingStyle = {
    transform: `translateY(-50%) rotate(${currentHeading + 270}deg)`,
  };

  const onDialClick = (event: React.MouseEvent) => {
    const {
      top,
      left,
      bottom,
      right,
    } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / (right - left) - 0.5;
    const y = (event.clientY - top) / (bottom - top) - 0.5;
    const targetBearing = Math.floor(
      ((Math.atan2(y, x) * 360) / (2 * Math.PI) + 360 + 90) % 360
    );
    requestHeading(game, targetBearing);
  };

  const dialMarks = ((Array(16) as any).fill(0) as number[]).map(
    (_, idx, arr) => {
      const deg = (360 * idx) / arr.length;
      const style = {
        transform: `translateX(-50%) rotate(${deg}deg)`,
      };
      const text = bearingLabelLookup[deg] || "";
      return (
        <div className="dial-mark" style={style}>
          {text}
        </div>
      );
    }
  );

  return (
    <div className="steering-control card">
      <div className="steering-dial" onClick={onDialClick}>
        <div
          className="requested-bearing dial-hand"
          style={requestedHeadingStyle}
        />
        <div className="actual-bearing dial-hand" style={currentHeadingStyle} />
        <div className="dial-center">
          <div className="dial-center-text">
            <div>
              Target Course: <br />
              {requestedHeading}°
            </div>
            <div>
              Actual Course: <br />
              {currentHeading}°
            </div>
          </div>
        </div>
        {dialMarks}
      </div>
      <button onClick={modHeading(-1)}>Fine-tune (left)</button>
      <button onClick={modHeading(1)}>Fine-tune (right)</button>
    </div>
  );
};

export default SteeringControl;
