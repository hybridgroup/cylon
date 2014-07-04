"use strict";

var fs = require('fs');

var DigitalPin = source('io/digital-pin'),
    Utils = source('utils');

describe("Cylon.IO.DigitalPin", function() {
  var pin = new DigitalPin({ pin: '4', mode: 'w' })

  describe("constructor", function() {
    it("sets @pinNum to the pin number passed in opts", function() {
      expect(pin.pinNum).to.be.eql('4');
    });

    it("sets @status to 'low' by default", function() {
      expect(pin.status).to.be.eql("low");
    });

    it("sets @ready to false by default", function() {
      expect(pin.ready).to.be.false;
    });

    it("sets @mode to the mode passed in opts", function() {
      expect(pin.mode).to.be.eql("w");
    });
  });

  describe("#connect", function() {
    var path = "/sys/class/gpio/gpio4";

    context("if the GPIO file for the pin exists", function() {
      beforeEach(function() {
        stub(fs, 'exists').callsArgWith(1, true);
        stub(pin, '_openPin');
      });

      afterEach(function() {
        fs.exists.restore();
        pin._openPin.restore();
      });

      it("opens the pin", function() {
        pin.connect(pin.mode);
        expect(fs.exists).to.be.calledWith(path);
        expect(pin._openPin).to.be.called;
      });
    });

    context("if the GPIO file for the pin doesn't exist", function() {
      beforeEach(function() {
        stub(fs, 'exists').callsArgWith(1, false);
        stub(pin, '_createGPIOPin');
      });

      afterEach(function() {
        fs.exists.restore();
        pin._createGPIOPin.restore();
      });

      it("creates a new GPIO pin", function() {
        pin.connect(pin.mode);
        expect(fs.exists).to.be.calledWith(path);
        expect(pin._createGPIOPin).to.be.called;
      });
    });
  });

  describe("#close", function() {
    var path = "/sys/class/gpio/unexport";

    beforeEach(function() {
      stub(fs, 'writeFile').callsArgWith(2, false);
      stub(pin, '_closeCallback');
    });

    afterEach(function() {
      fs.writeFile.restore();
      pin._closeCallback.restore();
    });

    it("writes to the GPIO unexport path with the pin's value", function() {
      pin.close();
      expect(fs.writeFile).to.be.calledWith(path, '4');
    });

    it("calls the closeCallback", function() {
      pin.close();
      expect(pin._closeCallback).to.be.calledWith(false);
    });
  });

  describe("#closeSync", function() {
    var path = "/sys/class/gpio/unexport";

    beforeEach(function() {
      stub(fs, 'writeFileSync');
      stub(pin, '_closeCallback');
    });

    afterEach(function() {
      fs.writeFileSync.restore();
      pin._closeCallback.restore();
    });

    it("writes to the GPIO unexport path with the pin's value", function() {
      pin.closeSync();
      expect(fs.writeFileSync).to.be.calledWith(path, '4');
    });

    it("calls the closeCallback", function() {
      pin.closeSync();
      expect(pin._closeCallback).to.be.calledWith(false);
    });
  });

  describe("#digitalWrite", function() {
    var path = "/sys/class/gpio/gpio4/value";

    context("if pin mode isn't 'w'", function() {
      beforeEach(function() {
        stub(fs, 'writeFile');
        stub(pin, '_setMode');
      });

      afterEach(function() {
        fs.writeFile.restore();
        pin._setMode.restore();
      });

      it("sets the pin mode to 'w'", function() {
        pin.mode = 'r';
        pin.digitalWrite(1);
        expect(pin._setMode).to.be.calledWith('w');
      });
    });

    context("when successful", function() {
      beforeEach(function() {
        pin.mode = 'w';
        stub(fs, 'writeFile').callsArgWith(2, null);
        stub(pin, 'emit');
      });

      afterEach(function() {
        fs.writeFile.restore();
        pin.emit.restore();
      });

      it("emits a digitalWrite event with the written value", function()  {
        pin.digitalWrite(1);
        expect(fs.writeFile).to.be.calledWith(path, 1);
        expect(pin.emit).to.be.calledWith('digitalWrite', 1);
      });

      it("returns the passed value", function() {
        expect(pin.digitalWrite(1)).to.be.eql(1);
      });

      it("changes the pin's @status", function() {
        pin.status = 'low';
        pin.digitalWrite(1);
        expect(pin.status).to.be.eql('high');
      });
    });

    context("when there is an error", function() {
      beforeEach(function() {
        pin.mode = 'w';
        stub(fs, 'writeFile').callsArgWith(2, true);
        stub(pin, 'emit');
      });

      afterEach(function() {
        fs.writeFile.restore();
        pin.emit.restore();
      });

      it("emits an error message", function() {
        pin.digitalWrite(1);
        expect(pin.emit).to.be.calledWith('error');
      });
    });
  });

  describe("#digitalRead", function() {
    var path = "/sys/class/gpio/gpio4/value";

    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      this.clock.restore();
    });

    context("if the mode isn't 'r'", function() {
      beforeEach(function() {
        stub(Utils, 'every');
        stub(pin, '_setMode');
      });

      afterEach(function() {
        Utils.every.restore();
        pin._setMode.restore();
      });

      it("sets the pin mode to 'r'", function() {
        pin.mode = 'w';
        pin.digitalRead(500);
        expect(pin._setMode).to.be.calledWith('r');
      });
    });

    context("when successful", function() {
      beforeEach(function() {
        stub(fs, 'readFile').callsArgWith(1, null, 1);
        stub(pin, 'emit');
      });

      afterEach(function() {
        fs.readFile.restore();
        pin.emit.restore();
      });

      it("requests the pin value on the specified interval", function() {
        pin.digitalRead(500);
        this.clock.tick(510);

        expect(fs.readFile).to.be.calledOnce;

        this.clock.tick(500);
        expect(fs.readFile).to.be.calledTwice;
      });

      it("emits a 'digitalRead' event with the data recieved", function() {
        pin.digitalRead(500);
        this.clock.tick(510);

        expect(pin.emit).to.be.calledWith('digitalRead', 1);
      });
    });

    context("when an error occurs", function() {
      beforeEach(function() {
        stub(fs, 'readFile').callsArgWith(1, true, null);
        stub(pin, 'emit');
      });

      afterEach(function() {
        fs.readFile.restore();
        pin.emit.restore();
      });

      it("emits an error message", function() {
        pin.digitalRead(500);
        this.clock.tick(500);

        expect(pin.emit).to.be.calledWith('error');
      });
    });
  });

  describe("#setHigh", function() {
    beforeEach(function() {
      stub(pin, 'digitalWrite');
    });

    afterEach(function() {
      pin.digitalWrite.restore();
    });

    it("calls #digitalWrite with a value of 1", function() {
      pin.setHigh();
      expect(pin.digitalWrite).to.be.calledWith(1);
    });
  });

  describe("#setLow", function() {
    beforeEach(function() {
      stub(pin, 'digitalWrite');
    });

    afterEach(function() {
      pin.digitalWrite.restore();
    });

    it("calls #digitalWrite with a value of 0", function() {
      pin.setLow();
      expect(pin.digitalWrite).to.be.calledWith(0);
    });
  });

  describe("#toggle", function() {
    context("when @status is 'high'", function() {
      beforeEach(function() {
        stub(pin, 'setLow')
        pin.status = "high";
      });

      afterEach(function() {
        pin.setLow.restore();
      });

      it("calls #setLow", function() {
        pin.toggle();
        expect(pin.setLow).to.be.called;
      });
    });

    context("when @status is 'low'", function() {
      beforeEach(function() {
        stub(pin, 'setHigh')
        pin.status = "low";
      });

      afterEach(function() {
        pin.setHigh.restore();
      });

      it("calls #setHigh", function() {
        pin.toggle();
        expect(pin.setHigh).to.be.called;
      });
    });
  });

  describe("#_createGPIOPin", function() {
    var path = "/sys/class/gpio/export";

    context("when successful", function() {
      beforeEach(function() {
        stub(fs, 'writeFile').callsArgWith(2, null);
        stub(pin, "_openPin");
      });

      afterEach(function() {
        fs.writeFile.restore();
        pin._openPin.restore();
      });

      it("writes the pin number to the GPIO export path", function() {
        pin._createGPIOPin();
        expect(fs.writeFile).to.be.calledWith(path, "4")
      })

      it("calls #_openPin", function() {
        pin._createGPIOPin();
        expect(pin._openPin).to.be.called;
      });
    });

    context("when an error occurs", function() {
      beforeEach(function() {
        stub(fs, 'writeFile').callsArgWith(2, true);
        stub(pin, "emit");
      });

      afterEach(function() {
        fs.writeFile.restore();
        pin.emit.restore();
      });

      it("emits an error", function() {
        pin._createGPIOPin();
        expect(pin.emit).to.be.calledWith('error');
      });
    });
  })

  describe("#_openPin", function() {
    beforeEach(function() {
      stub(pin, '_setMode');
      stub(pin, 'emit');
    });

    afterEach(function() {
      pin._setMode.restore();
      pin.emit.restore();
    });

    it("sets the pin's mode", function() {
      pin._openPin();
      expect(pin._setMode).to.be.calledWith(pin.mode);
    });

    it("emits the 'open' event", function() {
      pin._openPin();
      expect(pin.emit).to.be.calledWith('open');
    });
  });

  describe("_closeCallback", function() {
    context("if there is an error", function() {
      beforeEach(function() {
        stub(pin, 'emit');
        pin._closeCallback(true);
      });

      afterEach(function() {
        pin.emit.restore();
      });

      it("emits an error", function() {
        expect(pin.emit).to.be.calledWith('error');
      });
    });

    context("if there is no error", function() {
      beforeEach(function() {
        stub(pin, 'emit');
        pin._closeCallback(false);
      });

      afterEach(function() {
        pin.emit.restore();
      });

      it("emits a 'close' event with the pin number", function() {
        expect(pin.emit).to.be.calledWith('close', '4');
      })
    });
  });

  describe("#_setMode", function() {
    var path = "/sys/class/gpio/gpio4/direction";

    beforeEach(function() {
      stub(fs, 'writeFile').callsArgWith(2, 'error');
      stub(pin, '_setModeCallback');
    });

    afterEach(function() {
      fs.writeFile.restore();
      pin._setModeCallback.restore();
    });

    context("when mode is 'w'", function() {
      it("writes to the pin's direction path with 'out'", function() {
        pin._setMode('w');
        expect(fs.writeFile).to.be.calledWith(path, 'out');
      });

      it("calls #_setModeCallback with any error message", function() {
        pin._setMode('w', true);
        expect(pin._setModeCallback).to.be.calledWith('error', true);
      });
    });

    context("when mode is 'r'", function() {
      it("writes to the pin's direction path with 'in'", function() {
        pin._setMode('r');
        expect(fs.writeFile).to.be.calledWith(path, 'in');
      });
    });
  });

  describe("#_setModeCallback", function() {
    beforeEach(function() {
      stub(pin, 'emit');
    });

    afterEach(function() {
      pin.emit.restore();
    });

    context("when successful", function() {
      it("sets @ready to true", function() {
        pin.ready = false;
        pin._setModeCallback(false);
        expect(pin.ready).to.be.eql(true);
      });

      context("when emitConnect is true", function() {
        it("emits a 'connect' event with the pin's mode", function() {
          pin._setModeCallback(false, true);
          expect(pin.emit).to.be.calledWith('connect', pin.mode);
        });
      });
    });

    context("when passed an error", function() {
      it('emits an error', function() {
        pin._setModeCallback(true);
        expect(pin.emit).to.be.calledWith('error');
      });
    });
  });

  describe("#_pinPath", function() {
    var path = "/sys/class/gpio/gpio4";

    it("returns the path to the GPIO pin", function() {
      expect(pin._pinPath()).to.be.eql(path);
    });
  });

  describe("#_directionPath", function() {
    var path = "/sys/class/gpio/gpio4/direction";

    it("returns the path to the GPIO pin's direction file", function() {
      expect(pin._directionPath()).to.be.eql(path);
    });
  });

  describe("#_valuePath", function() {
    var path = "/sys/class/gpio/gpio4/value";

    it("returns the path to the GPIO pin's value file", function() {
      expect(pin._valuePath()).to.be.eql(path);
    });
  });

  describe("#_exportPath", function() {
    var path = "/sys/class/gpio/export";

    it("returns the GPIO export path", function() {
      expect(pin._exportPath()).to.be.eql(path);
    });
  });

  describe("#_unexportPath", function() {
    var path = "/sys/class/gpio/unexport";

    it("returns the GPIO unexport path", function() {
      expect(pin._unexportPath()).to.be.eql(path);
    });
  });
});
