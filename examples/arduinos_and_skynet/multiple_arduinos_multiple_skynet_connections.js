var Cylon = require('../..');

SkynetBot = (function(){
  function SkynetBot(){
    this.connections = [
      { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
      { name: 'skynet', adaptor: 'skynet'}
    ];
  }

  SkynetBot.prototype.port = function(serialPort){
    for (var i in this.connections){
      if (this.connections[i].adaptor == 'firmata')
        this.connections[i].port = serialPort;
    }
  };

  SkynetBot.prototype.creds = function(uuid, token, portNumber){
    for (var i in this.connections){
      if (this.connections[i].adaptor == 'skynet'){
        this.connections[i].uuid = uuid;
        this.connections[i].token = token;
        this.connections[i].portNumber = portNumber;
      }
    }
  };

  SkynetBot.prototype.device = { name: 'led13', driver: 'led', pin: 13, connection: 'arduino' };

  SkynetBot.prototype.work = function(my) {

    my.skynet.on('message', function(data) {
      if(data.led13 == 'on') {
        my.led13.turnOn()
      }
      else if(data.led13 == 'off') {
        my.led13.turnOff()
      }
    });

    console.log("Skynet instance `" + my.name + "` is listening ...");
  };

  return SkynetBot;
})();

skynetBot0 = new SkynetBot();
skynetBot0.name = 'skynet0';
skynetBot0.port('/dev/ttyACM1');
skynetBot0.creds("96630051-a3dc-11e3-8442-5bf31d98c912", "2s67o7ek98pycik98f43reqr90t6s9k9");

skynetBot1 = new SkynetBot();
skynetBot1.name = 'skynet1';
skynetBot1.creds("e8f942f1-a49c-11e3-9270-795e22e700d8","0lpxpyafz7z7u8frgvp44g8mbr7o80k9");

Cylon.robot(skynetBot0);
Cylon.robot(skynetBot1);

Cylon.start();
