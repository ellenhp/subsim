import { Viewport } from "../helpers";

export type ToolHandler<T> = (
  event: T,
  viewport: Viewport,
  setViewport: (Viewport) => unknown
) => void;

export interface MapTool {
  mouseDown?: ToolHandler<React.MouseEvent>;
  mouseMove?: ToolHandler<React.MouseEvent>;
  mouseUp?: ToolHandler<React.MouseEvent>;
  mouseLeave?: ToolHandler<React.MouseEvent>;
  getOverlays: () => JSX.Element[];
}
