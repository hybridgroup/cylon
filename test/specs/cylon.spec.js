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

    it("sets @api_instance to null by default", function() {
      expect(Cylon.api_instance).to.be.eql(null);
    });

    it("sets @robots to an empty object by default", function() {
      expect(Cylon.robots).to.be.eql({});
    });

    it("sets @robots to an empty object by default", function() {
      expect(Cylon.commands).to.be.eql({});
    });
  });

  describe("#robot", function() {
    afterEach(function() {
      Cylon.robots = {};
    });

    it("uses passed options to create a new Robot", function() {
      var opts = { name: "Ultron" };
      var robot = Cylon.robot(opts);

      expect(robot.toString()).to.be.eql("[Robot name='Ultron']")
      expect(Cylon.robots['Ultron']).to.be.eql(robot);
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

  describe("#start", function() {
    it("calls #start() on all robots", function() {
      var bot1 = { start: spy() },
          bot2 = { start: spy() };

      Cylon.robots = {
        'bot1': bot1,
        'bot2': bot2
      };

      Cylon.start();

      expect(bot1.start).to.be.called;
      expect(bot2.start).to.be.called;
    });
  });

  describe("#halt", function() {
    it("calls #halt() on all robots", function() {
      var bot1 = { halt: spy() },
          bot2 = { halt: spy() };

      Cylon.robots = {
        'bot1': bot1,
        'bot2': bot2
      };

      Cylon.halt();

      expect(bot1.halt).to.be.called;
      expect(bot2.halt).to.be.called;
    });
  });

  describe("#toJSON", function() {
    var json, bot1, bot2, echo;

    beforeEach(function() {
      bot1 = {};
      bot2 = {};

      Cylon.robots = { 'bot1': bot1, 'bot2': bot2 };
      Cylon.commands.echo = echo = function(arg) { return arg; };

      json = Cylon.toJSON();
    });

    it("contains all robots the MCP knows about", function() {
      expect(json.robots).to.be.eql([bot1, bot2]);
    });

    it("contains an array of MCP commands", function() {
      expect(json.commands).to.be.eql(['echo']);
    })
  });
});
