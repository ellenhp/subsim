import React from "react";
import BroadbandSource from "../../../../engines/sonarEngine/broadbandSource";

/*  */
interface DisplaySettings {
  gain: number;
  contrast: number;
  multiplier: number;
}

interface BroadbandWaterfallProps {
  displaySettings: DisplaySettings;
  source: BroadbandSource;
}

const H_RES = 1000;
const V_RES = 300;
const SCOPE_IN_SECONDS = 10;
const INPUT_MULTIPLIER = 1000;
const UPDATE_INTERVAL_MS = (SCOPE_IN_SECONDS * 1000) / V_RES;

const gameEpoch = Date.now(); // TODO<< FIX THIS SHIT.

const timeToSampleIdx = (atTime: number) => {
  return Math.floor((atTime - gameEpoch) / UPDATE_INTERVAL_MS);
};

const sampleIdxToTime = (sample: number) => {
  return Math.floor(sample * UPDATE_INTERVAL_MS + gameEpoch);
};

const initCanvas = (
  source: BroadbandSource,
  { multiplier, gain, contrast }: DisplaySettings,
  canvasElement: HTMLCanvasElement
) => {
  canvasElement.style.backgroundColor = "#001300";
  const ctx = canvasElement.getContext("2d");

  let prevSampleCount = 0;

  const backBuffer = document.createElement("canvas");
  const backBufferCtx = backBuffer.getContext("2d");
  backBuffer.width = H_RES;
  backBuffer.height = V_RES;
  // TODO: Fix this
  const timer = setInterval(drawWaterfall, UPDATE_INTERVAL_MS);

  let samples: number[] = Array(H_RES).fill(0);
  function drawWaterfall() {
    prevSampleCount = Math.max(
      prevSampleCount,
      timeToSampleIdx(Date.now() - SCOPE_IN_SECONDS * multiplier * 1000),
      0
    );
    while (prevSampleCount < timeToSampleIdx(Date.now())) {
      for (var i = 0; i < H_RES; i++) {
        const bearing = (i * 360) / H_RES;
        const sample = source.sample(bearing, sampleIdxToTime(prevSampleCount));
        const activation = Math.min(
          Math.pow(sample * INPUT_MULTIPLIER, contrast) * gain,
          1
        );
        samples[i] += activation / multiplier;
      }
      prevSampleCount++;
      if (prevSampleCount % multiplier === 0) {
        drawLine(samples);
        samples = Array(H_RES).fill(0);
      }
    }
  }

  function drawLine(samples: number[]) {
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
};

class BroadbandWaterfall extends React.Component<BroadbandWaterfallProps> {
  constructor(props: BroadbandWaterfallProps) {
    super(props);
    this.canvas = React.createRef();
  }

  canvas: React.RefObject<HTMLCanvasElement>;

  componentDidMount() {
    initCanvas(
      this.props.source,
      this.props.displaySettings,
      this.canvas.current
    );
  }

  render() {
    return <canvas ref={this.canvas} />;
  }
}

export default BroadbandWaterfall;
