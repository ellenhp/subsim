// Idea: We want to be constantly updating this w/ the game state,
// since these need to be canvases, and constantly updated.
// In a certain sense, historical sonar data is captured solely in this interface.
// SO SINGLETON THEN

import { ElemSingleton, show, hide } from "../../../util/elemSingleton";
import BroadbandSource from "../broadbandSource";

const H_RES = 1000;
const V_RES = 300;
const SCOPE_IN_SECONDS = 10;
const INPUT_MULTIPLIER = 1000;

type DisplaySettings = {
  multiplier: number;
  gain: number;
  contrast: number;
};

const createBroadbandWaterfall = (
  source: BroadbandSource,
  { multiplier, gain, contrast }: DisplaySettings
): ElemSingleton<HTMLCanvasElement> => {
  const canvasElement = document.createElement("canvas");
  canvasElement.className = "elem-singleton";
  canvasElement.style.backgroundColor = "#001300";
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
      const activation = Math.min(
        Math.pow(source.sample(bearing) * INPUT_MULTIPLIER, contrast) * gain,
        1
      );
      samples[i] += activation / multiplier;
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

const buildWaterfalls = (broadbandSource: BroadbandSource) => ({
  broadbandShort: createBroadbandWaterfall(broadbandSource, {
    multiplier: 4,
    contrast: 1,
    gain: 0.08,
  }),
  broadbandMedium: createBroadbandWaterfall(broadbandSource, {
    multiplier: 16,
    contrast: 2,
    gain: 0.02,
  }),
  broadbandLong: createBroadbandWaterfall(broadbandSource, {
    multiplier: 64,
    contrast: 3,
    gain: 0.005,
  }),
});

export default buildWaterfalls;
