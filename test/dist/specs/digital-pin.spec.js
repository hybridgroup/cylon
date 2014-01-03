(function() {
  'use strict';
  var fs;

  source('digital-pin');

  fs = require('fs');

  describe("DigitalPin", function() {
    var pin;
    pin = new Cylon.IO.DigitalPin({
      pin: '13',
      mode: 'w'
    });
    describe("#constructor", function() {
      it("assigns @pinNum to the passed pin", function() {
        return expect(pin.pinNum).to.be.eql("13");
      });
      it("sets @mode to the passed mode", function() {
        return expect(pin.mode).to.be.eql('w');
      });
      it("sets @status to 'low' by default", function() {
        return expect(pin.status).to.be.eql("low");
      });
      return it("sets @ready to false by default", function() {
        return expect(pin.ready).to.be.eql(false);
      });
    });
    describe("#connect", function() {
      it("sets @mode if it wasn't already set", function() {
        sinon.stub(fs, 'exists').callsArgWith(1, true);
        sinon.stub(pin, '_openPin').returns(true);
        pin.mode = null;
        pin.connect('w');
        expect(pin.mode).to.be.eql('w');
        fs.exists.restore();
        return pin._openPin.restore();
      });
      it("opens the pin if the pin exists", function() {
        var spy;
        sinon.stub(fs, 'exists').callsArgWith(1, true);
        spy = sinon.stub(pin, '_openPin').returns(true);
        pin.connect();
        assert(spy.calledOnce);
        fs.exists.restore();
        return pin._openPin.restore();
      });
      return it("creates a new GPIO pin if the pin doesn't exist", function() {
        var spy;
        sinon.stub(fs, 'exists').callsArgWith(1, false);
        spy = sinon.stub(pin, '_createGPIOPin').returns(true);
        pin.connect();
        assert(spy.calledOnce);
        fs.exists.restore();
        return pin._createGPIOPin.restore();
      });
    });
    describe("#close", function() {
      return it("writes to the unexport path and triggers the close callback", function() {
        var callback, writeFile;
        callback = sinon.stub(pin, '_closeCallback').returns(true);
        writeFile = sinon.stub(fs, 'writeFile');
        fs.writeFile.callsArgWith(2, "err").returns(true);
        pin.close();
        assert(writeFile.calledWith(pin._unexportPath(), pin.pinNum));
        assert(callback.calledWith("err"));
        fs.writeFile.restore();
        return pin._closeCallback.restore();
      });
    });
    describe("#closeSync", function() {
      return it("writes to the unexport path synchronously and calls the close callback", function() {
        var writeFile;
        writeFile = sinon.stub(fs, 'writeFileSync').returns(true);
        pin.closeSync();
        assert(writeFile.calledWith(pin._unexportPath(), pin.pinNum));
        return fs.writeFileSync.restore();
      });
    });
    describe("#digitalWrite", function() {
      it("sets the pin mode to 'w' if it wasn't already", function() {
        var setMode;
        setMode = sinon.stub(pin, "_setMode").returns(true);
        sinon.stub(fs, 'writeFile').returns(true);
        pin.mode = 'r';
        pin.digitalWrite(1);
        assert(setMode.calledWith("w"));
        fs.writeFile.restore();
        return pin._setMode.restore();
      });
      it("sets the status to the digital value being written", function() {
        sinon.stub(fs, 'writeFile').returns(true);
        pin.digitalWrite(1);
        expect(pin.status).to.be.eql('high');
        return fs.writeFile.restore();
      });
      it("writes to the pin and emits 'digitalWrite' on success", function() {
        var emit;
        sinon.stub(fs, 'writeFile').callsArgWith(2, null);
        emit = sinon.stub(pin, "emit").returns(true);
        pin.digitalWrite(1);
        assert(emit.calledWith('digitalWrite'));
        fs.writeFile.restore();
        return pin.emit.restore();
      });
      return it("writes to the pin and emits 'error' on failure", function() {
        var emit;
        sinon.stub(fs, 'writeFile').callsArgWith(2, "err");
        emit = sinon.stub(pin, "emit").returns(true);
        pin.digitalWrite(1);
        assert(emit.calledWith('error'));
        fs.writeFile.restore();
        return pin.emit.restore();
      });
    });
    describe("#digitalRead", function() {
      it("sets the mode to 'r' if it isn't already", function() {
        var setMode;
        sinon.stub(global, 'every');
        setMode = sinon.stub(pin, "_setMode").returns(true);
        pin.mode = 'w';
        pin.digitalRead(1);
        assert(setMode.calledWith("r"));
        global.every.restore();
        return pin._setMode.restore();
      });
      it("runs readFile on an interval", function() {
        var clock, readFile;
        clock = sinon.useFakeTimers();
        readFile = sinon.stub(fs, 'readFile').returns(true);
        sinon.stub(pin, "_setMode").returns(true);
        pin.digitalRead(250);
        clock.tick(300);
        assert(readFile.calledOnce);
        fs.readFile.restore();
        pin._setMode.restore();
        return clock.restore();
      });
      it("emits 'digitalRead' with the data on success", function() {
        var clock, emit;
        clock = sinon.useFakeTimers();
        sinon.stub(fs, 'readFile').callsArgWith(1, null, "1");
        emit = sinon.stub(pin, 'emit').returns(true);
        sinon.stub(pin, "_setMode").returns(true);
        pin.digitalRead(250);
        clock.tick(300);
        assert(emit.calledWith('digitalRead', 1));
        fs.readFile.restore();
        pin.emit.restore();
        pin._setMode.restore();
        return clock.restore();
      });
      return it("emits 'error' with the on failure", function() {
        var clock, emit;
        clock = sinon.useFakeTimers();
        sinon.stub(fs, 'readFile').callsArgWith(1, true, "1");
        emit = sinon.stub(pin, 'emit').returns(true);
        sinon.stub(pin, "_setMode").returns(true);
        pin.digitalRead(250);
        clock.tick(300);
        assert(emit.calledWith('error'));
        fs.readFile.restore();
        pin.emit.restore();
        pin._setMode.restore();
        return clock.restore();
      });
    });
    describe("#setHigh", function() {
      return it("calls digitalWrite, setting the pin to 'HIGH'", function() {
        var write;
        write = sinon.stub(pin, 'digitalWrite').returns(true);
        pin.setHigh();
        assert(write.calledWith(1));
        return pin.digitalWrite.restore();
      });
    });
    describe("#setLow", function() {
      return it("calls digitalWrite, setting the pin to 'low'", function() {
        var write;
        write = sinon.stub(pin, 'digitalWrite').returns(true);
        pin.setLow();
        assert(write.calledWith(0));
        return pin.digitalWrite.restore();
      });
    });
    return describe("#toggle", function() {
      context("when the pin is 'high'", function() {
        return it("sets the pin to 'low'", function() {
          var set;
          pin.status = 'high';
          set = sinon.stub(pin, 'setLow').returns(true);
          pin.toggle();
          assert(set.calledOnce);
          return pin.setLow.restore();
        });
      });
      return context("when the pin is 'low'", function() {
        return it("sets the pin to 'high'", function() {
          var set;
          pin.status = 'low';
          set = sinon.stub(pin, 'setHigh').returns(true);
          pin.toggle();
          assert(set.calledOnce);
          return pin.setHigh.restore();
        });
      });
    });
  });

}).call(this);
