/*
 * adaptor
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  require('./basestar');

  namespace('Cylon', function() {
    return this.Adaptor = (function(_super) {
      __extends(Adaptor, _super);

      function Adaptor(opts) {
        if (opts == null) {
          opts = {};
        }
        this.self = this;
        this.name = opts.name;
        this.connection = opts.connection;
      }

      Adaptor.prototype.commands = function() {
        return [];
      };

      Adaptor.prototype.connect = function(callback) {
        Logger.info("Connecting to adaptor '" + this.name + "'...");
        callback(null);
        return this.connection.emit('connect');
      };

      Adaptor.prototype.disconnect = function() {
        return Logger.info("Disconnecting from adaptor '" + this.name + "'...");
      };

      return Adaptor;

    })(Cylon.Basestar);
  });

}).call(this);
