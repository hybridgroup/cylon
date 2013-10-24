Cylon = require('..').instance()

RobotInfo =
  connection:
    name: 'Sphero', adaptor: 'sphero'

  work: -> every 2.seconds(), -> Logger.info "Required cylon-sphero adaptor!"

huey = Object.create(RobotInfo)
huey.connection['port'] = '/dev/cu.Sphero-RGB'
huey.name = "Huey"

dewey = Object.create(RobotInfo)
dewey.connection['port'] = '/dev/cu.Sphero-GRB'
dewey.name = "Dewey"

louie = Object.create(RobotInfo)
louie.connection['port'] = '/dev/cu.Sphero-BRG'
louie.name = "Louie"

Cylon.robot(huey)
Cylon.robot(dewey)
Cylon.robot(louie)

Cylon.start()
