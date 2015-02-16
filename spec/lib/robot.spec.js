/* jshint expr:true */
"use strict";

var Driver = source("driver"),
    Adaptor = source("adaptor"),
    Robot = source("robot"),
    Logger = source("logger");

describe("Robot", function() {
  var work, extraFunction, robot;

  beforeEach(function() {
    work = spy();
    extraFunction = spy();

    robot = new Robot({
      name: "Robby",
      work: work,

      extraFunction: extraFunction,
      extraValue: "Hello World",

      master: { master: true }
    });
  });

  describe("constructor", function() {
    describe("name", function() {
      context("if provided", function() {
        it("is set to the passed value", function() {
          expect(robot.name).to.be.eql("Robby");
        });
      });

      context("if not provided", function() {
        beforeEach(function() {
          stub(Robot, "randomName").returns("New Robot");
        });

        afterEach(function() {
          Robot.randomName.restore();
        });

        it("is set to a random name", function() {
          var bot = new Robot({});
          expect(bot.name).to.be.eql("New Robot");
        });
      });
    });

    it("sets @master to the passed Master object", function() {
      expect(robot.master).to.be.eql({ master: true });
    });

    it("sets @connections to an empty object by default", function() {
      expect(robot.connections).to.be.eql({});
    });

    it("sets @devices to an empty object by default", function() {
      expect(robot.devices).to.be.eql({});
    });

    it("sets @work to the passed work function", function() {
      expect(robot.work).to.be.eql(work);
    });

    it("sets other obj params as values on the robot", function() {
      expect(robot.extraFunction).to.be.eql(extraFunction);
      expect(robot.extraValue).to.be.eql("Hello World");
    });

    context("if there are devices but no connections", function() {
      it("throws an error", function() {
        var fn = function() {
          return new Robot({
            name: "BrokenBot",
            devices: {
              ping: { driver: "ping" }
            }
          });
        };

        expect(fn).to.throw(Error, "No connections specified");
      });
    });

    context("if no commands are provided", function() {
      var robot;

      beforeEach(function() {
        robot = new Robot({
          name: "NewBot",
          otherThings: { more: "details" },
          sayHello: function() { return "Hello!"; }
        });
      });

      it("sets #commands to the additionally provided functions", function() {
        expect(robot.commands).to.be.eql({ sayHello: robot.sayHello });
      });
    });

    context("if a commands function is provided", function() {
      var robot;

      beforeEach(function() {
        robot = new Robot({
          name: "NewBot",

          sayHello: function() { return this.name + " says hello"; },

          commands: function() {
            return {
              say_hello: this.sayHello
            };
          }
        });
      });

      it("sets #commands to the returned object", function() {
        expect(robot.commands.say_hello).to.be.eql(robot.sayHello);
      });

      context("if the function doesn't return an object", function() {
        var fn;
        beforeEach(function() {
          fn = function() {
            var bot = new Robot({
              name: "NewBot",

              commands: function() {
                return [];
              }
            });

            return bot;
          };
        });

        it("throws an error", function() {
          expect(fn).to.throw(
            Error,
            "#commands must be an object or a function that returns an object"
          );
        });
      });
    });

    context("if a commands object is provided", function() {
      var robot;

      beforeEach(function() {
        robot = new Robot({
          name: "NewBot",

          sayHello: function() { return this.name + " says hello"; },

          commands: {
           say_hello: function() {}
          }
        });
      });

      it("sets #commands to the provided object", function() {
        expect(robot.commands.say_hello).to.be.a("function");
      });
    });

    context("arbitrary arguments", function() {
      beforeEach(function() {
        robot = new Robot({
          name: "NewBot",

          hiThere: "hi there",

          sayHi: function() {
            return "hi";
          },

          start: "start"
        });
      });

      context("if they don't conflict with built-ins", function() {
        it("passes them through", function() {
          expect(robot.hiThere).to.be.eql("hi there");
          expect(robot.sayHi()).to.be.eql("hi");
        });
      });

      context("if they do conflict with built-ins", function() {
        it("doesn't pass them through", function() {
          expect(robot.start).to.be.a("function");
        });
      });
    });
  });

  describe("all work and no play", function() {
    var play = spy();

    var playBot = new Robot({
      play: play
    });

    it("makes Jack a dull boy", function() {
      expect(playBot.work).to.be.eql(play);
    });
  });

  describe("#toJSON", function() {
    var bot = new Robot({
      connections: {
        loopback: { adaptor: "loopback" }
      },

      devices: {
        ping: { driver: "ping" }
      },

      events: ["hello", "world"]
    });

    var json = bot.toJSON();

    it("returns an object", function() {
      expect(json).to.be.a("object");
    });

    it("contains the robot's name", function() {
      expect(json.name).to.eql(bot.name);
    });

    it("contains the robot's commands", function() {
      expect(json.commands).to.eql(Object.keys(bot.commands));
    });

    it("contains the robot's devices", function() {
      expect(json.devices).to.eql([bot.devices.ping.toJSON()]);
    });

    it("contains the robot's connections", function() {
      expect(json.connections).to.eql([bot.connections.loopback.toJSON()]);
    });

    it("contains the robot's events, or an empty array", function() {
      expect(json.events).to.eql(["hello", "world"]);

      var bot = new Robot();
      expect(bot.toJSON().events).to.be.eql([]);
    });
  });

  describe("#connection", function() {
    var opts, bot;

    beforeEach(function() {
      bot = new Robot();
      opts = { adaptor: "loopback" };
    });

    it("creates and adds a new Connection", function() {
      expect(bot.connections.loopback).to.be.eql(undefined);
      bot.connection("loopback", opts);
      expect(bot.connections.loopback).to.be.an.instanceOf(Adaptor);
    });

    it("sets connection.robot on to the Robot initializing it", function() {
      bot.connection("loopback", opts);
      expect(bot.connections.loopback.robot).to.be.eql(bot);
    });

    it("avoids name collisions", function() {
      bot.connection("loopback", opts);
      bot.connection("loopback", opts);

      var conns = Object.keys(bot.connections);

      expect(conns).to.be.eql(["loopback", "loopback-1"]);
    });
  });

  describe("initConnections", function() {
    var bot;

    beforeEach(function() {
      bot = new Robot();
    });

    context("when not passed anything", function() {
      it("does not modify the bot's connections", function() {
        bot.initConnections({});
        expect(bot.connections).to.be.eql({});
      });
    });

    context("when passed an object containing connection details", function() {
      it("creates new connections with each of the ones provided", function() {
        var connections = {
          loopback: { adaptor: "loopback" }
        };

        bot.initConnections({ connections: connections });
        expect(bot.connections.loopback).to.be.instanceOf(Adaptor);
      });

      context("when the object contains device details", function() {
        var opts;

        beforeEach(function() {
          opts = {
            connections: {
              loopback: {
                adaptor: "loopback",
                devices: {
                  ping: { driver: "ping", pin: 1 }
                }
              }
            }
          };

          bot.initConnections(opts);
        });

        it("adds the devices to opts.devices", function() {
          expect(opts.devices).to.be.eql({
            ping: { driver: "ping", pin: 1, connection: "loopback" }
          });
        });

        it("removes the device details from optsconnections", function() {
          expect(opts.connections.devices).to.be.eql(undefined);
        });
      });
    });
  });

  describe("#device", function() {
    var opts, bot;

    beforeEach(function() {
      bot = new Robot();
      opts = { driver: "ping" };
    });

    it("creates and adds a new Device", function() {
      expect(bot.devices.ping).to.be.eql(undefined);
      bot.device("ping", opts);
      expect(bot.devices.ping).to.be.an.instanceOf(Driver);
    });

    it("sets @robot on the Device to be the Robot initializing it", function() {
      bot.device("ping", opts);
      expect(bot.devices.ping.robot).to.be.eql(bot);
    });

    it("avoids name collisions", function() {
      bot.device("ping", opts);
      bot.device("ping", opts);
      expect(Object.keys(bot.devices)).to.be.eql(["ping", "ping-1"]);
    });
  });

  describe("initDevices", function() {
    var bot;

    beforeEach(function() {
      bot = new Robot({
        connections: {
          loopback: { adaptor: "loopback" }
        }
      });
    });

    context("when not passed anything", function() {
      it("does not modify the bot's devices", function() {
        bot.initDevices({});
        expect(bot.devices).to.be.eql({});
      });
    });

    context("when passed an object containing device details", function() {
      it("creates new devices with each of the ones provided", function() {
        var devices = {
          ping: { driver: "ping" }
        };

        bot.initDevices({ devices: devices });
        expect(bot.devices.ping).to.be.instanceOf(Driver);
      });
    });
  });

  describe("#start", function() {
    beforeEach(function() {
      stub(robot, "startConnections").callsArg(0);
      stub(robot, "startDevices").callsArg(0);
      stub(robot, "emit").returns(null);

      robot.start();
    });

    afterEach(function() {
      robot.startConnections.restore();
      robot.startDevices.restore();
      robot.emit.restore();
    });

    it("starts the robot's connections", function() {
      expect(robot.startConnections).to.be.called;
    });

    it("starts the robot's devices", function() {
      expect(robot.startDevices).to.be.called;
    });

    it("starts the robot's work", function() {
      expect(robot.work).to.be.called;
    });

    it("emits the 'ready' event", function() {
      expect(robot.emit).to.be.calledWith("ready", robot);
    });

    it("returns the robot", function() {
      expect(robot.start()).to.be.eql(robot);
    });
  });

  describe("#startConnections", function() {
    var bot;

    beforeEach(function() {
      bot = new Robot({
        connections: {
          alpha: { adaptor: "loopback" },
          bravo: { adaptor: "loopback" }
        }
      });

      stub(bot.connections.alpha, "connect").returns(true);
      stub(bot.connections.bravo, "connect").returns(true);
    });

    it("runs #connect on each connection", function() {
      bot.startConnections();

      expect(bot.connections.alpha.connect).to.be.called;
      expect(bot.connections.bravo.connect).to.be.called;
    });
  });

  describe("#startDevices", function() {
    var bot;

    beforeEach(function() {
      bot = new Robot({
        connections: {
          loopback: { adaptor: "loopback" }
        },

        devices: {
          alpha: { driver: "ping" },
          bravo: { driver: "ping" }
        }
      });

      stub(bot.devices.alpha, "start").returns(true);
      stub(bot.devices.bravo, "start").returns(true);
    });

    it("runs #start on each device", function() {
      bot.startDevices();

      expect(bot.devices.alpha.start).to.be.called;
      expect(bot.devices.bravo.start).to.be.called;
    });
  });

  describe("#halt", function() {
    var bot, device, connection;

    beforeEach(function() {
      bot = new Robot({
        devices: {
          ping: { driver: "ping" }
        },

        connections: {
          loopback: { adaptor: "loopback" }
        }
      });

      bot.isRunning = true;

      device = bot.devices.ping;
      connection = bot.connections.loopback;

      stub(device, "halt").yields(true);
      stub(connection, "disconnect").yields(true);
    });

    afterEach(function() {
      device.halt.restore();
      connection.disconnect.restore();
    });

    it("calls #halt on all devices and connections", function() {
      bot.halt();

      expect(device.halt).to.be.called;
      expect(connection.disconnect).to.be.called;
    });
  });

  describe("#toString", function() {
    it("returns basic information about the robot", function() {
      expect(robot.toString()).to.be.eql("[Robot name='Robby']");
    });
  });

  describe("#log", function() {
    beforeEach(function() {
      stub(Logger, "info");
      stub(Logger, "fatal");

      robot.log("info", "an informative message");
      robot.log("fatal", "a fatal error");
    });

    afterEach(function() {
      Logger.info.restore();
      Logger.fatal.restore();
    });

    it("it passes messages onto Logger, with the Robot's name", function() {
      var nameStr = "[" + robot.name + "] -";
      expect(Logger.info).to.be.calledWith(nameStr, "an informative message");
      expect(Logger.fatal).to.be.calledWith(nameStr, "a fatal error");
    });
  });
});
