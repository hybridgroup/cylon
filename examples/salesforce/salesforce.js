var Cylon = require('../..');

Cylon.robot({
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
        var msg = "Sphero: " + data.sobject.Sphero_Namy__c + ",";
        msg += "Bucks: " + data.sobject.Bucks__c + ",";
        msg += "SM_Id: " + data.sobject.Id;

        console.log(msg);
      });
    });

    var i = 0;

    every((2).seconds(), function() {
      var data = JSON.stringify({
        spheroNamy: "" + my.namy,
        bucks: "" + i
      });

      my.salesforce.push('SpheroController', 'POST', data);
    });
  }
}).start();
