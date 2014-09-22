'use strict';

var EventEmitter = require('events').EventEmitter;

var Adaptor = source("adaptor"),
    Logger = source('logger'),
    Utils = source('utils');

describe("Adaptor", function() {
  var connection = new EventEmitter;
  var adaptor = new Adaptor({ name: 'adaptor', connection: connection });

  describe("#constructor", function() {
    it("sets @name to the provided name", function() {
      expect(adaptor.name).to.be.eql('adaptor');
    });

    it("sets @connection to the provided connection", function() {
      expect(adaptor.connection).to.be.eql(connection);
    });

    it("sets @commands to an empty array by default", function() {
      expect(adaptor.commands).to.be.eql([]);
    });
  });
});
