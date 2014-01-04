var Cylon = require('../..');

Cylon.robot({
  work: function() {
    every(1..second(), function() { console.log("Hello, human!"); });
    after(10..seconds(), function() { console.log("Impressive."); });
  }
}).start();
