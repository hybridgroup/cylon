'use strict';

var EventEmitter = require('events').EventEmitter;

var Adaptor = source("adaptor");

describe("Adaptor", function() {
  var connection = new EventEmitter;
  var adaptor = new Adaptor({ name: 'adaptor', connection: connection });

  describe("#constructor", function() {
    it("sets @self as a reference to the adaptor", function() {
      expect(adaptor.self).to.be.eql(adaptor);
    });

    it("sets @name to the provided name", function() {
      expect(adaptor.name).to.be.eql('adaptor');
    });

    it("sets @connection to the provided connection", function() {
      expect(adaptor.connection).to.be.eql(connection);
    });

    it("sets @commandList to an empty array by default", function() {
      expect(adaptor.commandList).to.be.eql([]);
    });
  });

  describe("#commands", function() {
    var commands = ['list', 'of', 'commands']
    before(function() {
      adaptor.commandList = commands;
    });

    after(function() {
      adaptor.commandList = [];
    });

    it("returns the adaptor's @commandList", function() {
      expect(adaptor.commands()).to.be.eql(commands);
    });
  });

  describe("#connect", function() {
    var callback = spy();

    before(function() {
      stub(connection, 'emit');
      stub(Logger, 'info');
      adaptor.connect(callback);
    });

    after(function() {
      connection.emit.restore();
      Logger.info.restore();
    });

    it("logs that it's connecting to the adaptor", function() {
      var string = "Connecting to adaptor 'adaptor'...";
      expect(Logger.info).to.be.calledWith(string);
    });

    it("triggers the provided callback", function() {
      expect(callback).to.be.called;
    });

    it("tells the connection to emit the 'connect' event", function() {
      expect(connection.emit).to.be.calledWith('connect');
    });
  });

  describe("#disconnect", function() {
    before(function() {
      stub(Logger, 'info');
      adaptor.disconnect();
    });

    after(function() {
      Logger.info.restore();
    });

    it("logs that it's disconnecting to the adaptor", function() {
      var string = "Disconnecting from adaptor 'adaptor'...";
      expect(Logger.info).to.be.calledWith(string);
    });
  });
});
