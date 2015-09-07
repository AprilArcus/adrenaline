/* @flow */

import { createStore, combineReducers } from 'redux';
import merge from '../utils/merge';
import { UPDATE_CACHE } from '../constants';

export default function createCache(parsedSchema, composedStore = createStore) {
  const reducer = combineReducers(
    Object.keys(parsedSchema).reduce((acc, key) => {
      return {
        ...acc,
        [key]: createReducer(key),
      };
    }, {})
  );
  return composedStore(reducer);
}

function createReducer(key) {
  return (state = {}, action) => {
    const { type, payload, error } = action;

    if (error) {
      return state;
    }

    if (type === UPDATE_CACHE) {
      return merge(state, payload[key] || {});
    }

    return state;
  };
}
