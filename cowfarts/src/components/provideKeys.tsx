import React from "react";

type ProvidedKeys = {
  heldKeys: number[];
};

type KeysChangeCB<T> = (
  props: T,
  oldKeys: number[],
  newKeys: number[]
) => unknown;

function provideKeys<T>(
  Wrapped: React.ComponentType<T & ProvidedKeys>,
  listenKeys: number[],
  keysChange: KeysChangeCB<T> = () => {}
) {
  return class KeyStateProvider extends React.Component<T> {
    constructor(props: T) {
      super(props);
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("keyup", this.handleKeyUp);
    }

    state: { heldKeys: number[] } = { heldKeys: [] };

    handleKeyDown = ({ keyCode }: KeyboardEvent) => {
      const oldKeys = this.state.heldKeys;
      if (listenKeys.includes(keyCode) && !oldKeys.includes(keyCode)) {
        const newKeys = [...this.state.heldKeys, keyCode];
        keysChange(this.props, oldKeys, newKeys);
        this.setState({ heldKeys: newKeys });
      }
    };

    handleKeyUp = ({ keyCode }: KeyboardEvent) => {
      const oldKeys = this.state.heldKeys;
      if (listenKeys.includes(keyCode) && oldKeys.includes(keyCode)) {
        const newKeys = oldKeys.filter((a) => a !== keyCode);
        keysChange(this.props, oldKeys, newKeys);
        this.setState({ heldKeys: newKeys });
      }
    };

    render() {
      return <Wrapped {...this.props} heldKeys={this.state.heldKeys} />;
    }
  };
}

export default provideKeys;
