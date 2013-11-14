(function() {
  'use strict';
  var faye, http, namespace, nforce;

  nforce = require('nforce');

  http = require('http');

  faye = require('faye');

  namespace = require('node-namespace');

  namespace('Cylon.SF', function() {
    return this.SFClient = (function() {
      function SFClient(opts) {
        this.client = null;
        this.outboundMessages = [];
        this.sfuser = opts.sfuser;
        this.sfpass = opts.sfpass;
        this.orgCreds = opts.orgCredentials;
        this.org = nforce.createConnection(this.orgCreds);
      }

      SFClient.prototype._processOutboundMessages = function() {
        var msg, _i, _len, _ref, _results;
        _ref = this.outboundMessages;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          msg = _ref[_i];
          _results.push(console.log(msg));
        }
        return _results;
      };

      SFClient.prototype._handleStreamingAPI = function(outboundCB) {
        var client, subscription;
        client = new faye.Client(this.oauth.instance_url + '/cometd/28.0');
        client.setHeader("Authorization", "OAuth " + this.oauth.access_token);
        subscription = client.subscribe('/topic/SpheroMsgOutbound', outboundCB);
        return console.log("Streaming API Connected...");
      };

      SFClient.prototype.authenticate = function(outboundCB) {
        var _this = this;
        return this.org.authenticate({
          username: this.sfuser,
          password: this.sfpass
        }, function(err, _oauth) {
          var code;
          if (err) {
            console.error('unable to authenticate to sfdc');
            console.log(err);
            return process.exit(code = 0);
          } else {
            console.log("authenticated");
            console.log("oauth");
            console.log(_oauth);
            _this.oauth = _oauth;
            _this._handleStreamingAPI(outboundCB);
            return _this._processOutboundMessages();
          }
        });
      };

      SFClient.prototype.push = function(msg) {
        var jsonString,
          _this = this;
        jsonString = msg;
        return this.org.apexRest({
          uri: 'SpheroController',
          method: 'POST',
          body: jsonString
        }, this.oauth, function(err, resp) {
          if (err) {
            return console.log(err);
          } else {
            return console.log(resp);
          }
        });
      };

      return SFClient;

    })();
  });

}).call(this);
