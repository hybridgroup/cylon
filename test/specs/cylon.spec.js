"use strict";

var Cylon = source("cylon"),
    Utils = source('utils');

var API = source('api'),
    Logger = source('logger'),
    Adaptor = source('adaptor'),
    Driver = source('driver');

describe("Cylon", function() {
  describe("exports", function() {
    it("sets Logger to the Logger module", function() {
      expect(Cylon.Logger).to.be.eql(Logger);
    });

    it("sets Adaptor to the Adaptor module", function() {
      expect(Cylon.Adaptor).to.be.eql(Adaptor);
    });

    it("sets Driver to the Driver module", function() {
      expect(Cylon.Driver).to.be.eql(Driver);
    });
  });

  it("sets @api_instance to null by default", function() {
    expect(Cylon.api_instance).to.be.eql(null);
  });

  it("sets @robots to an empty array by default", function() {
    expect(Cylon.robots).to.be.eql([]);
  });

  describe("#robot", function() {
    after(function() {
      Cylon.robots = [];
    });

    it("uses passed options to create a new Robot", function() {
      var opts = { name: "Ultron" };
      var robot = Cylon.robot(opts);

      expect(robot.toString()).to.be.eql("[Robot name='Ultron']")
      expect(Cylon.robots.pop()).to.be.eql(robot);
    });
  });

  describe("#api", function() {
    beforeEach(function() {
      stub(API.prototype, 'listen');
    });

    afterEach(function() {
      API.prototype.listen.restore();
    });

    it('creates a new API instance', function() {
      Cylon.api();
      expect(Cylon.api_instance).to.be.an.instanceOf(API);
    });

    it('passes arguments to the API constructor', function() {
      Cylon.api({ port: '1234' });
      expect(Cylon.api_instance.port).to.be.eql('1234');
    })
  });

  describe("#findRobot", function() {
    var bot;

    before(function() {
      bot = Cylon.robot({ name: "Robby" })
    });

    describe("async", function() {
      context("looking for a robot that exists", function() {
        it("calls the callback with the robot", function() {
          var callback = spy();
          Cylon.findRobot("Robby", callback);
          expect(callback).to.be.calledWith(undefined, bot);
        });
      });

      context("looking for a robot that does not exist", function(){
        it("calls the callback with no robot and an error message", function() {
          var callback = spy();
          Cylon.findRobot("Ultron", callback);
          var error = { error: "No Robot found with the name Ultron" };
          expect(callback).to.be.calledWith(error, null);
        });
      });
    });

    describe("sync", function() {
      context("looking for a robot that exists", function() {
        it("returns the robot", function() {
          expect(Cylon.findRobot("Robby")).to.be.eql(bot);
        });
      });

      context("looking for a robot that does not exist", function(){
        it("returns null", function() {
          expect(Cylon.findRobot("Ultron")).to.be.eql(null);
        });
      });
    });
  });

  describe("#findRobotDevice", function() {
    var bot, device;

    before(function() {
      bot = Cylon.robot({
        name: "Ultron",
        device: { name: "ping", driver: "ping" }
      });

      device = bot.devices.ping;
    });

    describe("async", function() {
      context("looking for a valid robot/device", function() {
        it("calls the callback with the device and no error message", function() {
          var callback = spy();
          Cylon.findRobotDevice("Ultron", "ping", callback);
          expect(callback).to.be.calledWith(undefined, device);
        });
      });

      context("looking for a valid robot and invalid device", function() {
        it("calls the callback with no device and an error message", function() {
          var callback = spy();
          Cylon.findRobotDevice("Ultron", "nope", callback);
          var error = { error: "No device found with the name nope." };
          expect(callback).to.be.calledWith(error, null);
        });
      });

      context("looking for an invalid robot", function() {
        it("calls the callback with no device and an error message", function() {
          var callback = spy();
          Cylon.findRobotDevice("Rob", "ping", callback);
          var error = { error: "No Robot found with the name Rob" };
          expect(callback).to.be.calledWith(error, null);
        });
      });
    });

    describe("synchronous", function() {
      context("looking for a valid robot/device", function() {
        it("returns the device", function() {
          expect(Cylon.findRobotDevice("Ultron", "ping")).to.be.eql(device);
        });
      });

      context("looking for a valid robot and invalid device", function() {
        it("returns null", function() {
          expect(Cylon.findRobotDevice("Ultron", "nope")).to.be.eql(null);
        });
      });

      context("looking for an invalid robot", function() {
        it("returns null", function() {
          expect(Cylon.findRobotDevice("Rob", "ping")).to.be.eql(null);
        });
      });
    });
  });

  describe("#findRobotConnection", function() {
    var bot, conn;

    before(function() {
      bot = Cylon.robot({
        name: "JARVIS",
        connection: { name: "loopback", adaptor: "loopback" }
      });

      conn = bot.connections.loopback;
    });

    describe("async", function() {
      context("looking for a valid robot/connection", function() {
        it("calls the callback with the connection and no error message", function() {
          var callback = spy();
          Cylon.findRobotConnection("JARVIS", "loopback", callback);
          expect(callback).to.be.calledWith(undefined, conn);
        });
      });

      context("looking for a valid robot and invalid connection", function() {
        it("calls the callback with no connection and an error message", function() {
          var callback = spy();
          Cylon.findRobotConnection("JARVIS", "nope", callback);
          var error = { error: "No connection found with the name nope." };
          expect(callback).to.be.calledWith(error, null);
        });
      });

      context("looking for an invalid robot", function() {
        it("calls the callback with no connection and an error message", function() {
          var callback = spy();
          Cylon.findRobotConnection("Rob", "loopback", callback);
          var error = { error: "No Robot found with the name Rob" };
          expect(callback).to.be.calledWith(error, null);
        });
      });
    });

    describe("synchronous", function() {
      context("looking for a valid robot/connection", function() {
        it("returns the connection", function() {
          expect(Cylon.findRobotConnection("JARVIS", "loopback")).to.be.eql(conn);
        });
      });

      context("looking for a valid robot and invalid connection", function() {
        it("returns null", function() {
          expect(Cylon.findRobotConnection("JARVIS", "nope")).to.be.eql(null);
        });
      });

      context("looking for an invalid robot", function() {
        it("returns null", function() {
          expect(Cylon.findRobotConnection("Rob", "loopback")).to.be.eql(null);
        });
      });
    });
  });

  describe("#start", function() {
    before(function() {
      Cylon.robots = [];
    });

    it("calls #start() on all robots", function() {
      var bot1 = { start: spy() },
          bot2 = { start: spy() };

      Cylon.robots = [bot1, bot2];

      Cylon.start();

      expect(bot1.start).to.be.called;
      expect(bot2.start).to.be.called;
    });
  });

  describe("#halt", function() {
    before(function() {
      Cylon.robots = [];
    });

    it("calls #halt() on all robots", function() {
      var bot1 = { halt: spy() },
          bot2 = { halt: spy() };

      Cylon.robots = [bot1, bot2];

      Cylon.halt();

      expect(bot1.halt).to.be.called;
      expect(bot2.halt).to.be.called;
    });
  });
});
