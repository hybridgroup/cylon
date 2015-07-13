"use strict";

var Logger = lib("logger"),
    Config = lib("config");

describe("Logger", function() {
  afterEach(function() {
    // to be friendly to other specs
    Config.logger = false;
    Logger.setup();
  });

  describe("#setup", function() {
    context("with no arguments", function() {
      it("sets up a BasicLogger", function() {
        Config.logger = null;
        Logger.setup();
        expect(Logger.logger.name).to.be.eql("basiclogger");
      });
    });

    context("with false", function() {
      it("sets up a NullLogger", function() {
        Config.logger = false;
        Logger.setup();
        expect(Logger.logger.name).to.be.eql("nulllogger");
      });
    });

    context("with a custom logger", function() {
      it("uses the custom logger", function() {
        function customlogger() {}
        Config.logger = customlogger;
        Logger.setup();
        expect(Logger.logger.name).to.be.eql("customlogger");
      });
    });
  });

  describe("proxies", function() {
    var logger;

    beforeEach(function() {
      logger = spy();
      Logger.logger = logger;
    });

    describe("#debug", function() {
      it("proxies to the logger method", function() {
        Logger.should.debug = true;
        Logger.debug("debug message");
        Logger.should.debug = false;
        expect(logger).to.be.calledWith("debug message");
      });
    });

    describe("#log", function() {
      it("proxies to the logger method", function() {
        Logger.log("log message");
        expect(logger).to.be.calledWith("log message");
      });
    });
  });

  it("automatically updates if configuration changed", function() {
    var custom = spy();
    expect(Logger.logger.name).to.be.eql("basiclogger");
    Config.update({ logger: custom });
    expect(Logger.logger).to.be.eql(custom);
  });
});
