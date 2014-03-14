/*
 * Linux IO DigitalPin
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var FS = require('fs'),
    EventEmitter = require('events').EventEmitter,
    namespace = require('node-namespace');

// DigitalPin class offers an interface with the Linux GPIO system present in
// single-board computers such as a Raspberry Pi, or a BeagleBone
namespace("Cylon.IO", function() {
  this.DigitalPin = (function(klass) {
    subclass(DigitalPin, klass);

    var GPIO_PATH = "/sys/class/gpio";

    var GPIO_READ = "in";
    var GPIO_WRITE = "out";

    var HIGH = 1;
    var LOW = 0;

    function DigitalPin(opts) {
      this.pinNum = opts.pin;
      this.status = 'low';
      this.ready = false;
      this.mode = opts.mode;
    }

    DigitalPin.prototype.connect = function(mode) {
      var self = this;

      if (this.mode == null) { this.mode = mode; }

      FS.exists(this._pinPath(), function(exists) {
        exists ? self._openPin() : self._createGPIOPin();
      });
    };

    DigitalPin.prototype.close = function() {
      var self = this,
          num = this.pinNum.toString();

      FS.writeFile(this._unexportPath(), num, function(err) {
        self._closeCallback(err);
      });
    };

    DigitalPin.prototype.closeSync = function() {
      var num = this.pinNum.toString();

      FS.writeFileSync(this._unexportPath(), num);
      this._closeCallback(false);
    };

    DigitalPin.prototype.digitalWrite = function(value) {
      if (this.mode !== 'w') { this._setMode('w'); }

      var self = this;
      this.status = value === 1 ? 'high' : 'low';

      FS.writeFile(this._valuePath(), value, function(err) {
        if (err) {
          self.emit('error', "Error occurred while writing value " + value + " to pin " + self.pinNum);
        } else {
          self.emit('digitalWrite', value);
        }
      });

      return value;
    };

    // Public: Reads the digial pin's value periodicly on a supplied interval,
    // and emits the result or an error
    //
    // interval - time (in milliseconds) to read from the pin at
    //
    // Returns the defined interval
    DigitalPin.prototype.digitalRead = function(interval) {
      var self = this;

      if (this.mode !== 'r') { this._setMode('r'); }

      every(interval, function() {
        FS.readFile(self._valuePath(), function(err, data) {
          if (err) {
            var error = "Error occurred while reading from pin " + self.pinNum;
            self.emit('error', error);
          } else {
            var readData = parseInt(data.toString());
            self.emit('digitalRead', readData);
          }
        });
      });
    };

    DigitalPin.prototype.setHigh = function() { return this.digitalWrite(1); };
    DigitalPin.prototype.setLow = function() { return this.digitalWrite(0); };

    DigitalPin.prototype.toggle = function() {
      return (this.status === 'low') ? this.setHigh() : this.setLow();
    };

    // Creates the GPIO file to read/write from
    DigitalPin.prototype._createGPIOPin = function() {
      var self = this,
          num = this.pinNum.toString();

      FS.writeFile(this._exportPath(), num, function(err) {
        if (err) {
          self.emit('error', 'Error while creating pin files');
        } else {
          self._openPin();
        }
      });
    };

    DigitalPin.prototype._openPin = function() {
      this._setMode(this.mode, true);
      this.emit('open');
    };

    DigitalPin.prototype._closeCallback = function(err) {
      if (err) {
        this.emit('error', 'Error while closing pin files');
      } else {
        this.emit('close', this.pinNum);
      }
    };

    // Sets the mode for the GPIO pin by writing the correct values to the pin reference files
    DigitalPin.prototype._setMode = function(mode, emitConnect) {
      if (emitConnect == null) { emitConnect = false; }

      this.mode = mode;

      var self = this,
          data = (mode === 'w') ? GPIO_WRITE : GPIO_READ;

      FS.writeFile(this._directionPath(), data, function(err) {
        self._setModeCallback(err, emitConnect);
      });
    };

    DigitalPin.prototype._setModeCallback = function(err, emitConnect) {
      if (err) {
        this.emit('error', "Setting up pin direction failed");
      } else {
        this.ready = true;
        if (emitConnect) { this.emit('connect', this.mode); }
      }
    };

    DigitalPin.prototype._directionPath = function() {
      return this._pinPath() + "/direction";
    };

    DigitalPin.prototype._valuePath = function() {
      return this._pinPath() + "/value";
    };

    DigitalPin.prototype._pinPath = function() {
      return GPIO_PATH + "/gpio" + this.pinNum;
    };

    DigitalPin.prototype._exportPath = function() {
      return GPIO_PATH + "/export";
    };

    DigitalPin.prototype._unexportPath = function() {
      return GPIO_PATH + "/unexport";
    };

    return DigitalPin;

  })(EventEmitter);
});
