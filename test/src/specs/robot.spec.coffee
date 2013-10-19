'use strict';

Robot = source("robot")
#robot = require '../dist/robot.js'
#Robot = require("#{__dirname}/robot")

describe "basic tests", ->
  r = new Robot("irobot")

  it "robot should have a name", ->
    r.should.have.keys 'name'
    r.name.should.be.equal 'irobot'
