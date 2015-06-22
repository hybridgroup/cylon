"use strict";

var Driver = require("../driver"),
    Utils = require("../utils");

var TestDriver = module.exports = function TestDriver() {
  TestDriver.__super__.constructor.apply(this, arguments);
};

Utils.subclass(TestDriver, Driver);

TestDriver.drivers = ["test"];
TestDriver.driver = function(opts) { return new TestDriver(opts); };
