# Sphero + Pebble + SalesForce

First, let's import Cylon:

    var Cylon = require('../..');

Next up, we'll configure the API Cylon will serve, telling it to serve on port
`8080`.

    Cylon.api({ host: '0.0.0.0', port: '8080' });

We'll also setup a convenince function for some binding we'll need to do later:

    var bind = function(fn, me) {
      return function() { return fn.apply(me, arguments); };
    };

Now that we have Cylon imported, we can start defining our Pebble robot:

    var PebbleRobot = (function() {

Let's define the connections and devices:

      PebbleRobot.prototype.connection = { name: 'pebble', adaptor: 'pebble' };
      PebbleRobot.prototype.device = { name: 'pebble', driver: 'pebble' };

      PebbleRobot.prototype.message = function(robot, msg) {
        robot.message_queue().push(msg);
      };

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      PebbleRobot.prototype.work = function(me) {
        me.pebble.on('connect', function() { console.log("Connected!"); });
      };

      return PebbleRobot;

    })();

Next, let's define our SalesForce robot:

    var SalesforceRobot = (function() {
      function SalesforceRobot() {}

Let's define the connections and devices:

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

      SalesforceRobot.prototype.spheroReport = {};

Tell it what work we want to do:

      SalesforceRobot.prototype.work = function(me) {
        me.salesforce.on('start', function() {
          me.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
            var bucks, key, msg, name, toPebble, val, _ref;

            name = data.sobject.Sphero_Name__c;
            bucks = data.sobject.Bucks__c;

            msg = "Sphero: " + name + ",";
            msg += "data Bucks: " + bucks + ",";
            msg += "SM_Id: " + data.sobject.Id;

            console.log(msg);

            var spheroBot = Cylon.robots[name];
            spheroBot.react(spheroBot.devices.sphero);

            me.spheroReport[name] = bucks;
            toPebble = "";

            _ref = me.spheroReport;

            for (key in _ref) {
              val = _ref[key];
              toPebble += "" + key + ": $" + val + "\n";
            }

            var pebbleBot = Cylon.robots['pebble'];
            pebbleBot.message(pebbleBot.devices.pebble, toPebble);
          });
        });
      };

      return SalesforceRobot;

    })();

Now, Let's define our Sphero robot

    var SpheroRobot = (function() {
      function SpheroRobot() {}

      SpheroRobot.prototype.totalBucks = 1;

      SpheroRobot.prototype.payingPower = true;

      SpheroRobot.prototype.connection = { name: 'sphero', adaptor: 'sphero' };
      SpheroRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

      SpheroRobot.prototype.react = function(device) {
        device.setRGB(0x00FF00);
        device.roll(90, Math.floor(Math.random() * 360));
        this.payingPower = true;
      };

      SpheroRobot.prototype.bankrupt = function() {
        var _this = this;
        every(3..seconds(), function() {
          if (_this.payingPower && _this.totalBucks > 0) {
            _this.totalBucks += -1;
            if (_this.totalBucks === 0) {
              _this.sphero.setRGB(0xFF000);
              _this.sphero.stop();
            }
          }
        });
      };

      SpheroRobot.prototype.changeDirection = function() {
        var _this = this;
        every((1).seconds(), function() {
          if (_this.payingPower) {
            _this.sphero.roll(90, Math.floor(Math.random() * 360));
          }
        });
      };

Tell it what work we want to do:

      SpheroRobot.prototype.work = function(me) {
        me.sphero.on('connect', function() {
          console.log('Setting up Collision Detection...');
          me.sphero.detectCollisions();
          me.sphero.stop();
          me.sphero.setRGB(0x00FF00);
          me.sphero.roll(90, Math.floor(Math.random() * 360));
          me.bankrupt();
          me.changeDirection();
        });

        me.sphero.on('collision', function(data) {
          me.sphero.setRGB(0x0000FF);
          me.sphero.stop();
          me.payingPower = false;

          data = JSON.stringify({
            spheroName: "" + me.name,
            bucks: "" + (me.totalBucks++)
          });

          var sf = Cylon.robots['salesforce'];
          sf.devices.salesforce.push("SpheroController", "POST", data);
        });
      };

      return SpheroRobot;

    })();

Now that we've defined all of our bots, let's tell Cylon about them:

    var salesforceRobot = new SalesforceRobot();
    salesforceRobot.name = "salesforce";
    Cylon.robot(salesforceRobot);

    var pebbleRobot = new PebbleRobot();
    pebbleRobot.name = "pebble";
    Cylon.robot(pebbleRobot);

    var bots = [
      { port: '/dev/tty.Sphero-ROY-AMP-SPP', name: 'ROY' },
      { port: '/dev/tty.Sphero-GBO-AMP-SPP', name: 'GBO' },
      { port: '/dev/tty.Sphero-RRY-AMP-SPP', name: 'RRY' }
    ];

    for (var i = 0; i < bots.length; i++) {
      var bot = bots[i];
      var robot = new SpheroRobot;

      robot.connection.port = bot.port;
      robot.name = bot.name;

      Cylon.robot(robot);
    }

Now that Cylon knows about all our robots, and what they'll be doing, we can
start:

    Cylon.start();
