"use strict";

var util = require("util"),
    createRepl = require("repl").start,
    EventEmitter = require("events").EventEmitter;

var _ = require("./utils/helpers");

// asserts that a constructor was called with 'new'
function classCallCheck(instance, constructor) {
  if (!instance instanceof constructor) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Repl = module.exports = function Repl(opts, context) {
  classCallCheck(this, Repl);

  opts = opts || {};
  context = context || {};

  opts.prompt = opts.prompt || "repl > ";
  opts.stdin = opts.stdin || process.stdin;
  opts.stdout = opts.stdout || process.stdout;

  this.repl = null;
  this.options = opts;
  this.context = context;
};

Repl.active = false;

util.inherits(Repl, EventEmitter);

Repl.prototype.start = function() {
  // don't try to start two repls at once
  if (Repl.active) {
    return false;
  }

  Repl.active = true;

  this.repl = createRepl(this.options);
  _.extend(this.repl.context, this.context);

  this.repl.on("exit", function() {
    Repl.active = false;
    this.emit("exit");
  }.bind(this));

  this.repl.on("reset", function(context) {
    _.extend(context, this.context);
    this.emit("reset");
  }.bind(this));
};

// add a value to the context
Repl.prototype.addContext = function(key, value) {
  this.context[key] = value;
  this.repl.context[key] = value;
};

// remove a value from the context
Repl.prototype.removeContext = function(key) {
  delete this.context[key];
  delete this.repl.context[key];
};

// set the context to the provided object
Repl.prototype.setContext = function(object) {
  _.each(this.context, function(value, key) {
    if (this.context.hasOwnProperty(key)) {
      this.removeContext(key);
    }
  }.bind(this));

  _.each(object, function(value, key) {
    if (object.hasOwnProperty(key)) {
      this.addContext(key, value);
    }
  }.bind(this));
};
