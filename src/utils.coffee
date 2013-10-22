###
 * utils
 * cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

# Public: Alias to setInterval, combined with Number monkeypatches below to
# create an artoo-like syntax.
#
# interval - interval to run action on
# action - action to perform at interval
#
# Returns an interval
# Examples:
#   every(10.seconds(), -> console.log("hello world (and again in 5 seconds)!"))
global.every = (interval, action) ->
  setInterval action, interval

# Public: Alias to setTimeout, combined with Number monkeypatches below to
# create an artoo-like syntax.
#
# interval - interval to run action on
# action - action to perform at interval
#
# Returns an interval
# Examples:
#   after(10.seconds(), -> console.log("hello world from ten seconds ago!"))
global.after = (delay, action) ->
  setTimeout action, delay

Number::seconds = ->
  this * 1000

Number::second = ->
  @seconds(this)
