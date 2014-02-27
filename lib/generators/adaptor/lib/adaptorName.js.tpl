/*
 * <%= adaptorName %>
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
*/

"use strict";

require('cylon');
require('./adaptor');
require('./driver');

module.exports = {
  adaptor: function(opts) {
    // Provide a function that's an instance of your adaptor here. For example,
    // the Sphero adaptor creates a new instance of the Sphero adaptor class:
    //
    // new Cylon.Adaptors.Sphero(args...)
    return new Cylon.Adaptors.<%= adaptorClassName %>(opts);
  },

  driver: function(opts) {
    // Provide a function that's an instance of your driver here. For example,
    // the Sphero adaptor creates a new instance of the Sphero driver class:
    //
    // new Cylon.Drivers.Sphero(args...)
    return new Cylon.Drivers.<%= adaptorClassName %>(opts);
  },

  register: function(robot) {
    // Bootstrap your adaptor here. For example, with a Sphero, you would call
    // the registerAdaptor and registerDriver functions as follows:
    //
    // robot.registerAdaptor('cylon-sphero', 'sphero');
    // robot.registerDriver('cylon-sphero', 'sphero');
  }
};
