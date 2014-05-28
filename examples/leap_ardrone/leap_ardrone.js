/*
 * leap_ardrone.js
 * 
 * Written by Giuliano Sposito and Fábio Uechi
 * Copyright (c) 2013-2014 CI&T Software
 * Licensed under the Apache 2.0 license.
*/

Cylon = require('cylon');

var lastS = 0;
var handStartPosition = [];
var handStartDirection = [];
var UP_CONTROL_THRESHOLD = 50;
var UP_SPEED_FACTOR = 0.01;
var SWIPE_THRESHOLD = 30;
var CIRCLE_THRESHOLD = 1.5;
var DIRECTION_THRESHOLD = 0.25;
var DIRECTION_SPEED_FACTOR = 0.05;
var TURN_SPEED = 0.5;
var TURN_TRESHOLD = 0.2;
var TURN_SPEED_FACTOR = 2.0;

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

    //KEYBOARD

    my.keyboard.on('right', function(key) { 
      console.log("RIGHT");
      my.drone.rightFlip();
    });

    my.keyboard.on('left', function(key) { 
      console.log("LEFT");
      my.drone.leftFlip();
    });

    my.keyboard.on('up', function(key) { 
      console.log("UP");
      my.drone.frontFlip();
    });

    my.keyboard.on('down', function(key) { 
      console.log("DOWN");
      my.drone.backFlip();
    });

    my.keyboard.on('w', function(key) { 
        console.log("key(w): my.drone.wave()");
        my.drone.wave();
    });

    // EMERGENCE KEYS
    my.keyboard.on('s', function(key) { 
        console.log("key(S): my.drone.stop()");
        my.drone.stop();
    });
      
    my.keyboard.on('l', function(key) {
        console.log("key(L): my.drone.land()");
        my.drone.land();
    });
      
      
      
    // HAND 
    my.leapmotion.on('hand', function(hand) {

      // detecta abertua de mão ==> ATIVA COMANDO DE MDAnielOVIMENTO
      if (hand.s>1.5 && lastS<=1.5) {
        console.log('Direction Motion Control'); 
        handStartPosition = hand.palmPosition;
        handStartDirection = hand.direction;
        console.log();
      };

      //console.log(hand);

    // TURNS
    if(hand.s>1.5 && Math.abs(handStartDirection[0]-hand.direction[0]) > TURN_TRESHOLD ) {
      var signal = handStartDirection[0]-hand.direction[0];
      var value = (Math.abs(handStartDirection[0]-hand.direction[0])-TURN_TRESHOLD)*TURN_SPEED_FACTOR;

      if (signal>0){
        my.drone.counterClockwise(value);
        console.log('turn left: CCW('+ value +')');
      }

      if (signal<0){
        my.drone.clockwise(value);
        console.log('turn right:  CW('+ value +')');
      }
      
    }
  
      // UP and DOWN 
      if (hand.s>1.5 && Math.abs(hand.palmPosition[1]-handStartPosition[1]) > UP_CONTROL_THRESHOLD) {
    
        var signal = (hand.palmPosition[1]-handStartPosition[1]) >= 0 ? 1 : -1;
        var value = Math.round(Math.abs((hand.palmPosition[1]-handStartPosition[1]))-UP_CONTROL_THRESHOLD) * UP_SPEED_FACTOR;
    
        if (signal>0) {
          my.drone.up(value);
          console.log('my.drone.up('+value+')'); 
        };

        if (signal<0) {
            my.drone.down(value);
            console.log('my.drone.down('+value+')');
        }

      }

      // DIRECTION FRONT/BACK
      if (hand.s>1.5 && (Math.abs(hand.palmNormal[2])>DIRECTION_THRESHOLD)) {
          if (hand.palmNormal[2]>0) {
              var value = Math.abs(Math.round( hand.palmNormal[2]*10 + DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
              my.drone.forward( value );
              console.log ('my.drone.forward(' + value + ')');
          };
          
          if (hand.palmNormal[2]<0) {
              var value = Math.abs(Math.round( hand.palmNormal[2]*10 - DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
              my.drone.back( value );
              console.log ('my.drone.back(' + value + ')');
          };
      } 

      // DIRECTION LEFT/RIGHT
      if (hand.s>1.5 && (Math.abs(hand.palmNormal[0])>DIRECTION_THRESHOLD)) {
          if (hand.palmNormal[0]>0) {
              var value = Math.abs(Math.round( hand.palmNormal[0]*10 + DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
              my.drone.left( value );
              console.log ('my.drone.left(' + value + ')');
          };
          
          if (hand.palmNormal[0]<0) {
              var value = Math.abs(Math.round( hand.palmNormal[0]*10 - DIRECTION_THRESHOLD )*DIRECTION_SPEED_FACTOR);
              my.drone.right( value );
              console.log ('my.drone.right(' + value + ')');
          };
      }

      // AUTO FREEZE
      if ( hand.s>1.5 &&  // mão aberta
          (Math.abs(hand.palmNormal[0])<DIRECTION_THRESHOLD) && // dentro do threshold lateral
          (Math.abs(hand.palmNormal[2])<DIRECTION_THRESHOLD) && // dentro do threshold frontal
           Math.abs(hand.palmPosition[1]-handStartPosition[1]) < UP_CONTROL_THRESHOLD && // dentro do treshold de altura
           Math.abs(handStartDirection[0]-hand.direction[0]) < TURN_TRESHOLD) // turn da mao
      {
          my.drone.stop();
          console.log('my.drone.stop()');
      }

      // COMMAND FREEZE
      if (hand.s<=1.5 && lastS > 1.5) { // mão fechada
        console.log("my.drone.stop() !!!");
        my.drone.stop();
      }

      lastS = hand.s;
      
    });

    // GESTOS
    my.leapmotion.on('gesture', function(gesture) {
        
        if (gesture.type=='swipe' && gesture.state=='stop'){

        deltaX = gesture.position[0]-gesture.startPosition[0];
        deltaY = gesture.position[1]-gesture.startPosition[1];
        deltaZ = gesture.position[2]-gesture.startPosition[2];

        var amplitude = Math.abs(Math.max(Math.max(deltaX, deltaY),deltaZ));

        if (amplitude>SWIPE_THRESHOLD) {

          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > Math.abs(deltaZ)) {
            //console.log('swipe X: ' + deltaX); // drone flip left/right
            if (deltaX>0){
                 my.drone.clockwise(TURN_SPEED);
                 console.log('swipe right: my.drone.clockwise('+TURN_SPEED+')');
                //my.drone.animate('flipRight',1000);
                //my.drone.rightFlip();
            };

            if (deltaX<0){
                my.drone.counterClockwise(TURN_SPEED);
                console.log('swipe left: my.drone.counterClockwise('+TURN_SPEED+')');
                //my.drone.animate('flipLeft',1000);
                //my.drone.leftFlip();
            }
          }

          if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > Math.abs(deltaZ)) {
            console.log('swipe Y: ' + deltaY); // drone takeoff/land
            if (deltaY>0) { 
              console.log('swipe up: no command'); 
              //my.drone.takeoff();
            };
            
            if (deltaY<0) { 
              console.log('swipe down: no command');
             //my.drone.land();
            };
          }

          if (Math.abs(deltaZ) > Math.abs(deltaX) && Math.abs(deltaZ) > Math.abs(deltaY)) 
            console.log('swipe Z: ' + deltaZ); // null
        } else {
          console.log("Swipe skipped (" + Math.round(amplitude) + ")");
        }

      } else {
        if (gesture.type=='circle' && gesture.state=='stop' && gesture.progress > CIRCLE_THRESHOLD ){
          
          if (gesture.normal[2] < 0) {
            //console.log("Turn CW: " + (gesture.progress - CIRCLE_THRESHOLD) );
            console.log('circle-cw: my.drone.takeoff()');
            my.drone.takeoff();
          };

          if (gesture.normal[2] > 0) {
            //console.log("Turn CCW: " +  (gesture.progress - CIRCLE_THRESHOLD) );
            console.log('circle-ccw: my.drone.land()');
            my.drone.land();
            after((5).seconds(), my.drone.stop);
          }
        }
      }
        
      // EMERGENCE STOP
      if (gesture.type=='keyTap' || gesture.type=='screenTap') {
          console.log('tap: my.drone.stop()');
          my.drone.stop();
      };
    }); 


  }
}).start();
