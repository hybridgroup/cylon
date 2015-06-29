/* eslint no-sync: 0 */

"use strict";

var FS = require("fs"),
    EventEmitter = require("events").EventEmitter;

var Utils = require("../utils");

var GPIO_PATH = "/sys/class/gpio";

var GPIO_READ = "in";
var GPIO_WRITE = "out";

/**
 * The DigitalPin class provides an interface with the Linux GPIO system present
 * in single-board computers such as Raspberry Pi, or Beaglebone Black.
 *
 * @constructor DigitalPin
 * @param {Object} opts digital pin options
 * @param {String} pin which pin number to use
 * @param {String} mode which pin mode to use
 */
var DigitalPin = module.exports = function DigitalPin(opts) {
  this.pinNum = opts.pin.toString();
  this.status = "low";
  this.ready = false;
  this.mode = opts.mode;
};

Utils.subclass(DigitalPin, EventEmitter);

DigitalPin.prototype.connect = function(mode) {
  if (this.mode == null) {
    this.mode = mode;
  }

  FS.exists(this._pinPath(), function(exists) {
    if (exists) {
      this._openPin();
    } else {
      this._createGPIOPin();
    }
  }.bind(this));
};

DigitalPin.prototype.close = function() {
  FS.writeFile(this._unexportPath(), this.pinNum, function(err) {
    this._closeCallback(err);
  }.bind(this));
};

DigitalPin.prototype.closeSync = function() {
  FS.writeFileSync(this._unexportPath(), this.pinNum);
  this._closeCallback(false);
};

DigitalPin.prototype.digitalWrite = function(value) {
  if (this.mode !== "w") {
    this._setMode("w");
  }

  this.status = value === 1 ? "high" : "low";

  FS.writeFile(this._valuePath(), value, function(err) {
    if (err) {
      var str = "Error occurred while writing value ";
      str += value + " to pin " + this.pinNum;

      this.emit("error", str);
    } else {
      this.emit("digitalWrite", value);
    }
  }.bind(this));

  return value;
};

// Public: Reads the digial pin"s value periodicly on a supplied interval,
// and emits the result or an error
//
// interval - time (in milliseconds) to read from the pin at
//
// Returns the defined interval
DigitalPin.prototype.digitalRead = function(interval) {
  if (this.mode !== "r") { this._setMode("r"); }

  Utils.every(interval, function() {
    FS.readFile(this._valuePath(), function(err, data) {
      if (err) {
        var error = "Error occurred while reading from pin " + this.pinNum;
        this.emit("error", error);
      } else {
        var readData = parseInt(data.toString(), 10);
        this.emit("digitalRead", readData);
      }
    }.bind(this));
  }.bind(this));
};

DigitalPin.prototype.setHigh = function() {
  return this.digitalWrite(1);
};

DigitalPin.prototype.setLow = function() {
  return this.digitalWrite(0);
};

DigitalPin.prototype.toggle = function() {
  return (this.status === "low") ? this.setHigh() : this.setLow();
};

// Creates the GPIO file to read/write from
DigitalPin.prototype._createGPIOPin = function() {
  FS.writeFile(this._exportPath(), this.pinNum, function(err) {
    if (err) {
      this.emit("error", "Error while creating pin files");
    } else {
      this._openPin();
    }
  }.bind(this));
};

DigitalPin.prototype._openPin = function() {
  this._setMode(this.mode, true);
  this.emit("open");
};

DigitalPin.prototype._closeCallback = function(err) {
  if (err) {
    this.emit("error", "Error while closing pin files");
  } else {
    this.emit("close", this.pinNum);
  }
};

// Sets the mode for the pin by writing the values to the pin reference files
DigitalPin.prototype._setMode = function(mode, emitConnect) {
  if (emitConnect == null) { emitConnect = false; }

  this.mode = mode;

  var data = (mode === "w") ? GPIO_WRITE : GPIO_READ;

  FS.writeFile(this._directionPath(), data, function(err) {
    this._setModeCallback(err, emitConnect);
  }.bind(this));
};

DigitalPin.prototype._setModeCallback = function(err, emitConnect) {
  if (err) {
    return this.emit("error", "Setting up pin direction failed");
  }

  this.ready = true;

  if (emitConnect) {
    this.emit("connect", this.mode);
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
