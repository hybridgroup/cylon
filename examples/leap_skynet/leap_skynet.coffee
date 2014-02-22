Cylon = require '../..'
 
Cylon.robot
  connections: [
    { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' },
    { name: 'skynet', adaptor: 'skynet', uuid: "0675b9d1-9b7e-11e3-af21-030ff142869f", token: "yr2oi19yyspmbo6rcgkp7gov5i2j4i" },
  ]
 
  device:
    { name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion' }
 
  turnLED: (status) ->
    console.log status
    this.skynet.message
      "devices": ["742401f1-87a4-11e3-834d-670dadc0ddbf"],
      "message":
        'red': status

  work: (my) ->
    my.leapmotion.on 'frame', (frame) ->
      if frame.hands.length > 0         
        my.turnLED 'on'

      else
        my.turnLED 'off'
 
.start()
