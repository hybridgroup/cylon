/*
 * Cylon API - Basic Auth
 * cylonjs.com
 *
 * Copyright (c) 2013-2015 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var http = require("http");

var unauthorized = function unauthorized(res) {
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
  res.end("Unauthorized");
};

var error = function error(code, msg){
  var err = new Error(msg || http.STATUS_CODES[code]);
  err.status = code;
  return err;
};

module.exports = function(config) {
  var user = config.user,
      pass = config.pass;

  return function auth(req, res, next) {
    var authorization = req.headers.authorization;

    if (!authorization) {
      return unauthorized(res);
    }

    // malformed
    var parts = authorization.split(" ");

    if ("basic" !== parts[0].toLowerCase() || !parts[1]) {
      return next(error(400));
    }

    authorization = parts[1];

    // credentials
    authorization = new Buffer(authorization, "base64").toString();
    authorization = authorization.match(/^([^:]+):(.+)$/);

    if (!authorization) {
      return unauthorized(res);
    }

    if (authorization[1] === user && authorization[2] === pass) {
      return next();
    }

    return unauthorized(res);
  };
};
