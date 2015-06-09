"use strict";

var initializer = lib("initializer"),
    Registry = lib("registry"),
    Config = lib("config");

var Loopback = lib("test/loopback"),
    Ping = lib("test/ping"),
    TestAdaptor = lib("test/test-adaptor"),
    TestDriver = lib("test/test-driver");

describe("Initializer", function() {
  beforeEach(function() {
    spy(Registry, "findBy");
    stub(Registry, "register");
  });

  afterEach(function() {
    Registry.findBy.restore();
    Registry.register.restore();
  });

  it("creates an instance of the requested adaptor/driver", function() {
    var adaptor = initializer("adaptor", { adaptor: "loopback" });
    expect(adaptor).to.be.an.instanceOf(Loopback);

    var driver = initializer("driver", { driver: "ping" });
    expect(driver).to.be.an.instanceOf(Ping);
  });

  context("if the module isn't registered", function() {
    var module;

    beforeEach(function() {
      Registry.findBy.restore();

      module = {
        adaptor: stub(),
        driver: stub()
      };

      stub(Registry, "findBy")
        .onFirstCall().returns(false)
        .onSecondCall().returns(module);
    });

    context("if a module key was provided", function() {
      it("attempts to register it", function() {
        initializer("adaptor", { adaptor: "adaptor", module: "test" });
        expect(Registry.register).to.be.calledWith("test");
        expect(module.adaptor).to.be.called;
      });
    });

    context("if no module key was provided", function() {
      it("attempts to find it automatically", function() {
        initializer("driver", { driver: "driver" });
        expect(Registry.register).to.be.calledWith("cylon-driver");
        expect(module.driver).to.be.called;
      });
    });

    context("if the module still can't be found", function() {
      beforeEach(function() {
        Registry.findBy.onSecondCall().returns(false);
      });

      it("throws an error", function() {
        function fn() {
          return initializer("adaptor", { adaptor: "badadaptor" });
        }

        expect(fn).to.throw("Unable to find adaptor for badadaptor");
      });
    });
  });

  context("if in test mode", function() {
    var tm = Config.testMode, adaptor, driver;

    beforeEach(function() {
      Config.testMode = true;

      driver = initializer("driver", { driver: "ping" });
      adaptor = initializer("adaptor", { adaptor: "loopback" });
    });

    afterEach(function() {
      Config.testMode = tm;
    });

    it("creates a test adaptor/driver", function() {
      expect(driver).to.be.an.instanceOf(TestDriver);
      expect(adaptor).to.be.an.instanceOf(TestAdaptor);
    });

    it("stubs out the driver/adaptor behaviour", function() {
      expect(driver.ping).to.be.a("function");
    });
  });
});
