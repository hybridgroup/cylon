###
 * cylon configuration loader
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

namespace = require 'node-namespace'

# Public: Fetches a variable from the environment, returning a provided value if
# it's not set.
#
# variable - variable to fetch from the environment
# defaultValue - value to return if the ENV variable isn't set
#
# Examples
#
#   process.env["CYLON_TEST"] #=> undefined
#   fetch("CYLON_TEST", "not set")
#   #=> "not set"
#
#   process.env["CYLON_TEST"] #=> false
#   fetch("CYLON_TEST", true)
#   #=> false
#
#   process.env["CYLON_TEST"] #=> true
#   fetch("CYLON_TEST", false)
#   #=> true
#
# Returns the env var or default value
fetch = (variable, defaultValue = false) ->
  if process.env[variable]? then process.env[variable] else defaultValue

namespace 'CylonConfig', ->
  @testing_mode = fetch("CYLON_TEST", false)

module.exports = CylonConfig
