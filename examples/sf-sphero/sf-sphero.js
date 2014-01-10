var __bind = function(fn, me) {
  return function() { return fn.apply(me, arguments); };
};

var Cylon = require('../..');

var SalesforceRobot = (function() {
  function SalesforceRobot() {}

  SalesforceRobot.prototype.connection = {
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN,
    orgCreds: {
      clientId: process.env.SF_CLIENT_ID,
      clientSecret: process.env.SF_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }
  };

  SalesforceRobot.prototype.device = { name: 'salesforce', driver: 'force' };

  SalesforceRobot.prototype.work = function(me) {
    me.salesforce.on('start', function() {
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
        var msg;
        msg = "Sphero: " + data.sobject.Sphero_Name__c + ",";
        msg += "Bucks: " + data.sobject.Bucks__c + ",";
        msg += "SM_Id: " + data.sobject.Id;
        console.log(msg);
        me.master.findRobot(data.sobject.Sphero_Name__c, function(err, spheroBot) {
          spheroBot.react(spheroBot.devices.sphero);
        });
      });
    });
  };

  return SalesforceRobot;

})();

var SpheroRobot = (function() {
  function SpheroRobot() {
    this.react = __bind(this.react, this);
  }

  SpheroRobot.prototype.totalBucks = 0;

  SpheroRobot.prototype.connection = { name: 'sphero', adaptor: 'sphero' };
  SpheroRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  SpheroRobot.prototype.react = function(robot) {
    robot.setRGB(0x00FF00);
    robot.roll(90, Math.floor(Math.random() * 360));
  };

  SpheroRobot.prototype.work = function(me) {
    me.sphero.on('connect', function() {
      console.log('Setting up Collision Detection...');
      me.sphero.detectCollisions();
      me.sphero.stop();
      me.sphero.setRGB(0x00FF00);
      me.sphero.roll(90, Math.floor(Math.random() * 360));
    });
    me.sphero.on('collision', function(data) {
      me.sphero.setRGB(0x0000FF, me);
      me.sphero.stop();
      data = JSON.stringify({
        spheroName: "" + me.name,
        bucks: "" + (me.totalBucks++)
      });
      me.master.findRobot('salesforce', function(err, sf) {
        sf.devices.salesforce.push('SpheroController', 'POST', data);
      });
    });
  };

  return SpheroRobot;

})();

var sfRobot = new SalesforceRobot();
sfRobot.name = "salesforce";
Cylon.robot(sfRobot);

var spheroRobot = new SpheroRobot();
spheroRobot.name = 'ROY';
spheroRobot.connection.port = '/dev/rfcomm0';
Cylon.robot(spheroRobot);

Cylon.start();
