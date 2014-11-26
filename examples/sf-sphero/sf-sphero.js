var Cylon = require('../..');

Cylon.robot({
  name: 'salesforce',

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

  work: function(my) {
    my.salesforce.on('start', function() {
      my.salesforce.subscribe('/topic/SpheroMsgOutbound', function(data) {
        var msg = "Sphero: " + data.sobject.Sphero_Name__c + ",";
            msg += "Bucks: " + data.sobject.Bucks__c + ",";
            msg += "SM_Id: " + data.sobject.Id;

        console.log(msg);

        var sphero = Cylon.robots[data.sobject.Sphero_Name__c];
        sphero.react();
      });
    });
  }
});

Cylon.robot({
  name: 'ROY',

  connections: {
    sphero: { adaptor: 'sphero' }
  },

  devices: {
    sphero: { driver: 'sphero' }
  },

  react: function() {
    this.sphero.setRGB(0x00FF00);
    this.sphero.roll(90, Math.floor(Math.random() * 360));
  },

  work: function(my) {
    console.log('Setting up collision detection.');
    my.sphero.detectCollisions();

    my.sphero.stop();
    my.sphero.setRGB(0x00FF00);

    my.sphero.roll(90, Math.floor(Math.random() * 360));

    my.sphero.on('collision', function() {
      my.sphero.setRGB(0x0000FF, my);
      my.sphero.stop();

      var data = JSON.stringify({
        spheroName: my.name,
        bucks: "" + (my.totalBucks++)
      });

      var sf = Cylon.robots.salesforce;
      sf.devices.salesforce.push('SpheroController', 'POST', data);
    });
  }
});

Cylon.start();
