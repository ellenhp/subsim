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

const tools = [new PanTool()];

const Map = ({ className, mapEngine, latestUpdate }: MapProps) => {
  const [viewport, setViewport] = useState<Viewport>(initState);
  const [tool, setTool] = useState<MapTool>(tools[0]);

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

  const playerTL = localToGlobal(
    latLongToMapTL(latestUpdate.position, mapEngine.data),
    viewport
  );

  const playerIconStyle = {
    transform: `translate(${playerTL.left}px, ${
      playerTL.top
    }px) rotate(${getPlayerHeading(latestUpdate)}deg)`,
  };

  return (
    <div
      className={"map-viewport " + className}
      onMouseMove={(event) =>
        tool.mouseMove && tool.mouseMove(event, viewport, setViewport)
      }
      onMouseUp={(event) =>
        tool.mouseUp && tool.mouseUp(event, viewport, setViewport)
      }
      onMouseDown={(event) =>
        tool.mouseDown && tool.mouseDown(event, viewport, setViewport)
      }
      onMouseLeave={(event) =>
        tool.mouseLeave && tool.mouseLeave(event, viewport, setViewport)
      }
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
      </div>
    </div>
  );
};

export default Map;
