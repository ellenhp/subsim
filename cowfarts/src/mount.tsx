import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

const mount = () => {
  ReactDOM.render(<App>Hi from React!!</App>, document.getElementById("mount"));
};

export default mount;
