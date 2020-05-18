import { Viewport } from "../helpers";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { GameConnection } from "../../../game";
import { MapData } from "../../../engines/mapEngine/data";

export type ToolHandler<T> = (
  event: T,
  viewport: Viewport,
  setViewport: (port: Viewport) => unknown
) => void;

export interface OverlayProps {
  latestUpdate: VesselUpdate.AsObject;
  game: GameConnection;
  mapData: MapData;
  viewport: Viewport;
  tmaTarget?: string;
}

export type OverlayComponent = React.FunctionComponent<OverlayProps>;

// Tools should really just be an overlay component, I'm guessing.
// But that means I've got to move PanTool over which sounds awful rn.
export interface MapTool {
  mouseDown?: ToolHandler<React.MouseEvent>;
  mouseMove?: ToolHandler<React.MouseEvent>;
  mouseUp?: ToolHandler<React.MouseEvent>;
  mouseLeave?: ToolHandler<React.MouseEvent>;
  overlay?: OverlayComponent;
  backgroundFilter?: string;
  hideContactIcons?: boolean;
}
