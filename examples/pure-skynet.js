var skynet = require('skynet');

var conn = skynet.createConnection({
  "uuid": "96630051-a3dc-11e3-8442-5bf31d98c912",
  "token": "2s67o7ek98pycik98f43reqr90t6s9k9"
  "protocol": "websocket", // or "websocket"
  "qos": 0, // MQTT Quality of Service (0=no confirmation, 1=confirmation, 2=N/A)
  "host": "localhost", // optional - defaults to http://skynet.im
  "port": 80  // optional - defaults to 80
});

conn.on('notReady', function(data){
  console.log('UUID FAILED AUTHENTICATION!');
  console.log(data);
});

conn.on('ready', function(data){
  console.log('UUID AUTHENTICATED!');
  console.log(data);

  // Subscribe to device
  conn.subscribe({
    "uuid": "96630051-a3dc-11e3-8442-5bf31d98c912",
    "token": "2s67o7ek98pycik98f43reqr90t6s9k9"
  }, function (data) {
    console.log(data);
  });

  // Subscribe to device
  //conn.unsubscribe({
    //"uuid": "f828ef20-29f7-11e3-9604-b360d462c699"
  //}, function (data) {
    //console.log(data);
  //});

  // Send and receive messages
  conn.message({
    "devices": "*",
    "payload": {
      "skynet":"online"
    },
    "qos": 0
  });
  conn.message({
    "devices": "96630051-a3dc-11e3-8442-5bf31d98c912",
    "payload": {
      "skynet":"online 2"
    },
    "qos": 0
  });
  conn.message({
    "devices": "96630051-a3dc-11e3-8442-5bf31d98c912",
    "payload": {
      "skynet":"online 3"
    },
    "qos": 0
  });

  conn.on('message', function(channel, message){
    console.log('message received', channel, message);
  });


  // Event triggered when device loses connection to skynet
  conn.on('disconnect', function(data){
    console.log('disconnected from skynet');
  });

  // Register a device (note: you can leave off the token to have skynet generate one for you)
  //conn.register({
    //"token": "zh4p7as90pt1q0k98fzvwmc9rmjkyb9", 
    //"type": "drone"
  //}, function (data) {
    //console.log(data); 
  //});

  // UnRegister a device
  //conn.unregister({
    //"uuid": "zh4p7as90pt1q0k98fzvwmc9rmjkyb9", 
    //"token": "zh4p7as90pt1q0k98fzvwmc9rmjkyb9"
  //}, function (data) {
    //console.log(data); 
  //});


  // Update device
  //conn.update({
    //"uuid":"ad698900-2546-11e3-87fb-c560cb0ca47b", 
    //"token": "zh4p7as90pt1q0k98fzvwmc9rmjkyb9", 
    //"armed":true
  //}, function (data) {
    //console.log(data); 
  //});

  // WhoAmI?
  conn.whoami({"uuid":"96630051-a3dc-11e3-8442-5bf31d98c912"}, function (data) {
    console.log(data); 
  });

  // Receive an array of device UUIDs based on user defined search criteria
  conn.devices({
    "type":"drone"
  }, function (data) {
    console.log(data); 
  });

  // Skynet status
  conn.status(function (data) {
    console.log(data); 
  });

});

