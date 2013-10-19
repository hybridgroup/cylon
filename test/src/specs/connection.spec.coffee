'use strict';

Connection = source("connection")

describe "basic tests", ->
  r = new Connection("irobot")

  it "connection should have a name", ->
    r.should.have.keys 'name'
    r.name.should.be.equal 'irobot'
