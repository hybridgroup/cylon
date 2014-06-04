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
  var self = this;

  if (opts == null) {
    opts = {};
  }

  for (var d in this.defaults) {
    this[d] = opts.hasOwnProperty(d) ? opts[d] : this.defaults[d];
  }

  this.createServer();

  this.server.set('title', 'Cylon API Server');

  this.server.use(self.setupAuth());
  this.server.use(bodyParser());
  this.server.use(express["static"](__dirname + "/../node_modules/robeaux/"));

  // set CORS headers for API requests
  this.server.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", self.CORS || "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set('Content-Type', 'application/json');
    return next();
  });

  // load route definitions
  this.server.use('/', require('./api/routes'))
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
  this.server = express();

  //configure ssl if requested
  if (this.ssl && typeof(this.ssl) === 'object') {
    var https = require('https');

    this.server.node = https.createServer({
      key:  fs.readFileSync(this.ssl.key),
      cert: fs.readFileSync(this.ssl.cert)
    }, this.server);
  } else {
    Logger.warn("API using insecure connection. We recommend using an SSL certificate with Cylon.")
    this.server.node = this.server;
  }
};

API.prototype.setupAuth = function setupAuth() {
  var authfn = function auth(req, res, next) { next(); };

  if (typeof(this.auth) === 'object' && this.auth.type) {
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
  var self = this;

  this.server.node.listen(this.port, this.host, null, function() {
    var title    = self.server.get('title');
    var protocol = self.ssl ? "https" : "http";

    Logger.info(title + " is now online.");
    Logger.info("Listening at " + protocol + "://" + self.host + ":" + self.port);
  });
};
