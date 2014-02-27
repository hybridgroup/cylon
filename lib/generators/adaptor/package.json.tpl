{
  "name": "<%= adaptorName %>",
  "version": "0.1.0",
  "main": "dist/<%= adaptorName %>.js",
  "description": "Cylon module for <%= adaptorClassName %>",
  "homepage": "http://cylonjs.com",
  "bugs": "Your bug report URL here",
  "author": {
    "name": "Your Name Here",
    "email": "Your Email Here",
    "url": "Your URL here"
  },
  "repository": {
    "type": "git",
    "url": "your git URL here"
  },
  "licenses": [
    {
      "type": "your license type here"
    }
  ],
  "devDependencies": {
    "matchdep": "~0.1.1",
    "grunt-contrib-jshint": "~0.6.0",
    "grunt-contrib-watch": "~0.5.0",
    "grunt-contrib-coffee": "~0.7.0",
    "grunt-simple-mocha": "~0.4.0",
    "grunt-contrib-clean": "~0.5.0",
    "sinon-chai": "~2.4.0",
    "chai": "~1.7.2",
    "mocha": "~1.12.1",
    "sinon": "~1.7.3"
  },
  "dependencies": {
    "node-namespace": "~1.0.0",
    "cylon": "~<%= cylonVersion %>"
  }
}
