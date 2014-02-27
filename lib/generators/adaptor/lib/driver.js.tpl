/*
 * <%= adaptorName %> driver
 * http://cylonjs.com
 *
 * Copyright (c) 2013-2014 Your Name Here
 * Licensed under the Apache 2.0 license.
*/

"use strict";

require('./<%= adaptorName %>');
require('./adaptor');

var namespace = require('node-namespace');

namespace("Cylon.Drivers", function() {
  this.<%= adaptorClassName %> = (function(klass) {
    subclass(<%= adaptorClassName %>, klass);

    function <%= adaptorClassName %>() {
      <%= adaptorClassName %>.__super__.constructor.apply(this, arguments);
    }

    <%= adaptorClassName %>.prototype.start = function(callback) {
      return <%= adaptorClassName %>.__super__.start.apply(this, arguments);
    };

    return <%= adaptorClassName %>;

  })(Cylon.Driver);
});

module.exports = Cylon.Drivers.<%= adaptorClassName %>;
