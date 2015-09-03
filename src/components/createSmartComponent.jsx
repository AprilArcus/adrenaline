/* @flow */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import { mapValues, reduce } from 'lodash';
import GraphQLConnector from './GraphQLConnector';
import shadowEqualScalar from '../utils/shadowEqualScalar';
import getDisplayName from '../utils/getDisplayName';

export default function createSmartComponent(DecoratedComponent, specs) {
  const displayName = `SmartComponent(${getDisplayName(DecoratedComponent)})`;

  return class extends Component {
    static displayName = displayName
    static DecoratedComponent = DecoratedComponent

    static contextTypes = {
      Loading: PropTypes.func.isRequired,
      performQuery: PropTypes.func.isRequired,
      performMutation: PropTypes.func.isRequired,
    }

    constructor(props, context) {
      super(props, context);
      this.args = specs.initialArgs(props) || {};

      DecoratedComponent.prototype.setArgs = (nextArgs) => {
        this.args = {
          ...this.args,
          ...nextArgs,
        };
        this.fetch();
      };

      this.mutations = mapValues(specs.mutations, m => {
        return (...args) => this.context.performMutation(m, ...args);
      });

      this.fetch();
    }

    shouldComponentUpdate(nextProps) {
      return !shadowEqualScalar(this.props, nextProps);
    }

    fetch(args = this.args) {
      const { performQuery } = this.context;
      const { query } = specs;

      performQuery(query(args));
    }

    renderComponent(state) {
      invariant(
        DecoratedComponent.propTypes !== undefined,
        'You have to declare propTypes for %s',
        displayName,
      );

      const { propTypes } = DecoratedComponent;
      const requiredPropTypes = reduce(propTypes, (memo, val, key) => {
        if (!val.hasOwnProperty('isRequired')) {
          return [...memo, key];
        }
        return memo;
      }, []);
      const dataLoaded = requiredPropTypes.every(key => {
        if (key === 'mutations') {
          return true;
        }
        return state.hasOwnProperty(key) && state[key] !== null;
      });

      const { Loading } = this.context;
      if (!dataLoaded) {
        return <Loading />;
      }

      return (
        <DecoratedComponent {...this.props} {...state}
          args={this.args}
          mutations={this.mutations} />
      );
    }

    render() {
      return (
        <GraphQLConnector query={specs.query} queryArgs={this.args}>
          {this.renderComponent.bind(this)}
        </GraphQLConnector>
      );
    }
  };
}
