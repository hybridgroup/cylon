"use strict";

var API = lib("api"),
    MCP = lib("mcp");

describe("API", function() {
  describe("#create", function() {
    afterEach(function() {
      API.instances = [];
    });

    context("with a provided API server and opts", function() {
      var Server, opts, instance;

      beforeEach(function() {
        instance = { start: spy() };
        opts = { https: false };
        Server = stub().returns(instance);

        API.create(Server, opts);
      });

      it("creates an API instance", function() {
        expect(Server).to.be.calledWithNew;
        expect(Server).to.be.calledWith(opts);
      });

      it("passes MCP through to the instance as opts.mcp", function() {
        expect(opts.mcp).to.be.eql(MCP);
      });

      it("stores the API instance in @instances", function() {
        expect(API.instances).to.be.eql([instance]);
      });

      it("tells the API instance to start", function() {
        expect(instance.start).to.be.called;
      });
    });
  });
});
