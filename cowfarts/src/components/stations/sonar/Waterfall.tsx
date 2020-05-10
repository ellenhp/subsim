import React from "react";
import getNarrowbandedWaterfall from "./sonarSceens/narrowbandWaterfall";
import "./Waterfall.css";

export default class Waterfall extends React.Component {
  constructor(props) {
    super(props);
    this.posElement = React.createRef();
  }

  posElement: React.RefObject<HTMLElement>;

  componentDidMount() {
    const bounds = this.posElement.current.getBoundingClientRect();
    getNarrowbandedWaterfall().show(bounds);
  }

  componentWillUnmount() {
    getNarrowbandedWaterfall().hide();
  }

  render() {
    return <div className="waterfall-pos" ref={this.posElement}></div>;
  }
}
