/*
 * cylon-keyboard adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 Your Name Here
 * Licensed under the Apache 2.0 license.
*/


(function() {
  "use strict";
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  require('./cylon-keyboard');

  require('./driver');

  namespace('Cylon.Adaptors', function() {
    return this.Keyboard = (function(_super) {
      __extends(Keyboard, _super);

      function Keyboard(opts) {
        if (opts == null) {
          opts = {};
        }
        Keyboard.__super__.constructor.apply(this, arguments);
      }

      Keyboard.prototype.connect = function(callback) {
        return Keyboard.__super__.connect.apply(this, arguments);
      };

      return Keyboard;

    })(Cylon.Adaptor);
  });

}).call(this);
