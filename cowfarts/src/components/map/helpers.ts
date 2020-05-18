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

export const mapTLToLatLong = (mapTL: TopLeft, mapData: MapData): LatLong => {
  const { top, left } = mapTL;
  return {
    lat:
      mapData.topLeft.lat +
      ((mapData.bottomRight.lat - mapData.topLeft.lat) * top) / mapData.height,
    lng:
      mapData.topLeft.lng +
      ((mapData.bottomRight.lng - mapData.topLeft.lng) * left) / mapData.width,
  };
};

export const paneTransform = (viewport: Viewport) => {
  const { zoom, x, y } = viewport;

  return `scale(${zoom}) translate(${-x}px, ${-y}px)`;
};

const earthRadiusMeters = 6371e3; // metres
const metersPerNM = 1852;

// Taken with love from https://www.movable-type.co.uk/scripts/latlong.html
export const latLongDistance = (
  { lat: lat1, lng: lon1 }: LatLong,
  { lat: lat2, lng: lon2 }: LatLong
) => {
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (earthRadiusMeters * c) / 1852;
};

// Taken with love from https://stackoverflow.com/questions/45234631/find-the-final-latitude-longitude-after-a-movement-on-the-globe
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180.0);
}
function rad2deg(rad: number): number {
  return rad * (180.0 / Math.PI);
}

export function getFinalLatLong(
  { lat: lat1, lng: long1 }: LatLong,
  distanceNm: number,
  bearing: number
): LatLong {
  const distanceMeters = distanceNm * metersPerNM;
  // calculate angles
  var delta = distanceMeters / earthRadiusMeters,
    theta = deg2rad(lat1),
    phi = deg2rad(long1),
    gamma = deg2rad(bearing);

  // calculate sines and cosines
  var c_theta = Math.cos(theta),
    s_theta = Math.sin(theta);
  var c_phi = Math.cos(phi),
    s_phi = Math.sin(phi);
  var c_delta = Math.cos(delta),
    s_delta = Math.sin(delta);
  var c_gamma = Math.cos(gamma),
    s_gamma = Math.sin(gamma);

  // calculate end vector
  var x =
    c_delta * c_theta * c_phi -
    s_delta * (s_theta * c_phi * c_gamma + s_phi * s_gamma);
  var y =
    c_delta * c_theta * s_phi -
    s_delta * (s_theta * s_phi * c_gamma - c_phi * s_gamma);
  var z = s_delta * c_theta * c_gamma + c_delta * s_theta;

  // calculate end lat long
  var theta2 = Math.asin(z),
    phi2 = Math.atan2(y, x);

  return {
    lat: rad2deg(theta2),
    lng: rad2deg(phi2),
  };
}
