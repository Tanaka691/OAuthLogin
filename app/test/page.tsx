'use client';

import React from 'react';

// propsがない場合は {} を指定
type Props = {};

// stateに count:number を定義
type State = {
  count: number;
};

class Counter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>増やす</button>
      </div>
    );
  }
}

export default Counter;
