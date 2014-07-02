/*
 * Cylon API - Basic Auth
 * cylonjs.com
 *
 * Copyright (c) 2013-2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

var http = require('http');

module.exports = function(config) {
  var user = config.user,
      pass = config.pass;

  return function auth(req, res, next) {
    var auth = req.headers.authorization;

    if (!auth) {
      return unauthorized(res);
    }

    // malformed
    var parts = auth.split(' ');

    if ('basic' != parts[0].toLowerCase() || !parts[1]) {
      return next(error(400));
    }

    auth = parts[1];

    // credentials
    auth = new Buffer(auth, 'base64').toString();
    auth = auth.match(/^([^:]+):(.+)$/);

    if (!auth) {
      return unauthorized(res);
    }

    if (auth[1] === user && auth[2] === pass) {
      return next();
    }

    return unauthorized(res);
  };
};

var unauthorized = function unauthorized(res) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"');
  res.end('Unauthorized');
};

var error = function error(code, msg){
  var err = new Error(msg || http.STATUS_CODES[code]);
  err.status = code;
  return err;
};
