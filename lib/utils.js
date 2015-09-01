"use strict";

var _ = require("./utils/helpers");

var monkeyPatches = require("./utils/monkey-patches");

var Utils = module.exports = {
  /**
   * A wrapper around setInterval to provide a more english-like syntax
   * (e.g. "every 5 seconds, do this thing")
   *
   * @param {Number} interval delay between action invocations
   * @param {Function} action function to trigger every time interval elapses
   * @example every((5).seconds(), function() {});
   * @return {intervalID} setInterval ID to pass to clearInterval()
   */
  every: function every(interval, action) {
    return setInterval(action, interval);
  },

  /**
   * A wrapper around setInterval to provide a more english-like syntax
   * (e.g. "after 5 seconds, do this thing")
   *
   * @param {Number} delay how long to wait
   * @param {Function} action action to perform after delay
   * @example after((5).seconds(), function() {});
   * @return {timeoutId} setTimeout ID to pass to clearTimeout()
   */
  after: function after(delay, action) {
    return setTimeout(action, delay);
  },

  /**
   * A wrapper around setInterval, with a delay of 0ms
   *
   * @param {Function} action function to invoke constantly
   * @example constantly(function() {});
   * @return {intervalID} setInterval ID to pass to clearInterval()
   */
  constantly: function constantly(action) {
    return every(0, action);
  },

  /**
   * A wrapper around clearInterval
   *
   * @param {intervalID} intervalID ID of every/after/constantly
   * @example finish(blinking);
   * @return {void}
   */
  finish: function finish(intervalID) {
    clearInterval(intervalID);
  },

  /**
   * Sleeps the program for a period of time.
   *
   * Use of this is not advised, as your program can't do anything else while
   * it's running.
   *
   * @param {Number} ms number of milliseconds to sleep
   * @return {void}
   */
  sleep: function sleep(ms) {
    var start = Date.now(),
        i = 0;

    while (Date.now() < start + ms) {
      i = i.toString();
    }
  },

  /**
   * Utility for providing class inheritance.
   *
   * Based on CoffeeScript's implementation of inheritance.
   *
   * Parent class methods/properites are available on Child.__super__.
   *
   * @param {Function} child the descendent class
   * @param {Function} parent the parent class
   * @return {Function} the child class
   */
  subclass: function subclass(child, parent) {
    var Ctor = function() {
      this.constructor = child;
    };

    for (var key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }

    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
  },

  proxyFunctions: function proxyFunctions(source, target) {
    _.each(source, function(prop, key) {
      if (_.isFunction(prop) && !target[key]) {
        target[key] = prop.bind(source);
      }
    });
  },

  /**
   * Proxies calls from all methods in the source to a target object
   *
   * @param {String[]} methods methods to proxy
   * @param {Object} target object to proxy methods to
   * @param {Object} [base=this] object to proxy methods from
   * @param {Boolean} [force=false] whether to overwrite existing methods
   * @return {Object} the base
   */
  proxyFunctionsToObject: function(methods, target, base, force) {
    if (base == null) {
      base = this;
    }

    force = force || false;

    methods.forEach(function(method) {
      if (_.isFunction(base[method]) && !force) {
        return;
      }

      base[method] = function() {
        return target[method].apply(target, arguments);
      };
    });

    return base;
  },

  classCallCheck: function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  },

  /**
   * Approximation of Ruby's Hash#fetch method for object property lookup
   *
   * @param {Object} obj object to do lookup on
   * @param {String} property property name to attempt to access
   * @param {*} fallback a fallback value if property can't be found. if
   * a function, will be invoked with the string property name.
   * @throws Error if fallback needed but not provided, or fallback fn doesn't
   * return anything
   * @example
   *    fetch({ property: "hello world" }, "property"); //=> "hello world"
   * @example
   *    fetch({}, "notaproperty", "default value"); //=> "default value"
   * @example
   *    var notFound = function(prop) { return prop + " not found!" };
   *    fetch({}, "notaproperty", notFound); //=> "notaproperty not found!"
   * @example
   *    var badFallback = function(prop) { prop + " not found!" };
   *    fetch({}, "notaproperty", badFallback);
   *    // Error: no return value from provided callback function
   * @example
   *    fetch(object, "notaproperty");
   *    // Error: key not found: "notaproperty"
   * @return {*} fetched property, fallback, or fallback function return value
   */
  fetch: function(obj, property, fallback) {
    if (obj.hasOwnProperty(property)) {
      return obj[property];
    }

    if (fallback === void 0) {
      throw new Error("key not found: \"" + property + "\"");
    }

    if (_.isFunction(fallback)) {
      var value = fallback(property);

      if (value === void 0) {
        throw new Error("no return value from provided fallback function");
      }

      return value;
    }

    return fallback;
  },

  /**
   * Given a name, and an array of existing names, returns a unique new name
   *
   * @param {String} name the name that's colliding with existing names
   * @param {String[]} arr array of existing names
   * @example
   *   makeUnique("hello", ["hello", "hello-1", "hello-2"]); //=> "hello3"
   * @return {String} the new name
   */
  makeUnique: function(name, arr) {
    var newName;

    if (!~arr.indexOf(name)) {
      return name;
    }

    for (var n = 1; ; n++) {
      newName = name + "-" + n;
      if (!~arr.indexOf(newName)) {
        return newName;
      }
    }
  },

  /**
   * Adds every/after/constantly to the global namespace, and installs
   * monkey-patches.
   *
   * @return {Object} utils object
   */
  bootstrap: function bootstrap() {
    global.every = this.every;
    global.after = this.after;
    global.constantly = this.constantly;

    monkeyPatches.install();

    return this;
  }
};

Utils.bootstrap();
