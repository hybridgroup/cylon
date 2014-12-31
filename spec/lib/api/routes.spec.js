/* jshint expr:true */
"use strict";

var Cylon = source("cylon"),
    router = source("api/routes");

var MockRequest = require("../../support/mock_request"),
    MockResponse = require("../../support/mock_response");

function findRoute(path) {
  var routes = router.stack.filter(function(m) {
    return m.regexp.test(path);
  });
  return routes[0];
}

function findFinalHandler(path) {
  var handlers = findRoute(path).route.stack.map(function(m) {
      return m.handle;
  });
  return handlers[handlers.length - 1];
}

describe("API routes", function() {
  var routes = [
    ["GET",  "/"],
    ["GET",  "/commands"],
    ["POST", "/commands/command"],
    ["GET",  "/robots"],
    ["GET",  "/robots/TestBot"],
    ["GET",  "/robots/TestBot/commands"],
    ["POST", "/robots/TestBot/commands/cmd"],
    ["GET",  "/robots/TestBot/devices"],
    ["GET",  "/robots/TestBot/devices/ping"],
    ["GET",  "/robots/TestBot/devices/ping/commands"],
    ["POST", "/robots/TestBot/devices/ping/commands/ping"],
    ["GET",  "/robots/TestBot/connections"],
    ["GET",  "/robots/TestBot/connections/loopback"]
  ];

  routes.forEach(function(route) {
    var method = route[0],
        path = route[1];

    it("defines a " + method + " route for " + path, function() {
      expect(findRoute(path)).to.exist();
    });
  });

});


describe("API commands", function() {

  var req, res;
  beforeEach(function() {
    Cylon.commands.ping = function() { return "pong"; };
    req = new MockRequest();
    res = new MockResponse();
    req.device = {
      name: "testDevice",
      commands: {
        announce: function(){return "im here";}
      }
    };
    req.robot = {
      name: "fred",
      commands: {
        speak: function(){return "ahem";}
      },
      devices: {
        testDevice: req.device
      }
    };
  });
  afterEach(function() {
    delete Cylon.commands.ping;
  });

  it("returns the list of MCP commands", function() {
    res.json = function(obj){
      expect(obj.commands).to.exist();
      expect(obj.commands.length).to.equal(1);
      expect(obj.commands[0]).to.equal("ping");
    };
    findFinalHandler("/commands")(req, res);
  });

  it("invokes an MCP command", function() {
    req.params = {command:"ping"};
    res.json = function(obj){
      expect(obj.result).to.equal("pong");
    };
    findFinalHandler("/commands/ping")(req, res);
  });

  it("returns the list of robot commands", function() {
    req.params = {robot: "fred"};
    res.json = function(obj){
      expect(obj.commands).to.exist();
      expect(obj.commands.length).to.equal(1);
      expect(obj.commands[0]).to.equal("speak");
    };
    findFinalHandler("/robots/fred/commands")(req, res);
  });

  it("invokes a robot command", function() {
    req.params = {robot: "fred", command:"speak"};
    res.json = function(obj){
      expect(obj.result).to.equal("ahem");
    };
    findFinalHandler("/robots/fred/commands/speak")(req, res);
  });

  it("returns the list of device commands", function() {
    req.params = {robot: "fred", device: "testDevice" };
    res.json = function(obj){
      expect(obj.commands).to.exist();
      expect(obj.commands.length).to.equal(1);
      expect(obj.commands[0]).to.equal("announce");
    };
    var path = "/robots/fred/devices/testDevice/commands";
    findFinalHandler(path)(req, res);
  });

  it("invokes a device command", function() {
    req.params = {robot: "fred", device: "testDevice", command:"announce"};
    res.json = function(obj){
      expect(obj.result).to.equal("im here");
    };
    var path = "/robots/fred/devices/testDevice/commands/speak";
    findFinalHandler(path)(req, res);
  });

});
