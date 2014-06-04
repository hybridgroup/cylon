'use strict';

var express = require('express'),
    https = require('https'),
    fs = require('fs');

var API = source('api');

describe("API", function() {
  var api, opts;

  describe("constructor", function() {

    beforeEach(function() {
      stub(https, 'createServer').returns({ listen: spy() });

      api = new API(opts);
    });

    afterEach(function() {
      https.createServer.restore();
    });

    it("sets @opts to the passed opts object", function() {
      expect(api.opts).to.be.eql(opts);
    });

    it("sets @host to 127.0.0.1 by default", function() {
      expect(api.host).to.be.eql("127.0.0.1")
    });

    it("sets @post to 3000 by default", function() {
      expect(api.port).to.be.eql("3000")
    });

    it("sets @server to an Express server instance", function() {
      expect(api.server).to.be.a('function');

      var methods = ['get', 'post', 'put', 'delete'];

      for (var i = 0; i < methods.length; i++) {
        expect(api.server[methods[i]]).to.be.a('function');
      }
    });

    it("sets @server.https to a https.createServer", function() {
      expect(https.createServer).to.be.calledWith();
    });

    it("sets the server's title", function() {
      var title = api.server.get('title');
      expect(title).to.be.eql("Cylon API Server");
    });

  });


  describe("ssl disabled", function () {

    beforeEach(function() {
      stub(https, 'createServer').returns({ listen: spy() });

      opts = { ssl: false }

      api = new API(opts);
    });

    afterEach(function() {
      https.createServer.restore();
    });

    it("doesn't create https server", function() {
      expect(https.createServer).not.to.be.calledWith();
    });

  });

  describe("#configureRoutes", function() {
    var server;
    var methods = ['all', 'get', 'post'];

    beforeEach(function() {
      server = api.server;
      for (var i = 0; i < methods.length; i++) {
        stub(server, methods[i]);
      }

      api.configureRoutes();
    });

    afterEach(function() {
      for (var i = 0; i < methods.length; i++) {
        server[methods[i]].restore();
      }
    });

    it("ALL /*", function() {
      expect(server.all).to.be.calledWith("/*");
    });

    it("GET /robots", function() {
      expect(server.get).to.be.calledWith("/robots");
    });

    it("GET /robots/:robot", function() {
      expect(server.get).to.be.calledWith("/robots/:robot");
    });

    it("GET /robots/:robot/commands", function() {
      expect(server.get).to.be.calledWith("/robots/:robot/commands");
    });

    it("ALL /robots/:robot/commands/:command", function() {
      expect(server.all).to.be.calledWith("/robots/:robot/commands/:command");
    });

    it("GET /robots/:robot/devices", function() {
      expect(server.get).to.be.calledWith("/robots/:robot/devices");
    });

    it("GET /robots/:robot/devices/:device", function() {
      expect(server.get).to.be.calledWith("/robots/:robot/devices/:device");
    });

    it("GET /robots/:robot/devices/:device/events/:event", function() {
      expect(server.get).to.be.calledWith("/robots/:robot/devices/:device/events/:event");
    });

    it("GET /robots/:robot/devices/:device/commands", function() {
      expect(server.get).to.be.calledWith("/robots/:robot/devices/:device/commands");
    });

    it("ALL /robots/:robot/devices/:device/commands/:command", function() {
      expect(server.all).to.be.calledWith("/robots/:robot/devices/:device/commands/:command");
    });

    it("GET /robots/:robot/connections", function() {
      expect(server.get).to.be.calledWith("/robots/:robot/connections");
    });

    it("GET /robots/:robot/connections/:connection", function() {
      expect(server.get).to.be.calledWith("/robots/:robot/connections/:connection");
    });
  });
});
