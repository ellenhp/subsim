import React, { useState } from "react";
import PanTool from "./panTool";
import { MapTool, OverlayComponent } from ".";
import {
  getBearingsForContact,
  getTmaSolutionForContact,
} from "../../../gettorz";
import { latLongToMapTL, localToGlobal, mapTLToLatLong } from "../helpers";
import "./tmaTool.css";
import { uploadTmaSolution } from "../../../gameActions";

const TmaOverlay: OverlayComponent = ({
  latestUpdate,
  game,
  mapData,
  viewport,
  tmaTarget,
}) => {
  // AAAAAA THIS IS REALLY NOT GOOD
  const contact = tmaTarget;

  if (!contact) {
    return <></>;
  }

  const bearings = getBearingsForContact(latestUpdate, contact);
  const solution = getTmaSolutionForContact(latestUpdate, contact);

  let tmaInitialClickOverlay = undefined;

  // Disabling this:
  /*if (!solution) {
    const handleInitialClick = (event: React.MouseEvent) => {
      const {
        top,
        left,
        bottom,
        right,
      } = event.currentTarget.getBoundingClientRect();

      const initialPosition = mapTLToLatLong(
        localToGlobal(
          {
            left: (event.clientX - left) / (right - left),
            top: (event.clientY - top) / (bottom - top),
          },
          viewport
        ),
        mapData
      );
      debugger;
      // Probably want better values
      uploadTmaSolution(game, contact, initialPosition, 0, 10);
    };
    tmaInitialClickOverlay = (
      <div
        className="tma-initial-guess-clicktarget"
        onClick={handleInitialClick}
      >
        Click to choose initial TMA solution position for {contact}.
      </div>
    );
  }*/

  let solutionBar;
  if (solution) {
    const { top, left } = latLongToMapTL(solution.position, mapData);
    const solutionBarStyle = {
      transform: `translate(${left}px, ${top}px)`,
    };
    solutionBar = (
      <div className="tma-solution-bar" style={solutionBarStyle}>
        <div className="tma-drag-handle"></div>
      </div>
    );
  }

  return (
    <>
      {tmaInitialClickOverlay}
      {bearings.map((bearing) => {
        const { top, left } = localToGlobal(
          latLongToMapTL(bearing.location, mapData),
          viewport
        );
        const rotation = (bearing.bearingDegrees + 270) % 360;
        const bearingStyle = {
          transform: `translate(${left}px, ${top}px) rotate(${rotation}deg)`,
        };
        return <div className="tma-bearing-line" style={bearingStyle}></div>;
      })}
      {solutionBar}
    </>
  );
};

export default class TmaTool extends PanTool implements MapTool {
  backgroundFilter = "invert(1) brightness(0.2)";

  overlay = TmaOverlay;
}
