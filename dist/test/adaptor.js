/*
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var Adaptor;

  module.exports = Adaptor = (function() {
    function Adaptor(opts) {
      this.name = opts.name;
    }

    Adaptor.prototype.commands = function() {
      return ['smile', 'laugh', 'help'];
    };

    return Adaptor;

  })();

}).call(this);
