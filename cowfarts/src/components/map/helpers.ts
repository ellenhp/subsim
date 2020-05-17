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

// Taken with love from https://www.movable-type.co.uk/scripts/latlong.html
export const latLongDistance = (
  { lat: lat1, lng: lon1 }: LatLong,
  { lat: lat2, lng: lon2 }: LatLong
) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};
