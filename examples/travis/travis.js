var Cylon = require('../..')
var Travis = require('travis-ci')

var travis = new Travis({version: '2.0.0'});

var BLUE = 0x0000ff
var GREEN = 0x00ff00
var RED = 0xff0000

Cylon.robot({
  connection: {name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0'},
  device: {name: 'sphero', driver: 'sphero'},

  work: function(me) {
    var user = "hybridgroup"
    var name = "cylon"

    me.checkTravis = function() {
      console.log("Checking repo "+user+"/"+name);
      me.sphero.setRGB(BLUE, true);

      travis.repos(
        { owner_name: user, name: name }, 
        function(err, res) {
          if (res.repo != undefined) {
            if (res.repo.last_build_state == 'passed') {
              me.sphero.setRGB(GREEN, true);
            } else if (res.repo.last_build_state == 'failed') {
              me.sphero.setRGB(RED, true);
            } else {
              me.sphero.setRGB(BLUE, true);
            }
          } else {
            me.sphero.setRGB BLUE, true
          }
        });
    }

    me.checkTravis();

    every((10).seconds(), function() {
      me.checkTravis();
    });
  }
}).start();
