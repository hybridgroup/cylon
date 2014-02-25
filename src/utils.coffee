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

# Public: Alias to the `every` function, but passing 0
# Examples
#
#   constantly -> console.log("hello world (and again and again)!")
#
# Returns an interval
global.constantly = (action) ->
  every 0, action

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

global.slice = [].slice

global.hasProp = {}.hasOwnProperty

# Public: Function to use for class inheritance. Copy of a CoffeeScript helper
# function.
#
# Example
#
#   var Sphero = (function(klass) {
#     subclass(Sphero, klass);
#     // Sphero is now a subclass of Parent, and can access it's methods through
#     // Sphero.__super__
#   })(Parent);
#
# Returns subclass
global.subclass = (child, parent) ->
  for key of parent
    child[key] = parent[key] if hasProp.call(parent, key)

  ctor = -> @constructor = child

  ctor.prototype = parent.prototype
  child.prototype = new ctor()
  child.__super__ = parent.prototype
  child

# Public: Function for instantiating a class with all passed arguments to
# a function
#
# Example
#
#  createNewThing = function() {
#    var args = getArgs(arguments);
#    return instantiate(ClassToMake, args, function(){});
#  }
#
# Returns an instance of the new class
global.instantiate = (func, args, ctor) ->
  ctor.prototype = func.prototype
  child = new ctor()
  result = func.apply(child, args)
  (if Object(result) is result then result else child)

# Public: Function for obtaining array of function arguments. Copied from
# a CoffeeScript utility function.
#
# Example
#
#   printArgs = function() {
#     console.log(getArgs(arguments));
#   }
#
#   printArgs();
#   //=> []
#
#   printArgs('hello', 'world', 3);
#   //=> ['hello', 'world', 3]
#
# Returns an array of args
global.getArgs = (args) ->
  if args.length >= 1 then slice.call(args, 0) else []

# Public: Proxies a list of methods from one object to another. It will not
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

# Public: Proxies a list of methods for test stubbing.
#
# methods - array of functions to proxy
# base - (optional) object that proxied functions will be declared on. Defaults
#       to this
#
# Returns base
global.proxyTestStubs = (methods, base = this) ->
  for method in methods
    base[method] = (args...) -> true
    base.commandList.push method

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
