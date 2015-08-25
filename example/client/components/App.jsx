/* @flow */

import React, { Component, PropTypes } from 'react';
import TodoList from './TodoList';
import { createSmartComponent } from '../../../src';

class App extends Component {
  static propTypes = {
    todos: PropTypes.object.isRequired,
  }

  static defaultProps = {
    todos: [],
  }

  render() {
    return (
      <TodoList todos={this.props.todos} />
    );
  }
}

export default createSmartComponent(App, {
  endpoint: '/graphql',
  query: () => `
    query QueryNameHere {
      ${TodoList.getFragment('viewer')}
    }
  `,
});
