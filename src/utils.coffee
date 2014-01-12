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
#   every 5.seconds(), -> console.log("hello world (and again in 5 seconds)!")
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
#   after 10.seconds(), -> console.log("hello world from ten seconds ago!")
global.after = (delay, action) ->
  setTimeout action, delay

# Public: Proxies a list of methods from one oject to another. It will not
# overwrite existing methods unless told to.
#
# methods - array of functions to proxy
# target - object to proxy the functions to
# base - (optional) object that proxied functions will be declared on. Defaults
# to this
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
# Returns an integer representing time in milliseconds
# Examples:
#   # Thanks to Javascript's parser, this will generate a syntax error
#
#   2.seconds()
#   #=> SyntaxError: Unexpected token ILLEGAL
#
#   # So instead, use something like the following:
#
#   10..seconds()
#   #=> 10000
#
#   (5).seconds()
#   #=> 5000
Number::seconds = ->
  this * 1000

# Public: Alias for Number::seconds, see comments for that method
#
# Returns an integer representing time in milliseconds
# Examples:
#   1.second()
#   #=> 1000
Number::second = ->
  @seconds(this)

# Public: Convert value from old scale (start, end) to (0..1) scale
#
# Returns an integer representing the scaled value
Number::fromScale = (start, end) ->
  (this - Math.min(start, end)) / (Math.max(start, end) - Math.min(start, end))

# Public: Convert value from (0..1) scale to new (start, end) scale
#
# Returns an integer representing the scaled value
Number::toScale = (start, end) ->
  Math.ceil(this * (Math.max(start, end) - Math.min(start, end)) + Math.min(start, end))
