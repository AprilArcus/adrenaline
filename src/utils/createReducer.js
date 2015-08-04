/* @flow */

import { mapValues, reduce } from 'lodash';
import mergeDeep from 'deepmerge';
import { ACTION_TYPE } from '../constants';

export default function createReducer() {
  return (state = {}, action) => {
    const { type, payload } = action;

    const keyedPayload = mapValues(payload, value => {
      return reduce(value, (acc, v) => {
        return {
          ...acc,
          [v._id]: v,
        };
      }, {});
    });

    switch (type) {
      case ACTION_TYPE:
        return mergeDeep(state, keyedPayload);
      default:
        return state;
    }
  };
}
