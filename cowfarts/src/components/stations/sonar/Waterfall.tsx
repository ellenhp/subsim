import React from "react";
import getNarrowbandedWaterfall from "./sonarSceens/narrowbandWaterfall";

export default class Waterfall extends React.Component {
  constructor(props) {
    super(props);
    this.posElement = React.createRef();
  }

  posElement: React.RefObject<HTMLElement>;

  componentDidMount() {
    const { top, left } = this.posElement.current.getBoundingClientRect();
    console.log(top, left);
    getNarrowbandedWaterfall().show({ top, left });
  }

  componentWillUnmount() {
    getNarrowbandedWaterfall().hide();
  }

  render() {
    return <div className="waterfall-pos" ref={this.posElement}></div>;
  }
}
