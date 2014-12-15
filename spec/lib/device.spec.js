/* jshint expr:true */
"use strict";

var Ping = source("test/ping"),
    device = source("device");

describe("Device", function() {
  it("returns a Driver instance", function() {
    var driver = device({
      name: "test",
      driver: "ping"
    });

    expect(driver).to.be.an.instanceOf(Ping);
  });
});
