Cylon = require('..')

Cylon.robot
  connection:
    name: 'sfcon',
    adaptor: 'force',
    sfuser: process.env.SF_USERNAME,
    sfpass: process.env.SF_SECURITY_TOKEN,
    orgCreds: {
      clientId: process.env.SF_CLIENT_ID,
      clientSecret: process.env.SF_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }

  device:
    name: 'salesforce', driver: 'force'

  work: (me) ->

    me.salesforce.on('start', () ->
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', (data) ->
        Logger.info "Sphero: #{ data.sobject.Sphero_Name__c }, Bucks: #{ data.sobject.Bucks__c }, SM_Id: #{ data.sobject.Id }"
      )
    )

    i = 0
    every 2.seconds(), () ->
      # push(apexPath, method, body)
      toSend = "{ \"spheroName\" :\"#{ me.name }\", \"bucks\": \"#{ i }\" }"
      me.salesforce.push('SpheroController', 'POST', toSend)

.start()
