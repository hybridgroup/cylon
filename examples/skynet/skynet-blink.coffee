Cylon = require '../..'

Cylon.robot
  connections: [
    { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
    { name: 'skynet', adaptor: 'skynet', uuid: "742401f1-87a4-11e3-834d-670dadc0ddbf", token: "xjq9h3yzhemf5hfrme8y08fh0sm50zfr" }
  ]

  device: { name: 'led', driver: 'led', pin: 13, connection: 'arduino' }

  work: (my) ->
    Logger.info "connected..."
    
    my.connections['skynet'].on 'message', (channel, data) ->
      console.log(data)
      if data.red is 'on'
        console.log("red on request received from skynet");
        my.led.turnOn()
      else if data.red is 'off'
        console.log("red off request received from skynet");
        my.led.turnOff()

.start()
