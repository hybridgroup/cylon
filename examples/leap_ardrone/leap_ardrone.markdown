# Leapmotion Ardrone 2.0

First, let's import Cylon:

    var Cylon = require('../..');

Now that we have Cylon imported, we can start defining our robot

    Cylon.robot({

Let's define the connections and devices:

```
  connections: [
    { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' },
    { name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1' },
    { name: 'keyboard', adaptor: 'keyboard' }
  ],

  devices: [
    { name: 'drone', driver: 'ardrone', connection:'ardrone' },
    { name: 'leapmotion', driver: 'leapmotion', connection:'leapmotion' },
    { name: 'keyboard', driver: 'keyboard', connection:'keyboard'}
  ],
``` 

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: function(my) {
        // TODO
      
      }

Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

    }).start();
