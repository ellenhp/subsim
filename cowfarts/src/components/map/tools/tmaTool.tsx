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
} from "../helpers";
import "./tmaTool.css";
import { uploadTmaSolution } from "../../../gameActions";
import { MapData } from "../../../engines/mapEngine/data";
import { TmaSystemUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { LatLong } from "../../../commonTypes";
import { GameConnection } from "../../../game";

/* Solution Overlay */
interface SolutionOverlayProps {
  viewport: Viewport;
  mapData: MapData;
  // Can probs remove below
  solution: TmaSystemUpdate.TmaContact.Solution.AsObject;
  game: GameConnection;
  contact: string;
}

type DragState =
  | {
      status: "dropped";
    }
  | {
      status: "dragging";
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
}: SolutionOverlayProps) => {
  const [dragState, setDragState] = useState<DragState>({
    status: "dropped",
  });

  const position =
    dragState.status === "dragging" ? dragState.latLong : solution.position;

  const { top, left } = localToGlobal(
    latLongToMapTL(position, mapData),
    viewport
  );

  const startDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragState({
      status: "dragging",
      origin: {
        top: e.clientY,
        left: e.clientX,
      },
      initialLatLong: solution.position,
      latLong: solution.position,
    });
  };

  const onDrag = (e: React.MouseEvent) => {
    // This time we actually do it in the react lifecycle!
    // This is because of the nasty stuff w.r.t. the accuracy indicator
    // in the top left
    if (dragState.status !== "dragging") {
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
    if (dragState.status !== "dragging") {
      return;
    }
    e.stopPropagation();
    uploadTmaSolution(game, contact, dragState.latLong, 0, 10);

    setDragState({ status: "dropped" });
  };

  const solutionBarStyle = {
    transform: `translate(${left}px, ${top}px)`,
  };

  // If i were good, I'd figure out a clean way these
  // handlers to the viewport tl. That would also work to
  // convert panTool to using overlayComponent.
  // This, however, is JAM code.
  const dragHandleStyleHackWhileDragging =
    dragState.status === "dragging"
      ? {
          height: "1000px",
          width: "1000px",
        }
      : {};
  return (
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
    </div>
  );
};

/* End Solution Bar */

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
