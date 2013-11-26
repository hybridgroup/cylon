'use strict'

namespace = require 'node-namespace'
nforce = require 'nforce'
Faye = require 'faye'

namespace 'SF', ->
  class @SFClient
    constructor: (opts) ->
      @client = null
      @outboundMessages = []
      @sfuser = opts.sfuser
      @sfpass = opts.sfpass
      @orgCreds = opts.orgCredentials
      @org = nforce.createConnection @orgCreds

    _processOutboundMessages: () ->
      # Do work here

    _handleStreamingAPI: (outboundCB) ->
      client = new Faye.Client("#{@oauth.instance_url}/cometd/28.0")
      client.setHeader "Authorization", "OAuth #{@oauth.access_token}"

      subscription = client.subscribe '/topic/SpheroMsgOutbound', outboundCB
      console.log "Streaming API Connected..."

    authenticate: (outboundCB) ->
      @org.authenticate {username: @sfuser, password: @sfpass}, (err, _oauth) =>
        if err
          console.log 'unable to authenticate to sfdc'
          console.log err
          process.exit 1
        else
          console.log "authenticated"
          @oauth = _oauth
          @_handleStreamingAPI outboundCB
          @_processOutboundMessages()

    push: (msg) ->
      jsonString = msg

      console.log "SpheroController post msg:"
      console.log msg

      methodData = {uri:'SpheroController', method: 'POST', body: jsonString}

      @org.apexRest methodData, @oauth, (err, resp) =>
        console.log if err then err else resp
