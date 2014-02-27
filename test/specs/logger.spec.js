(function() {
  'use strict';
  source('logger');

  describe('Logger', function() {
    it("sets to NullLogger if false is provided", function() {
      Logger.setup(false);
      return Logger.toString().should.be.equal("NullLogger");
    });
    it("sets to BasicLogger if nothing is provided", function() {
      Logger.setup();
      return Logger.toString().should.be.equal("BasicLogger");
    });
    it("allows for custom loggers", function() {
      var logger;
      logger = {
        toString: function() {
          return "CustomLogger";
        }
      };
      Logger.setup(logger);
      return Logger.toString().should.be.equal("CustomLogger");
    });
    return it('passes all received args to loggers', function() {
      var logger;
      logger = {
        debug: function(message, level) {
          return "Debug Level " + level + ": " + message;
        }
      };
      Logger.setup(logger);
      Logger.debug("demo", 4).should.be.equal("Debug Level 4: demo");
      return Logger.setup(false);
    });
  });

}).call(this);
