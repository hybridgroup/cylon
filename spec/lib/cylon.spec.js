"use strict";

var Cylon = lib("../index");

var MCP = lib("mcp"),
    API = lib("api"),
    Robot = lib("robot"),
    Driver = lib("driver"),
    Adaptor = lib("adaptor"),
    Utils = lib("utils"),
    Config = lib("config"),
    Logger = lib("logger");

var IO = {
  DigitalPin: lib("io/digital-pin"),
  Utils: lib("io/utils")
};

describe("Cylon", function() {
  it("exports the MCP as Cylon.MCP", function() {
    expect(Cylon.MCP).to.be.eql(MCP);
  });

  it("exports the Robot as Cylon.Robot", function() {
    expect(Cylon.Robot).to.be.eql(Robot);
  });

  it("exports the Driver as Cylon.Driver", function() {
    expect(Cylon.Driver).to.be.eql(Driver);
  });

  it("exports the Adaptor as Cylon.Adaptor", function() {
    expect(Cylon.Adaptor).to.be.eql(Adaptor);
  });

  it("exports the Utils as Cylon.Utils", function() {
    expect(Cylon.Utils).to.be.eql(Utils);
  });


  it("exports the Logger as Cylon.Logger", function() {
    expect(Cylon.Logger).to.be.eql(Logger);
  });

  it("exports the IO DigitalPin and Utils as Cylon.IO", function() {
    expect(Cylon.IO).to.be.eql(IO);
  });

  describe("#robot", function() {
    it("proxies to MCP.create", function() {
      expect(Cylon.robot).to.be.eql(MCP.create);
    });
  });

  describe("#start", function() {
    it("proxies to MCP.start", function() {
      expect(Cylon.start).to.be.eql(MCP.start);
    });
  });

  describe("#halt", function() {
    it("proxies to MCP.halt", function() {
      expect(Cylon.halt).to.be.eql(MCP.halt);
    });
  });

  describe("#api", function() {
    it("proxies to API.create", function() {
      expect(Cylon.api).to.be.eql(API.create);
    });
  });

  describe("#config", function() {
    it("proxies to Config.update", function() {
      expect(Cylon.config).to.be.eql(Config.update);
    });
  });
});
