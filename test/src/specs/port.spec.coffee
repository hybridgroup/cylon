'use strict';

Port = source("port")

describe "tcp port", ->
  p = new Port("locahost:4567")

  it "should have a host", ->
    p.host.should.be.equal 'localhost'

  it "should have a port", ->
    p.port.should.be.equal '4567'
