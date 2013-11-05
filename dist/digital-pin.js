/*
 * Linux IO DigitalPin
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var FS, namespace;

  FS = require('fs');

  namespace = require('node-namespace');

  namespace('Cylon.IO', function() {
    return this.DigitalPin = (function() {
      var GPIO_DIRECTION_READ, GPIO_DIRECTION_WRITE, GPIO_PATH, HIGH, LOW;

      GPIO_PATH = "/sys/class/gpio";

      GPIO_DIRECTION_READ = "in";

      GPIO_DIRECTION_WRITE = "out";

      HIGH = 1;

      LOW = 0;

      function DigitalPin(opts) {
        this.self = this;
        this.pinNum = opts.pin;
        this.status = 0;
        FS.writeFile("" + GPIO_PATH + "/export", "" + this.pinNum);
        this._setMode(opts.mode);
      }

      DigitalPin.prototype.digitalWrite = function(value) {
        var status;
        if (this.mode !== 'w') {
          this._setMode('w');
        }
        return status = value === 1 ? 'high' : 'low';
      };

      DigitalPin.prototype._setMode = function(mode) {
        this.mode = mode;
        if (this.mode === 'w') {
          return FS.open("" + GPIO_PATH + "/gpio" + this.pinNum + "/direction", "w", function(err, fd) {
            if (!err) {
              return FS.write(fd, GPIO_DIRECTION_WRITE);
            } else {
              return console.log("EROR OCCURED: while opening " + GPIO_PATH + "/gpio" + this.pinNum + "/direction");
            }
          });
        } else if (mode === 'r') {
          return FS.open("" + GPIO_PATH + "/gpio" + this.pinNum + "/direction", "w", function(err, fd) {
            if (!err) {
              return FS.write(fd, GPIO_DIRECTION_READ);
            } else {
              return console.log("EROR OCCURED: while opening " + GPIO_PATH + "/gpio" + this.pinNum + "/direction");
            }
          });
        }
      };

      return DigitalPin;

    })();
  });

}).call(this);
