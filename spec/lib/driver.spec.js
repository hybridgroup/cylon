'use strict';

var EventEmitter = require('events').EventEmitter;

var Driver = source("driver"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Driver", function() {
  var connection, device, driver;

  beforeEach(function() {
    connection = {
      adaptor: 'adaptor'
    };

    device = {
      connection: connection,
      emit: spy()
    };

    driver = new Driver({
      name: 'driver',
      device: device,
      connection: connection
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

    it("sets @connection to the device's connection adaptor", function() {
      expect(driver.adaptor).to.be.eql(device.connection.adaptor);
    });

    it("sets @commands to an empty object by default", function() {
      expect(driver.commands).to.be.eql({});
    });

    it("sets @interval to 10ms by default, or the provided value", function() {
      expect(driver.interval).to.be.eql(10);

      driver = new Driver({
        name: 'driver',
        device: device,
        interval: 2000,
        connection: { }
      });

      expect(driver.interval).to.be.eql(2000);
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
});
