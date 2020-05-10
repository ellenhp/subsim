// Idea: We want to be constantly updating this w/ the game state,
// since these need to be canvases, and constantly updated.
// In a certain sense, historical sonar data is captured solely in this interface.
// SO SINGLETON THEN

import { ElemSingleton, show, hide } from "./elemSingleton";
import noise from "noisejs";

let canvasElement: HTMLCanvasElement | undefined = undefined;

const H_RES = 1000;
const V_RES = 1000;
const BUFFER_SIZE_SEC = 20;
const NOISE_MULT = 20;

const createNarrowbandWaterfall = () => {
  canvasElement = document.createElement("canvas");
  canvasElement.className = "elem-singleton";
  document.body.appendChild(canvasElement);
  const ctx = canvasElement.getContext("2d");

  var backBuffer = document.createElement("canvas"),
    backBufferCtx = backBuffer.getContext("2d");
  backBuffer.width = H_RES;
  backBuffer.height = V_RES;
  const timer = setInterval(drawWaterfall, (BUFFER_SIZE_SEC * 1000) / V_RES);

  const noiseSource = new noise.Noise(Math.random());
  let counter = 0;
  function drawWaterfall() {
    // Move the old backbuffer data down by one pixel.
    backBufferCtx.drawImage(backBuffer, 0, 1);

    backBufferCtx.fillStyle = "black";
    backBufferCtx.fillRect(0, 0, 1000, 1);

    // Fill in the new shit.
    backBufferCtx.fillStyle = "green";
    for (var i = 0; i < H_RES; i++) {
      const noiseVal =
        (1 +
          noiseSource.perlin2(
            (counter * NOISE_MULT) / V_RES,
            (i * NOISE_MULT) / H_RES
          )) /
        2;
      backBufferCtx.globalAlpha = noiseVal * 0.6;
      backBufferCtx.fillRect(i, 0, 1, 1);
    }
    backBufferCtx.globalAlpha = 1;
    counter++;

    // Copy the backbuffer to the canvas.
    ctx.drawImage(backBuffer, 0, 0, canvasElement.width, canvasElement.height);
  }
};

export default function getNarrowbandedWaterfall(): ElemSingleton<
  HTMLCanvasElement
> {
  if (!canvasElement) {
    createNarrowbandWaterfall();
  }

  return {
    element: canvasElement,
    show: show(canvasElement),
    hide: hide(canvasElement),
  };
}
