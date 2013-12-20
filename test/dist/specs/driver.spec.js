(function() {
  'use strict';
  var EventEmitter;

  source("driver");

  EventEmitter = require('events').EventEmitter;

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
      return spy.should.have.been.called;
    });
    it("tells the device to emit the 'start' event when started", function() {
      var spy;
      spy = sinon.spy();
      driver.device.on('start', function() {
        return spy();
      });
      driver.start(function() {});
      return spy.should.have.been.called;
    });
    it("provides a 'stop' method", function() {
      return expect(driver.stop).to.be.a('function');
    });
    it("provides a default empty array of commands", function() {
      return expect(driver.commands()).to.be.eql([]);
    });
    it("saves the provided name in the @name variable", function() {
      return expect(driver.name).to.be.eql("TestDriver");
    });
    it("saves the provided device in the @device variable", function() {
      return expect(driver.device).to.be.eql(device);
    });
    it("saves the provided device connection in the @device variable", function() {
      return expect(driver.connection).to.be.eql('connect');
    });
    return it("contains a reference to itself in the @self variable", function() {
      return expect(driver.self).to.be.eql(driver);
    });
  });

}).call(this);
