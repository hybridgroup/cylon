/*
 * leap_ardrone.js
 * 
 * Written by Giuliano Sposito and Fábio Uechi
 * Copyright (c) 2013-2014 CI&T Software
 * Licensed under the Apache 2.0 license.
*/

Cylon = require('cylon');

// constants
var lastS = 0,
    handStartPosition = [],
    handStartDirection = [],
    UP_CONTROL_THRESHOLD = 50,
    UP_SPEED_FACTOR = 0.01,
    CIRCLE_THRESHOLD = 1.5,
    DIRECTION_THRESHOLD = 0.25,
    DIRECTION_SPEED_FACTOR = 0.05,
    TURN_SPEED = 0.5,
    TURN_TRESHOLD = 0.2,
    TURN_SPEED_FACTOR = 2.0;

Cylon.robot({

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

  work: function(my) {

    // HAND 
    my.leapmotion.on('hand', function(hand) {

      // detects open hand ==> reset
      if (hand.s>1.5 && lastS<=1.5) {
        handStartPosition = hand.palmPosition;
        handStartDirection = hand.direction;
      };

      // TURNS
      if(hand.s>1.5 && Math.abs(handStartDirection[0]-hand.direction[0]) > TURN_TRESHOLD ) {
        var signal = handStartDirection[0]-hand.direction[0];
        var value = (Math.abs(handStartDirection[0]-hand.direction[0])-TURN_TRESHOLD)*TURN_SPEED_FACTOR;
        if (signal>0){
          my.drone.counterClockwise(value);
        }

        if (signal<0){
          my.drone.clockwise(value);
        }      
      }
  
      // UP and DOWN 
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

      // DIRECTION FRONT/BACK
      if (hand.s>1.5 && (Math.abs(hand.palmNormal[2])>DIRECTION_THRESHOLD)) {
        if (hand.palmNormal[2]>0) {
            var value = Math.abs(Math.round( hand.palmNormal[2]*10 + DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
            my.drone.forward( value );
        };
        
        if (hand.palmNormal[2]<0) {
            var value = Math.abs(Math.round( hand.palmNormal[2]*10 - DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
            my.drone.back( value );
        };
      } 

      // DIRECTION LEFT/RIGHT
      if (hand.s>1.5 && (Math.abs(hand.palmNormal[0])>DIRECTION_THRESHOLD)) {
        if (hand.palmNormal[0]>0) {
            var value = Math.abs(Math.round( hand.palmNormal[0]*10 + DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
            my.drone.left( value );
        };
        
        if (hand.palmNormal[0]<0) {
            var value = Math.abs(Math.round( hand.palmNormal[0]*10 - DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
            my.drone.right( value );
        };
      }

      // AUTO FREEZE
      if ( hand.s>1.5 &&  // open hand
          (Math.abs(hand.palmNormal[0])<DIRECTION_THRESHOLD) && // within left/right threshold
          (Math.abs(hand.palmNormal[2])<DIRECTION_THRESHOLD) && // within forward/back threshold
           Math.abs(hand.palmPosition[1]-handStartPosition[1]) < UP_CONTROL_THRESHOLD && // within up/down threshold
           Math.abs(handStartDirection[0]-hand.direction[0]) < TURN_TRESHOLD) // within turn threshold
      {
          my.drone.stop();
      }

      // COMMAND FREEZE
      if (hand.s<=1.5 && lastS > 1.5) { // closed hand
        my.drone.stop();
      }

      lastS = hand.s;

    });// end hand

    // Gestures
    my.leapmotion.on('gesture', function(gesture) {
      if (gesture.type=='circle' && gesture.state=='stop' && gesture.progress > CIRCLE_THRESHOLD ){
        if (gesture.normal[2] < 0) {
          my.drone.takeoff();
        };

        if (gesture.normal[2] > 0) {
          my.drone.land();
        }
      }
        
      // EMERGENCE STOP
      if (gesture.type=='keyTap' || gesture.type=='screenTap') {
          my.drone.stop();
      };
    }); // end gesture

    //KEYBOARD
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

    my.keyboard.on('w', function(key) { 
        my.drone.wave();
    });

    my.keyboard.on('s', function(key) { 
        my.drone.stop();
    });
      
    my.keyboard.on('l', function(key) {
        my.drone.land();
    });

  } // end work
}).start();