// This is a beast of a file
// Beware all ye who entereth here

import React, { useState } from "react";
import PanTool from "./panTool";
import { MapTool, OverlayComponent } from ".";
import {
  getBearingsForContact,
  getTmaSolutionForContact,
} from "../../../gettorz";
import {
  latLongToMapTL,
  globalToLocal,
  localToGlobal,
  mapTLToLatLong,
  Viewport,
  TopLeft,
  getFinalLatLong,
  latLongDistance,
} from "../helpers";
import "./tmaTool.css";
import { uploadTmaSolution } from "../../../gameActions";
import { MapData } from "../../../engines/mapEngine/data";
import { TmaSystemUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { LatLong } from "../../../commonTypes";
import { GameConnection } from "../../../game";
import { TmaSystem } from "../../../__protogen__/mass/api/systems_pb";
import { MAP_VIEWPORT_ID } from "../constants";

/* Solution Overlay */
interface SolutionOverlayProps {
  viewport: Viewport;
  mapData: MapData;
  // Can probs remove below
  solution: TmaSystemUpdate.TmaContact.Solution.AsObject;
  game: GameConnection;
  contact: string;
  bearings: Array<TmaSystemUpdate.TmaContact.Bearing.AsObject>;
}

const pixelsAtEndOfTmaShaft = 10;
const handleLengthMult = 1 / 30000;
// because i don't have enough time to do proper math.
const garbageSpeedToHandleLength = (
  speedKnots: number,
  heading: number,
  timeScaleMs: number,
  viewport: Viewport
) => {
  return (
    handleLengthMult * speedKnots * timeScaleMs * viewport.zoom +
    pixelsAtEndOfTmaShaft
  );
};

const garbageHandleLengthToSpeed = (
  length: number,
  heading: number,
  timeScaleMs: number,
  viewport: Viewport
) => {
  return (
    (length - pixelsAtEndOfTmaShaft) /
    (handleLengthMult * timeScaleMs * viewport.zoom)
  );
};

type DragState =
  | {
      status: "dropped";
    }
  | {
      status: "dragging-base";
      origin: TopLeft;
      initialLatLong: LatLong;
      latLong: LatLong;
    };

const SolutionOverlay = ({
  solution,
  viewport,
  mapData,
  game,
  contact,
  bearings,
}: SolutionOverlayProps) => {
  const [dragState, setDragState] = useState<DragState>({
    status: "dropped",
  });

  const earliestBearing = bearings[bearings.length - 1];
  const earliestBearingTime = earliestBearing.epochMillis;
  const latestBearing = bearings[0];
  const latestBearingTime = latestBearing.epochMillis;

  const basePosition =
    dragState.status === "dragging-base"
      ? dragState.latLong
      : solution.position;

  const speedKnots = solution.speedKnots;

  const heading = solution.headingDegrees;

  const { top, left } = localToGlobal(
    latLongToMapTL(basePosition, mapData),
    viewport
  );

  const startDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragState({
      status: "dragging-base",
      origin: {
        top: e.clientY,
        left: e.clientX,
      },
      initialLatLong: basePosition,
      latLong: basePosition,
    });
  };

  const onDrag = (e: React.MouseEvent) => {
    // This time we actually do it in the react lifecycle!
    // This is because of the nasty stuff w.r.t. the accuracy indicator
    // in the top left
    if (dragState.status === "dropped") {
      return;
    }
    const localOriginTl = globalToLocal(
      {
        top: dragState.origin.top,
        left: dragState.origin.left,
      },
      viewport
    );
    const localClientTl = globalToLocal(
      {
        top: e.clientY,
        left: e.clientX,
      },
      viewport
    );

    const pixelOffset = {
      top: localClientTl.top - localOriginTl.top,
      left: localClientTl.left - localOriginTl.left,
    };
    const oldMapTl = latLongToMapTL(dragState.initialLatLong, mapData);
    const newMapTl = {
      top: oldMapTl.top + pixelOffset.top,
      left: oldMapTl.left + pixelOffset.left,
    };

    const newLatLong = mapTLToLatLong(newMapTl, mapData);

    setDragState({
      ...dragState,
      latLong: newLatLong,
    });
  };

  const stopDrag = (e: React.MouseEvent) => {
    if (dragState.status !== "dragging-base") {
      return;
    }
    e.stopPropagation();
    uploadTmaSolution(game, contact, dragState.latLong, 0, 10);

    setDragState({ status: "dropped" });
  };

  /*
    Some notes about styling!
    - Head of TMA solution handle should be last taken bearing line + 
      SOME_CONSTANT pixels
    - Tail of TMA solution should be earliest relevant bearing.
    - This head should be draggable, while keeping tail steady
    - Same with tail being draggable, while keeping heading steady
    - We should have a dotted line to actual position, if outside of the handle
    - This is a doozy
  */

  // This is gonna be annoying
  // due to lat-long to px

  const bearingToEstLatLong = (
    bearing: TmaSystemUpdate.TmaContact.Bearing.AsObject
  ) => {
    const distanceFromEarliestBearingTime =
      (speedKnots * (bearing.epochMillis - earliestBearingTime)) /
      (1000 * 3600);

    return getFinalLatLong(
      basePosition,
      distanceFromEarliestBearingTime,
      heading
    );
  };

  const solutionBarWidth = garbageSpeedToHandleLength(
    speedKnots,
    heading,
    latestBearingTime - earliestBearingTime,
    viewport
  );
  debugger;
  const solutionBarStyle = {
    transform: `translate(${left}px, ${top}px) rotate(${
      (heading + 270) % 360
    }deg)`,
    width: `${solutionBarWidth}px`,
  };

  // If i were good, I'd figure out a clean way these
  // handlers to the viewport tl. That would also work to
  // convert panTool to using overlayComponent.
  // This, however, is JAM code.
  const dragHandleStyleHackWhileDragging =
    dragState.status === "dragging-base"
      ? {
          height: "1000px",
          width: "1000px",
        }
      : {};

  const bearingTicks = bearings.map((bearing) => {
    const { top, left } = localToGlobal(
      latLongToMapTL(bearingToEstLatLong(bearing), mapData),
      viewport
    );

    return (
      <div
        className="tma-bearing-tick"
        style={{
          transform: `translate(${left}px, ${top}px) rotate(${heading}deg)`,
        }}
      />
    );
  });
  return (
    <>
      <div className="tma-bearing-tick-container">{bearingTicks}</div>
      <div className="tma-solution-bar" style={solutionBarStyle}>
        <div className="tma-drag-handle" />
        <div
          className="tma-drag-handle-clicktarget"
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          style={dragHandleStyleHackWhileDragging}
        />
        <div className="tma-head-handle"></div>
        <div className="tma-head-handle-clicktarget" />
      </div>
    </>
  );
};

