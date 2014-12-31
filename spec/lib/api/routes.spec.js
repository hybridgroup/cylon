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

function MockPromise() {
  var my = this;
  my.resolve = function() {
    var args = arguments;
    process.nextTick(function() {
      my.thenCallback.apply(null, args);
    });
    return my;
  };
  my.reject = function() {
    var args = arguments;
    process.nextTick(function() {
      my.errorCallback.apply(null, args);
    });
    return my;
  };
  my.then = function(thenCallback) {
    my.thenCallback = thenCallback;
    return my;
  };
  my.catch = function(errorCallback) {
    my.errorCallback = errorCallback;
    return my;
  };
  my.deferred = my;
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
    Cylon.commands.pingAsync = function() {
      var promise = new MockPromise();
      return promise.resolve("immediate pong");
    };
    req = new MockRequest();
    res = new MockResponse();
    res.status = function(statusCode) {
      res.statusCode = statusCode;
      return res;
    };
    req.device = {
      name: "testDevice",
      commands: {
        announce: function(){return "im here";},
        announceAsync: function() {
          var promise = new MockPromise();
          process.nextTick(function(){
            return promise.reject("sorry, sore throat");
          });
          return promise.deferred;
        }
      }
    };
    req.robot = {
      name: "fred",
      commands: {
        speak: function(){return "ahem";},
        speakAsync: function() {
          var promise = new MockPromise();
          process.nextTick(function(){
            return promise.resolve("see ya in another cycle");
          });
          return promise.deferred;
        }
      },
      devices: {
        testDevice: req.device
      }
    };
  });
  afterEach(function() {
    delete Cylon.commands.ping;
    delete Cylon.commands.pingAsync;
  });

  it("returns the list of MCP commands", function() {
    res.json = function(obj){
      expect(obj.commands).to.exist();
      expect(obj.commands.length).to.equal(2);
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

  it("returns an immediate MCP async command", function() {
    req.params = {command:"pingAsync"};
    res.json = function(obj){
      expect(obj.result).to.equal("immediate pong");
    };
    findFinalHandler("/commands/pingAsync")(req, res);
  });

  it("returns the list of robot commands", function() {
    req.params = {robot: "fred"};
    res.json = function(obj){
      expect(obj.commands).to.exist();
      expect(obj.commands.length).to.equal(2);
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

  it("invokes an asynchronous robot command", function() {
    req.params = {robot: "fred", command:"speakAsync"};
    res.json = function(obj){
      expect(obj.result).to.equal("see ya in another cycle");
    };
    findFinalHandler("/robots/fred/commands/speakAsync")(req, res);
  });

  it("returns the list of device commands", function() {
    req.params = {robot: "fred", device: "testDevice" };
    res.json = function(obj){
      expect(obj.commands).to.exist();
      expect(obj.commands.length).to.equal(2);
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
    var path = "/robots/fred/devices/testDevice/commands/announce";
    findFinalHandler(path)(req, res);
  });

  it("returns correctly for an async device command that errored", function() {
    req.params = {robot: "fred", device: "testDevice", command:"announceAsync"};
    res.json = function(obj){
      expect(obj.error).to.equal("sorry, sore throat");
      expect(res.statusCode).to.equal(500);
    };
    var path = "/robots/fred/devices/testDevice/commands/announceAsync";
    findFinalHandler(path)(req, res);
  });

});
