/*
 * port
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  namespace('Cylon', function() {
    return this.Port = (function() {
      function Port(data) {
        this.self = this;
        this.isTcp = this.isSerial = this.isPortless = false;
        this.parse(data);
      }

      Port.prototype.parse = function(data) {
        var match;
        if (data === void 0) {
          this.port = void 0;
          return this.isPortless = true;
        } else if (match = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/.exec(data)) {
          this.port = match[2];
          this.host = match[1];
          return this.isTcp = true;
        } else if (/^[0-9]{1,5}$/.exec(data)) {
          this.port = data;
          this.host = "localhost";
          return this.isTcp = true;
        } else {
          this.port = data;
          this.host = void 0;
          return this.isSerial = true;
        }
      };

      Port.prototype.toString = function() {
        if (this.isPortless) {
          return "none";
        } else if (this.isSerial) {
          return this.port;
        } else {
          return "" + this.host + ":" + this.port;
        }
      };

      return Port;

    })();
  });

  module.exports = Cylon.Port;

}).call(this);
