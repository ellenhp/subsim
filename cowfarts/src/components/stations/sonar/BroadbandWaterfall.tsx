import React from "react";
import { Pipe } from "../../../util/pipe";
import {
  H_RES,
  V_RES,
  BroadbandScreen,
} from "../../../engines/sonarEngine/waterfalls/buildWaterfalls";
import "./BroadbandWaterfall.css";

interface BroadbandWaterfallProps {
  screen: BroadbandScreen;
}

interface TimeAndBearing {
  timeAgoSeconds: number;
  bearing: number;
}

const toTimeAndBearing = (
  mousePos: { x: number; y: number },
  screen: BroadbandScreen
): TimeAndBearing => {
  return {
    timeAgoSeconds: mousePos.y * screen.timeScopeInSeconds,
    bearing: (mousePos.x * 360 + screen.leftBearing) % 360,
  };
};

const formatSecondsAgo = (secondsAgo: number) => {
  if (secondsAgo < 60) {
    return `${secondsAgo.toFixed(1)}s ago`;
  }
  return `${(secondsAgo / 60).toFixed(1)}m ago`;
};

const TimeAndBearingIndicator = ({
  timeAndBearing: { timeAgoSeconds, bearing },
}: {
  timeAndBearing: TimeAndBearing;
}) => (
  <div className="time-and-bearing-indicator">
    <div className="tiny-bearing-indicator">
      <div className="tiny-bearing-text">{bearing.toFixed(1)}°</div>
      <div
        className="tiny-bearing-pointer"
        style={{
          transform: `translate(0, -50%) rotate(${
            Math.round(bearing) + 270
          }deg)`,
        }}
      >
        ➤
      </div>
    </div>
    <div>{formatSecondsAgo(timeAgoSeconds)}</div>
  </div>
);

class BroadbandWaterfall extends React.Component<BroadbandWaterfallProps> {
  constructor(props: BroadbandWaterfallProps) {
    super(props);
    this.canvas = React.createRef();
    this.state = {};
  }

  state: {
    mousePos?: {
      x: number; // 0 - 1
      y: number; // 0 - 1
    };
  };

  canvas: React.RefObject<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;

  handlePipeMessage = (imageData: ImageData) => {
    this.ctx.putImageData(imageData, 0, 0);
  };

  componentDidMount = () => {
    this.ctx = this.canvas.current.getContext("2d");
    this.props.screen.data.listen(this.handlePipeMessage);
  };

  componentWillUnmount = () => {
    this.props.screen.data.unlisten(this.handlePipeMessage);
  };

  handleMouseEnterOrMove = (event: React.MouseEvent) => {
    const {
      top,
      left,
      bottom,
      right,
    } = this.canvas.current.getBoundingClientRect();
    this.setState({
      mousePos: {
        x: (event.clientX - left) / (right - left),
        y: (event.clientY - top) / (bottom - top),
      },
    });
  };

  handleMouseExit = () => {
    this.setState({
      mousePos: undefined,
    });
  };

  render() {
    return (
      <div
        className="broadband-waterfall-wrapper"
        onMouseOver={this.handleMouseEnterOrMove}
        onMouseMove={this.handleMouseEnterOrMove}
        onMouseOut={this.handleMouseExit}
      >
        <canvas
          className="broadband-waterfall"
          ref={this.canvas}
          height={V_RES}
          width={H_RES}
        />
        {this.state.mousePos && (
          <TimeAndBearingIndicator
            timeAndBearing={toTimeAndBearing(
              this.state.mousePos,
              this.props.screen
            )}
          />
        )}
      </div>
    );
  }
}

export default BroadbandWaterfall;
