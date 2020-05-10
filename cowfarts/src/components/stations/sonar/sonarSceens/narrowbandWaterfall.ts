// Idea: We want to be constantly updating this w/ the game state,
// since these need to be canvases, and constantly updated.
// In a certain sense, historical sonar data is captured solely in this interface.
// SO SINGLETON THEN

import { ElemSingleton, show, hide } from "./elemSingleton";

let canvasElement: HTMLCanvasElement | undefined = undefined;

const createNarrowbandWaterfall = () => {
  canvasElement = document.createElement("canvas");
  canvasElement.className = "elem-singleton";
  document.body.appendChild(canvasElement);
  const ctx = canvasElement.getContext("2d");

  var backBuffer = document.createElement("canvas"),
    backBufferCtx = backBuffer.getContext("2d");
  backBuffer.width = 32;
  backBuffer.height = 100;
  const timer = setInterval(drawWaterfall, 100);

  function drawWaterfall() {
    // Move the old backbuffer data down by one pixel.
    backBufferCtx.drawImage(backBuffer, 0, 1);

    backBufferCtx.fillStyle = "black";
    backBufferCtx.fillRect(0, 0, 32, 1);

    // Fill in the new shit.
    backBufferCtx.fillStyle = "green";
    for (var i = 0; i < 32; i++) {
      backBufferCtx.globalAlpha = Math.random() * 0.7;
      backBufferCtx.fillRect(i, 0, 1, 1);
    }
    backBufferCtx.globalAlpha = 1;

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
