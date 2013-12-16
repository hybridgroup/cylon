'use strict';

source "digital-pin"

describe "DigitalPin", ->
  pin = new Cylon.IO.DigitalPin(pin: '13', mode: 'w')

  it "should connect"
  it "should close"
  it "should closeSync"
  it "should digitalWrite"
  it "should digitalRead"
  it "should setHigh"
  it "should setLow"
  it "should toggle"
