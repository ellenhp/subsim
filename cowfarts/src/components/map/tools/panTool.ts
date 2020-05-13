import { MapTool } from ".";
import { globalToLocal, Viewport, TopLeft, paneTransform } from "../helpers";
import { MAP_EL_ID, MAP_OVERLAY_ID } from "../constants";

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

export default class PanTool implements MapTool {
  constructor() {
    this.dragState = { status: "dropped" };
  }
  dragState: DragState;

  mouseDown = (event: React.MouseEvent, viewport, setViewport) => {
    this.dragState = {
      status: "dragging",
      initialViewPort: viewport,
      origin: {
        top: event.screenY,
        left: event.screenX,
      },
    };
  };

  mouseMove = (event: React.MouseEvent, viewport, setViewport) => {
    if (this.dragState.status !== "dragging") {
      return;
    }
    const newViewport = computeNewViewportFromDrag(event, this.dragState);

    // Dirty hacks to bring this outside of react lifecycle, (e.g. faster!)
    document.getElementById(MAP_EL_ID).style.transform = paneTransform(
      newViewport
    );

    document.getElementById(MAP_OVERLAY_ID).style.transform = `translate(${
      event.screenX - this.dragState.origin.left
    }px, ${event.screenY - this.dragState.origin.top}px)`;
  };

  mouseUp = (event: React.MouseEvent, viewport, setViewport) => {
    if (this.dragState.status !== "dragging") {
      return;
    }
    // Reset the overlay to be what you'd expect
    const newViewport = computeNewViewportFromDrag(event, this.dragState);
    document.getElementById(MAP_OVERLAY_ID).style.transform = "";
    setViewport(newViewport);
    this.dragState = {
      status: "dropped",
    };
  };

  mouseLeave = this.mouseUp;

  getOverlays() {
    return [];
  }
}
