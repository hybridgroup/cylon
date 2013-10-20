'use strict';

Connection = source("connection")

describe "basic tests", ->
  r = new Connection(name: "connective", adaptor: "adaptive")

  it "connection should have a name", ->
    r.name.should.be.equal 'connective'

  it "connection should have an adaptor", ->
    r.adaptor.should.be.equal 'adaptive'
