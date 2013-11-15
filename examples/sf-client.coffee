'use strict';

nforce = require('nforce')
http = require('http')
faye = require('faye')

namespace = require('node-namespace')

namespace 'SF', ->
  class @SFClient
    constructor: (opts) ->
      @client = null
      @outboundMessages = []
      @sfuser = opts.sfuser
      @sfpass = opts.sfpass
      @orgCreds = opts.orgCredentials
      @org = nforce.createConnection(@orgCreds)

    _processOutboundMessages: () ->
      # Do work here
      console.log(msg) for msg in @outboundMessages

    _handleStreamingAPI: (outboundCB) ->
      client = new faye.Client(@oauth.instance_url + '/cometd/28.0')
      client.setHeader("Authorization", "OAuth #{ @oauth.access_token }")

      subscription = client.subscribe('/topic/SpheroMsgOutbound', outboundCB)
      console.log("Streaming API Connected...")

    authenticate: (outboundCB) ->
      @org.authenticate({ username: @sfuser, password: @sfpass}, (err, _oauth) =>
        if(err)
          console.error('unable to authenticate to sfdc')
          console.log(err)
          process.exit(code=0)
        else
          console.log("authenticated")
          console.log("oauth")
          console.log(_oauth)
          @oauth = _oauth
          @_handleStreamingAPI(outboundCB)
          @_processOutboundMessages()
      )

    push: (msg) ->
      #jsonBody = JSON.parse(msg)
      #jsonString = JSON.stringify(msg)
      jsonString = msg
      @org.apexRest({uri:'SpheroController', method: 'POST', body: jsonString}, @oauth, (err,resp) =>
        if(err)
          console.log(err)
        else
          console.log(resp)
      )
