import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

const mount = () => {
  ReactDOM.render(<App />, document.getElementById("mount"));
};

export default mount;
