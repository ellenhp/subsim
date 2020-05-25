import React from "react";
import {
  H_RES,
  V_RES,
  NarrowbandScreen,
} from "../../../engines/sonarEngine/waterfalls/narrowbandWaterfalls";
import "./BroadbandWaterfall.css";
interface NarrowbandWaterfallProps {
  screen: NarrowbandScreen;
  bearing: number;
}

class NarrowbandWaterfall extends React.Component<NarrowbandWaterfallProps> {
  constructor(props: NarrowbandWaterfallProps) {
    super(props);
    this.canvas = React.createRef();
  }

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

  render() {
    return (
      <div className="broadband-waterfall-wrapper">
        <canvas
          className="broadband-waterfall"
          ref={this.canvas}
          height={V_RES}
          width={H_RES}
        />
      </div>
    );
  }
}

export default NarrowbandWaterfall;
