'use strict';

var namespace = require('node-namespace');
var nforce = require('nforce');
var Faye = require('faye');

namespace('SF', function() {
  this.SFClient = (function() {

    function SFClient(opts) {
      this.client = null;
      this.outboundMessages = [];
      this.sfuser = opts.sfuser;
      this.sfpass = opts.sfpass;
      this.orgCreds = opts.orgCredentials;
      this.org = nforce.createConnection(this.orgCreds);
    }

    SFClient.prototype._processOutboundMessages = function() {};

    SFClient.prototype._handleStreamingAPI = function(outboundCB) {
      var client, subscription;
      client = new Faye.Client("" + this.oauth.instance_url + "/cometd/28.0");
      client.setHeader("Authorization", "OAuth " + this.oauth.access_token);
      subscription = client.subscribe('/topic/SpheroMsgOutbound', outboundCB);
      console.log("Streaming API Connected...");
    };

    SFClient.prototype.authenticate = function(outboundCB) {
      var _this = this;
      this.org.authenticate({
        username: this.sfuser,
        password: this.sfpass
      }, function(err, _oauth) {
        if (err) {
          console.log('unable to authenticate to sfdc');
          console.log(err);
          process.exit(1);
        } else {
          console.log("authenticated");
          _this.oauth = _oauth;
          _this._handleStreamingAPI(outboundCB);
          _this._processOutboundMessages();
        }
      });
    };

    SFClient.prototype.push = function(msg) {
      var jsonString, methodData,
        _this = this;
      jsonString = msg;
      console.log("SpheroController post msg:");
      console.log(msg);
      methodData = {
        uri: 'SpheroController',
        method: 'POST',
        body: jsonString
      };
      this.org.apexRest(methodData, this.oauth, function(err, resp) {
        console.log(err ? err : resp);
      });
    };

    return SFClient;

  })();
});
