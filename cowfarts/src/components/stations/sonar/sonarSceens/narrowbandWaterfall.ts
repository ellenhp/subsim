// Idea: We want to be constantly updating this w/ the game state,
// since these need to be canvases, and constantly updated.
// In a certain sense, historical sonar data is captured solely in this interface.
// SO SINGLETON THEN

import { ElemSingleton, show, hide } from "./elemSingleton";
import BroadbandSource from "../../../sonarEngine/broadbandSource";

const H_RES = 1000;
const V_RES = 300;
const SCOPE_IN_SECONDS = 10;

const createBroadbandWaterfall = (
  source: BroadbandSource,
  multiplier: number = 1
) => {
  const canvasElement = document.createElement("canvas");
  canvasElement.className = "elem-singleton";
  document.body.appendChild(canvasElement);
  const ctx = canvasElement.getContext("2d");

  const backBuffer = document.createElement("canvas");
  const backBufferCtx = backBuffer.getContext("2d");
  backBuffer.width = H_RES;
  backBuffer.height = V_RES;
  const timer = setInterval(drawWaterfall, (SCOPE_IN_SECONDS * 1000) / V_RES);

  let count = 0;
  let samples = Array(H_RES).fill(0);
  function drawWaterfall() {
    for (var i = 0; i < H_RES; i++) {
      const bearing = (i * 360) / H_RES;
      samples[i] += source.sample(bearing) / multiplier;
    }
    count++;
    if (count % multiplier === 0) {
      drawLine(samples);
      samples = Array(H_RES).fill(0);
    }
  }

  function drawLine(samples) {
    // Move the old backbuffer data down by one pixel.
    backBufferCtx.drawImage(backBuffer, 0, 1);

    backBufferCtx.fillStyle = "black";
    backBufferCtx.fillRect(0, 0, 1000, 1);

    // Fill in the new shit.
    backBufferCtx.fillStyle = "green";
    for (var i = 0; i < samples.length; i++) {
      const bearing = (i * 360) / H_RES;
      backBufferCtx.globalAlpha = samples[i];
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
const broadbandShort = createBroadbandWaterfall(broadbandSource, 2);
const broadbandMedium = createBroadbandWaterfall(broadbandSource, 8);
const broadbandLong = createBroadbandWaterfall(broadbandSource, 32);

export { broadbandShort, broadbandMedium, broadbandLong };
