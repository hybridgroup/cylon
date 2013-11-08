'use strict';

Cylon = source("cylon")

describe "Cylon", ->
  it "should create a robot", ->
    assert 'robot' in Object.keys(Cylon)
    robot = Cylon.robot(name: 'caprica six')
    robot.name.should.be.eql 'caprica six'
