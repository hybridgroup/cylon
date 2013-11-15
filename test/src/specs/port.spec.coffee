'use strict';

source "port"

describe "Port", ->
  describe "remote TCP port", ->
    port = new Cylon.Port("192.168.0.1:8080")

    it "#port", ->
      port.port.should.be.equal "8080"

    it "#isTcp", ->
      port.isTcp.should.be.true

    it "#isSerial", ->
      port.isSerial.should.be.false

    it "#isPortless", ->
      port.isPortless.should.be.false

    it "#toString", ->
      port.toString().should.be.equal "192.168.0.1:8080"

  describe "local TCP port", ->
    port = new Cylon.Port("5678")

    it "#port", ->
      port.port.should.be.equal "5678"

    it "#isTcp", ->
      port.isTcp.should.be.true

    it "#isSerial", ->
      port.isSerial.should.be.false

    it "#isPortless", ->
      port.isPortless.should.be.false

    it "#toString", ->
      port.toString().should.be.equal "localhost:5678"

  describe "serial port", ->
    port = new Cylon.Port("/dev/tty.usb12345")

    it "#port", ->
      port.port.should.be.equal "/dev/tty.usb12345"

    it "#isTcp", ->
      port.isTcp.should.be.false

    it "#isSerial", ->
      port.isSerial.should.be.true

    it "#isPortless", ->
      port.isPortless.should.be.false

    it "#toString", ->
      port.toString().should.be.equal "/dev/tty.usb12345"

  describe "portless", ->
    port = new Cylon.Port

    it "#port", ->
      # cannot call .should on undefined(void 0)
      assert port.port is undefined

    it "#isTcp", ->
      port.isTcp.should.be.false

    it "#isSerial", ->
      port.isSerial.should.be.false

    it "#isPortless", ->
      port.isPortless.should.be.true

    it "#toString", ->
      port.toString().should.be.equal "none"
