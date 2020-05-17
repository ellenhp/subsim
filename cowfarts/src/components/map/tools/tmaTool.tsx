import React, { useState } from "react";
import PanTool from "./panTool";
import { MapTool, OverlayComponent } from ".";
import { getBearingsForContact } from "../../../gettorz";
import { latLongToMapTL, localToGlobal } from "../helpers";
import "./tmaTool.css";

const TmaOverlay: OverlayComponent = ({
  latestUpdate,
  game,
  mapData,
  viewport,
}) => {
  // AAAAAA NOT GOOD
  const [contact, setContact] = useState("S1");
  const bearings = getBearingsForContact(latestUpdate, contact);

  return (
    <>
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
    </>
  );
};

export default class TmaTool extends PanTool implements MapTool {
  backgroundFilter = "invert(1) brightness(0.2)";

  overlay = TmaOverlay;
}
