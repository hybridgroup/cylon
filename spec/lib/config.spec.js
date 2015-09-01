"use strict";

var config = lib("config");

describe("config", function() {
  it("contains configuration options", function() {
    expect(config.testMode).to.be.eql(false);
  });

  describe("#update", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      config.subscribe(callback);
    });

    afterEach(function() {
      config.unsubscribe(callback);
      delete config.newValue;
    });

    it("updates the configuration", function() {
      expect(config.newValue).to.be.eql(undefined);
      config.update({ newValue: "value" });
      expect(config.newValue).to.be.eql("value");
    });

    it("notifies subscribers of changes", function() {
      var update = { newValue: "value" };
      expect(callback).to.not.be.called;
      config.update(update);
      expect(callback).to.be.calledWith(update);
    });

    it("rejects changes that conflict with config functions", function() {
      config.update({ update: null });
      expect(config.update).to.be.a("function");
    });

    it("does nothing with empty changesets", function() {
      config.update({});
      expect(callback).to.not.be.called;
    });
  });

  describe("#subscribe", function() {
    var callback = spy();

    afterEach(function() {
      delete config.test;
      config.unsubscribe(callback);
    });

    it("subscribes a callback to change updates", function() {
      config.subscribe(callback);
      config.update({ test: true });
      expect(callback).to.be.calledWith({ test: true });
    });
  });

  describe("#unsubscribe", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      config.subscribe(callback);
    });

    afterEach(function() {
      delete config.test;
    });

    it("unsubscribes a callback from change updates", function() {
      config.update({ test: true });
      expect(callback).to.be.called;

      config.unsubscribe(callback);

      config.update({ test: false });
      expect(callback).to.be.calledOnce;
    });
  });
});
