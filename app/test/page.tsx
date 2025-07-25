import React from 'react';

type CounterState = { count: number };

class Counter extends React.Component<{}, CounterState> {
  constructor(props: {}) {
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
