/*
 * leap_ardrone.js
 *
 * Written by Giuliano Sposito and Fábio Uechi
 * Copyright (c) 2013-2014 CI&T Software
 * Licensed under the Apache 2.0 license.
*/

var Cylon = require('cylon');

var TURN_SPEED = 0.5,
    TURN_TRESHOLD = 0.2,
    TURN_SPEED_FACTOR = 2.0;

var DIRECTION_THRESHOLD = 0.25,
    DIRECTION_SPEED_FACTOR = 0.05;

var UP_CONTROL_THRESHOLD = 50,
    UP_SPEED_FACTOR = 0.01,
    CIRCLE_THRESHOLD = 1.5;

var handStartPosition = [],
    handStartDirection = [];

var handWasClosedInLastFrame = false;

Cylon.robot({
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

  work: function(my) {
    my.keyboard.on('right', my.drone.rightFlip);
    my.keyboard.on('left', my.drone.leftFlip);
    my.keyboard.on('up', my.drone.frontFlip);
    my.keyboard.on('down', my.drone.backFlip);

    my.keyboard.on('w', my.drone.wave);
    my.keyboard.on('s', my.drone.stop);
    my.keyboard.on('l', my.drone.land);

    my.leapmotion.on('gesture', function(gesture) {
      var type = gesture.type,
          state = gesture.state,
          progress = gesture.progress;

      if (type === 'circle' && state === 'stop' && progress > CIRCLE_THRESHOLD) {
        if (gesture.normal[2] < 0) {
          my.drone.takeoff();
        }

        if (gesture.normal[2] > 0) {
          my.drone.land();
        }
      }

      // emergency stop
      if (type === 'keyTap' || type === 'screenTap') {
        my.drone.stop();
      }
    });

    my.leapmotion.on('hand', function(hand) {
      var handOpen = !!hand.fingers.filter(function(f) {
        return f.extended;
      }).length;

      if (handOpen) {
        if (handWasClosedInLastFrame) {
          handStartPosition = hand.palmPosition;
          handStartDirection = hand.direction;
        }

        // TURNS
        if (Math.abs(handStartDirection[0] - hand.direction[0]) > TURN_TRESHOLD) {
          var signal = handStartDirection[0] - hand.direction[0],
              value = (Math.abs(handStartDirection[0] - hand.direction[0])- TURN_TRESHOLD) * TURN_SPEED_FACTOR;

          if (signal > 0){
            my.drone.counterClockwise(value);
          }

          if (signal < 0){
            my.drone.clockwise(value);
          }
        }

        // UP and DOWN
        if (Math.abs(hand.palmPosition[1] - handStartPosition[1]) > UP_CONTROL_THRESHOLD) {
          var signal = (hand.palmPosition[1] - handStartPosition[1]) >= 0 ? 1 :  - 1;
          var value = Math.round(Math.abs((hand.palmPosition[1] - handStartPosition[1])) - UP_CONTROL_THRESHOLD) * UP_SPEED_FACTOR;

          if (signal > 0) {
            my.drone.up(value);
          }

          if (signal < 0) {
            my.drone.down(value);
          }
        }

        // DIRECTION FRONT/BACK
        if ((Math.abs(hand.palmNormal[2]) > DIRECTION_THRESHOLD)) {
          if (hand.palmNormal[2] > 0) {
            var value = Math.abs(Math.round(hand.palmNormal[2] * 10 + DIRECTION_THRESHOLD) * DIRECTION_SPEED_FACTOR);
            my.drone.forward(value);
          }

          if (hand.palmNormal[2] < 0) {
              var value = Math.abs(Math.round(hand.palmNormal[2] * 10 - DIRECTION_THRESHOLD) * DIRECTION_SPEED_FACTOR);
              my.drone.back(value);
          }
        }

        // DIRECTION LEFT/RIGHT
        if ((Math.abs(hand.palmNormal[0])>DIRECTION_THRESHOLD)) {
          if (hand.palmNormal[0] > 0) {
              var value = Math.abs(Math.round(hand.palmNormal[0] * 10 + DIRECTION_THRESHOLD ) * DIRECTION_SPEED_FACTOR);
              my.drone.left(value);
          }

          if (hand.palmNormal[0] < 0) {
              var value = Math.abs(Math.round(hand.palmNormal[0] * 10 - DIRECTION_THRESHOLD) * DIRECTION_SPEED_FACTOR);
              my.drone.right(value);
          }
        }

        // AUTO FREEZE
        if ((Math.abs(hand.palmNormal[0]) < DIRECTION_THRESHOLD) && // within left/right threshold
            (Math.abs(hand.palmNormal[2]) < DIRECTION_THRESHOLD) && // within forward/back threshold
            Math.abs(hand.palmPosition[1] - handStartPosition[1]) < UP_CONTROL_THRESHOLD && // within up/down threshold
            Math.abs(handStartDirection[0] - hand.direction[0]) < TURN_TRESHOLD) // within turn threshold
        {
            my.drone.stop();
        }
      }

      if (!handOpen && !handWasClosedInLastFrame) {
        my.drone.stop();
      }

      handWasClosedInLastFrame = !handOpen;
    });
  }
}).start();
