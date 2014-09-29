var Cylon = require('../..');

Cylon.config({
  api: { host: '0.0.0.0', port: '8080' }
});

Cylon.api();

var bots = {
  'Thelma': '/dev/rfcomm0',
  'Louise': '/dev/rfcomm1'
};

Object.keys(bots).forEach(function(name) {
  var port = bots[name];

  Cylon.robot({
    name: name,

    connection: { name: 'sphero', adaptor: 'sphero', port: port },
    device: { name: 'sphero', driver: 'sphero' },

    work: function(my) {
      every((1).seconds(), function() {
        console.log(my.name);
        my.sphero.setRandomColor();
        my.sphero.roll(60, Math.floor(Math.random() * 360));
      });
    }
  });
});

Cylon.start();
