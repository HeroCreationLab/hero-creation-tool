/**
 * Update a source object by replacing its keys and values with those from a target object.
 *
 * @param {object} original       The initial object which should be updated with values from the target
 * @param {object} [other={}]     A new object whose values should replace those in the source
 * @param {object} [options={}]   Additional options which configure the merge
 * @param {boolean} [options.insertKeys=true]     Control whether to insert new top-level objects into the resulting structure which do not previously exist in the original object.
 * @param {boolean} [options.insertValues=true]   Control whether to insert new nested values into child objects in the resulting structure which did not previously exist in the original object.
 * @param {boolean} [options.overwrite=true]      Control whether to replace existing values in the source, or only merge values which do not already exist in the original object.
 * @param {boolean} [options.recursive=true]      Control whether to merge inner-objects recursively (if true), or whether to simply replace inner objects with a provided new value.
 * @param {boolean} [options.inplace=true]        Control whether to apply updates to the original object in-place (if true), otherwise the original object is duplicated and the copy is merged.
 * @param {boolean} [options.enforceTypes=false]  Control whether strict type checking requires that the value of a key in the other object must match the data type in the original data to be merged.
 * @param {number} [_d=0]         A privately used parameter to track recursion depth.
 * @returns {object}              The original source object including updated, inserted, or overwritten records.
 *
 * @example <caption>Control how new keys and values are added</caption>
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: false}); // {k1: "v1"}
 * mergeObject({k1: "v1"}, {k2: "v2"}, {insertKeys: true});  // {k1: "v1", k2: "v2"}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: false}); // {k1: {i1: "v1"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {insertValues: true}); // {k1: {i1: "v1", i2: "v2"}}
 *
 * @example <caption>Control how existing data is overwritten</caption>
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: true}); // {k1: "v2"}
 * mergeObject({k1: "v1"}, {k1: "v2"}, {overwrite: false}); // {k1: "v1"}
 *
 * @example <caption>Control whether merges are performed recursively</caption>
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: false}); // {k1: {i1: "v2"}}
 * mergeObject({k1: {i1: "v1"}}, {k1: {i2: "v2"}}, {recursive: true}); // {k1: {i1: "v1", i2: "v2"}}
 *
 * @example <caption>Deleting an existing object key</caption>
 * mergeObject({k1: "v1", k2: "v2"}, {"-=k1": null});   // {k2: "v2"}
 */

module.exports = function mergeObject(
  original,
  other = {},
  {
    insertKeys = true,
    insertValues = true,
    overwrite = true,
    recursive = true,
    inplace = true,
    enforceTypes = false,
  } = {},
  _d = 0,
) {
  other = other || {};
  if (!(original instanceof Object) || !(other instanceof Object)) {
    throw new Error('One of original or other are not Objects!');
  }
  const options = { insertKeys, insertValues, overwrite, recursive, inplace, enforceTypes };

  // Special handling at depth 0
  if (_d === 0) {
    if (!inplace) original = deepClone(original);
    if (Object.keys(original).some((k) => /\./.test(k))) original = expandObject(original);
    if (Object.keys(other).some((k) => /\./.test(k))) other = expandObject(other);
  }

  // Iterate over the other object
  for (let k of Object.keys(other)) {
    const v = other[k];
    if (original.hasOwnProperty(k)) _mergeUpdate(original, k, v, options, _d + 1);
    else _mergeInsert(original, k, v, options, _d + 1);
  }
  return original;
};

/**
 * Quickly clone a simple piece of data, returning a copy which can be mutated safely.
 * Does not support Set, Map, or other advanced data types.
 * @param {*} original      Some sort of data
 * @return {*}              The clone of that data
 */
function deepClone(original) {
  // Simple types
  if (typeof original !== 'object' || original === null) return original;

  // Arrays
  if (original instanceof Array) {
    return original.map(deepClone);
  }

  // Dates
  if (original instanceof Date) return new Date(original);

  // Other objects
  const clone = {};
  for (let k of Object.keys(original)) {
    clone[k] = deepClone(original[k]);
  }
  return clone;
}

function expandObject(obj, _d = 0) {
  const expanded = {};
  if (_d > 10) {
    throw new Error('Maximum depth exceeded');
  }
  for (let [k, v] of Object.entries(obj)) {
    if (v instanceof Object && !Array.isArray(v)) v = expandObject(v, _d + 1);
    setProperty(expanded, k, v);
  }
  return expanded;
}

function setProperty(object, key, value) {
  let target = object;
  let changed = false;

  // Convert the key to an object reference if it contains dot notation
  if (key.indexOf('.') !== -1) {
    let parts = key.split('.');
    key = parts.pop();
    target = parts.reduce((o, i) => {
      if (!o.hasOwnProperty(i)) o[i] = {};
      return o[i];
    }, object);
  }

  // Update the target
  if (target[key] !== value) {
    changed = true;
    target[key] = value;
  }

  // Return changed status
  return changed;
}

/**
 * A helper function for merging objects when the target key does not exist in the original
 * @private
 */
function _mergeInsert(original, k, v, { insertKeys, insertValues } = {}, _d) {
  // Delete a key
  const isDelete = k.startsWith('-=') && v === null;
  if (isDelete) {
    delete original[k.slice(2)];
    return;
  }

  // Insert a key
  const canInsert = (_d <= 1 && insertKeys) || (_d > 1 && insertValues);
  if (canInsert) original[k] = v;
}

/**
 * A helper function for merging objects when the target key exists in the original
 * @private
 */
function _mergeUpdate(original, k, v, { insertKeys, insertValues, enforceTypes, overwrite, recursive } = {}, _d) {
  const x = original[k];
  const tv = getType(v);
  const tx = getType(x);

  // Recursively merge an inner object
  if (tv === 'Object' && tx === 'Object' && recursive) {
    return mergeObject(
      x,
      v,
      {
        insertKeys: insertKeys,
        insertValues: insertValues,
        overwrite: overwrite,
        inplace: true,
        enforceTypes: enforceTypes,
      },
      _d,
    );
  }

  // Overwrite an existing value
  if (overwrite) {
    if (tx !== 'undefined' && tv !== tx && enforceTypes) {
      throw new Error(`Mismatched data types encountered during object merge.`);
    }
    original[k] = v;
  }
}

function getType(token) {
  const tof = typeof token;
  if (tof === 'object') {
    if (token === null) return 'null';
    let cn = token.constructor.name;
    if (['String', 'Number', 'Boolean', 'Array', 'Set'].includes(cn)) return cn;
    else if (/^HTML/.test(cn)) return 'HTMLElement';
    else return 'Object';
  }
  return tof;
}
