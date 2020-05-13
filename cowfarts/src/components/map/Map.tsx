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
} from "./helpers";
import MapEngine from "../../engines/mapEngine/mapEngine";

interface MapProps {
  className?: string;
  mapEngine: MapEngine;
  latestUpdate: VesselUpdate.AsObject;
}

const MAP_EL_ID = "map-pane-element-loooolz";
const MAP_VIEWPORT_ID = "map-viewport-element-loooolz";
const MAP_OVERLAY_ID = "map-overlay-element-loooolz";

const initState = {
  x: 0,
  y: 0,
  zoom: 1,
};

type DraggingState = {
  status: "dragging";
  origin: TopLeft;
  initialViewPort: Viewport;
};
type DragState =
  | DraggingState
  | {
      status: "dropped";
    };

const computeNewViewportFromDrag = (
  event: React.MouseEvent,
  draggingState: DraggingState
) => {
  const { top: y, left: x } = globalToLocal(
    {
      left: draggingState.origin.left - event.screenX,
      top: draggingState.origin.top - event.screenY,
    },
    draggingState.initialViewPort
  );
  return {
    x,
    y,
    zoom: draggingState.initialViewPort.zoom,
  };
};

const paneTransform = (viewport: Viewport) => {
  const { zoom, x, y } = viewport;

  return `scale(${zoom}) translate(${-x}px, ${-y}px)`;
};

// TODO: We really should compress this proto on entry
// and replace VesselUpdate.AsObject as the canonical world update.
const getPlayerHeading = (latestUpdate: VesselUpdate.AsObject) => {
  return latestUpdate.systemUpdatesList.filter(
    (system) => system.steeringUpdate
  )[0].steeringUpdate.actualHeadingDegrees;
};

const Map = ({ className, mapEngine, latestUpdate }: MapProps) => {
  const [dragState, setDragState] = useState<DragState>({ status: "dropped" });
  const [viewport, setViewport] = useState<Viewport>(initState);

  const dragStart = (event: React.MouseEvent) => {
    setDragState({
      status: "dragging",
      initialViewPort: viewport,
      origin: {
        top: event.screenY,
        left: event.screenX,
      },
    });
  };

  const dragMove = (event: React.MouseEvent) => {
    if (dragState.status !== "dragging") {
      return;
    }
    const newViewport = computeNewViewportFromDrag(event, dragState);

    // Dirty hacks to bring this outside of react lifecycle, (e.g. faster!)
    document.getElementById(MAP_EL_ID).style.transform = paneTransform(
      newViewport
    );

    document.getElementById(MAP_OVERLAY_ID).style.transform = `translate(${
      event.screenX - dragState.origin.left
    }px, ${event.screenY - dragState.origin.top}px)`;
  };

  const dragEnd = (event: React.MouseEvent) => {
    if (dragState.status !== "dragging") {
      return;
    }
    // Reset the overlay to be what you'd expect
    const newViewport = computeNewViewportFromDrag(event, dragState);
    setViewport(newViewport);
    setDragState({
      status: "dropped",
    });
  };

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

  const overlayStyle =
    dragState.status !== "dragging" ? { transform: "translate(0, 0)" } : {};

  return (
    <div
      className={"map-viewport " + className}
      onMouseMove={dragMove}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      onMouseDown={dragStart}
      id={MAP_VIEWPORT_ID}
    >
      <div
        className="map-pane"
        style={{ transform: paneTransform(viewport) }}
        id={MAP_EL_ID}
      >
        <img src={mapEngine.mapImageEl.src} />
      </div>
      <div className="map-overlay" style={overlayStyle} id={MAP_OVERLAY_ID}>
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
