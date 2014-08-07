var Cylon = require('../..');

Cylon.api();

Cylon.robot({
  name: 'Frankie',

  sayRelax: function() {
    return this.name + " says relax";
  },

  work: function(my) {
    every((5).seconds(), function() {
      console.log(my.sayRelax());
    });
  },

  commands: function() {
    return {
      say_relax: this.sayRelax
    };
  }
});

Cylon.start();
