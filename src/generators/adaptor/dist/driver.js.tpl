/*
 * <%= adaptorName %> driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 Your Name Here
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('./<%= adaptorName %>');

  require('./adaptor');

  namespace = require('node-namespace');

  namespace("Cylon.Drivers", function() {
    var _ref;
    return this.<%= adaptorClassName %> = (function(_super) {
      __extends(<%= adaptorClassName %>, _super);

      function <%= adaptorClassName %>() {
        _ref = <%= adaptorClassName %>.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      <%= adaptorClassName %>.prototype.start = function(callback) {
        return <%= adaptorClassName %>.__super__.start.apply(this, arguments);
      };

      return <%= adaptorClassName %>;

    })(Cylon.Driver);
  });

}).call(this);
