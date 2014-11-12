"use strict";

var Ping = source('test/ping'),
    Device = source("device");

describe("Device", function() {
  it("returns a Driver instance", function() {
    var driver = Device({
      name: 'test',
      driver: 'ping'
    });

    expect(driver).to.be.an.instanceOf(Ping);
  });
});
