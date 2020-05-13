import { TopLeft, LatLong } from "../../commonTypes";
import { MapData } from "../../engines/mapEngine/data";

export type Viewport = {
  x /* viewport top left, in px */;
  y /* viewport top left, in px */;
  zoom;
};

export type TopLeft = {
  top: number;
  left: number;
};

export const localToGlobal = (
  { top, left }: TopLeft,
  { x, y, zoom }: Viewport
): TopLeft => {
  return {
    top: zoom * (top - y),
    left: zoom * (left - x),
  };
};

export const globalToLocal = (
  { top, left }: TopLeft,
  { x, y, zoom }: Viewport
): TopLeft => {
  return {
    top: y + top / zoom,
    left: x + left / zoom,
  };
};

export const changeZoom = (
  zoomAmount: number,
  viewport: Viewport,
  origin = { top: 0, left: 0 }
) => {
  const oldZoom = viewport.zoom;
  const scaledZoom = 0.5 * zoomAmount * viewport.zoom;
  const newZoom = Math.min(5, Math.max(0.1, viewport.zoom + scaledZoom));

  return {
    x: viewport.x + (origin.left / oldZoom - origin.left / newZoom),
    y: viewport.y + (origin.top / oldZoom - origin.top / newZoom),
    zoom: newZoom,
  };
};

export const latLongToMapTL = (latLong: LatLong, mapData: MapData): TopLeft => {
  const { lat, lng } = latLong;
  return {
    top:
      (mapData.height * (lat - mapData.topLeft.lat)) /
      (mapData.bottomRight.lat - mapData.topLeft.lat),
    left:
      (mapData.width * (lng - mapData.topLeft.lng)) /
      (mapData.bottomRight.lng - mapData.topLeft.lng),
  };
};

export const paneTransform = (viewport: Viewport) => {
  const { zoom, x, y } = viewport;

  return `scale(${zoom}) translate(${-x}px, ${-y}px)`;
};
