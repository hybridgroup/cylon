var spheron = require('spheron');

var sphero = spheron.sphero();
var spheroPort = '/dev/rfcomm0';

var COLORS = spheron.toolbelt.COLORS;

sphero.on('open', function() {
  console.log('EVENT OPEN!');
  sphero.configureCollisionDetection(0x01, 0x20, 0x20, 0x20, 0x20, 0x50);
  sphero.setRGB(COLORS.GREEN, false);
});

sphero.on('close', function() {
  console.log('EVENT CLOSE!');
});

sphero.on('end', function() {
  console.log('EVENT END!');
});

sphero.on('error', function() {
  console.log('EVENT ERROR!');
});

sphero.on('notification', function(packet) {
  console.log("Packet contents: " + packet);
});

sphero.on('message', function(packet) {
  console.log("Packet contents: " + packet);
});

sphero.open(spheroPort);
