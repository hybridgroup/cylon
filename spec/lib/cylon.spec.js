"use strict";

var Cylon = source("cylon"),
    Robot = source("robot"),
    Utils = source('utils');

var API = source('api'),
    Logger = source('logger'),
    Adaptor = source('adaptor'),
    Driver = source('driver'),
    Config = source('config');

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

    it("avoids duplicating names", function() {
      Cylon.robot({ name: "Ultron" })
      Cylon.robot({ name: "Ultron" })

      var bots = Object.keys(Cylon.robots);
      expect(bots).to.be.eql(["Ultron", "Ultron-1"])
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

    it('passes configuration to the API constructor', function() {
      Cylon.config({ api: { port: '1234' }});
      Cylon.api();
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

  describe("#config", function() {
    beforeEach(function() {
      for (var c in Config) {
        delete Config[c];
      }

      stub(Logger, 'setup');
    });

    afterEach(function() {
      Logger.setup.restore();
    });

    it("sets config variables", function() {
      Cylon.config({ a: 1, b: 2 });
      expect(Config.a).to.be.eql(1);
      expect(Config.b).to.be.eql(2);
    });

    it("updates existing config", function() {
      Cylon.config({ a: 1, b: 2 });
      Cylon.config({ a: 3 });
      expect(Config.a).to.be.eql(3);
      expect(Config.b).to.be.eql(2);
    });

    it("returns updated config", function() {
      var config = Cylon.config({ a: 1, b: 2 });
      expect(Config).to.be.eql(config);
    });

    it("doesn't ignores non-object arguments", function() {
      var config = Cylon.config({ a: 1, b: 2 });
      Cylon.config(["a", 1, "b", 2]);
      Cylon.config("hello world");
      expect(Config).to.be.eql(config);
    });

    it("updates the Logger setup if that changed", function() {
      Cylon.config({ a: 1 });
      expect(Logger.setup).to.not.be.called;

      Cylon.config({ a: 1, logging: { logger: false } });
      expect(Logger.setup).to.be.called;
    })
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
      bot1 = new Robot();
      bot2 = new Robot();

      Cylon.robots = { 'bot1': bot1, 'bot2': bot2 };
      Cylon.commands.echo = echo = function(arg) { return arg; };

      json = Cylon.toJSON();
    });

    it("contains all robots the MCP knows about", function() {
      expect(json.robots).to.be.eql([bot1.toJSON(), bot2.toJSON()]);
    });

    it("contains an array of MCP commands", function() {
      expect(json.commands).to.be.eql(['echo']);
    })
  });
});
