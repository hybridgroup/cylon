// A collection of useful helper functions, used internally but not exported
// with the rest of Cylon. 

// jshint strict:false

var __slice = Array.prototype.slice;

var H = module.exports = {};

function identity(value) {
  return value;
}

function extend(base, source) {
  var isArray = Array.isArray(source);

  if (base == null) {
    base = isArray ? [] : {};
  }

  if (isArray) {
    source.forEach(function(e, i) {
      if (typeof base[i] === "undefined") {
        base[i] = e;
      } else if (typeof e === "object") {
        base[i] = extend(base[i], e);
      } else {
        if (!~base.indexOf(e)) {
          base.push(e);
        }
      }
    });
  } else {
    var key;

    for (key in source) {
      if (typeof source[key] !== "object" || !source[key]) {
        base[key] = source[key];
      } else {
        if (base[key]) {
          extend(base[key], source[key]);
        } else {
          base[key] = source[key];
        }
      }
    }
  }

  return base;
}

extend(H, {
  identity: identity,
  extend: extend
});

function kind(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}

function isA(type) {
  return function(thing) {
    return kind(thing) === type;
  };
}

extend(H, {
  isObject:      isA("Object"),
  isObjectLoose: function(thing) { return typeof thing === "object"; },
  isFunction:    isA("Function"),
  isArray:       isA("Array"),
  isString:      isA("String"),
  isNumber:      isA("Number"),
  isArguments:   isA("Arguments"),
  isUndefined:   isA("Undefined")
});

function iterate(thing, fn, thisVal) {
  if (H.isArray(thing)) {
    thing.forEach(fn, thisVal);
    return;
  }

  if (H.isObject(thing)) {
    for (var key in thing) {
      var value = thing[key];
      fn.call(thisVal, value, key);
    }
  }

  return [];
}

function pluck(collection, key) {
  var keys = [];

  iterate(collection, function(object) {
    if (H.isObject(object)) {
      if (H.isFunction(object[key])) {
        keys.push(object[key].bind(object));
      } else {
        keys.push(object[key]);
      }
    }
  });

  return keys;
}

function map(collection, fn, thisVal) {
  var vals = [];

  if (fn == null) {
    fn = identity;
  }

  iterate(collection, function(object, index) {
    vals.push(fn.call(thisVal, object, index));
  });

  return vals;
}

function invoke(collection, fn) {
  var args = __slice.call(arguments, 2),
      vals = [];

  iterate(collection, function(object) {
    if (H.isFunction(fn)) {
      vals.push(fn.apply(object, args));
      return;
    }

    vals.push(object[fn].apply(object, arguments));
  });

  return vals;
}

function reduce(collection, iteratee, accumulator, thisVal) {
  var isArray = H.isArray(collection);

  if (!isArray && !H.isObjectLoose(collection)) {
    return null;
  }

  if (iteratee == null) {
    iteratee = identity;
  }

  if (accumulator == null) {
    if (isArray) {
      accumulator = collection.shift();
    } else {
      for (var key in collection) {
        accumulator = collection[key];
        delete collection[key];
        break;
      }
    }
  }

  iterate(collection, function(object, key) {
    accumulator = iteratee.call(thisVal, accumulator, object, key);
  });

  return accumulator;
}

extend(H, {
  pluck: pluck,
  each: iterate,
  map: map,
  invoke: invoke,
  reduce: reduce
});

function arity(fn, n) {
  return function() {
    var args = __slice.call(arguments, 0, n);
    return fn.apply(null, args);
  };
}

function partial(fn) {
  var args = __slice.call(arguments, 1);

  return function() {
    return fn.apply(null, args.concat(__slice.call(arguments)));
  };
}

function partialRight(fn) {
  var args = __slice.call(arguments, 1);

  return function() {
    return fn.apply(null, __slice.call(arguments).concat(args));
  };
}

extend(H, {
  arity: arity,
  partial: partial,
  partialRight: partialRight
});

function debounce(fn, delay, immediate) {
  var timeout, timestamp, context, args, value;

  var now = Date.now;

  if (delay == null) {
    delay = 100;
  }

  immediate = !!immediate;

  function later() {
    var last = now() - timestamp;

    if (last > 0 && last < delay) {
      timeout = setTimeout(later, delay - last);
      return;
    }

    timeout = null;

    if (!immediate) {
      value = fn.apply(context, args);

      if (!timeout) {
        context = args = null;
      }
    }
  }

  function cancel() {
    timeout = null;
  }

  function debounced() {
    var shouldCallNow = !timeout && immediate;

    context = this;
    args = arguments;
    timestamp = now();

    if (!timeout) {
      timeout = setTimeout(later, delay);
    }

    if (shouldCallNow) {
      value = fn.apply(context, args);
      context = args = null;
    }

    return value;
  }

  debounced.cancel = cancel;

  return debounced;
}

extend(H, {
  debounce: debounce
});