/* End Solution Bar */

const maxTmaBearings = 5;

const TmaOverlay: OverlayComponent = ({
  latestUpdate,
  game,
  mapData,
  viewport,
  tmaTarget,
}) => {
  // We REALLY should not pass down TMA target this deeply
  const contact = tmaTarget;

  if (!contact) {
    return <></>;
  }

  const bearings = getBearingsForContact(latestUpdate, contact)
    .sort((a, b) => b.epochMillis - a.epochMillis)
    .slice(0, maxTmaBearings);

  if (!bearings.length) {
    return <></>;
  }

  const solution = getTmaSolutionForContact(latestUpdate, contact);

  let tmaInitialClickOverlay = undefined;

  // Disabling this:
  if (!solution) {
    const handleInitialClick = (event: React.MouseEvent) => {
      const {
        top,
        left,
        bottom,
        right,
      } = event.currentTarget.getBoundingClientRect();

      const initialPosition = mapTLToLatLong(
        globalToLocal(
          {
            left: (event.clientX - left) / (right - left),
            top: (event.clientY - top) / (bottom - top),
          },
          viewport
        ),
        mapData
      );
      // Probably want better values
      uploadTmaSolution(game, contact, initialPosition, 0, 10);
    };
    tmaInitialClickOverlay = (
      <div
        className="tma-initial-guess-clicktarget"
        onClick={handleInitialClick}
      >
        <div className="tma-initial-guess-text">
          [ Click to choose initial TMA solution position for {contact}. ]
        </div>
      </div>
    );
  }

  let solutionOverlay;
  if (solution) {
    solutionOverlay = (
      <SolutionOverlay
        game={game}
        contact={contact}
        mapData={mapData}
        viewport={viewport}
        solution={solution}
        bearings={bearings}
      />
    );
  }

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
      {solutionOverlay}
      {tmaInitialClickOverlay}
    </>
  );
};

export default class TmaTool extends PanTool implements MapTool {
  backgroundFilter = "invert(1) brightness(0.2)";

  overlay = TmaOverlay;
}
