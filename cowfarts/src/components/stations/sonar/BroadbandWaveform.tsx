import React from "react";
import { Engines } from "../../../engines/engine";
import "./BroadbandWaveform.css";
interface BroadbandWaveformProps {
  engines: Engines;
}

class BroadbandWaveform extends React.Component<BroadbandWaveformProps> {
  constructor(props: BroadbandWaveformProps) {
    super(props);
    this.canvas = React.createRef();
  }

  canvas: React.RefObject<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;
  horizontalResolution = 100;
  width = 300;
  height = 50;
  leftBearing = 180;
  interval: NodeJS.Timeout;
  contrast = 1;
  gain = 0.05;
  sampleRate = 30; // ms

  componentDidMount = () => {
    this.ctx = this.canvas.current.getContext("2d");
    this.interval = setInterval(() => {
      const waveform = this.getCurrentWaveform();
      const ctx = this.ctx;

      ctx.clearRect(0, 0, this.width, this.height);
      ctx.beginPath(); // Start a new path
      ctx.moveTo(0, this.height);
      for (let i = 0; i < waveform.length; i++) {
        const sample = waveform[i];
        // This should be moved to the sonar engine
        const activation = Math.min(
          Math.pow(sample * 1000, this.contrast) * this.gain,
          1
        );
        ctx.lineTo(
          i * (this.width / this.horizontalResolution),
          (1 - activation) * this.height
        );
      }
      ctx.strokeStyle = "lightgreen";
      ctx.stroke();
    }, this.sampleRate);
  };

  componentWillUnmount = () => {};

  getCurrentWaveform = () => {
    const now = Date.now();
    const waveform = Array(this.horizontalResolution)
      .fill(0)
      .map(
        (_, i) => 180 + (((i * 360) / (this.horizontalResolution - 1)) % 360)
      )
      .map((bearing) =>
        this.props.engines.sonarEngine.broadbandSource.sample(bearing, now)
      );
    return waveform;
  };

  render() {
    return (
      <canvas
        className="broadband-waveform"
        ref={this.canvas}
        width={this.width}
        height={this.height}
      />
    );
  }
}

export default BroadbandWaveform;
