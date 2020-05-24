import React from "react";
import { Pipe } from "../../../util/pipe";
import {
  H_RES,
  V_RES,
  BroadbandScreen,
} from "../../../engines/sonarEngine/waterfalls/broadbandWaterfalls";
import "./BroadbandWaterfall.css";
import { GameConnection } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";
import { getBearingsForContact } from "../../../gettorz";
import { takeBearingForContact } from "../../../gameActions";

interface BroadbandWaterfallProps {
  screen: BroadbandScreen;
  game: GameConnection;
  latestUpdate: VesselUpdate.AsObject;
  contact?: string;
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

  handleClick = (event: React.MouseEvent) => {
    const {
      top,
      left,
      bottom,
      right,
    } = this.canvas.current.getBoundingClientRect();
    const timeAndBearing = toTimeAndBearing(
      {
        x: (event.clientX - left) / (right - left),
        y: (event.clientY - top) / (bottom - top),
      },
      this.props.screen
    );
    takeBearingForContact(
      this.props.game,
      timeAndBearing.bearing,
      Date.now() - timeAndBearing.timeAgoSeconds * 1000,
      this.props.contact
    );
  };

  render() {
    const contact = this.props.contact;
    let takenBearings: any[] = [];
    if (this.props.contact) {
      const bearings = getBearingsForContact(this.props.latestUpdate, contact);
      takenBearings = bearings.map((bearing) => {
        const left =
          (((bearing.bearingDegrees + this.props.screen.leftBearing) % 360) *
            100) /
          360;
        const style = {
          left: left + "%",
          top:
            ((Date.now() - bearing.epochMillis) * 100) /
              (1000 * this.props.screen.timeScopeInSeconds) +
            "%",
        };
        return (
          <div className="taken-bearing" style={style}>
            {contact}
          </div>
        );
      });
    }

    return (
      <div
        className="broadband-waterfall-wrapper"
        onMouseOver={this.handleMouseEnterOrMove}
        onMouseMove={this.handleMouseEnterOrMove}
        onMouseOut={this.handleMouseExit}
        onClick={contact && this.handleClick}
      >
        <canvas
          className="broadband-waterfall"
          ref={this.canvas}
          height={V_RES}
          width={H_RES}
        />
        {takenBearings}
        {this.state.mousePos && (
          <TimeAndBearingIndicator
            timeAndBearing={toTimeAndBearing(
              this.state.mousePos,
              this.props.screen
            )}
          />
        )}
        {this.props.contact && (
          <div className="broadband-contact-info">
            Showing bearings for {this.props.contact}. <br /> Click to take
            bearing.
          </div>
        )}
      </div>
    );
  }
}

export default BroadbandWaterfall;
