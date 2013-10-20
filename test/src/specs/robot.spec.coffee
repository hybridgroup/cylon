'use strict';

Robot = source("robot")

describe "basic tests", ->
  testWork = ->
    console.log "hi"

  r = new Robot(name: "irobot", work: testWork)

  it "robot should have a name", ->
    r.name.should.be.equal 'irobot'

  it "robot should have work", ->
    r.work.should.be.equal testWork
