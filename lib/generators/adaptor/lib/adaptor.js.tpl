/*
 * <%= adaptorName %> adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 Your Name Here
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var namespace = require('node-namespace');

require('./<%= adaptorName %>');
require('./driver');

namespace('Cylon.Adaptors', function() {
  this.<%= adaptorClassName %> = (function(klass) {
    subclass(<%= adaptorClassName %>, klass);

    function <%= adaptorClassName %>(opts) {
      if (opts == null) { opts = {}; }
      <%= adaptorClassName %>.__super__.constructor.apply(this, arguments);
    }

    <%= adaptorClassName %>.prototype.connect = function(callback) {
      return <%= adaptorClassName %>.__super__.connect.apply(this, arguments);
    };

    return <%= adaptorClassName %>;

  })(Cylon.Adaptor);
});

module.exports = Cylon.Adaptors.<%= adaptorClassName %>;
