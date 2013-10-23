'use strict';

Driver = source("driver")

describe "Driver", ->
  driver = new Driver(name: "driving")

  it "should have a name", ->
    driver.should.have.keys 'name'
    driver.name.should.be.equal 'driving'
