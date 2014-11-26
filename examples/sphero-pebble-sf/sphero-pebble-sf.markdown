# Sphero + Pebble + SalesForce

First, let's import Cylon:

    var Cylon = require('../..');

Next up, we'll configure the API Cylon will serve, telling it to serve on port
`8080`.

    Cylon.api({ host: '0.0.0.0', port: '8080' });

Now that we have Cylon imported, we can start defining our Pebble robot:

    Cylon.robot({
      name: 'pebble',

Let's define the connections and devices:

      connections: {
        pebble: { adaptor: 'pebble' }
      },

      devices: {
        pebble: { driver: 'pebble' }
      },

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      message: function(msg) {
        this.message_queue().push(msg);
      },

      work: function(my) {
        console.log('Pebble connected');
      }
    });

Next, let's define our SalesForce robot:

    Cylon.robot({
      name: 'salesforce',

Let's define the connections and devices:

      connections: {
        sfcon: {
          adaptor: 'force',
          sfuser: process.env.SF_USERNAME,
          sfpass: process.env.SF_SECURITY_TOKEN,
          orgCreds: {
            clientId: process.env.SF_CLIENT_ID,
            clientSecret: process.env.SF_CLIENT_SECRET,
            redirectUri: 'http://localhost:3000/oauth/_callback'
          }
        }
      },

      devices: {
        salesforce: { driver: 'force' }
      },

Tell it what work we want to do:

      spheroReport: {},

      work: function(my) {
        my.salesforce.on('start', function() {
          my.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
            var toPebble = "",
                name = data.sobject.Sphero_Name__c,
                bucks = data.sobject.Bucks__c;

            var msg = "Sphero: " + name + ",";
            msg += "data Bucks: " + bucks + ",";
            msg += "SM_Id: " + data.sobject.Id;

            console.log(msg);

            var sphero = Cylon.robots[name];
            sphero.react();

            my.spheroReport[name] = bucks;

            for (var key in my.spheroReport) {
              var val = my.spheroReport[key];
              toPebble += key + ": $" + val + "\n";
            }

            var pebble = Cylon.robots.pebble;
            pebble.message(toPebble);
          });
        });
      }
    });

Now, Let's define our Sphero robots:

    var bots = [
      { port: '/dev/tty.Sphero-ROY-AMP-SPP', name: 'ROY' },
      { port: '/dev/tty.Sphero-GBO-AMP-SPP', name: 'GBO' },
      { port: '/dev/tty.Sphero-RRY-AMP-SPP', name: 'RRY' }
    ];

    bots.forEach(function(bot) {
      Cylon.robot({
        name: bot.name,

        connections: {
          sphero: { adaptor: 'sphero', port: bot.port }
        },

        devices: {
          sphero: { driver: 'sphero' }
        },

        totalBucks: 1,
        payingPower: true,


Tell them what work we want to do:

        react: function() {
          this.sphero.setRGB(0x00FF00);
          this.sphero.roll(90, Math.floor(Math.random() * 360));

          this.payingPower = true;
        },

        bankrupt: function() {
          var my = this;

          every((3).seconds(), function() {
            if (my.payingPower && my.totalBucks > 0) {
              my.totalBucks += -1;

              if (my.totalBucks === 0) {
                my.sphero.setRGB(0xFF000);
                my.sphero.stop();
              }
            }
          });
        },

        changeDirection: function() {
          var my = this;

          every((1).seconds(), function() {
            if (my.payingPower) {
              my.sphero.roll(90, Math.floor(Math.random() * 360));
            }
          });
        },

        work: function(my) {
          console.log("Setting up collision detection for " + my.name);

          my.sphero.detectCollisions();

          my.sphero.stop();

          my.sphero.setRGB(0x00FF00);

          my.sphero.roll(90, Math.floor(Math.random() * 360));

          my.bankrupt();
          my.changeDirection();

          my.sphero.on('collision', function() {
            my.sphero.setRGB(0x0000FF);
            my.sphero.stop();
            my.payingPower = false;

            var data = JSON.stringify({
              spheroName: my.name,
              bucks: "" + (my.totalBucks++)
            });

            var sf = Cylon.robots['salesforce'];
            sf.devices.salesforce.push("SpheroController", "POST", data);
          });
        }
      });
    });

Now that Cylon knows about all our robots, and what they'll be doing, we can start:

    Cylon.start();
