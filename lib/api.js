/*
 * Cylon API
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var fs = require('fs'),
    path = require('path');

var express = require('express'),
    bodyParser = require('body-parser');

var Logger = require('./logger');

var API = module.exports = function API(opts) {
  if (opts == null) {
    opts = {};
  }

  for (var d in this.defaults) {
    this[d] = opts.hasOwnProperty(d) ? opts[d] : this.defaults[d];
  }

  this.createServer();

  this.express.set('title', 'Cylon API Server');

  this.express.use(this.setupAuth());

  this.express.use(bodyParser.json());
  this.express.use(bodyParser.urlencoded({ extended: true }));

  this.express.use(express["static"](__dirname + "/../node_modules/robeaux/"));

  // set CORS headers for API requests
  this.express.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", this.CORS || "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set('Content-Type', 'application/json');
    return next();
  }.bind(this));

  // extracts command params from request
  this.express.use(function(req, res, next) {
    req.commandParams = [];

    for (var p in req.body) {
      req.commandParams.push(req.body[p]);
    }

    return next();
  });

  // load route definitions
  this.express.use('/api', require('./api/routes'));

  // error handling
  this.express.use(function(err, req, res, next) {
    res.status(500).json({ error: err.message || "An error occured."})
  });
};

API.prototype.defaults = {
  host: '127.0.0.1',
  port: '3000',
  auth: false,
  CORS: '',
  ssl: {
    key: path.normalize(__dirname + "/api/ssl/server.key"),
    cert: path.normalize(__dirname + "/api/ssl/server.crt")
  }
};

API.prototype.createServer = function createServer() {
  this.express = express();

  //configure ssl if requested
  if (this.ssl && typeof(this.ssl) === 'object') {
    var https = require('https');

    this.server = https.createServer({
      key:  fs.readFileSync(this.ssl.key),
      cert: fs.readFileSync(this.ssl.cert)
    }, this.express);
  } else {
    Logger.warn("API using insecure connection. We recommend using an SSL certificate with Cylon.");
    this.server = this.express;
  }
};

API.prototype.setupAuth = function setupAuth() {
  var authfn = function auth(req, res, next) { next(); };

  if (!!this.auth && typeof(this.auth) === 'object' && this.auth.type) {
    var type = this.auth.type,
        module = "./api/auth/" + type,
        filename = path.normalize(__dirname + "/" + module + ".js"),
        exists = fs.existsSync(filename);

    if (exists) {
      authfn = require(filename)(this.auth);
    }
  };

  return authfn;
};

API.prototype.listen = function() {
  this.server.listen(this.port, this.host, null, function() {
    var title    = this.express.get('title');
    var protocol = this.ssl ? "https" : "http";

    Logger.info(title + " is now online.");
    Logger.info("Listening at " + protocol + "://" + this.host + ":" + this.port);
  }.bind(this));
};
