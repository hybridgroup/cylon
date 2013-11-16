Cylon = require('..')

Cylon.robot
  connection:
    name: 'sfcon',
    adaptor: 'force',
    sfuser: "edgarsilva@hybridgroup.com",
    sfpass: "password1232YOQR0HQMpQ5f74msKqaPuCD6",
    orgCreds: {
      clientId: '3MVG9A2kN3Bn17huqBLyrtmQ9Cgwc.FjKA4769ApTRhNNjgKEetcGv23W97cJQ3ER3VXxzyREIaD0Bp1Or8ou',
      clientSecret: '6079348238616906521',
      redirectUri: 'http://localhost:3000/oauth/_callback'
    }

  device:
    name: 'salesforce', driver: 'force'

  work: (me) ->

    me.salesforce.on('start', () ->
      me.salesforce.subscribe('/topic/SpheroMsgOutbound', (data) ->
        Logger.info "Sphero: #{ data.sobject.Sphero_Name__c }, data Content: #{ data.sobject.Content__c }, SM_Id: #{ data.sobject.Id }"
      )
    )

    # push(apexPath, method, body)
    toSend = "{ \"identifier\" :\"#{ me.name }\", \"msg\": \"#{ 'Salesforce Bot #2' }\" }"
    me.salesforce.push('SpheroController', 'POST', toSend)
.start()
