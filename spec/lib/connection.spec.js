/* jshint expr:true */
"use strict";

var Loopback = source("test/loopback"),
    connection = source("connection");

describe("Connection", function() {
  it("returns a Adaptor instance", function() {
    var conn = connection({
      name: "test",
      adaptor: "loopback"
    });

    expect(conn).to.be.an.instanceOf(Loopback);
  });
});
