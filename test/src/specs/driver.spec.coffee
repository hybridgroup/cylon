'use strict';

source "driver"

describe "Driver", ->
  driver = new Cylon.Drivers.Driver(name: 'max', device: {connection: 'connect', pin: 13})

  it 'needs tests'
