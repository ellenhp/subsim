import React, { useState } from "react";
import "./Map.css";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import {
  Viewport,
  localToGlobal,
  changeZoom,
  latLongToMapTL,
  paneTransform,
} from "./helpers";
import MapEngine from "../../engines/mapEngine/mapEngine";
import { MAP_EL_ID, MAP_VIEWPORT_ID, MAP_OVERLAY_ID } from "./constants";
import { MapTool } from "./tools";
import PanTool from "./tools/panTool";
import TmaTool from "./tools/tmaTool";
import { LatLong } from "../../commonTypes";
import { MapData } from "../../engines/mapEngine/data";
import { GameConnection } from "../../game";

type ToolList = {
  pan: MapTool;
  tma: MapTool;
};

const tools: ToolList = {
  pan: new PanTool(),
  tma: new TmaTool(),
};

interface MapProps {
  className?: string;
  mapEngine: MapEngine;
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
  forceTool?: keyof ToolList;
}

// TODO: We really should compress this proto on entry
// and replace VesselUpdate.AsObject as the canonical world update.
const getPlayerHeading = (latestUpdate: VesselUpdate.AsObject) => {
  return latestUpdate.systemUpdatesList.filter(
    (system) => system.steeringUpdate
  )[0].steeringUpdate.actualHeadingDegrees;
};

/* This is a lot */
const getViewportWithPlayerInCenter = (
  viewport: Viewport,
  position: LatLong,
  data: MapData
) => {
  const pos = latLongToMapTL(position, data);
  return {
    x: pos.left,
    y: pos.top,
    zoom: viewport.zoom,
  };
};

const Map = ({
  className,
  mapEngine,
  latestUpdate,
  forceTool,
  game,
}: MapProps) => {
  // Thank god that this is just math
  const initialState = getViewportWithPlayerInCenter(
    {
      x: 0,
      y: 0,
      zoom: 1,
    },
    latestUpdate.position,
    mapEngine.data
  );
  let [viewport, setViewport] = useState<Viewport>(initialState);

  // Nasty hack to shim in staying centered on player. Is v. gross and
  // should be abstracted away. Viewport should not include zoom
  const [isCenteredOnPlayer, setCenteredOnPlayer] = useState<boolean>(true);
  if (isCenteredOnPlayer) {
    viewport = getViewportWithPlayerInCenter(
      viewport,
      latestUpdate.position,
      mapEngine.data
    );
  }

  const focusViewport = (viewport: Viewport) => {
    setViewport(viewport);
    setCenteredOnPlayer(false);
  };

  // End nasty hack

  let [tool, setTool] = useState<MapTool>(tools.pan);

  if (forceTool) {
    tool = tools[forceTool];
    setTool = () => {
      throw "dont force tool and set tool";
    };
  }

  const zoomIn = () => {
    setViewport(changeZoom(1, viewport));
  };

  const zoomOut = () => {
    setViewport(changeZoom(-1, viewport));
  };

  const centerOnPlayer = () => {
    setCenteredOnPlayer(true);
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
    tool.mouseMove && tool.mouseMove(event, viewport, focusViewport);
  const mouseUp = (event: React.MouseEvent) =>
    tool.mouseUp && tool.mouseUp(event, viewport, focusViewport);
  const mouseDown = (event: React.MouseEvent) =>
    tool.mouseDown && tool.mouseDown(event, viewport, focusViewport);
  const mouseLeave = (event: React.MouseEvent) =>
    tool.mouseLeave && tool.mouseLeave(event, viewport, focusViewport);

  const mapPaneStyle = {
    transform: paneTransform(viewport),
    filter: "",
  };

  if (tool.backgroundFilter) {
    mapPaneStyle.filter = tool.backgroundFilter;
  }

  /*let toolSwitcher;
  if (!forceTool) {
    // This should really be refactored
    toolSwitcher = (
      <div className="map-tool-switcher">
        <button onClick={() => setTool(tools.pan)}>Pan</button>
        <button onClick={() => setTool(tools.tma)}>TMA</button>
      </div>
    );
  }*/

  const Overlay = tool.overlay;

  return (
    <div
      className={"map-viewport " + className}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseDown={mouseDown}
      onMouseLeave={mouseLeave}
      id={MAP_VIEWPORT_ID}
    >
      <div className="map-viewport-center">
        <div className="map-pane" style={mapPaneStyle} id={MAP_EL_ID}>
          <img src={mapEngine.mapImageEl.src} />
        </div>
        <div className="map-overlay" id={MAP_OVERLAY_ID}>
          <div className="map-player-icon" style={playerIconStyle} />
          {Overlay && (
            <Overlay
              game={game}
              latestUpdate={latestUpdate}
              mapData={mapEngine.data}
              viewport={viewport}
            />
          )}
        </div>
      </div>

      {/*toolSwitcher*/}

      <div className="map-zoom-buttons">
        {!isCenteredOnPlayer && (
          <button onClick={centerOnPlayer}>Center on Player</button>
        )}
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
    </div>
  );
};

export default Map;
