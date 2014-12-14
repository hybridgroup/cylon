/* jshint expr:true */
"use strict";

var logger = source("logger/basic_logger");

var date = new Date(0).toISOString();

describe("BasicLogger", function() {
  var clock;

  beforeEach(function() {
    stub(console, "log");
    clock = sinon.useFakeTimers(0);
  });

  afterEach(function() {
    console.log.restore();
    clock.restore();
  });

  describe("#toString", function() {
    it("returns 'BasicLogger'", function() {
      expect(logger.toString()).to.be.eql("BasicLogger");
    });
  });

  describe("#debug", function() {
    it("logs to the console with a debug string", function() {
      var logstring = "D, [" + date + "] DEBUG -- :";

      logger.debug("Hello, World");
      expect(console.log).to.be.calledWith(logstring, "Hello, World");
    });
  });

  describe("#info", function() {
    it("logs to the console with a info string", function() {
      var logstring = "I, [" + date + "]  INFO -- :";

      logger.info("Hello, World");
      expect(console.log).to.be.calledWith(logstring, "Hello, World");
    });
  });

  describe("#warn", function() {
    it("logs to the console with a warn string", function() {
      var logstring = "W, [" + date + "]  WARN -- :";

      logger.warn("Hello, World");
      expect(console.log).to.be.calledWith(logstring, "Hello, World");
    });
  });

  describe("#error", function() {
    it("logs to the console with a error string", function() {
      var logstring = "E, [" + date + "] ERROR -- :";

      logger.error("Hello, World");
      expect(console.log).to.be.calledWith(logstring, "Hello, World");
    });
  });

  describe("#fatal", function() {
    it("logs to the console with a fatal string", function() {
      var logstring = "F, [" + date + "] FATAL -- :";

      logger.fatal("Hello, World");
      expect(console.log).to.be.calledWith(logstring, "Hello, World");
    });
  });
});
