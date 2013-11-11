'use strict';

source "test/driver"

describe "Driver", ->
  driver = new Cylon.Driver(name: "driving")

  it "should have a name", ->
    driver.name.should.be.equal 'driving'
