'use strict';

source "driver"

describe "Driver", ->
  driver = new Cylon.Driver(name: 'max', device: {connection: 'connect', pin: 13})

  it 'needs tests'
