import React from "react";
import {
  broadbandShort,
  broadbandMedium,
  broadbandLong,
} from "./sonarSceens/narrowbandWaterfall";
import "./Waterfall.css";

export default class Waterfall extends React.Component {
  constructor(props) {
    super(props);
    this.shortElem = React.createRef();
    this.mediumElem = React.createRef();
    this.longElem = React.createRef();
  }

  shortElem: React.RefObject<HTMLDivElement>;
  mediumElem: React.RefObject<HTMLDivElement>;
  longElem: React.RefObject<HTMLDivElement>;

  componentDidMount() {
    const shortBounds = this.shortElem.current.getBoundingClientRect();
    broadbandShort.show(shortBounds);

    const mediumBounds = this.mediumElem.current.getBoundingClientRect();
    broadbandMedium.show(mediumBounds);

    const longBounds = this.longElem.current.getBoundingClientRect();
    broadbandLong.show(longBounds);
  }

  componentWillUnmount() {
    broadbandShort.hide();
    broadbandMedium.hide();
    broadbandLong.hide();
  }

  render() {
    return (
      <div className="waterfalls">
        <div className="waterfall-pos" ref={this.shortElem}></div>
        <div className="waterfall-pos" ref={this.mediumElem}></div>
        <div className="waterfall-pos" ref={this.longElem}></div>
      </div>
    );
  }
}
