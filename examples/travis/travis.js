var Cylon = require('../..'),
    Travis = require('travis-ci');

var travis = new Travis({version: '2.0.0'});

Cylon.robot({
  connections: {
    sphero: { adaptor: 'sphero', port: '/dev/rfcomm0' }
  },

  devices: {
    sphero: { driver: 'sphero' }
  },

  work: function(my) {
    var user = "hybridgroup",
        name = "cylon";

    var checkTravis = function() {
      console.log("Checking repo " + user + "/" + name);
      my.sphero.setColor('blue', true);

      travis.repos({ owner_name: user, name: name }, function(err, res) {
        if (res.repo === undefined) { my.sphero.setColor('blue', true); }

        switch (res.repo.last_build_state) {
          case 'passed':
            my.sphero.setColor('green', true);
            break;
          case 'failed':
            my.sphero.setColor('red', true);
            break;
          default:
            my.sphero.setColor('blue', true);
        }
      });
    }

    checkTravis();

    every((10).seconds(), checkTravis);
  }
}).start();
