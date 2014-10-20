"use strict";

var router = source('api/routes');

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
      var matches = router.stack.map(function(m) {
        return m.regexp.test(path);
      });

      expect(matches).to.include(true);
    });
  });
});
