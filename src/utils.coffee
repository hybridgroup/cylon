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
# Examples:
#
#   awesomeClass = {
#     sayHello: function() { console.log("Hello World!"); }
#   }
#
#   newClass = {}
#
#   proxyFunctionsToObject(["sayHello"], awesomeClass, newClass);
#   newClass.sayHello();
#   //=> Hello, World!
global.proxyFunctionsToObject = (methods, target, base = this, force = false) ->
  for method in methods
    unless force
      continue if typeof base[method] is 'function'
    base[method] = (args...) -> target[method](args...)

  return base

Number::seconds = ->
  this * 1000

Number::second = ->
  @seconds(this)
