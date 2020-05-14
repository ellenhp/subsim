import React from "react";
import { Pipe } from "../../../util/pipe";
import {
  H_RES,
  V_RES,
} from "../../../engines/sonarEngine/waterfalls/buildWaterfalls";

interface BroadbandWaterfallProps {
  imagePipe: Pipe<ImageData>;
}

class BroadbandWaterfall extends React.Component<BroadbandWaterfallProps> {
  constructor(props: BroadbandWaterfallProps) {
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
    this.props.imagePipe.listen(this.handlePipeMessage);
  };

  componentWillUnmount = () => {
    this.props.imagePipe.unlisten(this.handlePipeMessage);
  };

  render() {
    return (
      <canvas
        className="broadband-waterfall"
        ref={this.canvas}
        height={V_RES}
        width={H_RES}
      />
    );
  }
}

export default BroadbandWaterfall;
