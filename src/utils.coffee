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
# Examples
#
#   every 5.seconds(), -> console.log("hello world (and again in 5 seconds)!")
#
# Returns an interval
global.every = (interval, action) ->
  setInterval action, interval

# Public: Alias to setTimeout, combined with Number monkeypatches below to
# create an artoo-like syntax.
#
# interval - interval to run action on
# action - action to perform at interval
#
# Examples
#
#   after 10.seconds(), -> console.log("hello world from ten seconds ago!")
#
# Returns an interval
global.after = (delay, action) ->
  setTimeout action, delay

# Public: Sleep - do nothing for some duration of time.
#
# ms - number of ms to sleep for
#
# Returns a function
# Examples:
#   sleep 1.second()
global.sleep = (ms) ->
  start = Date.now()
  while (Date.now() < start + ms)
    i = 1

# Public: Proxies a list of methods from one oject to another. It will not
# overwrite existing methods unless told to.
#
# methods - array of functions to proxy
# target - object to proxy the functions to
# base - (optional) object that proxied functions will be declared on. Defaults
#       to this
# force - (optional) boolean - whether or not to force method assignment
#
# Returns base
global.proxyFunctionsToObject = (methods, target, base = this, force = false) ->
  for method in methods
    unless force
      continue if typeof base[method] is 'function'
    do (method) ->
      base[method] = (args...) -> target[method](args...)

  base

# Public: Monkey-patches Number to have Rails-like #seconds() function. Warning,
# due to the way the Javascript parser works, applying functions on numbers is
# kind of weird. See examples for details.
#
# Examples
#
#   2.seconds()
#   #=> SyntaxError: Unexpected token ILLEGAL
#
#   10..seconds()
#   #=> 10000
#
#   (5).seconds()
#   #=> 5000
#
# Returns an integer representing time in milliseconds
Number::seconds = ->
  this * 1000

# Public: Alias for Number::seconds, see comments for that method
#
# Examples
#
#   1.second()
#   #=> 1000
#
# Returns an integer representing time in milliseconds
Number::second = ->
  @seconds(this)

# Public: Convert value from old scale (start, end) to (0..1) scale
#
# start - low point of scale to convert value from
# end - high point of scale to convert value from
#
# Examples
#
#   5..fromScale(0, 10)
#   #=> 0.5
#
# Returns an integer representing the scaled value
Number::fromScale = (start, end) ->
  (this - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end))

# Public: Convert value from (0..1) scale to new (start, end) scale
#
# start - low point of scale to convert value to
# end - high point of scale to convert value to
#
# Examples
#
#   0.5.toScale(0, 10)
#   #=> 5
#
# Returns an integer representing the scaled value
Number::toScale = (start, end) ->
  Math.ceil(this * (Math.max(start, end) - Math.min(start, end)) + Math.min(start, end))
