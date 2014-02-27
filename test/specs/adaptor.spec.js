'use strict';

source("adaptor");
var EventEmitter = require('events').EventEmitter;

describe("Adaptor", function() {
  var adaptor, conn;
  conn = new EventEmitter;
  adaptor = new Cylon.Adaptor({
    name: 'TestAdaptor',
    connection: conn
  });

  it("provides a 'connect' method that accepts a callback", function() {
    var spy;
    expect(adaptor.connect).to.be.a('function');
    spy = sinon.spy();
    adaptor.connect(function() {
      return spy();
    });
    spy.should.have.been.called;
  });

  it("tells the connection to emit the 'connect' event when connected", function() {
    var spy;
    spy = sinon.spy();
    adaptor.connection.on('connect', function() {
      return spy();
    });
    adaptor.connect(function() {});
    spy.should.have.been.called;
  });

  it("provides a 'disconnect' method", function() {
    expect(adaptor.disconnect).to.be.a('function');
  });

  it("provides a default empty array of commands", function() {
    expect(adaptor.commands()).to.be.eql([]);
  });

  it("saves the provided name in the @name variable", function() {
    expect(adaptor.name).to.be.eql("TestAdaptor");
  });

  it("saves the provided connection in the @connection variable", function() {
    expect(adaptor.connection).to.be.eql(conn);
  });

  it("contains a reference to itself in the @self variable", function() {
    expect(adaptor.self).to.be.eql(adaptor);
  });
});
