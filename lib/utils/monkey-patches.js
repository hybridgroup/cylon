/* eslint no-extend-native: 0 key-spacing: 0 */

"use strict";

var max = Math.max,
    min = Math.min;

var originals = {
  seconds:   Number.prototype.seconds,
  second:    Number.prototype.second,
  fromScale: Number.prototype.fromScale,
  toScale:   Number.prototype.toScale
};

module.exports.uninstall = function() {
  for (var opt in originals) {
    if (originals[opt] == null) {
      Number.prototype[opt] = originals[opt];
    } else {
      delete Number.prototype[opt];
    }
  }
};

module.exports.install = function() {
  /**
   * Multiplies a number by 1000 to get time in milliseconds
   *
   * @example
   * (2).seconds(); //=> 2000
   * @return {Number} time in milliseconds
   */
  Number.prototype.seconds = function() {
    return this * 1000;
  };

  /**
   * Alias for Number.prototype.seconds
   *
   * @see Number.prototype.seconds
   * @example
   * (1).second(); //=> 1000
   * @return {Number} time in milliseconds
   */
  Number.prototype.second = Number.prototype.seconds;

  /**
   * Converts a number from a current scale to a 0 - 1 scale.
   *
   * @param {Number} start low point of scale to convert from
   * @param {Number} end high point of scale to convert from
   * @example
   * (5).fromScale(0, 10) //=> 0.5
   * @return {Number} the scaled value
   */
  Number.prototype.fromScale = function(start, end) {
    var val = (this - min(start, end)) / (max(start, end) - min(start, end));

    if (val > 1) {
      return 1;
    }

    if (val < 0) {
      return 0;
    }

    return val;
  };

  /**
   * Converts a number from a 0 - 1 scale to the specified scale.
   *
   * @param {Number} start low point of scale to convert to
   * @param {Number} end high point of scale to convert to
   * @example
   * (0.5).toScale(0, 10) //=> 5
   * @return {Number} the scaled value
   */
  Number.prototype.toScale = function(start, end) {
    var i = this * (max(start, end) - min(start, end)) + min(start, end);

    if (i < start) {
      return start;
    }

    if (i > end) {
      return end;
    }

    return i;
  };
};
