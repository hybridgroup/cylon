'use strict';

var EventEmitter = require('events').EventEmitter;

var Driver = source("driver"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Driver", function() {
  var connection, device, driver;

  beforeEach(function() {
    connection = {
      connection: 'connection'
    };

    driver = new Driver({
      name: 'driver',
      connection: connection,
    });
  });

  describe("#constructor", function() {
    it("sets @name to the provided name", function() {
      expect(driver.name).to.be.eql('driver');
    });

    it("sets @connection to the provided connection", function() {
      expect(driver.connection).to.be.eql(connection);
    });

    it("sets @commands to an empty object by default", function() {
      expect(driver.commands).to.be.eql({});
    });

    it("sets @interval to 10ms by default, or the provided value", function() {
      expect(driver.interval).to.be.eql(10);

      driver = new Driver({
        name: 'driver',
        connection: connection,
        interval: 2000,
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
