# Leapmotion Ardrone 2.0

This example illustrates how to use Leap Motion and the keyboard to control an ARDrone. We basically use one hand to drive the drone (takeoff, land, up, down, etc) and the arrow keys to perform some cool stunts (flips).

First, let's import Cylon:

    var Cylon = require('../..');

Now that we have Cylon imported, we can start defining our robot

    Cylon.robot({

Let's define the connections and devices:

    connections: {
        leapmotion: { adaptor: 'leapmotion' },
        ardrone: { adaptor: 'ardrone', port: '192.168.1.1' },
        keyboard: { adaptor: 'keyboard' }
    },

    devices: {
        drone: { driver: 'ardrone', connection:'ardrone' },
        leapmotion: { driver: 'leapmotion', connection:'leapmotion' },
        keyboard: { driver: 'keyboard', connection:'keyboard' }
    },

Now that Cylon knows about the necessary hardware we're going to be using, we'll
tell it what work we want to do:

      work: function(my) {

Lets use the circle gesture to take off and land : two rounds clockwise will trigger the takeoff() and counter clockwise will tell the drone to land: 


        my.leapmotion.on('gesture', function(gesture) {
            if (gesture.type=='circle' && gesture.state=='stop' && gesture.progress > CIRCLE_THRESHOLD ){
                if (gesture.normal[2] < 0) {
                    my.drone.takeoff();
                };

                if (gesture.normal[2] > 0) {
                    my.drone.land();
                }
            }
        });


Whenever we get a 'hand' gesture event from Leap Motion we need to tell ARDrone what to do. 


        my.leapmotion.on('hand', function(hand) {


In case we turn our hand to the right or left we want the drone to rotate clockwise or counter clockwise respectively:


        if(hand.s>1.5 && Math.abs(handStartDirection[0]-hand.direction[0]) > TURN_TRESHOLD ) {
            var signal = handStartDirection[0]-hand.direction[0];
            var value = (Math.abs(handStartDirection[0]-hand.direction[0])-TURN_TRESHOLD) * TURN_SPEED_FACTOR;
            if (signal>0){
                my.drone.counterClockwise(value);
            }

            if (signal<0){
                my.drone.clockwise(value);
            }      
        }

In case we raise our hand up or lower it down we tell the drone to go up or down respectively:

        if (hand.s>1.5 && Math.abs(hand.palmPosition[1]-handStartPosition[1]) > UP_CONTROL_THRESHOLD) {    
            var signal = (hand.palmPosition[1]-handStartPosition[1]) >= 0 ? 1 : -1;
            var value = Math.round(Math.abs((hand.palmPosition[1]-handStartPosition[1]))-UP_CONTROL_THRESHOLD) * UP_SPEED_FACTOR;
    
            if (signal>0) {
                my.drone.up(value);
            };

            if (signal<0) {
                my.drone.down(value);
            }
        }


In order to move the drone forward, backward, left or right we need to detect the hand inclination. Imagine your hand is the drone and lean it towards the direction we want it to move.


        if (hand.s>1.5 && (Math.abs(hand.palmNormal[2])>DIRECTION_THRESHOLD)) {
            if (hand.palmNormal[2]>0) {
                var value = Math.abs(Math.round( hand.palmNormal[2] * 10 + DIRECTION_THRESHOLD ) * DIRECTION_SPEED_FACTOR);
                my.drone.forward( value );
            };
        
            if (hand.palmNormal[2]<0) {
                var value = Math.abs(Math.round( hand.palmNormal[2] * 10 - DIRECTION_THRESHOLD ) * DIRECTION_SPEED_FACTOR);
                my.drone.back( value );
            };
        } 

        if (hand.s>1.5 && (Math.abs(hand.palmNormal[0])>DIRECTION_THRESHOLD)) {
            if (hand.palmNormal[0]>0) {
                var value = Math.abs(Math.round( hand.palmNormal[0] * 10 + DIRECTION_THRESHOLD ) * DIRECTION_SPEED_FACTOR);
                my.drone.left( value );
            };
        
            if (hand.palmNormal[0]<0) {
                var value = Math.abs(Math.round( hand.palmNormal[0] * 10 - DIRECTION_THRESHOLD ) * DIRECTION_SPEED_FACTOR);
                my.drone.right( value );
            };
        }


Whenever we close our hand we tell the drone no stop:

        if (hand.s<=1.5 && lastS > 1.5) { // closed hand
            my.drone.stop();
        }


And finally lets use the arrow keys to tell the drone to do some cool stunts:


        my.keyboard.on('right', function(key) { 
            my.drone.rightFlip();
        });

        my.keyboard.on('left', function(key) { 
            my.drone.leftFlip();
        });

        my.keyboard.on('up', function(key) { 
            my.drone.frontFlip();
        });

        my.keyboard.on('down', function(key) { 
            my.drone.backFlip();
        });


Now that our robot knows what work to do, and the work it will be doing that
hardware with, we can start it:

        }).start();
