/* jshint expr:true */
"use strict";

var Driver = source("driver");

describe("Driver", function() {
  var connection, driver;

  beforeEach(function() {
    connection = {
      connection: "connection"
    };

    driver = new Driver({
      name: "driver",
      connection: connection,
    });
  });

  describe("#constructor", function() {
    it("sets @name to the provided name", function() {
      expect(driver.name).to.be.eql("driver");
    });

    it("sets @connection to the provided connection", function() {
      expect(driver.connection).to.be.eql(connection);
    });

    it("sets @commands to an empty object by default", function() {
      expect(driver.commands).to.be.eql({});
    });

    it("sets @events to an empty array by default", function() {
      expect(driver.events).to.be.eql([]);
    });

    it("sets @interval to 10ms by default, or the provided value", function() {
      expect(driver.interval).to.be.eql(10);

      driver = new Driver({
        name: "driver",
        connection: connection,
        interval: 2000,
      });

      expect(driver.interval).to.be.eql(2000);
    });
  });

  describe("#toJSON", function() {
    var driver, json;

    beforeEach(function() {
      driver = new Driver({
        connection: { name: "conn" },
        name: "name",
        port: "3000"
      });

      json = driver.toJSON();
    });

    it("returns an object", function() {
      expect(json).to.be.a("object");
    });

    it("contains the driver's name", function() {
      expect(json.name).to.eql("name");
    });

    it("contains the driver's constructor name", function() {
      expect(json.driver).to.eql("Driver");
    });

    it("contains the driver's connection name", function() {
      expect(json.connection).to.eql("conn");
    });

    it("contains the driver's commands", function() {
      expect(json.commands).to.eql(Object.keys(driver.commands));
    });

    it("contains the driver's events, or an empty array", function() {
      expect(json.events).to.eql([]);
      driver.events = ["hello", "world"];
      expect(driver.toJSON().events).to.be.eql(["hello", "world"]);
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
