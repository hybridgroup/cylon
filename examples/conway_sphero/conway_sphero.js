var Cylon = require("../..");

var Green = 0x0000FF,
    Red = 0xFF0000;

var bots = {
  'Thelma': '/dev/rfcomm0',
  'Louise': '/dev/rfcomm1',
  'Grace':  '/dev/rfcomm2',
  'Ada':    '/dev/rfcomm3'
};

Object.keys(bots).forEach(function(name) {
  var port = bots[name];

  Cylon.robot({
    name: name,

    connections: {
      sphero: { adaptor: 'sphero', port: port }
    },

    devices: {
      sphero: { driver: 'sphero' }
    },

    work: function(my) {
      my.born();

      my.sphero.on('collision', function() {
        my.contacts += 1;
      });

      every((3).seconds(), function() {
        if (my.alive) {
          my.move();
        }
      });

      every((10).seconds(), function() {
        my.birthday();
      });
    },

    move: function() {
      this.sphero.roll(60, Math.floor(Math.random() * 360));
    },

    born: function() {
      this.contacts = 0;
      this.age = 0;
      this.life();
      this.move();
    },

    life: function() {
      this.alive = true;
      this.sphero.setRGB(Green);
    },

    death: function() {
      this.alive = false;
      this.sphero.setRGB(Red);
      this.sphero.stop();
    },

    enoughContacts: function() {
      return this.contacts >= 2 && this.contacts < 7;
    },

    birthday: function() {
      this.age += 1;

      if (this.alive) {
        console.log("Happy birthday, " + this.name + ". You are " + this.age + " and had " + this.contacts + " contacts.");
      }

      if (this.enoughContacts()) {
        if (!this.alive) {
          this.born();
        }
      } else {
        this.death();
      }

      this.contacts = 0;
    }
  });
});

Cylon.start();
