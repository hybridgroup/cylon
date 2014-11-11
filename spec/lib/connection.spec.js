"use strict";

var Loopback = source('test/loopback'),
    Connection = source("connection");

describe("Connection", function() {
  it("returns a Adaptor instance", function() {
    var conn = Connection({
      name: 'test',
      adaptor: 'loopback'
    });

    expect(conn).to.be.an.instanceOf(Loopback);
  });
});
