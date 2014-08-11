'use strict';

var EventEmitter = require('events').EventEmitter;

var Driver = source("driver"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Driver", function() {
  var device, driver;

  beforeEach(function() {
    device = {
      connection: {},
      emit: spy()
    };

    driver = new Driver({
      name: 'driver',
      device: device
    });
  });

  describe("#constructor", function() {
    it("sets @name to the provided name", function() {
      expect(driver.name).to.be.eql('driver');
    });

    it("sets @device to the provided device", function() {
      expect(driver.device).to.be.eql(device);
    });

    it("sets @connection to the provided device's connection", function() {
      expect(driver.connection).to.be.eql(device.connection);
    });

    it("sets @commands to an empty object by default", function() {
      expect(driver.commands).to.be.eql({});
    });
  });

  describe("#setupCommands", function() {
    beforeEach(function() {
      driver.proxyMethods = spy();
    });

    it("snake_cases and proxies methods to @commands for the API", function() {
      var commands = ["helloWorld", "otherTestCommand"],
          snake_case = ["hello_world", "other_test_command"];

      commands.forEach(function(cmd) {
        driver[cmd] = spy();
      });

      driver.setupCommands(commands);

      for (var i = 0; i < commands.length; i++) {
        var cmd = commands[i],
            snake = snake_case[i];

        expect(driver.commands[snake]).to.be.eql(driver[cmd]);
      }
    });

    it("handles edge cases", function() {
      var commands = ["HelloWorld", "getPNGStream", "getHSetting"],
          snake_case = ["hello_world", "get_png_stream", "get_h_setting"];

      commands.forEach(function(cmd) {
        driver[cmd] = function() {};
      });

      driver.setupCommands(commands);

      expect(Object.keys(driver.commands)).to.be.eql(snake_case);
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(Logger, 'info');
      driver.start(callback);
    });

    afterEach(function() {
      Logger.info.restore();
    });

    it("logs that it's starting the driver", function() {
      var string = "Driver driver started.";
      expect(Logger.info).to.be.calledWith(string);
    });

    it("triggers the provided callback", function() {
      expect(callback).to.be.called;
    });
  });

  describe("#halt", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      stub(Logger, 'info');
      driver.halt(callback);
    });

    afterEach(function() {
      Logger.info.restore();
    });

    it("logs that it's halting the driver", function() {
      expect(Logger.info).to.be.calledWith("Driver driver halted.")
    });

    it("triggers the callback", function() {
      expect(callback).to.be.called;
    })
  });
});
