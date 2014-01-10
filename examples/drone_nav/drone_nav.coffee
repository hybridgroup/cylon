Cylon = require '../..'

Cylon.robot
  connection:
    name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1'

  devices: [
    {name: 'drone', driver: 'ardrone'},
    {name: 'nav', driver: 'ardroneNav'}
  ]

  work: (my) ->
    my.drone.config 'general:navdata_demo', 'TRUE'
    my.nav.on 'update', (data) -> console.log data

.start()
