'use strict';

source("driver");
var EventEmitter = require('events').EventEmitter;

describe("Driver", function() {
  var device, driver;
  device = new EventEmitter;
  device.connection = 'connect';
  driver = new Cylon.Driver({
    name: 'TestDriver',
    device: device
  });

  it("provides a 'start' method that accepts a callback", function() {
    var spy;
    expect(driver.start).to.be.a('function');
    spy = sinon.spy();
    driver.start(function() {
      return spy();
    });
    spy.should.have.been.called;
  });

  it("tells the device to emit the 'start' event when started", function() {
    var spy;
    spy = sinon.spy();
    driver.device.on('start', function() {
      return spy();
    });
    driver.start(function() {});
    spy.should.have.been.called;
  });

  it("provides a 'stop' method", function() {
    expect(driver.stop).to.be.a('function');
  });

  it("provides a default empty array of commands", function() {
    expect(driver.commands()).to.be.eql([]);
  });

  it("saves the provided name in the @name variable", function() {
    expect(driver.name).to.be.eql("TestDriver");
  });
  
  it("saves the provided device in the @device variable", function() {
    expect(driver.device).to.be.eql(device);
  });

  it("saves the provided device connection in the @device variable", function() {
    expect(driver.connection).to.be.eql('connect');
  });

  it("contains a reference to itself in the @self variable", function() {
    expect(driver.self).to.be.eql(driver);
  });
});
