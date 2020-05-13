import React, { useState } from "react";
import { StationComponent } from "../stations";
import "./Map.css";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import {
  Viewport,
  TopLeft,
  localToGlobal,
  globalToLocal,
  changeZoom,
  latLongToMapTL,
  paneTransform,
} from "./helpers";
import MapEngine from "../../engines/mapEngine/mapEngine";
import { MAP_EL_ID, MAP_VIEWPORT_ID, MAP_OVERLAY_ID } from "./constants";
import { ToolHandler, MapTool } from "./tools";
import PanTool from "./tools/panTool";
import React = require("react");

interface MapProps {
  className?: string;
  mapEngine: MapEngine;
  latestUpdate: VesselUpdate.AsObject;
}

const initState = {
  x: 0,
  y: 0,
  zoom: 1,
};

// TODO: We really should compress this proto on entry
// and replace VesselUpdate.AsObject as the canonical world update.
const getPlayerHeading = (latestUpdate: VesselUpdate.AsObject) => {
  return latestUpdate.systemUpdatesList.filter(
    (system) => system.steeringUpdate
  )[0].steeringUpdate.actualHeadingDegrees;
};

const tools = {
  pan: new PanTool(),
};

const Map = ({ className, mapEngine, latestUpdate }: MapProps) => {
  const [viewport, setViewport] = useState<Viewport>(initState);
  const [tool, setTool] = useState<MapTool>(tools.pan);

  const zoomIn = (event: React.MouseEvent) => {
    const { top, left, bottom, right } = document
      .getElementById(MAP_VIEWPORT_ID)
      .getBoundingClientRect();
    setViewport(
      changeZoom(1, viewport, {
        top: (bottom - top) / 2,
        left: (right - left) / 2,
      })
    );
  };

  const zoomOut = (event: React.MouseEvent) => {
    const { top, left, bottom, right } = document
      .getElementById(MAP_VIEWPORT_ID)
      .getBoundingClientRect();
    setViewport(
      changeZoom(-1, viewport, {
        top: (bottom - top) / 2,
        left: (right - left) / 2,
      })
    );
  };

  const centerOnPlayer = () => {
    const { top, left, bottom, right } = document
      .getElementById(MAP_VIEWPORT_ID)
      .getBoundingClientRect();
    const offset = globalToLocal(
      {
        top: (bottom - top) / 2,
        left: (right - left) / 2,
      },
      viewport
    );
    const pos = latLongToMapTL(latestUpdate.position, mapEngine.data);
    setViewport({
      x: viewport.x + pos.left - offset.left,
      y: viewport.y + pos.top - offset.top,
      zoom: viewport.zoom,
    });
  };

  const playerTL = localToGlobal(
    latLongToMapTL(latestUpdate.position, mapEngine.data),
    viewport
  );

  const playerIconStyle = {
    transform: `translate(${playerTL.left}px, ${
      playerTL.top
    }px) rotate(${getPlayerHeading(latestUpdate)}deg)`,
  };

  const mouseMove = (event: React.MouseEvent) =>
    tool.mouseMove && tool.mouseMove(event, viewport, setViewport);
  const mouseUp = (event: React.MouseEvent) =>
    tool.mouseUp && tool.mouseUp(event, viewport, setViewport);
  const mouseDown = (event: React.MouseEvent) =>
    tool.mouseDown && tool.mouseDown(event, viewport, setViewport);
  const mouseLeave = (event: React.MouseEvent) =>
    tool.mouseLeave && tool.mouseLeave(event, viewport, setViewport);

  return (
    <div
      className={"map-viewport " + className}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseDown={mouseDown}
      onMouseLeave={mouseLeave}
      id={MAP_VIEWPORT_ID}
    >
      <div
        className="map-pane"
        style={{ transform: paneTransform(viewport) }}
        id={MAP_EL_ID}
      >
        <img src={mapEngine.mapImageEl.src} />
      </div>
      <div className="map-overlay" id={MAP_OVERLAY_ID}>
        <div className="map-player-icon" style={playerIconStyle} />
      </div>
      <div className="map-zoom-buttons">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={centerOnPlayer}>Center on Player</button>
      </div>
    </div>
  );
};

export default Map;
