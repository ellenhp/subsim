// Idea: We want to be constantly updating this w/ the game state,
// since these need to be canvases, and constantly updated.
// In a certain sense, historical sonar data is captured solely in this interface.
// SO SINGLETON THEN

import { ElemSingleton, show, hide } from "./elemSingleton";
import BroadbandSource from "./broadbandSource";

const H_RES = 1000;
const V_RES = 1000;

const createBroadbandWaterfall = (
  source: BroadbandSource,
  scopeInSeconds: number,
  multiplier: number = 1
) => {
  const canvasElement = document.createElement("canvas");
  canvasElement.className = "elem-singleton";
  document.body.appendChild(canvasElement);
  const ctx = canvasElement.getContext("2d");

  var backBuffer = document.createElement("canvas"),
    backBufferCtx = backBuffer.getContext("2d");
  backBuffer.width = H_RES;
  backBuffer.height = V_RES;
  const timer = setInterval(drawWaterfall, (scopeInSeconds * 1000) / V_RES);

  function drawWaterfall() {
    // Move the old backbuffer data down by one pixel.
    backBufferCtx.drawImage(backBuffer, 0, 1);

    backBufferCtx.fillStyle = "black";
    backBufferCtx.fillRect(0, 0, 1000, 1);

    // Fill in the new shit.
    backBufferCtx.fillStyle = "green";
    for (var i = 0; i < H_RES; i++) {
      const bearing = (i * 360) / H_RES;
      backBufferCtx.globalAlpha = source.sample(bearing);
      backBufferCtx.fillRect(i, 0, 1, 1);
    }
    backBufferCtx.globalAlpha = 1;

    // Copy the backbuffer to the canvas.
    ctx.drawImage(backBuffer, 0, 0, canvasElement.width, canvasElement.height);
  }
  return {
    element: canvasElement,
    show: show(canvasElement),
    hide: hide(canvasElement),
  };
};

const broadbandSource = new BroadbandSource();
const broadbandShort = createBroadbandWaterfall(broadbandSource, 30);
const broadbandMedium = createBroadbandWaterfall(broadbandSource, 60);
const broadbandLong = createBroadbandWaterfall(broadbandSource, 120);

export { broadbandShort, broadbandMedium, broadbandLong };
