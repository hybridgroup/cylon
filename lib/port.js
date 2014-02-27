/*
 * port
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var namespace = require('node-namespace');

// The Port class represents a port and/or host to be used to connect to
// a specific hardware device
namespace("Cylon", function() {
  return this.Port = (function() {
    // Public: Creates a new Port based on a passed String representation
    //
    // data - string representation of the Port
    //
    // Returns a new Port
    function Port(data) {
      this.self = this;
      this.isTcp = this.isSerial = this.isPortless = false;
      this.parse(data);
    }

    // Public: Parses the Port's data to determine what kind of port it is
    //
    // data - string representation of the port to parse
    //
    // Returns nothing.
    Port.prototype.parse = function(data) {
      var match;
      if (data === void 0) {
        this.port = void 0;
        return this.isPortless = true;
      // is TCP host/port?
      } else if (match = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/.exec(data)) {
        this.port = match[2];
        this.host = match[1];
        return this.isTcp = true;
      // is it a numeric port for localhost tcp?
      } else if (/^[0-9]{1,5}$/.exec(data)) {
        this.port = data;
        this.host = "localhost";
        return this.isTcp = true;
      // must be a serial port
      } else {
        this.port = data;
        this.host = void 0;
        return this.isSerial = true;
      }
    };

    // Public: Returns a string representation of the port that can be used to
    // connect to it.
    //
    // Returns a string
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
