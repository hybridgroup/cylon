###
 * cylon
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict';

Robot = require("./robot")
require('./utils')

exports.robot = (opts = {}) ->
  opts.master = this
  new Robot(opts)
