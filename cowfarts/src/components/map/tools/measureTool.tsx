import React, { useState } from "react";
import "./measureTool.css";
import { MapTool, OverlayProps } from ".";
import {
  globalToLocal,
  Viewport,
  TopLeft,
  paneTransform,
  mapTLToLatLong,
  latLongDistance,
  localToGlobal,
  latLongToMapTL,
} from "../helpers";
import { LatLong } from "../../../commonTypes";

type DraggingState = {
  status: "dragging";
  origin: TopLeft;
  currentLatLong: LatLong;
  originalLatLong: LatLong;
};
type DragState =
  | DraggingState
  | {
      status: "dropped";
    };

const MeasureOverlay = ({ viewport, mapData }: OverlayProps) => {
  const [dragState, setDragState] = useState<DragState>({ status: "dropped" });
  const mouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // todo: figure out whether this is accurate. Might be screwed
    // up by 50% viewport width.
    const { top, left } = event.currentTarget.getBoundingClientRect();

    const originalLatLong = mapTLToLatLong(
      globalToLocal(
        {
          top: event.clientY - top,
          left: event.clientX - left,
        },
        viewport
      ),
      mapData
    );
    setDragState({
      status: "dragging",
      currentLatLong: originalLatLong,
      originalLatLong,
      origin: {
        top: event.clientY,
        left: event.clientX,
      },
    });
  };

  const mouseMove = (event: React.MouseEvent) => {
    if (dragState.status !== "dragging") {
      return;
    }
    const { top, left } = event.currentTarget.getBoundingClientRect();

    const latlong = mapTLToLatLong(
      globalToLocal(
        {
          top: event.clientY - top,
          left: event.clientX - left,
        },
        viewport
      ),
      mapData
    );
    setDragState({
      ...dragState,
      currentLatLong: latlong,
    });
  };

  const mouseUp = (event: React.MouseEvent) => {
    if (dragState.status !== "dragging") {
      return;
    }

    setDragState({
      status: "dropped",
    });
  };

  let ruler;
  if (dragState.status === "dragging") {
    const sourceTl = localToGlobal(
      latLongToMapTL(dragState.originalLatLong, mapData),
      viewport
    );
    const destTl = localToGlobal(
      latLongToMapTL(dragState.currentLatLong, mapData),
      viewport
    );

    const offset = {
      top: destTl.top - sourceTl.top,
      left: destTl.left - sourceTl.left,
    };

    const angle = Math.atan2(offset.top, offset.left);
    const length = Math.sqrt(offset.top ** 2 + offset.left ** 2);

    const rulerStyle = {
      transform: `translate(${sourceTl.left}px, ${sourceTl.top}px) rotate(${angle}rad)`,
      width: `${length}px`,
    };

    ruler = (
      <div className="measure-tool-ruler" style={rulerStyle}>
        <div
          className="measure-tool-text"
          style={{ transform: `rotate(${-angle}rad)` }}
        >
          {latLongDistance(
            dragState.originalLatLong,
            dragState.currentLatLong
          ).toFixed(2)}
          nm
          <br />
          {(((angle * 360) / (Math.PI * 2) + 270) % 360).toFixed(1)}°
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        className="measure-tool-clickarea"
        onMouseDown={mouseDown}
        onMouseMove={mouseMove}
        onMouseUp={mouseUp}
        onMouseLeave={mouseUp}
      >
        {ruler}
      </div>
    </>
  );
};

export default class MeasureTool implements MapTool {
  overlay = MeasureOverlay;
}
