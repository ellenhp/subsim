import React from "react";
import { ElemSingleton } from "./elemSingleton";

interface ElemSingletonMountProps {
  elem: ElemSingleton<HTMLElement>;
  className: string;
}

export default class ElemSingletonMount extends React.Component<
  ElemSingletonMountProps
> {
  constructor(props) {
    super(props);
    this.elemRef = React.createRef();
  }

  elemRef: React.RefObject<HTMLDivElement>;

  componentDidMount() {
    const bounds = this.elemRef.current.getBoundingClientRect();
    this.props.elem.show(bounds);
  }

  componentWillUnmount() {
    this.props.elem.hide();
  }

  render() {
    return <div className={this.props.className} ref={this.elemRef}></div>;
  }
}
