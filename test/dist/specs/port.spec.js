(function() {
  'use strict';
  source("port");

  describe("Port", function() {
    describe("remote TCP port", function() {
      var port;
      port = new Cylon.Port("192.168.0.1:8080");
      it("#port", function() {
        return port.port.should.be.equal("8080");
      });
      it("#isTcp", function() {
        return port.isTcp.should.be["true"];
      });
      it("#isSerial", function() {
        return port.isSerial.should.be["false"];
      });
      it("#isPortless", function() {
        return port.isPortless.should.be["false"];
      });
      return it("#toString", function() {
        return port.toString().should.be.equal("192.168.0.1:8080");
      });
    });
    describe("local TCP port", function() {
      var port;
      port = new Cylon.Port("5678");
      it("#port", function() {
        return port.port.should.be.equal("5678");
      });
      it("#isTcp", function() {
        return port.isTcp.should.be["true"];
      });
      it("#isSerial", function() {
        return port.isSerial.should.be["false"];
      });
      it("#isPortless", function() {
        return port.isPortless.should.be["false"];
      });
      return it("#toString", function() {
        return port.toString().should.be.equal("localhost:5678");
      });
    });
    describe("serial port", function() {
      var port;
      port = new Cylon.Port("/dev/tty.usb12345");
      it("#port", function() {
        return port.port.should.be.equal("/dev/tty.usb12345");
      });
      it("#isTcp", function() {
        return port.isTcp.should.be["false"];
      });
      it("#isSerial", function() {
        return port.isSerial.should.be["true"];
      });
      it("#isPortless", function() {
        return port.isPortless.should.be["false"];
      });
      return it("#toString", function() {
        return port.toString().should.be.equal("/dev/tty.usb12345");
      });
    });
    return describe("portless", function() {
      var port;
      port = new Cylon.Port;
      it("#port", function() {
        return assert(port.port === void 0);
      });
      it("#isTcp", function() {
        return port.isTcp.should.be["false"];
      });
      it("#isSerial", function() {
        return port.isSerial.should.be["false"];
      });
      it("#isPortless", function() {
        return port.isPortless.should.be["true"];
      });
      return it("#toString", function() {
        return port.toString().should.be.equal("none");
      });
    });
  });

}).call(this);
