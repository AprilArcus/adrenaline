/* @flow */

export function map(obj: Object, predicate: Function): Object {
  let result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = predicate(obj[key], key);
    }
  }
  return result;
}

export function reduce(obj: Object | Array, predicate: Function, initial: any): any {
  if (Array.isArray(obj)) {
    return obj.reduce(predicate, initial);
  }

  let acc = initial;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      acc = predicate(acc, obj[key], key);
    }
  }
  return acc;
}

export function filter(obj: Object, predicate: Function): Object {
  let result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function isString(value) {
  return typeof value === 'string' || value instanceof String;
}
