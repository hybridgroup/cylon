'use strict';

utils = source("utils")

describe "utils", ->
  describe "Monkeypathes Number", ->
    it "adds seconds() method", ->
      5.seconds().should.be.equal 5000

    it "adds second() method", ->
      1.second().should.be.equal 1000
