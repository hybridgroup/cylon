"use strict";

var Device = source('device'),
    Connection = source('connection'),
    Robot = source("robot"),
    Utils = source('utils');

describe("Robot", function() {
  var work = spy();
  var extraFunction = spy();

  var robot = new Robot({
    name: "Robby",
    work: work,

    extraFunction: extraFunction,
    extraValue: "Hello World",

    master: { master: true }
  });

  describe("constructor", function() {
    describe("name", function() {
      context("if provided", function() {
        it("is set to the passed value", function() {
          expect(robot.name).to.be.eql("Robby")
        });
      });

      context("if not provided", function() {
        beforeEach(function() {
          stub(Robot, 'randomName').returns("New Robot");
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

    it("sets @adaptors to an object containing all adaptors the Robot knows of", function() {
      expect(robot.adaptors).to.have.keys(["loopback", "test"]);
    });

    it("sets @drivers to an object containing all drivers the Robot knows of", function() {
      expect(robot.drivers).to.have.keys(["ping", "test"]);
    });

    it("sets @work to the passed work function", function() {
      expect(robot.work).to.be.eql(work);
    });

    it("sets other obj params as values on the robot", function() {
      expect(robot.extraFunction).to.be.eql(extraFunction);
      expect(robot.extraValue).to.be.eql("Hello World");
    });
  });

  describe("all work and no play", function() {
    var play = spy();

    var playBot = new Robot({
      play: play
    });

    it('makes Jack a dull boy', function() {
      expect(playBot.work).to.be.eql(play);
    })
  })

  describe("#toJSON", function() {
    var bot = new Robot({
      connection: { name: 'loopback', adaptor: 'loopback' },
      device: { name: 'ping', driver: 'ping' }
    });

    var json = bot.toJSON();

    it("returns an object", function() {
      expect(json).to.be.a('object');
    });

    it("contains the robot's name", function() {
      expect(json.name).to.eql(bot.name);
    });

    it("contains the robot's commands", function() {
      expect(json.commands).to.eql(bot.commands);
    });

    it("contains the robot's devices", function() {
      var deviceJSON = bot.devices.ping.toJSON();
      expect(json.devices).to.eql([deviceJSON]);
    });

    it("contains the robot's connections", function() {
      var connectionJSON = bot.connections.loopback.toJSON();
      expect(json.connections).to.eql([connectionJSON]);
    });
  });

  describe("initConnections", function() {
    context("when not passed anything", function() {
      it("returns immediately", function() {
        expect(robot.initConnections()).to.be.eql(undefined);
      });
    });

    context("when passed a connection object", function() {
      it("instantiates a new connection with the provided object", function() {
        var connection = { name: 'loopback', adaptor: 'loopback' };
        robot.initConnections(connection);
        expect(robot.connections['loopback']).to.be.instanceOf(Connection);
      });
    });

    context("when passed an array of connection objects", function() {
      it("instantiates a new connection with each of the provided objects", function() {
        var connections = [{ name: 'loopback', adaptor: 'loopback' }]
        robot.initConnections(connections);
        expect(robot.connections['loopback']).to.be.instanceOf(Connection);
      });
    });
  });

  describe("initDevices", function() {
    context("when not passed anything", function() {
      it("returns immediately", function() {
        expect(robot.initDevices()).to.be.eql(undefined);
      });
    });

    context("when passed a connection object", function() {
      afterEach(function() { robot.devices = {}; });

      it("instantiates a new device with the provided object", function() {
        var device = { name: 'ping', driver: 'ping' };
        robot.initDevices(device);
        expect(robot.devices['ping']).to.be.instanceOf(Device);
      });
    });

    context("when passed an array of device objects", function() {
      afterEach(function() { robot.devices = {}; });

      it("instantiates a new device with each of the provided objects", function() {
        var devices = [{ name: 'ping', driver: 'ping' }]
        robot.initDevices(devices);

        expect(robot.devices['ping']).to.be.instanceOf(Device);
      });
    });
  });

  describe("#start", function() {
    beforeEach(function() {
      stub(robot, 'startConnections').callsArg(0);
      stub(robot, 'startDevices').callsArg(0);
      stub(robot, 'emit').returns(null);

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

    it("emits the 'working' event", function() {
      expect(robot.emit).to.be.calledWith("working")
    });
  });

  describe("#startConnections", function() {
    var bot;

    beforeEach(function() {
      bot = new Robot({
        connections: [
          { name: 'alpha', adaptor: 'loopback' },
          { name: 'bravo', adaptor: 'loopback' }
        ]
      });

      stub(bot.connections.alpha, 'connect').returns(true);
      stub(bot.connections.bravo, 'connect').returns(true);
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
        devices: [
          { name: 'alpha', driver: 'ping' },
          { name: 'bravo', driver: 'ping' }
        ]
      });

      stub(bot.devices.alpha, 'start').returns(true);
      stub(bot.devices.bravo, 'start').returns(true);
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
        device: { name: 'ping', driver: 'ping' },
        connection: { name: 'loopback', adaptor: 'loopback' }
      });

      device = bot.devices.ping;
      connection = bot.connections.loopback;

      stub(device, 'halt').returns(true);
      stub(connection, 'halt').returns(true);
    });

    afterEach(function() {
      device.halt.restore();
      connection.halt.restore();
    });

    it("calls #halt on all devices and connections", function() {
      bot.halt();

      expect(device.halt).to.be.called;
      expect(connection.halt).to.be.called;
    });
  });

  describe("#toString", function() {
    it("returns basic information about the robot", function() {
      expect(robot.toString()).to.be.eql("[Robot name='Robby']");
    });
  });
});
