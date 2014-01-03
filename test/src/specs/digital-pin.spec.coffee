'use strict'

source 'digital-pin'

fs = require('fs')

describe "DigitalPin", ->
  pin = new Cylon.IO.DigitalPin(pin: '13', mode: 'w')

  describe "#constructor", ->
    it "assigns @pinNum to the passed pin", ->
      expect(pin.pinNum).to.be.eql "13"

    it "sets @mode to the passed mode", ->
      expect(pin.mode).to.be.eql 'w'

    it "sets @status to 'low' by default", ->
      expect(pin.status).to.be.eql "low"

    it "sets @ready to false by default", ->
      expect(pin.ready).to.be.eql false

  describe "#connect", ->
    it "sets @mode if it wasn't already set", ->
      sinon.stub(fs, 'exists').callsArgWith(1, true)
      sinon.stub(pin, '_openPin').returns(true)
      pin.mode = null

      pin.connect 'w'
      expect(pin.mode).to.be.eql 'w'

      fs.exists.restore()
      pin._openPin.restore()

    it "opens the pin if the pin exists", ->
      sinon.stub(fs, 'exists').callsArgWith(1, true)
      spy = sinon.stub(pin, '_openPin').returns(true)

      pin.connect()

      assert spy.calledOnce

      fs.exists.restore()
      pin._openPin.restore()

    it "creates a new GPIO pin if the pin doesn't exist", ->
      sinon.stub(fs, 'exists').callsArgWith(1, false)
      spy = sinon.stub(pin, '_createGPIOPin').returns(true)

      pin.connect()

      assert spy.calledOnce

      fs.exists.restore()
      pin._createGPIOPin.restore()

  describe "#close", ->
    it "writes to the unexport path and triggers the close callback", ->
      callback = sinon.stub(pin, '_closeCallback').returns(true)
      writeFile = sinon.stub(fs, 'writeFile')
      fs.writeFile.callsArgWith(2, "err").returns(true)

      pin.close()

      assert writeFile.calledWith pin._unexportPath(), pin.pinNum
      assert callback.calledWith "err"

      fs.writeFile.restore()
      pin._closeCallback.restore()

  describe "#closeSync", ->
    it "writes to the unexport path synchronously and calls the close callback", ->
      writeFile = sinon.stub(fs, 'writeFileSync').returns(true)
      pin.closeSync()
      assert writeFile.calledWith pin._unexportPath(), pin.pinNum
      fs.writeFileSync.restore()

  describe "#digitalWrite", ->
    it "sets the pin mode to 'w' if it wasn't already", ->
      setMode = sinon.stub(pin, "_setMode").returns(true)
      sinon.stub(fs, 'writeFile').returns(true)

      pin.mode = 'r'
      pin.digitalWrite 1

      assert setMode.calledWith("w")

      fs.writeFile.restore()
      pin._setMode.restore()

    it "sets the status to the digital value being written", ->
      sinon.stub(fs, 'writeFile').returns(true)
      pin.digitalWrite(1)
      expect(pin.status).to.be.eql 'high'
      fs.writeFile.restore()

    it "writes to the pin and emits 'digitalWrite' on success", ->
      sinon.stub(fs, 'writeFile').callsArgWith(2, null)
      emit = sinon.stub(pin, "emit").returns(true)
      pin.digitalWrite(1)

      assert emit.calledWith 'digitalWrite'

      fs.writeFile.restore()
      pin.emit.restore()

    it "writes to the pin and emits 'error' on failure", ->
      sinon.stub(fs, 'writeFile').callsArgWith(2, "err")
      emit = sinon.stub(pin, "emit").returns(true)
      pin.digitalWrite(1)

      assert emit.calledWith 'error'

      fs.writeFile.restore()
      pin.emit.restore()

  it "should digitalRead"
  it "should setHigh"
  it "should setLow"
  it "should toggle"
