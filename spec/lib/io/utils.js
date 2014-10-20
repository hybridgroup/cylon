"use strict";

var Utils = source('io/utils.js');

describe("IOUtils", function() {
  describe("#periodAndDuty", function() {
    var fn = Utils.periodAndDuty;

    it("calculates values for PWM", function() {
      var value = fn(0.5, 2000, null, null);
      expect(value).to.be.eql({ period: 500000, duty: 250000 })
    });

    it("calculates values for servos", function() {
      var value = fn(0.5, 50, { min: 500, max: 2400 }, 'high');
      expect(value).to.be.eql({ duty: 1450000, period: 20000000 })
    });

    it("calculates values for different polarities", function() {
      var value = fn(0.5, 50, { min: 500, max: 2400 }, 'low');
      expect(value).to.be.eql({ duty: 18550000, period: 20000000 })
    });
  });
});
